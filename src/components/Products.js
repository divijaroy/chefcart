import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you are using react-router
import Cardes from '../components/Cardes';
import Navbar from '../components/navbar';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState(''); // State for category name
    const { categoryId } = useParams(); // Extract category ID from route params

    useEffect(() => {
        // Fetch products and category name based on the category ID
        fetch(`http://localhost:5000/api/products?categoryId=${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data:', data);
                setCategoryName(data[0]); // Set category name
                setProducts(data[1]);     // Set products
            })
            .catch((error) => console.error('Error fetching products:', error));
    }, [categoryId]);

    return (
        <div style={{ marginTop: "100px" }}>
            <Navbar />
            <div className="container mt-5" >
                <h2 className="text-center">Products in " {categoryName} "</h2> {/* Display the category name */}
                <div style={{ display: "flex", justifyContent: 'center', marginTop: '55px', flexWrap: "wrap" }}>
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} style={{ margin: '10px' }}>
                                <Cardes foodItem={product} />
                            </div>
                        ))
                    ) : (
                        <p>No products available</p>
                    )}
                </div>
            </div>
        </div>
    );
}
