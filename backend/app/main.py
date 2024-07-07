from fastapi import FastAPI, HTTPException

from pydantic import BaseModel
from typing import List, Optional
import logging
from utils import *
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "*",  # Allow all origins
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)   
logging.basicConfig(
    level=logging.INFO, 
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler() 
    ]
)
logger = logging.getLogger(__name__)

products_df = pd.read_csv('data/df_combined_small.csv')

class Preferences(BaseModel):
    like_product: Optional[List[str]] = []
    dislike_product: Optional[List[str]] = []
    pass_product: Optional[List[str]] = []
    iteration: Optional[int] = 1
class Product(BaseModel):
    asin: str
    title: str
    imgUrl: str
    price: float
    stars: float
class ProductListingResponse(BaseModel):
    products: List[Product]


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
                                      category: str  = None, 
                                      min_price: str  = None, 
                                      max_price: str  = None, 
                                      trendiness: str = False,
                                      delivery_time: str = None,
                                      title: str  = None ):
    
    delivery_time = int(delivery_time) if delivery_time else None
    min_price = float(min_price) if min_price else None
    max_price = float(max_price) if max_price else None

    conditions = {}
    if category:
        conditions["category"] = category.lower()
    if min_price is not None:
        conditions["min_price"] = min_price
    if max_price is not None:
        conditions["max_price"] = max_price
    if title:
        conditions["title"] = title
    if trendiness:
        conditions["trendiness"] = trendiness
    if delivery_time:
        conditions["delivery_time"] = delivery_time

    logger.info("Getting products for user %s with conditions %s", user_id, conditions)
    query_vector = get_user_vector(user_id)
    if query_vector is None:
        # if we store user's history in the future, we can get relevant products from the user's history
        logger.info("User vector not found, getting random popular products instead")
        query_vector = get_popular_products_vector()
        update_user_vector(user_id, query_vector)
        if query_vector is None:
            logger.error("No popular products found, should not happen")
            return {"message": "No popular products found"}

    query_vector = query_vector / np.linalg.norm(query_vector)

    filters = []
    if conditions:
        filters = create_filters_from_conditions(conditions)
        logger.info("Filters created")

    like_product, dislike_product = get_user_feedback(user_id)

    logger.info("Getting recommendations for user %s", user_id)
    product_ids = get_recommendations(query_vector, 
                                      5, 
                                      exclude_ids=like_product+dislike_product, 
                                      filters=filters)
    if not product_ids:
        logger.error("No recommendations found, filters may be too specific")
        return {"message": "No recommendations found"}
    
    logger.info("Product ids: %s", product_ids)
    products = [
        {
            "asin": pid,
            "title": products_df.loc[products_df['asin'] == pid, 'title'].values[0],
            "imgUrl": products_df.loc[products_df['asin'] == pid, 'imgUrl'].values[0],
            "price": products_df.loc[products_df['asin'] == pid, 'price'].values[0],
            "stars": products_df.loc[products_df['asin'] == pid, 'stars'].values[0]
        }
        for pid in product_ids
    ]
    products_list = [Product(**product) for product in products]
    
    return ProductListingResponse(products=products_list)

# example 
# const preferences = {
#     like_product: ["product1", "product2"],
#     dislike_product: ["product3"],
#     iteration: 1
# };

# // Send the POST request
# fetch(`/users/${userId}/update_preferences`, {
#     method: 'POST',
#     headers: {
#         'Content-Type': 'application/json'
#     },
#     body: JSON.stringify(preferences)
# })
# .then(response => response.json())
# .then(data => console.log(data))
# .catch(error => console.error('Error:', error));


@app.post("/users/{user_id}/update_preferences") 
async def update_preferences(user_id : str, 
                             preferences: Preferences
                             ):
    
    like_product = preferences.like_product
    dislike_product = preferences.dislike_product
    iteration = preferences.iteration

    positive_embeddings = []
    negative_embeddings = []
    
    if like_product:
        logger.info("Generating like_products embeddings for user preferences")
        negative_embeddings = get_vectors_for_asins("amazon_products", like_product)

    if dislike_product:
        logger.info("Generating like_products embeddings for user preferences")
        positive_embeddings = get_vectors_for_asins("amazon_products", dislike_product)
    
    logger.info("User %s likes %s", user_id, like_product)
    logger.info("User %s dislikes %s", user_id, dislike_product)
    store_user_feedback(user_id, like_product, dislike_product)
    query_vector = get_user_vector(user_id)

    if query_vector is None:
        logger.error("User vector not found, should not happen, update_preferences should not be called before get_products")
        return {"message": "User vector not found"}
    

    query_vector = refine_query_vector(query_vector, positive_embeddings, negative_embeddings, iteration)
    update_user_vector(user_id, query_vector)
    logger.info("User vector updated for user %s", user_id)

    return {"message": "Preferences updated successfully"}
