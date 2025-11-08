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

# --- 3. NEW HELPER FUNCTION TO FIX HISTORY ---
def clean_history(history):
    """
    Ensures the chat history alternates between 'user' and 'model' roles,
    which is a requirement for the Gemini API.
    """
    cleaned = []
    last_role = None
    for msg in history:
        role = msg.get("role")
        text = msg.get("text")
        
        # Skip if message is invalid or role is the same as the last one
        if not role or not text or role == last_role:
            continue
            
        # Ensure roles are valid for the API
        if role not in ["user", "model"]:
            continue
            
        cleaned.append({"role": role, "parts": [text]})
        last_role = role
    return cleaned

# --- 4. DEFINE THE CHAT ENDPOINT (UPDATED) ---
@app.route("/chat", methods=["POST"])
def chat():
    try:
        # Get the 'history' from the JSON sent by the frontend
        data = request.get_json()
        history_raw = data.get("history")

        if not history_raw:
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

        # --- FIX: Clean the history and use start_chat ---
        gemini_history = clean_history(history_raw)

        if not gemini_history:
             return jsonify({"error": "No valid chat history to process."}), 400

        # Separate the last message (new prompt) from the past history
        last_message = gemini_history[-1]
        past_history = gemini_history[:-1]

        # Start a chat session with the *past* history
        chat_session = model.start_chat(
            history=past_history
        )
        
        # Send the *new* message to the session
        response = chat_session.send_message(last_message["parts"])

        # Extract the AI's response text
        ai_text = response.text

        # Send the AI's response back to the frontend
        return jsonify({"responseText": ai_text})

    except Exception as e:
        # This will now print the *real* Gemini API error (e.g., "roles must alternate")
        print(f"An error occurred in /chat: {e}")
        return jsonify({"error": str(e)}), 500

# --- 5. RUN THE SERVER ---
if __name__ == "__main__":
    # Runs the server on http://localhost:5000
    # debug=True reloads the server on code changes
    app.run(port=5000, debug=True)