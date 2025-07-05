import express from 'express';
import axios from 'axios';

const router = express.Router();

// Search cities using GeoDB Cities API
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters long' });
    }

    const options = {
      method: 'GET',
      url: 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      params: {
        namePrefix: q.trim(),
        limit: 10,
        offset: 0,
        sort: 'population'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);
    
    const cities = response.data.data.map(city => ({
      id: city.id,
      name: city.name,
      country: city.country,
      countryCode: city.countryCode,
      region: city.region,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population
    }));

    res.json(cities);
  } catch (error) {
    console.error('Error searching cities:', error);
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    res.status(500).json({ error: 'Failed to search cities' });
  }
});

// Get travel insights (main attractions) for a city using TripAdvisor API via RapidAPI
router.get('/insights', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }
  try {
    // Step 1: Get location_id for the city
    const locationRes = await axios.get('https://tripadvisor1.p.rapidapi.com/locations/search', {
      params: { query: city, limit: '1', offset: '0', units: 'km', location_id: '1', currency: 'USD', sort: 'relevance', lang: 'en_US' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tripadvisor1.p.rapidapi.com'
      }
    });
    console.log('TripAdvisor location search response:', locationRes.data);
    let locationData = locationRes.data.data[0]?.result_object;
    // Fallback: If not found, try with simplified city name
    if ((!locationData || !locationData.location_id) && city.toLowerCase().includes('new')) {
      const fallbackCity = city.replace(/new /i, '').trim();
      console.log(`Fallback: Trying with city name '${fallbackCity}'`);
      const fallbackRes = await axios.get('https://tripadvisor1.p.rapidapi.com/locations/search', {
        params: { query: fallbackCity, limit: '1', offset: '0', units: 'km', location_id: '1', currency: 'USD', sort: 'relevance', lang: 'en_US' },
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'tripadvisor1.p.rapidapi.com'
        }
      });
      console.log('TripAdvisor fallback location search response:', fallbackRes.data);
      locationData = fallbackRes.data.data[0]?.result_object;
    }
    if (!locationData || !locationData.location_id) {
      console.error('City not found in TripAdvisor:', city, locationRes.data);
      return res.status(404).json({ error: 'City not found in TripAdvisor' });
    }
    const location_id = locationData.location_id;
    // Step 2: Get attractions for the location_id
    const attractionsRes = await axios.get('https://tripadvisor1.p.rapidapi.com/attractions/list', {
      params: { location_id, currency: 'USD', lang: 'en_US', lunit: 'km', sort: 'recommended' },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'tripadvisor1.p.rapidapi.com'
      }
    });
    const attractions = (attractionsRes.data.data || [])
      .filter(item => item.name && item.photo)
      .slice(0, 8)
      .map(item => ({
        name: item.name,
        address: item.address,
        photo: item.photo?.images?.small?.url,
        description: item.description,
        rating: item.rating
      }));
    res.json({
      city: locationData.name,
      country: locationData.country,
      mainAttractions: attractions,
      tips: [
        'Check opening hours before visiting attractions.',
        'Book tickets in advance for popular places.',
        'Use public transport for easy city travel.'
      ]
    });
  } catch (error) {
    console.error('Error fetching travel insights:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch travel insights' });
  }
});

export default router;