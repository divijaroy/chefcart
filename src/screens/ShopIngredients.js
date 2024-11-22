import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
        {/* Image Skeleton */}
        <div className="placeholder-glow">
            <span
                className="placeholder bg-secondary"
                style={{ display: 'block', height: '10rem', borderRadius: '4px' }}
            ></span>
        </div>

        {/* Divider */}
        <hr style={{ margin: '0', borderColor: '#ccc' }} />

        {/* Content Skeleton */}
        <div className="p-3">
            {/* Title Skeleton */}
            <div className="placeholder-glow">
                <span
                    className="placeholder bg-secondary"
                    style={{ display: 'block', height: '20px', width: '80%', borderRadius: '4px', marginBottom: '1rem' }}
                ></span>
            </div>

            {/* Text Skeleton */}
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

            {/* Button Skeletons */}
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
const ShopIngredients = () => {
    const location = useLocation();
    const { videoIngredients, parsedIngredients } = location.state;
    const navigate = useNavigate();

    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);  // New loading state

    const handleBack = () => {
        navigate(-1);  // This will navigate back to the previous page
    };

    const handleIngredientClick = async (ingredient) => {
        setSelectedIngredient(ingredient);


        setLoading(true);  // Show loading while fetching
        setRelatedProducts([]);  // Clear previous results

        const linkedIngredient = parsedIngredients.find((p) => p.original === ingredient);

        if (linkedIngredient) {
            const ingredientName = linkedIngredient.parsed.name;

            try {
                console.log('Ingredient name:', ingredientName);
                const response = await fetch(`https://chefcartbackend.onrender.com/api/search2?q=${ingredientName}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setRelatedProducts(data);

            } catch (error) {
                console.error('Error fetching products:', error);
                alert('Failed to fetch related products.');
            } finally {
                setLoading(false);  // Hide loading when done
            }
        } else {
            setLoading(false);  // Hide loading if no ingredient is found
            console.error('Linked ingredient not found');
            alert('Linked ingredient not found.');
        }
    };

    return (
        <div>
            <Navbar />

            <Container style={{ marginTop: "70px" }}>
                <Sidebar>
                    <h4>Ingredients</h4>
                    {/* Display video.ingredients */}
                    {videoIngredients.map((ingredient, index) => (
                        <button key={index} onClick={() => handleIngredientClick(ingredient)}>
                            {ingredient}
                        </button>
                    ))}
                    <button onClick={handleBack}>Back</button>
                </Sidebar>

                <Content>
                    <div className="container mt-5">
                        <h2 className="text-center">
                            {selectedIngredient ? `Products for "${selectedIngredient}"` : 'Select an Ingredient'}
                        </h2>
                        <div style={{ display: "flex", justifyContent: 'center', marginTop: '55px', flexWrap: "wrap" }}>
                            {/* Loading state */}
                            {loading ? (

                                Array(3).fill(0).map((_, index) => (
                                    <SkeletonCard key={index} />
                                ))
                            ) : (

                                relatedProducts.length > 0 ? (
                                    relatedProducts.map((product) => (
                                        <div key={product._id} style={{ margin: '10px' }}>
                                            <Cardes foodItem={product} />
                                        </div>
                                    ))
                                ) : (
                                    <p>{selectedIngredient ? 'No products available' : 'Please choose an ingredient'}</p>
                                )

                            )}
                        </div>
                    </div>
                </Content>
            </Container>
        </div>
    );
};

const Container = styled.div`
  display: flex;
`;

const Sidebar = styled.div`
  width: 25%;
  background-color: #f7f7f7;
  padding: 20px;
  border-right: 1px solid #ccc;
  
  h4 {
    margin-bottom: 20px;
  }

  button {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
  }
`;

const Content = styled.div`
  width: 75%;
  padding: 20px;
`;

export default ShopIngredients;
