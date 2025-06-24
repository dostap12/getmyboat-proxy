const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Proxy endpoint for GetMyBoat API
app.get('/api/availability', async (req, res) => {
    try {
        const { boat_id, start_date, end_date, page_size, guest_count, currency, lang } = req.query;
        
        const response = await axios.get('https://www.getmyboat.com/api/v4/instabook/availability/', {
            params: {
                boat_id,
                start_date,
                end_date,
                page_size: page_size || 25,
                guest_count: guest_count || 2,
                currency: currency || 'USD',
                lang: lang || 'en'
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from GetMyBoat API', details: error.message });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
