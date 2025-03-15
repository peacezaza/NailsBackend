const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Configure CORS to allow requests from Vite's dev server (port 5173)
app.use(cors());

app.use(express.json());

const DB_PATH = path.join(__dirname, 'database.json');

// Get reservations
app.get('/reservations', async (req, res) => {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        res.json([]);
    }
});

app.get("/", async (req, res) => {
    res.send("This API in running")
})

// Save reservations
app.post('/reservations', async (req, res) => {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save reservations' });
    }
});

app.listen(3001, () => console.log('Server running on port 3001'));

module.exports = app;