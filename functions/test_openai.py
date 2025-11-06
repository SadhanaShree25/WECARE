import openai
from dotenv import load_dotenv
import os

load_dotenv()
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model='gpt-3.5-turbo',
    messages=[{ "role": "user", "content": "Hello!" }]
)

print(response.choices[0].message.content)