require("dotenv").config(); // Import dotenv at the top of the file
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// Load the API key from .env
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

// Hugging Face model endpoint
const MODEL_ENDPOINT = process.env.MODEL_ENDPOINT;

// Load context from context.txt at server startup
let context;
try {
    context = fs.readFileSync(path.join(__dirname, "context.txt"), "utf8");
    console.log("Context loaded successfully from context.txt!");
} catch (error) {
    console.error("Error reading context.txt:", error.message);
    process.exit(1); // Exit the process if context.txt cannot be loaded
}

// Question and Answer endpoint
app.post("/qa", async (req, res) => {
    const { question } = req.body;

    if (!context || !question) {
        return res.status(400).json({ error: "Both 'context' and 'question' are required." });
    }

    try {
        const response = await axios.post(
            MODEL_ENDPOINT,
            {
                inputs: {
                    question: question,
                    context: context
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Assuming the response structure contains 'answer'
        const result = response.data;
        console.log(result);  // For debugging
        res.json({ answer: result.answer }); // Adjust based on actual response structure
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
