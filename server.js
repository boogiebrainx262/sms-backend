const express = require("express");
const axios = require("axios");

const app = express();

// BUY NUMBER
app.get("/buy", async (req, res) => {
  try {
    const { country, service } = req.query;

    const response = await axios.get(
      `https://api.5sim.net/v1/user/buy/activation/${country}/${service}`,
      {
        headers: {
          Authorization: "Bearer YOUR_API_KEY"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CHECK SMS
app.get("/check", async (req, res) => {
  try {
    const { id } = req.query;

    const response = await axios.get(
      `https://api.5sim.net/v1/user/check/${id}`,
      {
        headers: {
          Authorization: "Bearer YOUR_API_KEY"
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));
