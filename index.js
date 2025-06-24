const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Proxy endpoint for GetMyBoat Next.js data
app.get('/api/listing/:listingId', async (req, res) => {
    try {
        const { listingId } = req.params;
        const buildId = 'B6JpKIBJAaLf6nY6CkDFy'; // This might need to be updated periodically
        
        const response = await axios.get(`https://www.getmyboat.com/_next/data/${buildId}/en/trips/${listingId}.json`, {
            params: {
                listing_id: listingId
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from GetMyBoat API', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
