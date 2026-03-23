const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔐 YOUR 5SIM API KEY
const API_KEY = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDU3ODQwNDksImlhdCI6MTc3NDI0ODA0OSwicmF5IjoiMmFlMWVmYzMxMTQ4ZDFjZTE0NTY0YzhjNGE2NDlmNmUiLCJzdWIiOjM4OTY4NTh9.UFKoIvUBo-OAVJKB67XtpWvOPSnjBK-EHz5vtc08OWOHDf_Lu7AJCcBN-5o6MTtYKkLq3YtmGW2gy8Fsr2Pvhy7yZm7Ud9DECgvDhw9b0ZO_-I5pKh3NZ3GMlyCbybYlkeZfY4AVv7_CaUmnvXEFxt9cLK-Eg3EDKCYijgc-qt4WKrse7DUXB_jHiatLIl-Dlk8LZPszDPR1M-iDD5VyJeGpCk_26NUqVAa7kNicuiNQHqoY5v6P5yLVQxtVZK5n4OfKGJtI7nRNULiMzcqgs2Gq-MCN5Xd8o8cO2gINP1vHbmwXZnARD8jPa2eOuuWigwDB8qjIEYdxh78kSotiEQ";

// 🧪 TEST ROUTE (Check if API key works)
app.get("/profile", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.5sim.net/v1/user/profile",
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// 📱 BUY NUMBER
app.get("/buy", async (req, res) => {
  try {
    const { country, service } = req.query;

    if (!country || !service) {
      return res.json({
        error: "Please provide country and service"
      });
    }

    const response = await axios.get(
      `https://api.5sim.net/v1/user/buy/activation/${country}/${service}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// 📥 CHECK SMS (GET OTP)
app.get("/check", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({
        error: "Order ID is required"
      });
    }

    const response = await axios.get(
      `https://api.5sim.net/v1/user/check/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// ❤️ ROOT ROUTE
app.get("/", (req, res) => {
  res.send("SMS Backend is running 🚀");
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
