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
const NEXT_BUILD_ID = 'B6JpKIBJAaLf6nY6CkDFy';

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
