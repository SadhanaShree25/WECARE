from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import traceback
import openai

app = Flask(__name__)
CORS(app)

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
print("Loaded API Key:", openai_api_key)

client = openai.OpenAI(api_key=openai_api_key)

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    print("Received:", user_message)

    try:
        response = client.chat.completions.create(
            model='gpt-3.5-turbo',
            messages=[{ "role": "user", "content": user_message }]
        )
        reply = response.choices[0].message.content
        print("Reply:", reply)
        return jsonify({ 'reply': reply })
    except Exception as e:
        traceback.print_exc()
        print("Error:", str(e))
        return jsonify({ 'error': str(e) }), 500

if __name__ == '__main__':
    app.run(port=5000)