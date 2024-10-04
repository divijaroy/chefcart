import React, { useState } from 'react';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa';

const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
 
  const searchVideos = async () => {
    const API_KEY = 'AIzaSyCmNbj5akGMG0p9cvgGiE2r7yl18bXTHhY';

    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: `${query} recipe`,
          key: API_KEY,
          maxResults: 10,
        },
      });

      const videoDetails = await Promise.all(response.data.items.map(async (video) => {
        const videoId = video.id.videoId;
        const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: 'snippet',
            id: videoId,
            key: API_KEY,
          },
        });
        return {
          ...video,
          description: detailsResponse.data.items[0].snippet.description,
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
      const response = await axios.post('http://localhost:5000/extract_ingredients', { description });
      return response.data;
    } catch (error) {
      console.error('Error fetching ingredients', error);
      return [];
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos();
  };

  const addToCart = async (ingredients) => {
    try {
      const response = await axios.post('http://localhost:5000/add_to_cart', { ingredients:['milk'] });
      if (response.data.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      }
    } catch (error) {
      console.error('Error adding to cart', error);
    }
  };


 
  const sendWhatsAppMessage = async (ingredients) => {
    try {
      const response = await axios.post('http://localhost:5000/send_whatsapp', {
        ingredients
      });
      alert(response.data.status || 'Message sent!');
    } catch (error) {
      console.error('Error sending WhatsApp message', error);
      alert('Failed to send message');
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a food item"
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {videos.map((video) => (
          <div key={video.id.videoId}>
            <h3>{video.snippet.title}</h3>
            <iframe
              title={video.snippet.title}
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allowFullScreen
            ></iframe>
            <div>
              <h4>Ingredients:</h4>
              <ul>
                {video.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <button onClick={() => addToCart(video.ingredients)}>Add to Cart</button>
              <button onClick={() => sendWhatsAppMessage(video.ingredients)}><FaWhatsapp size={30} color="green" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeSearch;
