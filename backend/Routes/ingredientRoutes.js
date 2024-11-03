const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const user = require('../models/User');

const client = new twilio(process.env.REACT_APP_accountSid, process.env.REACT_APP_authToken);

const instructionKeywords = [
    'boil', 'cook', 'fry', 'bake', 'stir', 'grill', 'saute', 'mix', 'blend', 'cover', 'heat', 'add'
];

// Function to check if a line contains instruction-related keywords
const isInstructionLine = (line) => {
    return instructionKeywords.some(keyword => line.toLowerCase().includes(keyword));
};

// Function to check if a line contains a URL
const containsURL = (line) => {
    const urlPattern = /https?:\/\/[^\s]+/i;
    return urlPattern.test(line);
};

// Function to check if a description contains the word "ingredient"
const containsIngredientsKeyword = (description) => {
    return description.toLowerCase().includes('ingredient');
};

// Ingredient extraction function with exact regex as in the Python code
const extractIngredients = (text) => {
    const pattern = new RegExp(
        `(\\d+(?:\\s*[\\d\\/]+)?)?\\s*(cup|cups|tablespoon|tablespoons|tbsp|teaspoon|teaspoons|tsp|kg|g|grams|ml|l|liters|pinch|slices|slice|pieces|piece|stalks|stalk|cloves|clove|bunch|handful|medium|large|small)\\b`,
        'gi'
    );

    const lines = text.split('\n');

    // Filter lines containing only ingredients and not URLs, and check their length
    const matchingLines = lines.filter(line => {
        const hasIngredients = pattern.test(line);
        const hasInstructions = isInstructionLine(line);
        const hasURL = containsURL(line);
        
        // Include line if it has inoes NOT have instructiongredients, ds, does NOT have URLs, and is <= 60 characters
        return hasIngredients && !hasInstructions && !hasURL && line.length <= 60;
    });

    return containsIngredientsKeyword(text) ? matchingLines : [];
};

// Endpoint to extract ingredients from a description
router.post('/extract_ingredients', (req, res) => {
    try {
        const description = req.body.description || '';
        const extractedIngredients = extractIngredients(description);
        res.json(extractedIngredients);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});


// Endpoint to send WhatsApp message
router.post('/send_whatsapp', async (req, res) => {
    try {
        const ingredients = req.body.ingredients;
        const userProfile = await user.findOne({ email: req.body.email });
        console.log(userProfile)
        if (!ingredients || ingredients.length === 0) {
            return res.status(400).json({ error: "Ingredients are required" });
        }
        if (!userProfile) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const messageBody = "Here are your ingredients:\n" + ingredients.join('\n');

        let phoneNumber = userProfile.contactNumber;
        console.log(phoneNumber)
        if (phoneNumber.length === 10) {
            phoneNumber = `+91${phoneNumber}`;
        }
        // Send WhatsApp message to the fixed phone number
        const message = await client.messages.create({
            body: messageBody,
            from: 'whatsapp:+14155238886',  // Twilio's sandbox number
            to: `whatsapp:${phoneNumber}`
        });
        console.log(`whatsapp:${phoneNumber}`)

        console.log("WhatsApp message sent successfully:", message.sid);
        return res.json({ status: "Message sent successfully", sid: message.sid });
    } catch (error) {
        console.error("Error sending WhatsApp message:", error);
        return res.status(500).json({ error: error.message });
    }
});

router.get('/', (req, res) => {
    res.send('Ingredient router is running!');
});

module.exports = router;
