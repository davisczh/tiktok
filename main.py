from fastapi import FastAPI, HTTPException

from pydantic import BaseModel
from typing import List, Optional

from test_recommender import *

app = FastAPI()
products_df = pd.read_csv('df_combined_small.csv')
client = QdrantClient("localhost", port=6333) 

class Preferences(BaseModel):
    like_product: Optional[List[str]] = None
    dislike_product: Optional[List[str]] = None
    iteration: Optional[int] = None

class ProductListingResponse(BaseModel):
    products: List[dict]


@app.get("/")
async def root():
    return {"message": "Hello World"}


# example query 
# const userId = "12345";
# const params = new URLSearchParams({
#   category: "Electronics",
#   min_price: "100",
#   max_price: "500",
#   title: "Phone"
# });

# fetch(/get_products/${userId}?${params.toString()})
#   .then(response => response.json())
#   .then(data => console.log(data))
#   .catch(error => console.error('Error:', error));
 
@app.get("/users/{user_id}/get_products", response_model=ProductListingResponse)
async def get_product_recommendations( user_id = str, 
                                      category: str | None = None, 
                                      min_price: float | None = None, 
                                      max_price: float | None = None, 
                                      title: str | None = None ):
    conditions = {}
    if category:
        conditions = {"category": category}
    if min_price:
        conditions = {"min_price": min_price}
    if max_price:
        conditions = {"max_price": max_price}
    if title:
        conditions = {"title": title}

    query_vector = get_user_vector(user_id)
    query_vector = query_vector / np.linalg.norm(query_vector)

    filters = []
    if conditions:
        filters = create_filters_from_conditions(conditions)

    like_product, dislike_product = get_user_feedback(user_id)

    product_ids = get_recommendations(query_vector, 
                                      5, 
                                      exclude_ids=like_product+dislike_product, 
                                      filters=filters)


    # Check with carina what to return
    products = [{"asin": pid, 
                 "title": products_df.loc[products_df['asin'] == pid, 'title'].values[0]} for pid in product_ids
                 ]
    
    return {"products": products}

@app.post("/users/{user_id}/update_preferences") 
async def update_preferences(user_id : str, 
                             preferences: Preferences
                             ):
    
    like_product = preferences.like_product
    dislike_product = preferences.dislike_product
    iteration = preferences.iteration

    if like_product:
        negative_embeddings = get_vectors_for_asins("amazon_products", like_product)
    if dislike_product:
        positive_embeddings = get_vectors_for_asins("amazon_products", dislike_product)

    store_user_feedback(user_id, like_product, dislike_product)
    query_vector = get_user_vector(user_id)
    query_vector = refine_query_vector(query_vector, positive_embeddings, negative_embeddings, iteration)
    update_user_vector(user_id, query_vector)

    return {"message": "Preferences updated successfully"}

# ii) After every 5 swipe (POST)
# @app.post("/swipe")

# iii) 5 listings after initial search (GET)
# @app.get("/search")

# iv) Updated 5 listings after every 5 swipe (GET)
# @app.get("/listings")
