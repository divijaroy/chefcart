import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaCartPlus } from 'react-icons/fa';
import Navbar from '../components/navbar';
import './YouTubeSearch.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatchCart, useCart } from '../components/ContextReducer';
import ToastNotification from '../components/ToastNotification';
const parser = require('ingredientparserjs');

const YouTubeSearch = () => {
  let dispatch = useDispatchCart();
  let data = useCart();
  const { query } = useParams();
  const [videos, setVideos] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [toastInfo, setToastInfo] = useState({ show: false, message: '', type: 'success' });
  const [missingIngredients, setMissingIngredients] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for Add to Cart button
  const [whatsAppLoading, setWhatsAppLoading] = useState(false); // Loading state for WhatsApp button
  const apiKey = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      searchVideos();
    }
  }, [query]);

  const searchVideos = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} recipe&key=${apiKey}&maxResults=10`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.items || !Array.isArray(data.items)) {
        throw new Error('Invalid data structure: "items" not found or not an array');
      }

      const videoDetails = await Promise.all(data.items.map(async (video) => {
        const videoId = video.id.videoId;
        const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
        const detailsData = await detailsResponse.json();
        return {
          ...video,
          description: detailsData.items[0].snippet.description,
        };
      }));

      const videosWithIngredients = await Promise.all(videoDetails.map(async (video) => {
        const ingredients = await fetchIngredients(video.description);
        return {
          ...video,
          ingredients,
        };
      }));

      const validVideos = videosWithIngredients.filter(video => video.ingredients.length > 2);
      setVideos(validVideos);
    } catch (error) {
      console.error('Error fetching videos', error);
    }
  };

  const fetchIngredients = async (description) => {
    try {
      const response = await fetch('http://localhost:5000/api/extract_ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      return response.json();
    } catch (error) {
      console.error('Error fetching ingredients', error);
      return [];
    }
  };

  const sendWhatsAppMessage = async (ingredients) => {
    setWhatsAppLoading(true); // Start loading for WhatsApp button

    try {
      const response = await fetch('http://localhost:5000/api/send_whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients, email: localStorage.getItem('userEmail') }),
       
      });
      const data = await response.json();
      alert(data.status || 'Message sent!');
    } catch (error) {
      console.error('Error sending WhatsApp message', error);
      alert('Failed to send message');
    } finally {
      setWhatsAppLoading(false); // End loading for WhatsApp button
    }
  };

  const showToast = (message, type) => {
    setToastInfo({ show: true, message, type });
    setTimeout(() => setToastInfo({ show: false, message: '', type: 'success' }), 3000);
  };

  const addToCart = async (ingredients) => {
    setLoading(true); // Start loading

    const parsedIngredients = ingredients.map(item => parser.parse(item));
    const notFoundIngredients = [];

    const productFetchPromises = parsedIngredients.map(async (linkedIngredient) => {
      const ingredientName = linkedIngredient.name;

      try {
        const response = await fetch(`http://localhost:5000/api/search4?q=${ingredientName}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productData = await response.json();
        return productData.length > 0 ? productData[0] : null;
      } catch (error) {
        notFoundIngredients.push(ingredientName);
        return null;
      }
    });

    const products = await Promise.all(productFetchPromises);
    const validProducts = products.filter(product => product !== null);

    validProducts.forEach(product => {
      const totalPrice = product.DiscountPrice;
      const item = {
        id: product._id,
        name: product.ProductName,
        image: product.Image_Url,
        description: product.SubCategory,
        quantity: product.Quantity,
        price: product.DiscountPrice,
        brand: product.Brand,
        selectedQuantity: 1,
        totalPrice: totalPrice,
      };

      let food = [];
      for (const cartItem of data) {
        if (cartItem.id === product._id) {
          food = cartItem;
          break;
        }
      }

      if (food.length !== 0) {
        dispatch({ type: 'UPDATE', id: product._id, totalPrice: totalPrice, selectedQuantity: 1 });
        return;
      }
      dispatch({ type: 'ADD', item });
      showToast(`${product.ProductName} added to cart!`, 'success');
    });

    if (notFoundIngredients.length > 0) {
      setMissingIngredients(notFoundIngredients);
      showToast(`No products found for: ${notFoundIngredients.join(', ')}`, 'danger');
    } else {
      setMissingIngredients([]);
    }

    setLoading(false); // End loading
  };

  const handleReadMore = (videoId) => {
    setExpanded(prev => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  const shopIngredients = async (videoIngredients) => {
    const parsedIngredients = videoIngredients.map(item => parser.parse(item));

    const linkedIngredients = videoIngredients.map((ingredient, index) => ({
      original: ingredient,
      parsed: parsedIngredients[index]
    }));

    navigate(`/youtube/${query}/shopingredients`, { state: { videoIngredients, parsedIngredients: linkedIngredients } });
  };

  return (
    <div>
      <Navbar />
      <ToastNotification show={toastInfo.show} message={toastInfo.message} type={toastInfo.type} onClose={() => setToastInfo({ ...toastInfo, show: false })} />

      <div className="container" style={{ marginTop: "70px" }}>

        <div className='video-container'>

          {videos.map((video) => (

            <div className='video-card' key={video.id.videoId}>

              <h5>{video.snippet.title}</h5>

              <div className='video-and-ingredients'>

                <div className='video-and-button'>

                  <iframe
                    title={video.snippet.title}
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>

                  <div className='button-group'>

                    <button
                      onClick={() => addToCart(video.ingredients)}
                      disabled={loading} // Disable button during loading
                    >
                      {loading ? 'Adding to Cart...' : <><FaCartPlus size={20} /> Add to Cart</>}
                    </button>

                    <button
                      onClick={() => sendWhatsAppMessage(video.ingredients)}
                      disabled={whatsAppLoading} // Disable button during WhatsApp message sending
                    >
                      {whatsAppLoading ? 'Sending...' : <><FaWhatsapp size={20} color="green" /> Send to WhatsApp</>}
                    </button>

                    <button onClick={() => shopIngredients(video.ingredients)}>
                      🛒 Shop Ingredients
                    </button>

                  </div>

                </div>

                <div className='ingredients'>

                  <h4>Ingredients:</h4>

                  <ul>
                    {video.ingredients.slice(0, expanded[video.id.videoId] ? video.ingredients.length : 5).map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>

                  {video.ingredients.length > 5 && (
                    <button
                      onClick={() => handleReadMore(video.id.videoId)}
                      style={{
                        backgroundColor: '#fff',
                        color: '#18283f',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {expanded[video.id.videoId] ? 'show less' : '...read more'}
                    </button>
                  )}

                </div>

              </div>

            </div>

          ))}

        </div>

        {missingIngredients.length > 0 && (
          <div className="alert alert-warning mt-3">
            <strong>Missing Products:</strong> No products found for: {missingIngredients.join(', ')}
          </div>
        )}

      </div>
    </div>
  );
};

export default YouTubeSearch;
