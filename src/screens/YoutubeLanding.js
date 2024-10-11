// src/components/YouTubeLanding.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YoutubeLanding.css';
import Navbar from '../components/navbar';
const YouTubeLanding = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/youtube/${query}`); // Navigate to the results page
    };

    return (
        <div>
        <Navbar/>
       
        <div className="landing-page">
            
            <h1>Discover Delicious Recipes</h1>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a recipe"
                />
                <button type="submit">Search</button>
            </form>
        </div>
        </div>
    );
};

export default YouTubeLanding;
