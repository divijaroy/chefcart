import React, { useState } from 'react';
import { FaWhatsapp, FaCartPlus } from 'react-icons/fa';
import styled from 'styled-components';
import backgroundImage from '../images/tomato-veggies-soup-with-empty-notepad.jpg'; // Adjust the path accordingly
const parser = require('ingredientparserjs');

const YouTubeSearch = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState([]);
  const [searched, setSearched] = useState(false);
  const apiKey = process.env.REACT_APP_API_KEY;

  const searchVideos = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} recipe&key=${apiKey}&maxResults=10`);
      const data = await response.json();

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
      setSearched(true);
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

  const addToCart = async (ingredients) => {
    // Parse ingredients using ingredientparserjs
    const parsedIngredients = ingredients.map(item => parser.parse(item));

    // Log parsed ingredients to console
    parsedIngredients.forEach(ingredient => {
      console.log(`Ingredient: ${Array.isArray(ingredient.name) ? ingredient.name.join(', ') : ingredient.name}`);
      console.log(`Quantity: ${ingredient.measurement ? ingredient.measurement.quantity : 'None'}`);
      console.log(`Unit: ${ingredient.measurement ? ingredient.measurement.unit : 'None'}`);
      console.log('-'.repeat(40));
    });

    alert(`Added to cart: ${parsedIngredients.map(ing => ing.name).join(', ')}`);
  };

  // New state to manage the expanded state of ingredients
  const [expanded, setExpanded] = useState({});

  const handleReadMore = (videoId) => {
    setExpanded(prev => ({
      ...prev,
      [videoId]: !prev[videoId],
    }));
  };

  return (
    <Container>
      {!searched ? (
        <LandingPage>
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
        </LandingPage>
      ) : (
        <VideoContainer>
          {videos.map((video) => (
            <VideoCard key={video.id.videoId}>
              <h5>{video.snippet.title}</h5>
              <VideoAndIngredients>
                <VideoAndButton>
                  <iframe
                    title={video.snippet.title}
                    src={`https://www.youtube.com/embed/${video.id.videoId}`}
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  <ButtonGroup>
                    <button onClick={() => addToCart(video.ingredients)}>
                      <FaCartPlus size={20} /> Add to Cart
                    </button>
                    <button onClick={() => sendWhatsAppMessage(video.ingredients)}>
                      <FaWhatsapp size={20} color="green" /> Send to WhatsApp
                    </button>
                  </ButtonGroup>
                </VideoAndButton>
                <Ingredients>
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
                        color: '#ff7043',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {expanded[video.id.videoId] ? 'show less' : '...read more'}
                    </button>
                  )}
                </Ingredients>
              </VideoAndIngredients>
            </VideoCard>
          ))}
        </VideoContainer>
      )}
    </Container>
  );
};

 

const Container = styled.div`
  font-family: 'Arial', sans-serif;
  background-color: #fff;
`;


const LandingPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(${backgroundImage}) no-repeat center center/cover;
  
  h1 {
    color: #ff7043;
    font-size: 3rem;
    margin-bottom: 20px;
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  input {
    padding: 10px;
    width: 300px;
    border-radius: 5px;
    border: 2px solid #ff7043;
    margin-bottom: 10px;
  }

  button {
    padding: 10px 20px;
    background-color: #ff7043;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    background-color: #ff5722;
  }
`;


const VideoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  max-width:100%; /* Ensures the container has enough width */
  margin: 2%; /* Centers the container */
  gap: 15px;
  h5 {
    color: #ff5722;
    margin-bottom: 10px;
   
  }
`;

const VideoCard = styled.div`
  background: #ffff;
 
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
  flex: 1 1 45%; /* Ensures each card takes up roughly half of the container */
  box-sizing: border-box;

  iframe {
    width: 100%;
    height: 195px;
  }

  h4 {
    color: #ff5722;
    margin-bottom: 10px;
   
  }
`;


const VideoAndButton = styled.div`
  display: flex;
  flex-direction: column;
`;

const VideoAndIngredients = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Ingredients = styled.div`
  background: #fff;
  padding: 20px;
 
  border-radius: 10px;
 
  flex: 1;
  margin-left: 20px;

  h4 {
    color: #ff5722;
  
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
    padding: 5px;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;

  button {
    margin: 5px;
    padding: 10px;
    border: none;
    border-radius: 10px;
    background-color: #ff7043;
    color: #fff;
    width: 100%;

    cursor: pointer;
  }

  button:hover {
    background-color: #ff5722;
  }

  svg {
    margin-right: 5px;
  }
`;

export default YouTubeSearch;
