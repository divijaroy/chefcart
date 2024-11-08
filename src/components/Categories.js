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
        <div className="container mt-5" style={{ textAlign: "center", boxShadow: "none" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              flex: "1",
              borderBottom: "1px solid #ccc",
              marginRight: "20px",
              marginLeft: "300px",
            }}
          />
          <h2
            style={{
              fontSize: "25px",
              fontWeight: "400", // Thin font
              margin: "0",
            }}
          >
            SHOP BY CATEGORY
          </h2>
          <span
            style={{
              flex: "1",
              borderBottom: "1px solid #ccc",
              marginLeft: "20px",
              marginRight: "300px",
            }}
          />
        </div>
      
        <div className="row mt-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="col-lg-2 col-md-4 col-sm-6 mb-4"
              style={{ textAlign: "center" }}
            >
              <div className="category-item">
                <Link
                  to={`/products/${category._id}`}
                  style={{
                    textDecoration: "none", // Removes underline
                    color: "inherit", // Inherits the parent color (removes default link color)
                  }}
                >
                  <img
                    src={category.image}
                    alt={category.category}
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "50%",
                      border: "3px solid #eaeaea",
                      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <h5
                    style={{
                      marginTop: "15px",
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#666",
                    }}
                  >
                    {category.category}
                  </h5>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      

    );
}
