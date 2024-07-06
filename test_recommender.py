import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue, SearchRequest,Range,MatchText,MatchAny

client = QdrantClient("localhost", port=6333)


def refine_query_vector(query_vector, positive_embeddings, negative_embeddings, iteration, alpha=0.6, beta=0.7, gamma=0.85, decay_rate = 0.95, max_iterations=10):
    decay_factor = decay_rate ** min(iteration, max_iterations)
    if positive_embeddings:
        query_vector += (alpha * gamma * decay_factor) * np.mean(positive_embeddings, axis=0)
    if negative_embeddings:
        query_vector -= (beta * gamma * decay_factor) * np.mean(negative_embeddings, axis=0)
    return query_vector / np.linalg.norm(query_vector)

def get_recommendations(query_vector, n,filters= [], exclude_ids=None):
    results = client.search(
        collection_name="amazon_products",
        query_vector=query_vector.tolist(),
        limit=n + (len(exclude_ids) if exclude_ids else 0),
        query_filter=Filter(
            must=filters
                )
        )
    
    return [r.payload['asin'] for r in results if r.payload['asin'] not in (exclude_ids or [])][:n]

def get_vectors_for_asins(collection_name, asins):
    embeddings = []
    for asin in asins:
        try:
            # Perform a search using a filter to find items with the given asin
            search_results = client.scroll(
                collection_name=collection_name,
                scroll_filter=Filter(
                    must=[
                        FieldCondition(
                            key="asin",
                            match=MatchValue(value=asin)
                        )
                    ]
                ),
                with_vectors=True,
                limit=1 )
            
            if search_results and search_results[0][0]:
                vector = search_results[0][0].vector
                embeddings.append(vector)
                print(f"Retrieved vector for ASIN {asin}")
            else:
                print(f"No results found for ASIN: {asin}")
        except Exception as e:
            print(f"Error retrieving vector for ASIN {asin}: {e}")
    
    return embeddings

def create_filters_from_conditions(conditions):
    filters = []
    
    if not conditions:
        return filters

    if 'category' in conditions and conditions['category']:

        filters.append(FieldCondition(key="category_name", match=MatchText(text=conditions['category'])))
    
    if 'min_price' in conditions or 'max_price' in conditions:
        price_range = {}
        if 'min_price' in conditions and conditions['min_price'] is not None:
            price_range['gte'] = float(conditions['min_price'])
        if 'max_price' in conditions and conditions['max_price'] is not None:
            price_range['lte'] = float(conditions['max_price'])
        if price_range:
            filters.append(FieldCondition(key="price", range=Range(**price_range)))
    
    if 'title' in conditions and conditions['title']:
        filters.append(FieldCondition(key="title", match=MatchText(text=conditions['title'])))


    return filters
def interactive_recommendation(query_vector, 
                               positive_ids=[], 
                               negative_ids=[],
                               iteration=5,
                               conditions=None):
    #example conditions
    # conditions = {
    #     'category': 'Electronic',
    #     min_price': 1000,
    #     'max_price': 2000,
    #     'title': 'Apple'
    # }


    # get 3 different products as a start is better.
    # query_vector below is an example starting vector. 
    # if not query_vector:
    #     query_vector = [0.042422194,-0.0821819,0.025441661,-0.028092245,0.05952851,0.03649775,0.04851061,-0.024071569,-0.0017991255,0.022581507,0.040995214,-0.03732054,0.02831527,-0.08483772,0.07215696,0.036583908,0.03835436,0.017621594,-0.06134705,-0.047171008,0.013692059,-0.060491126,0.012011596,0.060294904,-0.09147237,0.08936967,0.042469047,0.037144054,-0.018788505,0.030196046,-0.014248465,-0.0020017358,0.03136435,-0.038725372,-0.011559807,-0.090139896,0.043319967,-0.055392727,-0.06413193,0.029054219,-0.08670057,-0.02699172,0.088944554,0.08584112,-0.015513,0.057450805,-0.035226442,-0.06847752,-0.019540489,-0.021261556,0.08522199,-0.08120479,-0.042420495,0.057678033,0.08527875,-0.01142223,-0.09238917,-0.010219232,0.015011661,-0.013735557,0.04111923,-0.07431039,-0.009991964,-0.050401483,-0.02992425,0.016579302,-0.092223905,0.047861505,0.044883206,0.036038514,-0.0549897,0.009002135,0.011470773,-0.01517727,-0.03429417,0.014204741,0.044040363,-0.08524517,-0.034356512,-0.033345714,-0.040107813,-0.03343666,-0.04793046,0.00919314,-0.031179693,-0.018964965,0.039600376,-0.062163983,-0.11143606,0.048739336,0.0048687286,-0.009221597,0.082950495,-0.06769493,-0.015380844,0.05586638,-0.0036493863,-0.04772462,0.01410857,-0.041667294,0.024820494,-0.018478677,0.073719285,0.023054501,-0.014904619,-0.012794872,-0.11221659,0.018801644,-0.030449383,-0.013516196,-0.12159395,-0.013780698,-0.10477144,-0.03223494,0.00022123044,-0.03341234,-0.003750026,0.0073032794,0.02228187,0.02331741,0.07796059,-0.008163573,0.022135438,0.0236487,0.06273114,-0.075510986,-0.044413295,6.3474675e-33,-0.01832426,0.027982583,-0.03146898,0.058177378,0.028445646,0.023425648,0.049134582,0.014247368,0.045253005,0.13176855,0.02384825,0.120086074,-0.07688812,0.07527052,0.011436843,-0.06685009,0.08410856,-0.03909322,-0.022611422,-0.021623328,0.03440173,0.04135592,0.048730362,0.06405419,0.024428165,-0.014629536,0.009004801,-0.046154566,-0.010365857,-0.0140862,-0.032743122,-0.012110667,-0.00170055,0.014597634,-0.067473605,0.005536539,0.022625154,-0.11704498,0.031569283,0.04764642,-0.031974666,0.011128933,-0.09624047,-0.007360804,0.03149673,0.053621504,-0.022301767,-0.039841082,0.08335747,0.05673514,-0.027018543,-0.007143481,-0.034546558,-0.023132456,0.018834798,-0.10227857,-0.029109722,0.05647606,-0.036900572,0.030318536,-0.06894673,-0.025761783,0.046845783,-0.11466373,-0.041743573,0.02073002,0.082175516,-0.06120908,-0.061448716,-0.00006210645,-0.056410383,0.014745059,0.036737047,0.015202253,0.03729199,0.024281507,-0.07740183,-0.030615553,-0.08693074,-0.015257641,-0.10245153,0.034977574,0.021093467,0.09082096,-0.03608042,-0.032509144,0.022035135,0.052203085,-0.033187583,-0.11467049,-0.037383944,-0.01644216,0.042540126,0.025716864,-0.0413677,-6.360391e-33,-0.008034605,-0.08967947,0.031887386,0.049920227,0.0758589,0.06149485,0.00617963,-0.022310764,0.047004387,0.015065137,-0.006217356,0.048706647,-0.048154358,0.016640067,-0.017674634,0.0049281507,-0.00586352,-0.062424786,0.007311687,0.0054144156,-0.035793472,0.036007613,0.063622236,-0.045793064,-0.028161671,0.006474264,0.01709014,-0.070467144,0.09483386,0.0315026,-0.027504006,0.013231255,0.14045879,0.049517516,0.02100833,-0.04753345,0.13110113,-0.008127551,-0.04457354,0.030573439,0.064753376,0.0013253837,0.16463311,0.03358589,-0.024924908,0.0057359086,-0.067456074,0.012066094,0.08570544,0.037931945,0.05968315,-0.11156767,-0.025534645,0.09120565,-0.005492573,-0.01985025,-0.057408947,0.03702552,0.11705329,-0.0248593,0.024276217,-0.021648975,-0.08764311,0.06286341,-0.051911253,-0.010167221,0.0039112912,-0.05002241,-0.020499432,-0.035196476,-0.037873957,-0.0060102367,-0.027404336,-0.040323388,0.0071224784,-0.05919149,-0.020338055,0.0012129119,0.01843086,0.06397337,-0.04462417,0.031767372,0.061460964,0.043242157,0.07389348,-0.05698783,0.028146755,0.05838515,0.02661661,-0.14050695,0.023061862,-0.009280914,0.076512925,0.043911867,0.009857357,-3.2468353e-8,-0.041865576,-0.065634444,-0.015752373,-0.0018039104,0.061545324,-0.008984687,-0.021833008,0.047648393,0.02514031,0.11653228,0.0930162,-0.01611263,-0.0091997655,-0.05269064,0.03840371,0.009123741,-0.08820472,0.06299286,0.058665805,-0.035858963,-0.04018178,0.037196036,-0.024773274,-0.04147395,0.038917553,0.05212817,-0.0031697464,-0.010869415,0.010523871,0.04825149,-0.0137057295,-0.06301256,0.10661371,-0.08017795,0.037793424,0.04769827,-0.010990237,0.0242022,0.026250817,-0.017755968,0.042917073,-0.104643226,-0.07722741,0.011129254,0.0229021,-0.09193922,-0.04273255,-0.05183204,-0.051523376,0.003706211,0.007635434,0.07029479,-0.019899331,-0.008641935,-0.0006634738,0.04098695,0.0035026688,0.020714385,0.02692361,0.008196834,0.011970718,0.060051225,-0.048874315,0.020065332]
    
    query_vector = query_vector / np.linalg.norm(query_vector)

    filters = create_filters_from_conditions(conditions)
    print(filters)

    recommendations = get_recommendations(query_vector, n=3, exclude_ids=positive_ids + negative_ids, filters=filters)
    if not recommendations:
        print("No more recommendations found.")
        return
    return recommendations


def store_user_feedback(user_id, like_product, dislike_product):
    # Store the user feedback in a database
    pass

def get_user_vector(user_id):
    # get the user vector from the database
    pass

def update_user_vector(user_id, query_vector):
    # update the user vector in the database
    pass

def get_user_feedback(user_id):
    # get the user feedback from the database, liked and disliked products during the swipe
    return [], []