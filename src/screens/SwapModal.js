import React, { useState } from 'react';

export default function SwapModal({ show, onClose, alternativeProducts, selectedProduct, onSelectAlternative }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false); // Tracks if search has been performed

    const handleSearch = async () => {
        setIsSearching(true); // Set to true to indicate search is happening
        try {
            const response = await fetch(`http://localhost:5000/api/search3?q=${searchQuery}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Error fetching products:', error);
            alert('Failed to fetch related products.');
        }
    };

    if (!show) {
        return null;
    }

    return (
        <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Swap item</h5>
                        <button type="button" className="close" onClick={onClose}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="swap-item d-flex align-items-center mb-3">
                            <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '50px' }} />
                            <h5 style={{ marginLeft: '10px' }}>{selectedProduct.name}</h5>
                            <h5 style={{ marginLeft: '10px' }}>{selectedProduct.quantity}</h5>
                            <p style={{ marginLeft: 'auto' }}>{selectedProduct.price}</p>
                        </div>

                        <input
                            type="text"
                            placeholder="Find store item"
                            className="form-control mb-4"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-primary mb-4" onClick={handleSearch}>
                            Search
                        </button>

                        <div className="alternative-items">
                            {(isSearching && searchResults.length > 0 ? searchResults : alternativeProducts).map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                    <div className="d-flex align-items-center">
                                        <img src={item.Image_Url} alt={item.ProductName} style={{ width: '50px', marginRight: '10px' }} />
                                        <span>{item.ProductName}</span>
                                        <span style={{ marginLeft: '10px' }}>{item.Quantity}</span>
                                    </div>
                                    <div className="text-right">
                                        <p>{item.DiscountPrice}</p>
                                        <button className="btn btn-primary" onClick={() => onSelectAlternative(item)}>
                                            Select
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
