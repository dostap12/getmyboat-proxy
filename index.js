const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Base URL for GetMyBoat API
const GETMYBOAT_API_BASE = 'https://www.getmyboat.com';
const NEXT_BUILD_ID = 'iyZtqGrmLXYuzpYLivERd';

// Listing Information
app.get('/api/listing/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/_next/data/${NEXT_BUILD_ID}/en/trips/${listingId}.json`, {
            params: {
                listing_id: listingId
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch listing data', details: error.message });
    }
});

// Reviews
app.get('/api/listing/:listingId/reviews', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { page = 1, lang = 'en' } = req.query;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/api/v4/boats/${listingId}/reviews/`, {
            params: { page, lang }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch reviews', details: error.message });
    }
});

// Available Days for Instant Book
app.get('/api/listing/:listingId/available-days', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { start_date, end_date, lang = 'en' } = req.query;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/api/v4/instabook/availability_dates_only/`, {
            params: {
                boat_id: listingId,
                start_date,
                end_date,
                lang
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch available days', details: error.message });
    }
});

// Instant Book Days Information
app.get('/api/listing/:listingId/availability', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { start_date, end_date, page_size = 50, guest_count = 2, currency = 'USD', lang = 'en' } = req.query;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/api/v4/instabook/availability/`, {
            params: {
                boat_id: listingId,
                start_date,
                end_date,
                page_size,
                guest_count,
                currency,
                lang
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch availability', details: error.message });
    }
});

// Booking Motivators
app.get('/api/listing/:listingId/booking-motivators', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { period = 'month', start_date, lang = 'en' } = req.query;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/api/v4/boats/${listingId}/booking-motivators/`, {
            params: {
                period,
                start_date,
                lang
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch booking motivators', details: error.message });
    }
});

// Blocked Times
app.get('/api/listing/:listingId/blocked-times', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { date, lang = 'en' } = req.query;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/api/v4/boats/${listingId}/blocked-times/`, {
            params: {
                date,
                lang
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch blocked times', details: error.message });
    }
});

// Calculate Price
app.get('/api/listing/:listingId/calculate-price', async (req, res) => {
    try {
        const { listingId } = req.params;
        const { guests = 2, captain_option = 2, duration = 'PT3H', currency = 'USD', lang = 'en' } = req.query;
        const response = await axios.get(`${GETMYBOAT_API_BASE}/api/v4/boats/${listingId}/calculate_price/`, {
            params: {
                guests,
                captain_option,
                duration,
                currency,
                lang
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to calculate price', details: error.message });
    }
});

// Extract place ID from URL and search GetMyBoat
app.get('/api/search-by-url', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Extract place_id from URL
        const urlObj = new URL(url);
        const placeId = urlObj.searchParams.get('place_id');
        
        if (!placeId) {
            return res.status(400).json({ error: 'No place_id found in URL' });
        }

        // Make API call to GetMyBoat with the place_id
        const response = await axios.get(`${GETMYBOAT_API_BASE}/_next/data/${NEXT_BUILD_ID}/en/boat-rental.json`, {
            params: {
                filters: '',
                page: 1,
                place_id: placeId,
                page_size: 40,
                instabooks: true,
                lang: 'en'
            }
        });

        res.json({
            placeId: placeId,
            searchResults: response.data
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to search by URL', details: error.message });
    }
});

// Direct place ID search
app.get('/api/search-by-place-id', async (req, res) => {
    try {
        const { placeId, page = 1 } = req.query;
        
        if (!placeId) {
            return res.status(400).json({ error: 'placeId parameter is required' });
        }

        // Make API call to GetMyBoat with the place_id
        const response = await axios.get(`${GETMYBOAT_API_BASE}/_next/data/${NEXT_BUILD_ID}/en/boat-rental.json`, {
            params: {
                filters: '',
                page: page,
                place_id: placeId,
                page_size: 40,
                instabooks: true,
                lang: 'en'
            }
        });

        res.json({
            placeId: placeId,
            searchResults: response.data
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to search by place ID', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
