# Qdrant Setup and Data Ingestion

## Prerequisites

- Docker
- Python 3.7+

## Install requirements to run the notebook to ingest data into the locally hosted database

1. Pull the Qdrant Docker image:

```
docker pull qdrant/qdrant

pip install -r requirements.txt
```

2. Verify Qdrant is running by visiting `http://localhost:6333/dashboard` in your browser.

3. Open `data_ingestion.ipynb` and run all cells.

## Start the app

At project-root directory, run

```
docker compose up --build -d
```

Go to frontend directory and start the frontend app

```
npm install
npm run dev
```

# Project directory

# NOTE: df_combined_small.csv will be generated from data_ingestion.ipynb

```
project-root/
├── backend/
│ ├── app/
│ │ ├── main.py
│ │ └── utils.py
│ ├── Dockerfile
│ └── requirements.txt
├── data/
| ├── archive/
│ │ ├── amazon_products.csv
│ │ └── amazon_categories.csv
│ └── df_combined_small.csv
├── docker-compose.yml
└── frontend/
```
