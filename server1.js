const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Load from .env

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// 🎯 Create a Checkout Session for Stripe Payment
app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: "Psychic Chat Session" },
                    unit_amount: 1000, // $10.00 per session
                },
                quantity: 1
            }],
            mode: "payment",
            success_url: "https://yourwebsite.com/chat.html?paid=true",
            cancel_url: "https://yourwebsite.com/cancel.html"
        });
        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔥 Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
