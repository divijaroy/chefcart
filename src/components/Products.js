import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Assuming you are using react-router
import Cardes from '../components/Cardes';

export default function Products() {
    const [products, setProducts] = useState([]);
    const { categoryId } = useParams(); // Extract category ID from route params

    useEffect(() => {
        // Fetch products based on the category ID
        fetch(`http://localhost:5000/api/products?categoryId=${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched products:', data);
                setProducts(data);
            })
            .catch((error) => console.error('Error fetching products:', error));
    }, [categoryId]); 

    return (
        <div className="container mt-5">
            <h2 className="text-center">Products in </h2>
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
    );
}
