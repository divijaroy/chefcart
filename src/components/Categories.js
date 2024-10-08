import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Categories() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch categories from your backend
        fetch("http://localhost:5000/api/categories") // Replace with your API URL
            .then((response) => response.json())
            .then((data) => {
                //console.log("Fetched categories: ", data);  // Debugging log
                setCategories(data);
            })
            .catch((error) => console.error("Error fetching categories:", error));
    }, []);

    return (
        <div className="container mt-5">
            <h2 className="text-center">Shop by Category</h2>
            <div className="row mt-4">
                {categories.map((category) => (
                    <div key={category.id} className="col-lg-3 col-md-4 col-sm-6 mb-4 text-center">
                        <div className="category-item">
                            <Link to={`/products/${category._id}`}>
                                <img
                                    src={category.image}
                                    alt={category.category}
                                    className="img-fluid rounded-circle"
                                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                                />
                                <h5 className="mt-3">{category.category}</h5>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
