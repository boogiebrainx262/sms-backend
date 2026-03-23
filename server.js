const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// 🔐 YOUR 5SIM API KEY
const API_KEY = "eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE4MDU3ODQwNDksImlhdCI6MTc3NDI0ODA0OSwicmF5IjoiMmFlMWVmYzMxMTQ4ZDFjZTE0NTY0YzhjNGE2NDlmNmUiLCJzdWIiOjM4OTY4NTh9.UFKoIvUBo-OAVJKB67XtpWvOPSnjBK-EHz5vtc08OWOHDf_Lu7AJCcBN-5o6MTtYKkLq3YtmGW2gy8Fsr2Pvhy7yZm7Ud9DECgvDhw9b0ZO_-I5pKh3NZ3GMlyCbybYlkeZfY4AVv7_CaUmnvXEFxt9cLK-Eg3EDKCYijgc-qt4WKrse7DUXB_jHiatLIl-Dlk8LZPszDPR1M-iDD5VyJeGpCk_26NUqVAa7kNicuiNQHqoY5v6P5yLVQxtVZK5n4OfKGJtI7nRNULiMzcqgs2Gq-MCN5Xd8o8cO2gINP1vHbmwXZnARD8jPa2eOuuWigwDB8qjIEYdxh78kSotiEQ";

// 🧠 TEMP USERS (replace later)
let users = {
  user1: { balance: 5000 }
};

// 📦 ORDERS
let orders = [];

// ❤️ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// 🧪 PROFILE (TEST API KEY)
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

// 💰 BUY NUMBER
app.get("/buy", async (req, res) => {
  try {
    const { country, service, userId } = req.query;

    if (!country || !service || !userId) {
      return res.json({ error: "Missing parameters" });
    }

    if (!users[userId]) {
      return res.json({ error: "User not found" });
    }

    if (users[userId].balance < 500) {
      return res.json({ error: "Insufficient balance" });
    }

    const response = await axios.get(
      `https://api.5sim.net/v1/user/buy/activation/${country}/${service}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const data = response.data;

    // 💸 Deduct wallet
    users[userId].balance -= 500;

    // 📦 Save order
    const order = {
      orderId: data.id,
      number: data.phone,
      service,
      country,
      otp: null,
      status: "waiting",
      userId,
      time: new Date().toLocaleString()
    };

    orders.push(order);

    res.json(order);

  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data
    });
  }
});

// 📥 CHECK OTP
app.get("/check", async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.json({ error: "Order ID required" });
    }

    const response = await axios.get(
      `https://api.5sim.net/v1/user/check/${id}`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    const sms = response.data.sms;

    let order = orders.find(o => o.orderId == id);

    if (sms && sms.length > 0 && order) {
      order.otp = sms[0].code;
      order.status = "success";
    }

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// 📜 GET ORDERS
app.get("/orders", (req, res) => {
  const { userId } = req.query;

  const userOrders = orders.filter(o => o.userId === userId);

  res.json(userOrders);
});

// 🚀 START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
