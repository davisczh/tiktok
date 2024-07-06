from fastapi import FastAPI, HTTPException
import test_recommender

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

# i) search product with user preferences (POST)
@app.post("/preferences")
test_recommender.get_recommendations()

# ii) After every 5 swipe (POST)
@app.post("/swipe")

# iii) 5 listings after initial search (GET)
@app.get("/search")

# iv) Updated 5 listings after every 5 swipe (GET)
@app.get("/listings")
