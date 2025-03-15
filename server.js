const express = require('express');
const cors = require('cors');
const { kv } = require('@vercel/kv');

const app = express();

app.use(cors());
app.use(express.json());

// Get reservations
app.get('/reservations', async (req, res) => {
    try {
        const data = await kv.get('reservations');
        res.json(data || []);
    } catch (error) {
        console.error('Error fetching reservations:', error);
        res.json([]);
    }
});

// Root endpoint
app.get("/", async (req, res) => {
    res.send("This API is running");
});

// Save reservations
app.post('/reservations', async (req, res) => {
    try {
        await kv.set('reservations', req.body);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving reservations:', error);
        res.status(500).json({ error: 'Failed to save reservations' });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));

module.exports = app;