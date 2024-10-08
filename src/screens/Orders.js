import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Cardes from '../components/Cardes';

export default function Orders() {
    const [categories, setCategories] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const productsPerPage = 20; // Number of products per page

    const loaddata = async (reset = false) => {
        let response = await fetch('http://localhost:5000/api/DisplayData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category: selectedCategory,
                page: currentPage,
                limit: productsPerPage
            })
        });

        const data = await response.json();
        setCategories(data.categories);

        if (reset) {
            setFilteredData(data.products); // Reset the product list
            setCurrentPage(1); // Reset the current page
        } else {
            setFilteredData((prevData) => [...prevData, ...data.products]); // Append new products
        }

        // Check if there are more products to load
        if (data.products.length < productsPerPage) {
            setHasMore(false); // No more products available
        } else {
            setHasMore(true);
        }
    };

    // Fetch data when the selected category or current page changes
    useEffect(() => {
        loaddata(true); // Reset data when category changes
           // eslint-disable-next-line
    }, [selectedCategory]);

    // Fetch more products when currentPage changes
    useEffect(() => {
        if (currentPage > 1) {
            loaddata(); // Load more products
        }
        // eslint-disable-next-line
    }, [currentPage]);

    // Infinite scrolling logic
    useEffect(() => {
        const handleScroll = () => {
            // Load more products when scrolling near the bottom
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 && hasMore) {
                setCurrentPage((prevPage) => prevPage + 1); // Increment current page
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Cleanup
    }, [hasMore]);

    return (
        <>
            <Navbar />
            <div style={{ fontSize: '20px', display: "flex", justifyContent: 'center', marginTop: '85px', flexWrap: "wrap" }}>
                <label htmlFor="category" style={{ marginRight: '10px', marginTop: '4px' }}>Category:</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1); // Reset to first page when changing category
                        setFilteredData([]); // Clear existing products
                        setHasMore(true); // Reset more products
                    }}
                    style={{ padding: '5px 10px', borderRadius: '5px', marginRight: '10px', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)' }}>
                    <option value="">All</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.category}>{category.category}</option>
                    ))}
                </select>
            </div>
            <div style={{ display: "flex", justifyContent: 'center', marginTop: '55px', flexWrap: "wrap" }}>
                {filteredData.length > 0 ? (
                    filteredData.map((product) => (
                        <div key={product._id} style={{ margin: '10px' }}>
                            <Cardes foodItem={product} />
                        </div>
                    ))
                ) : (
                    <p>No results found.</p>
                )}
            </div>
        </>
    );
}
