const express = require('express')
const router = express.Router()
const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

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
    //console.log(categoryId)
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
            res.json([category.category,filteredProducts]);
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



const searchProducts = async (searchQuery, lim = null) => {
    const agg = [
        {
            $search: {
                index: 'default', // Ensure this matches your Atlas index
                text: {
                    query: searchQuery,
                    path: {
                        wildcard: "*" // Search across all fields
                    }
                },
            }
        },
       
    ];
    if (typeof lim === 'number' && lim > 0) {
        agg.push({
            $limit: lim // Limit the number of results
        });
    }

    const client = await MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        const coll = client.db("test").collection("products");
        const cursor = coll.aggregate(agg);
        const results = await cursor.toArray();

        if (results.length > 0) {
            return results;
        } else {
            throw new Error("No products found.");
        }
    } catch (error) {
        console.error("Error during search:", error);
        throw error; // Propagate the error for handling in the route
    } finally {
        client.close();
    }
};

router.get('/search', async (req, res) => {
    const searchQuery = req.query.q;
    console.log("Search Query:", searchQuery);

    // Check if the query parameter exists
    if (!searchQuery) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        const results = await searchProducts(searchQuery);
        //console.log("Search Results:", results);
        res.json(results);
    } catch (error) {
        if (error.message === "No products found.") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).send("Server error");
        }
    }
});

router.get('/search3', async (req, res) => {
    const searchQuery = req.query.q;
    console.log("Search Query:", searchQuery);

    // Check if the query parameter exists
    if (!searchQuery) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        const lim=5
        const results = await searchProducts(searchQuery,lim);
        //console.log("Search Results:", results);
        res.json(results);
    } catch (error) {
        if (error.message === "No products found.") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).send("Server error");
        }
    }
});

router.get('/search2', async (req, res) => {
    const searchQuery = req.query.q;
    console.log("Search Query:", searchQuery);

    // Check if the query parameter exists
    if (!searchQuery) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        const lim = 50
        const results = await searchProducts(searchQuery, lim);
        //console.log("Search Results:", results);
        res.json(results);
    } catch (error) {
        if (error.message === "No products found.") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).send("Server error");
        }
    }
});


router.get('/search4', async (req, res) => {
    const searchQuery = req.query.q;
    console.log("Search Query:", searchQuery);

    // Check if the query parameter exists
    if (!searchQuery) {
        return res.status(400).json({ message: "Query parameter is required" });
    }

    try {
        const lim = 1
        const results = await searchProducts(searchQuery, lim);
        //console.log("Search Results:", results);
        res.json(results);
    } catch (error) {
        if (error.message === "No products found.") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).send("Server error");
        }
    }
});


// Search route
// router.get('/search', async (req, res) => {
//     const searchQuery = req.query.q;
//     console.log("Search Query:", searchQuery);
//     // Check if the query parameter exists
//     if (!searchQuery) {
//         return res.status(400).json({ message: "Query parameter is required" });
//     }

//     try {
       

//         const results = await global.products.aggregate([
//             {
//                 $search: {
//                     index: 'default', // Ensure this matches your Atlas index
//                     text: {
//                         query: searchQuery,
//                         path: {
//                             wildcard: "*" // Search across all fields
//                         }
//                     }
//                 }
//             }
//         ]).toArray(); // Convert the cursor to an array

//         console.log("Search Results:", results); // Log the search results

//         // Check if results are found and send the appropriate response
//         if (results.length > 0) {
//             res.json(results);
//         } else {
//             res.status(404).json({ message: "No products found." });
//         }
//     } catch (error) {
//         console.error("Error during search:", error); // Log the error
//         res.status(500).send("Server error");
//     }
// });





module.exports=router;