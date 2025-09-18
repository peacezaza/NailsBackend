const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

require('dotenv').config();
const postgres = require('postgres');


const app = express();

// Configure CORS to allow requests from Vite's dev server (port 5173)
app.use(cors());

app.use(express.json());

const DB_PATH = path.join(__dirname, 'database.json');


const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

// const DATABASE_URL= "postgresql://postgres.wcdslvwpyslbxuznxiys:ggggg@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres"

// Get reservations
app.get('/reservations', async (req, res) => {
    // try {
    //     const data = await fs.readFile(DB_PATH, 'utf8');
    //     console.log("Get Data SuccessFully")
    //     res.json(JSON.parse(data));
    // } catch (error) {
    //     console.log("File doesn't exist");
    //     // If file doesn't exist or is empty, return empty array
    //     res.json([]);
    // }

    // {
    //     clientName: "Tik",
    //         date: "2025-02-23",
    //     startTime: "14:00",
    //     endTime: "15:00",
    //     platform: "facebook",
    //     status: "confirmed",
    //     price: 1000,
    //     id: 1742712080500
    // }
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    try{
        const result = await sql `
SELECT 
    id,
    name as "clientName",
      current_setting('TimeZone') AS server_tz,
        timezone('Asia/Bangkok', date_time)                    AS tz_func,
    to_char(timezone(${localTz}, date_time), 'YYYY-MM-DD') AS "date",
    to_char(timezone(${localTz}, date_time)::time, 'HH24:MI') AS "startTime",
    to_char((timezone(${localTz}, date_time) + interval '2 hours')::time, 'HH24:MI') AS "endTime",
    platfrom as platform,
    price
    FROM data`;
        console.log(result);

        res.json(result)
    }catch (error){
        console.log(error);
    }
});

app.get("/", async (req, res) => {
    // try {
    //     const name = "Kanisorn";
    //     const time = Date.now();
    //     console.log(time)
    //     const platform = "facebook"
    //     const price  = 100
    //
    //
    //     const result = await sql`
    //   INSERT INTO data (name, date_time, platfrom, price)
    //   VALUES (${name}, ${time}, ${platform}, ${price})
    //   RETURNING *
    // `;
    //
    //     console.log("Inserted:", result[0]);
    // } catch (err) {
    //     console.error("Insert error:", err);
    // }
    res.send("This API in running")
})

// Save reservations
app.post('/reservations', async (req, res) => {
    // try {
    //     await fs.writeFile(DB_PATH, JSON.stringify(req.body, null, 2));
    //     console.log("Added Data Successfully")
    //     res.json({ success: true });
    // } catch (error) {
    //     console.log("Failed to write data")
    //     res.status(500).json({ error: 'Failed to save reservations' });
    // }

    try {
        const name = "Kanisorn";
        const date = "2025-09-18"
        const reserveTime = "17:00"

        // const time = new Date(`${date}T${reserveTime}:00+07:00`);
        const time = new Date(`${date}T${reserveTime}:00+07:00`);
        console.log(time)
        const platform = "facebook"
        const price  = 100
        // res.json(time)


        const result = await sql`
      INSERT INTO data (name, date_time, platfrom, price)
      VALUES (${name}, ${time}, ${platform}, ${price})
      RETURNING *
    `;

        console.log("Inserted:", result[0]);
        res.json(result);
    } catch (err) {
        console.error("Insert error:", err);
    }

});

app.listen(3000, () => console.log('Server running on port 3000'));

module.exports = app;