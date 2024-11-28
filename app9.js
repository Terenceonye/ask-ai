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

// Hugging Face model endpoint for text generation (you can change this model)
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/gpt2";

// Load context from context.txt at server startup (if you need a long prompt)
let context;
try {
    context = fs.readFileSync(path.join(__dirname, "context.txt"), "utf8");
    console.log("Context loaded successfully from context.txt!");
} catch (error) {
    console.error("Error reading context.txt:", error.message);
    process.exit(1); // Exit the process if context.txt cannot be loaded
}

// Text Generation endpoint
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;  // Ensure you're passing a 'prompt' in the request body

    if (!context && !prompt) {
        return res.status(400).json({ error: "Both 'context' and 'prompt' are required." });
    }

    const fullPrompt = context + " " + prompt;  // Combine context and user-provided prompt

    try {
        const response = await axios.post(
            MODEL_ENDPOINT,
            { inputs: fullPrompt },  // Payload structure for text generation
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Assuming the response structure contains 'generated_text'
        const result = response.data;
        console.log(result);  // For debugging
        res.json({ generated_text: result[0].generated_text }); // Adjust based on actual response structure
    } catch (err) {
        console.error("Error:", err.response?.data || err.message);
        res.status(500).json({ error: "Something went wrong while generating text." });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
