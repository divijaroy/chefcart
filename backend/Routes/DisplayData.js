const express = require('express');
const router = express.Router();

router.post('/DisplayData', async (req, res) => {
    const { category, page = 1, limit = 20 } = req.body; // Default limit set to 20

    try {
        let filter = {};
        if (category) {
            filter.Category = category; // Filter products by category
        }

        const productsCollection = global.products;

        // Count total products for pagination
        const totalProducts = await productsCollection.countDocuments(filter);
        const products = await productsCollection
            .find(filter)
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        const categoriesCollection =global.category;
        const categories = await categoriesCollection.find({}).toArray();

        res.send({ products, categories, totalProducts }); // Return products, categories, and total count
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server error");
    }
});


module.exports = router;
