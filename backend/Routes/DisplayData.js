const express = require('express')
const router = express.Router()

router.post('/DisplayData',(req,res)=>{
    try {
        res.send([global.products,global.brand,global.category])
    } catch (error) {
        console.error(error.message);
        res.send("server error");
    }
})

router.get('/products', (req, res) => {
    const categoryId = req.query.categoryId; // Get the category ID from the query parameters
    // console.log(categoryId)
    try {
        // Find the category name based on the category ID
        const ObjectId = require('mongodb').ObjectId;
        const category = global.category.find(cat => cat._id.equals(ObjectId(categoryId)));

        // console.log(category.category)
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Filter products based on the category name
        const filteredProducts = global.products.filter(
            (product) => product.Category === category.category // Compare with the category name
        );

        if (filteredProducts.length > 0) {
            res.json(filteredProducts);
        } else {
            res.status(404).json({ message: "No products found for this category" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


router.get('/categories', (req, res) => {
    try {
        
        res.send( global.category)
    } catch (error) {
        console.error(error.message);
        res.send("server error");
    }
})

module.exports=router;