import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue,Range,MatchText,MatchAny


client = QdrantClient("qdrant", port=6333) 


# mock database
delivery_time_mapping = {
    2 : ['Singapore', 'Malaysia'],
    3 : ['Indonesia'],
    7 : ['China', 'Japan', 'Korea'],
}
# user_id : user_vector
user_vectors = {}
# user_id : liked_product in a list of asin
user_like_visited_products = {}
# user_id : disliked_product in a list of asin
user_dislike_visited_products = {}



def store_user_feedback(user_id, like_product, dislike_product):
    user_like_visited_products[user_id] = user_like_visited_products.get(user_id, []) + like_product
    user_dislike_visited_products[user_id] = user_dislike_visited_products.get(user_id, []) + dislike_product
    return 
    

def get_user_vector(user_id):
    
    if user_id in user_vectors:
        return user_vectors[user_id]
    else:
        return None
    
def update_user_vector(user_id, query_vector):
    user_vectors[user_id] = query_vector
    return

def get_user_feedback(user_id):
    # get the user feedback from the database, liked and disliked products during the swipe
    return user_like_visited_products.get(user_id, []), user_dislike_visited_products.get(user_id, [])

def refine_query_vector(query_vector, positive_embeddings, negative_embeddings, iteration, alpha=0.8, beta=0.8, gamma=0.9, decay_rate = 0.99, max_iterations=30):
    decay_factor = decay_rate ** min(iteration, max_iterations)
    if positive_embeddings:
        query_vector += (alpha * gamma * decay_factor) * np.mean(positive_embeddings, axis=0)
    if negative_embeddings:
        query_vector -= (beta * gamma * decay_factor) * np.mean(negative_embeddings, axis=0)
    return query_vector / np.linalg.norm(query_vector)

def get_popular_products_vector():
    query_vector = np.random.rand(384)
    # define popular, currently is hardcoded to more than 2000 bought in the last month
    bought_threadhold = 2000
    result = client.search(
        collection_name="amazon_products",
        query_vector=query_vector.tolist(),
        limit=1,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="boughtInLastMonth",
                    range=Range(
                        gte=bought_threadhold
                        ))]
                ),
        with_vectors=True,

        )
    return result[0].vector

def get_recommendations(query_vector, n,filters= [], exclude_ids=None):
    results = client.search(
        collection_name="amazon_products",
        query_vector=query_vector.tolist(),
        limit=n + (len(exclude_ids) if exclude_ids else 0),
        query_filter=Filter(
            must=filters
                )
        )
    if not results:
        return []
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

    if 'trendiness' in conditions and conditions['trendiness']:
        trendiness_convert = {'High': 2000, 'Med': 1000, 'Low': 500}
        bought_threadhold = trendiness_convert[conditions['trendiness']]
        filters.append(  FieldCondition(
                    key="boughtInLastMonth",
                    range=Range(
                        gte=bought_threadhold
                        )))

    if 'delivery_time' in conditions and conditions['delivery_time']:
        countries = delivery_time_mapping[conditions['delivery_time']]
        filters.append(FieldCondition(key="origin_country", match=MatchAny(any=countries)))

    if 'title' in conditions and conditions['title']:
        filters.append(FieldCondition(key="title", match=MatchText(text=conditions['title'])))

    return filters

def interactive_recommendation(query_vector, 
                               positive_ids=[], 
                               negative_ids=[],
                               conditions=None):

    query_vector = query_vector / np.linalg.norm(query_vector)

    filters = create_filters_from_conditions(conditions)
    recommendations = get_recommendations(query_vector, n=3, exclude_ids=positive_ids + negative_ids, filters=filters)
    
    if not recommendations:
        print("No more recommendations found.")
        return
    return recommendations


