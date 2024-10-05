import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);

  const searchVideos = async () => {
    

    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} recipe&key=${process.env.API_KEY}&maxResults=10`);
      const data = await response.json();

      const videoDetails = await Promise.all(data.items.map(async (video) => {
        const videoId = video.id.videoId;
        const detailsResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.API_KEY}`);
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

      // Filter out videos with less than 2 ingredients
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
      return response.json(); // Assumes response is the array of ingredients
    } catch (error) {
      console.error('Error fetching ingredients', error);
      return [];
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchVideos();
  };

 

  const sendWhatsAppMessage = async (ingredients) => {
    try {
      const response = await fetch('http://localhost:5000/api/send_whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      alert(data.status || 'Message sent!');
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
             
              <button onClick={() => sendWhatsAppMessage(video.ingredients)}><FaWhatsapp size={30} color="green" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YouTubeSearch;
