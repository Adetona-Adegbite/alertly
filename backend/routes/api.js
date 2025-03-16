const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const Subscription = require("../models/subscriptions");

router.post("/send-otp", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    console.log(phoneNumber);
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, error: "Phone number is required" });
    }

    const response = await axios.post(
      `https://api.unimtx.com/?action=otp.send&accessKeyId=${process.env.OTP_ACCESS_ID}`,
      {
        to: phoneNumber,
        // channel: "whatsapp",
      }
    );
    console.log(response.data);

    if (response.data.message == "Success") {
      return res.json({ success: true, message: "OTP sent successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, error: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("OTP Sending Error:", error?.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: "Phone number and OTP code are required",
      });
    }

    const response = await axios.post(
      `https://api.unimtx.com/?action=otp.verify&accessKeyId=${process.env.OTP_ACCESS_ID}`,
      { to: phoneNumber, code }
    );

    const isValid = response.data?.data?.valid;

    if (isValid) {
      return res.json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }
  } catch (error) {
    console.error(
      "OTP Verification Error:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, phoneNumber, planId, category } = req.body;

    if (!email || !phoneNumber || !planId) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const existingUser = await Subscription.findOne({ where: { phoneNumber } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already registered" });
    }

    const newUser = await Subscription.create({
      email,
      phoneNumber,
      planId,
      category,
      status: "active",
    });

    return res.json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.post("/paystack/initialize", async (req, res) => {
  try {
    const { name, email, phoneNumber, category } = req.body;

    if (!email || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    const existingUser = await Subscription.destroy({ where: { phoneNumber } });

    const newUser = await Subscription.create({
      name,
      email,
      phoneNumber,
      category,
      status: "expired",
    });
    if (!email) {
      return res
        .status(400)
        .json({ error: "Email, amount, and callback_url are required" });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 300 * 100,
        // callback_url: "https://www.google.com",
        plan: "PLN_53iyld2yajq0rzt",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (error) {
    console.error("Paystack Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

router.post("/paystack/webhook", async (req, res) => {
  const event = req.body;

  try {
    if (
      event.event === "subscription.create" ||
      event.event === "charge.success"
    ) {
      await Subscription.update(
        { status: "active" },
        { where: { email: event.data.customer.email } }
      );
    }

    if (
      event.event === "subscription.disable" ||
      event.event === "charge.failed"
    ) {
      await Subscription.update(
        { status: "expired" },
        { where: { email: event.data.customer.email } }
      );
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(500).send("Error processing webhook");
  }
});

module.exports = router;
