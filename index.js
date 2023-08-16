const express = require('express');
const app = express();

// Sample data
const products = [
  { ProductId: 1, ProductName: 'Product A', Price: 100, Category: 'Electronics' },
  { ProductId: 2, ProductName: 'Product B', Price: 150, Category: 'Clothing' },
];

app.get('/odata/Products', (req, res) => {
  try {
    const queryParams = req.query;

    // Handle attribute selection using $select
    let selectedAttributes = Object.keys(products[0]); // Default to all attributes
    if (queryParams.$select) {
      selectedAttributes = queryParams.$select.split(',');
    }

    // Handle manual attribute addition using $add
    if (queryParams.$add) {
      const additionalAttributes = queryParams.$add.split(',');
      selectedAttributes = [...selectedAttributes, ...additionalAttributes];
    }

    // Filter the products to include only the selected attributes
    const selectedProducts = products.map(product => {
      const selectedProduct = {};
      selectedAttributes.forEach(attribute => {
        if (product[attribute] !== undefined) {
          selectedProduct[attribute] = product[attribute];
        }
      });
      return selectedProduct;
    });

    res.json(selectedProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
