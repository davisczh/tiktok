const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

let products = [];
let userActivities = [];  // Array to store user activities

fs.createReadStream('../../tiktok/assets/archive/processed_data.csv')
    .pipe(csv())
    .on('data', (data) => {
    products.push({
        id: parseInt(data.ID),
        name: data.Name,
        price: parseFloat(data['Unit Price']),
        category: data.Category,
        unitsSold: parseInt(data['Units Sold'])
    });
    })
    .on('end', () => {
    console.log('Data loaded');
    });

app.post('/api/search', (req, res) => {
  const { query, minPrice, maxPrice, selectedCategory, selectedSortOption } = req.body;

  let filteredProducts = [...products];
  console.log(query);
  console.log(filteredProducts.length)
  // Apply search query
  if (query && query !== '') {
    filteredProducts = filteredProducts.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Apply price filters
  if (minPrice && minPrice !== '') {
    filteredProducts = filteredProducts.filter(item => item.price >= parseFloat(minPrice));
  }
  if (maxPrice && maxPrice !== '') {
    filteredProducts = filteredProducts.filter(item => item.price <= parseFloat(maxPrice));
  }

  // Apply category filter
  if (selectedCategory && selectedCategory.toLowerCase() !== "none") {
    filteredProducts = filteredProducts.filter(item => item.category === selectedCategory);
  }

  // Apply sorting
  if (selectedSortOption) {
    if (selectedSortOption === 'price_asc') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (selectedSortOption === 'price_desc') {
      filteredProducts.sort((a, b) => b.price - a.price);
    }
  }

  console.log('search complete');
//   console.log('results:', filteredProducts)
  res.json(filteredProducts);

});

app.get('/api/products', (req, res) => {
    res.json(products);
});
app.get('/api/products/:id', (req, res) => {
   
    const id  = req.params.id;
    console.log('getting product:' ,id);
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  }
);

app.get('/api/user/:id', (req, res) => {    
    //TODO:
    // return user info
    // const { id } = req.params;
    // res.json({ id });
  });

app.get('/api/search/llm', async (req, res) => {
    //TODO:
    // Get user info and pass to Gemini API
    // call this api app.get('/api/user/:id', (req, res) => { ... });

    const prompt = req.query.prompt;
  
    if (useLLM) {
      try {
        const response = await queryGeminiAPI(prompt);
        res.json(response);
      } catch (error) {
        console.error('Error querying Gemini API:', error);
        res.status(500).json({ error: 'Failed to query Gemini API' });
      }
    } else {
      res.json([]);
    }
  });

app.post('/api/user/activity', (req, res) => {
  const activity = req.body;
  console.log('Received user activity:', activity);
  userActivities.push(activity);

  // Respond with a success message in JSON
  res.status(201).json({ message: 'User activity saved' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
