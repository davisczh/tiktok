import requests
import json

# Base URL of your API
BASE_URL = "http://localhost:8000"  # Adjust this to your API's actual URL

def test_get_product_recommendations():
    print("Testing GET /users/{user_id}/get_products")
    
    # Test case 1: Basic request
    user_id = "123"
    response = requests.get(f"{BASE_URL}/users/{user_id}/get_products")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    # Test case 2: With query parameters
    params = {
        "category": "electronics",
        "min_price": 100,
        "max_price": 1000,
        "title": "headphone"
    }
    response = requests.get(f"{BASE_URL}/users/{user_id}/get_products", params=params)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

def test_update_preferences():
    print("\nTesting POST /users/{user_id}/update_preferences")
    
    user_id = "123"
    preferences = {
        "like_product": ["B096L3FNMR"],
        "dislike_product": ["B09MHHM4XM"],

    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post(
        f"{BASE_URL}/users/{user_id}/update_preferences",
        data=json.dumps(preferences),
        headers=headers
    )

    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    test_get_product_recommendations()
    print("get_product_recommendations passed\n")
    test_update_preferences()