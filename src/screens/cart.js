import React, { useState } from 'react';
import { useCart, useDispatchCart } from '../components/ContextReducer';
import SwapModal from './SwapModal';

export default function Cart() {
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [alternativeProducts, setAlternativeProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const data = useCart();
  const dispatch = useDispatchCart();

  if (data.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px' }}>
        <h1 className='m-5 text-center fs-2 bold' style={{ color: 'whitesmoke', fontFamily: "Caveat,cursive", margin: '0' }}>
          The Cart is Empty!
        </h1>
      </div>
    );
  }

  const handleCheckOut = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      const response = await fetch('http://localhost:5000/api/OrderData', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_data: data,
          email: userEmail,
          order_date: new Date().toDateString(),
        }),
      });

      if (response.status === 200) {
        dispatch({ type: 'DROP' });
      } else {
        console.error('Failed to check:', response.status);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  const handleOpenSwapModal = async (food) => {
    setSelectedProduct(food);
    setAlternativeProducts([]);
    const ingredientName = food.name;

    try {
      const response = await fetch(`http://localhost:5000/api/search3?q=${ingredientName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAlternativeProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch related products.');
    }
    setShowSwapModal(true);
  };

  const handleCloseSwapModal = () => setShowSwapModal(false);

  const handleSelectAlternative = (newItem) => {
    dispatch({
      type: 'SWAP',
      oldItem: selectedProduct,
      newItem: {
        id: newItem._id,
        name: newItem.ProductName,
        image: newItem.Image_Url,
        description: newItem.Category,
        quantity: newItem.Quantity,
        price: newItem.DiscountPrice,
        brand: newItem.Brand,
        selectedQuantity: 1,
        totalPrice: newItem.DiscountPrice * 1,
      }
    });
    setShowSwapModal(false);
  };

  // Calculate total price and round to 2 decimal places
  const totalPrice = data.reduce((total, food) => total + food.totalPrice, 0).toFixed(2);

  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity < 1) return; // Prevent negative or zero quantity
    const updatedFood = { ...data[index], selectedQuantity: newQuantity, totalPrice: newQuantity * data[index].price };
    dispatch({ type: 'UPDATE_QUANTITY', index, updatedFood });
  };

  return (
    <div>
      <h1 className='fs-2' style={{ color: 'whitesmoke', fontFamily: "Caveat,cursive", textAlign: 'center', marginBottom: '20px' }}>
        Your Cart
      </h1>

      {/* Scrollable Table Container */}
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <table className='table table-hover'>
          <thead className='text-success fs-5'>
            <tr>
              <th scope='col'>#</th>
              <th scope='col'>Name</th>
              <th scope='col'>Quantity</th>
              <th scope='col'>Amount</th>
              <th scope='col'></th>
              <th scope='col'></th>
            </tr>
          </thead>
          <tbody>
            {data.map((food, index) => (
              <tr key={index}>
                <th scope='row'>{index + 1}</th>
                <td className='fs-5' style={{ fontWeight: '600' }}>{food.name}</td>

                {/* Quantity section with buttons for increasing and decreasing */}
                <td className='fs-5' style={{ fontWeight: '600' }}>
                  <button className="btn btn-sm btn-outline-danger mx-1" onClick={() => handleQuantityChange(index, food.selectedQuantity - 1)}>-</button>
                  {food.selectedQuantity}
                  <button className="btn btn-sm btn-outline-success mx-1" onClick={() => handleQuantityChange(index, food.selectedQuantity + 1)}>+</button>
                </td>

                <td className='fs-5' style={{ fontWeight: '600' }}>{food.totalPrice.toFixed(2)}</td>
                <td>
                  <button type="button" className="btn p-0" style={{ height: '30px', width: '30px', border: 'none', background: 'none' }} onClick={() => { dispatch({ type: "REMOVE", index: index }) }}>
                    <img src="https://imgur.com/rUAxV0S.png" alt='delete' style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </button>
                </td>
                <td>
                  <div className='btn-group'>
                    <button className='btn btn-primary btn-sm' onClick={() => handleOpenSwapModal(food)}>swap</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h1 className='fs-3' style={{ color: 'whitesmoke', fontFamily: "Caveat,cursive" }}>Total Price: {totalPrice}/-</h1>
      </div>
      <div className='btn-group'>
        <button className='btn bg-success mt-5' onClick={handleCheckOut}>Check Out</button>
      </div>

      {/* Swap Modal */}
      <SwapModal
        show={showSwapModal}
        onClose={handleCloseSwapModal}
        selectedProduct={selectedProduct}
        alternativeProducts={alternativeProducts}
        onSelectAlternative={handleSelectAlternative}
      />
    </div>
  );
}
