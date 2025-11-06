import os
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- 1. CONFIGURE THE APP ---
app = Flask(__name__)
# Enable CORS to allow your React app to call this server
CORS(app) 

# --- 2. CONFIGURE GEMINI API ---
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # If the key is not found, raise a clear error
    raise ValueError("GEMINI_API_KEY is not set in your .env file.")
    
genai.configure(api_key=api_key)

# --- 3. DEFINE THE CHAT ENDPOINT ---
@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Get the 'history' from the JSON sent by the frontend
        data = request.get_json()
        history = data.get("history")

        if not history:
            return jsonify({"error": "No chat history provided."}), 400

        # --- System Prompt ---
        system_prompt = (
            "You are MindShift, a gentle and supportive mental health assistant. "
            "Your role is to listen, provide comfort, and offer constructive coping "
            "strategies. You are not a doctor, but a friendly companion. "
            "Keep your responses empathetic and concise."
        )

        # Initialize the Generative Model
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash-preview-09-2025",
            system_instruction=system_prompt
        )

        # Map the frontend history to the format Gemini's API expects
        # Frontend: [{"role": "user", "text": "Hi"}, ...]
        # Gemini:   [{"role": "user", "parts": ["Hi"]}, ...]
        gemini_history = [
            {"role": msg["role"], "parts": [msg["text"]]} 
            for msg in history
        ]

        # Call the Gemini API
        response = model.generate_content(gemini_history)

        # Extract the AI's response text
        ai_text = response.text

        # Send the AI's response back to the frontend
        return jsonify({"responseText": ai_text})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": str(e)}), 500

# --- 4. RUN THE SERVER ---
if __name__ == "__main__":
    # Runs the server on http://localhost:5000
    # debug=True reloads the server on code changes
    app.run(port=5000, debug=True)