const functions = require("firebase-functions");
const axios = require("axios");

// This is an "onCall" Cloud Function. It's the best way to
// call a function from your React app. It automatically
// handles authentication (checks if user is logged in).
exports.chatWithAI = functions.https.onCall(async (data, context) => {
  // 1. Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "You must be logged in to use the chatbot.",
    );
  }

  // 2. Get the chat history from the client
  const { history } = data;
  if (!history || history.length === 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Chat history is required.",
    );
  }

  // 3. Get the Gemini API Key (SECURELY)
  const apiKey = functions.config().gemini.key;
  if (!apiKey) {
    throw new functions.https.HttpsError(
      "internal",
      "Gemini API key is not configured.",
    );
  }

  const GEMINI_API_URL =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

  // 4. Prepare the API call
  const systemPrompt =
    "You are MindShift, a gentle and supportive mental health assistant. Your role is to listen, provide comfort, and offer constructive coping strategies. You are not a doctor, but a friendly companion. Keep your responses empathetic and concise.";

  const contents = history.map((msg) => ({
    role: msg.role, // 'user' or 'model'
    parts: [{ text: msg.text }],
  }));

  const payload = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
  };

  // 5. Call the Gemini API
  try {
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const aiText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiText) {
      throw new Error("Invalid response structure from Gemini API.");
    }

    // 6. Send the AI's response back to the React app
    return { responseText: aiText };
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    if (error.response) console.error("Gemini Error:", error.response.data);
    
    throw new functions.https.HttpsError(
      "internal",
      "Failed to get a response from the AI.",
    );
  }
});