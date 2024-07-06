# Qdrant Setup and Data Ingestion

## Prerequisites

- Docker
- Python 3.7+

1. Pull the Qdrant Docker image:

```
docker pull qdrant/qdrant
```

2. Run the Qdrant container:

```
docker run -p 6333:6333 -p 6334:6334     -v $(pwd)/qdrant_storage:/qdrant/storage:z     qdrant/qdrant
```

3. Verify Qdrant is running by visiting `http://localhost:6333/dashboard` in your browser.

4. Install requirements

```
pip install -r requirements.txt
```

5. Open `data_ingestion.ipynb` and run all cells.

6. Run the test recommender script

```
python test_recommender.py
```
