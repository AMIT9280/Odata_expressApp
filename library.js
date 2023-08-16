const express = require('express');
const { ODataServer } = require('odata-v4-server');
const app = express();


const products = [
  { ProductId: 1, ProductName: 'Product A', Price: 100, Category: 'Electronics' },
  { ProductId: 2, ProductName: 'Product B', Price: 150, Category: 'Clothing' },
];

// Define the Product class
class ProductService extends ODataServer {
  async find(query, context) {
    // Parse query options using the "odata-v4-server" library
    const odataQuery = this.parse(query);

    // Determine the selected attributes (if $select is provided)
    const selectedAttributes = odataQuery.query.$select || Object.keys(products[0]);

    // Handle manual attribute addition (if $add is provided)
    if (odataQuery.query.$add) {
      const additionalAttributes = odataQuery.query.$add.split(',');
      selectedAttributes.push(...additionalAttributes);
    }

    // Apply attribute selection and addition to the products
    const selectedProducts = products.map(product => {
      const selectedProduct = {};
      selectedAttributes.forEach(attribute => {
        if (product[attribute] !== undefined) {
          selectedProduct[attribute] = product[attribute];
        }
      });
      return selectedProduct;
    });

    return selectedProducts;
  }
}

// Set up the OData server
const server = new ODataServer().controller(ProductService).entitySet('Products', ProductService);

// Use the OData server as middleware
app.use('/odata', server);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


