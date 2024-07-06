from fastapi import FastAPI, HTTPException
import test_recommender

app = FastAPI()

# Data Models
class UserPreferences(BaseModel):
    categories: Optional[List[str]] = None
    price_range: Optional[List[float]] = None
    tags: Optional[List[str]] = None

class SearchRequest(BaseModel):
    username: str
    preferences: UserPreferences

class SwipeAction(BaseModel):
    username: str
    product_id: str
    swipe_direction: str

class ProductListingResponse(BaseModel):
    products: List[dict]

# TEST
@app.get("/")
async def root():
    return {"message": "Hello World"}

# i) Search product with user preferences (POST)
@app.post("/preferences", response_model=ProductListingResponse)
async def search_product(search_request: SearchRequest):
    conditions = {
        'category': search_request.preferences.categories[0],
        'min_price': search_request.preferences.price_range[0],
        'max_price': search_request.preferences.price_range[1],
        'title': search_request.preferences.tags[0]
    }
    query_vector = test_recommender.model.encode([conditions['title']])
    
    query_vector = query_vector / np.linalg.norm(query_vector)
    filters = test_recommender.create_filters_from_conditions(conditions)
        
    product_ids = test_recommender.get_recommendations(query_vector, 5, filters)
    products = [{"asin": pid, "title": test_recommender.products_df.loc[test_recommender.products_df['asin'] == pid, 'title'].values[0]} for pid in product_ids]
    
    return {"products": products}

    

# ii) After every 5 swipe (POST)
# @app.post("/swipe")

# iii) 5 listings after initial search (GET)
# @app.get("/search")

# iv) Updated 5 listings after every 5 swipe (GET)
# @app.get("/listings")
