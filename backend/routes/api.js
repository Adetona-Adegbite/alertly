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
    const existingUser = await Subscription.findOne({ where: { phoneNumber } });
    if (existingUser) {
      if (existingUser.status === "active") {
        return res.status(400).json({
          success: false,
          error: "User already has an active subscription",
        });
      }

      await existingUser.update({ name, email, category, status: "expired" });
    } else {
      await Subscription.create({
        name,
        email,
        phoneNumber,
        category,
        status: "expired",
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: 400 * 100,
        plan: "PLN_7rkzvvlxqhuqrvo",
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
  const message =
    "🎉 Welcome to Alertly!\n\n" +
    "Hi, I'm *Alertly*, your personal *AI news assistant*. 📰✨\n" +
    "I'll keep you updated with *tailored news* that matches your interests, delivered straight to your WhatsApp.\n\n" +
    "To ensure you never miss an update, **please save this number** to your contacts. 📲\n\n" +
    "Looking forward to keeping you informed! 🚀💜";

  try {
    if (
      event.event === "subscription.create" ||
      event.event === "charge.success"
    ) {
      await Subscription.update(
        { status: "active" },
        { where: { email: event.data.customer.email } }
      );
      const subscription = await Subscription.findOne({
        where: { email: event.data.customer.email },
      });

      if (subscription) {
        const phoneNumber = subscription.phoneNumber;
        const apiKey = process.env.WHATSAPP_API_KEY;

        await axios.post(
          "https://waapi.app/api/v1/instances/51717/client/action/send-message",
          {
            chatId: `${phoneNumber}@c.us`,
            message: message,
          },
          {
            headers: {
              accept: "application/json",
              authorization: `Bearer ${apiKey}`,
              "content-type": "application/json",
            },
          }
        );
      }
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
router.post("/whatsapp/webhook", async (req, res) => {
  const event = req.body;
  try {
    if (event.event === "message") {
      const { body, from } = event.data.message._data;
      const chatId = from.split("@")[0];

      const validCategories = [
        "news",
        "sports",
        "entertainment",
        "technology",
        "business",
        "health",
        "fun facts",
      ];

      if (body.toLowerCase().startsWith("change category to ")) {
        const category = body
          .toLowerCase()
          .replace("change category to ", "")
          .trim();

        if (category) {
          if (validCategories.includes(category)) {
            const subscription = await Subscription.findOne({
              where: { phoneNumber: chatId },
            });

            if (subscription) {
              await subscription.update({ category: category });

              const confirmationMessage = `Category successfully changed to *${category}*!💜 \n You'll now receive updates related to this category.`;

              await axios.post(
                "https://waapi.app/api/v1/instances/51717/client/action/send-message",
                {
                  chatId: `${chatId}@c.us`,
                  message: confirmationMessage,
                },
                {
                  headers: {
                    accept: "application/json",
                    authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
                    "content-type": "application/json",
                  },
                }
              );
            } else {
              await axios.post(
                "https://waapi.app/api/v1/instances/51717/client/action/send-message",
                {
                  chatId: `${chatId}@c.us`,
                  message:
                    "Sorry, I couldn't find your subscription. Please register first.",
                },
                {
                  headers: {
                    accept: "application/json",
                    authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
                    "content-type": "application/json",
                  },
                }
              );
            }
          } else {
            const categoriesList = `Sorry, "${category}" is not a valid category 😔. Available categories are:\n\n${validCategories
              .map((cat) => `- ${cat}`)
              .join(
                "\n"
              )}\n\nPlease use one of these categories when changing.`;

            await axios.post(
              "https://waapi.app/api/v1/instances/51717/client/action/send-message",
              {
                chatId: `${chatId}@c.us`,
                message: categoriesList,
              },
              {
                headers: {
                  accept: "application/json",
                  authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
                  "content-type": "application/json",
                },
              }
            );
          }
        } else {
          const errorMessage =
            "Please specify a category. Format should be 'Change category to 'category name''";

          await axios.post(
            "https://waapi.app/api/v1/instances/51717/client/action/send-message",
            {
              chatId: `${chatId}@c.us`,
              message: errorMessage,
            },
            {
              headers: {
                accept: "application/json",
                authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
                "content-type": "application/json",
              },
            }
          );
        }
      } else {
        const defaultResponse =
          "Hi! How can I assist you today? You can change your category by sending 'Change category to 'category name'💜.";

        await axios.post(
          "https://waapi.app/api/v1/instances/51717/client/action/send-message",
          {
            chatId: `${chatId}@c.us`,
            message: defaultResponse,
          },
          {
            headers: {
              accept: "application/json",
              authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
              "content-type": "application/json",
            },
          }
        );
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    res.status(500).send("Error processing webhook");
  }
});
router.get("/users", async (req, res) => {
  try {
    const users = await Subscription.findAll({
      where: {
        status: "active",
      },
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/broadcast", async (req, res) => {
  const { message, selectedUsers } = req.body;

  if (!message || !selectedUsers || selectedUsers.length === 0) {
    return res.status(400).json({ error: "Missing message or users" });
  }

  try {
    for (const user of selectedUsers) {
      await axios.post(
        "https://waapi.app/api/v1/instances/51717/client/action/send-message",
        {
          chatId: `${user}@c.us`,
          message: message,
        },
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${process.env.WHATSAPP_API_KEY}`,
            "content-type": "application/json",
          },
        }
      );
    }

    res.json({ success: true, sentTo: selectedUsers.length });
  } catch (error) {
    console.error("Broadcast error:", error.message);
    res.status(500).json({ error: "Failed to send messages" });
  }
});

module.exports = router;
