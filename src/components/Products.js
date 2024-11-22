import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cardes from '../components/Cardes';
import Navbar from '../components/navbar';

const SkeletonCard = () => (
    <div
        className="card-skeleton"
        style={{
            width: '18%',
            backgroundColor: '#fff',
            padding: '1rem',
            borderRadius: '8px',
            boxShadow: '0 5px 7px rgba(0, 0, 0, 0.2)',
            margin: '10px',
        }}
    >
        <div className="placeholder-glow">
            <span
                className="placeholder bg-secondary"
                style={{ display: 'block', height: '10rem', borderRadius: '4px' }}
            ></span>
        </div>
        <hr style={{ margin: '0', borderColor: '#ccc' }} />
        <div className="p-3">
            <div className="placeholder-glow">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '20px', width: '80%', borderRadius: '4px', marginBottom: '1rem' }}
                ></span>
            </div>
            <div className="placeholder-glow">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '15px', width: '100%', borderRadius: '4px', marginBottom: '1rem' }}
                ></span>
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '15px', width: '100%', borderRadius: '4px' }}
                ></span>
            </div>
            <div className="d-flex gap-2 mt-4">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '40px', width: '80px', borderRadius: '4px' }}
                ></span>
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '40px', width: '100px', borderRadius: '4px' }}
                ></span>
            </div>
        </div>
    </div>
);

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true); // Loading state
    const { categoryId } = useParams();

    useEffect(() => {
        setLoading(true);
        fetch(`https://chefcartbackend.onrender.com/api/products?categoryId=${categoryId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched data:', data);
                setCategoryName(data[0]);
                setProducts(data[1]);
            })
            .catch((error) => console.error('Error fetching products:', error))
            .finally(() => setLoading(false));
    }, [categoryId]);

    return (
        <div style={{ marginTop: "100px" }}>
            <Navbar />
            <div className="container mt-5">
                <h2 className="text-center">Products in " {categoryName} "</h2>
                <div style={{ display: "flex", justifyContent: 'center', marginTop: '55px', flexWrap: "wrap" }}>
                    {loading ? (
                        Array(4).fill(0).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))
                    ) : (
                        Array.isArray(products) && products.length > 0 ? (
                            products.map((product) => (
                                <div key={product._id} style={{ margin: '10px' }}>
                                    <Cardes foodItem={product} />
                                </div>
                            ))
                        ) : (
                            <p>No products available</p>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
