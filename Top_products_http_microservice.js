const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');

const app = express();
const port = 3000;

// Dummy e-commerce APIs
const apiUrls = [
    'https://api.AMZ.com/products',
    'https://api.FLP.com/products',
    'https://api.SNP.com/products',
    'https://api.MYN.com/products',
    'https://api.AZO.com/products'
];

// Helper function to fetch product data from e-commerce APIs
async function fetchProducts(url, category) {
    const queryParams = querystring.stringify({ category });
    const apiUrl = ${url}?${queryParams};
    const response = await fetch(apiUrl);
    if (response.ok) {
        const data = await response.json();
        return data.products;
    } else {
        throw new Error(Failed to fetch products from ${url});
    }
}

// Endpoint to handle requests for top products
app.get('/categories/:categoryName/products', async (req, res) => {
    // Implementation for fetching top products
});

// Endpoint to handle requests for details of a specific product
app.get('/categories/:categoryName/products/:productId', async (req, res) => {
    const categoryName = req.params.categoryName;
    const productId = req.params.productId;

    try {
        let productDetails;
        // Fetch products from each e-commerce API
        for (const apiUrl of apiUrls) {
            const products = await fetchProducts(apiUrl, categoryName);
            productDetails = products.find(product => product.id === productId);
            if (productDetails) {
                break;
            }
        }

        if (productDetails) {
            res.json(productDetails);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(Server is running on port ${port});
});
