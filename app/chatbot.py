
from openai import OpenAI

def get_chatbot_response(user_message, api_key):
    
    if not user_message or user_message.strip() == "":
        return (
            "👋 Hello! I am your Trading Tutor Bot, created to help you with "
            "your queries and doubts about trading and stocks. "
            "You can ask me anything related to trading, stock market basics, or investing!"
        )

    client = OpenAI(
        base_url="https://api.sambanova.ai/v1",
        api_key=api_key
    )

    messages = [
        {
            "role": "system",
            "content": (
                "You are a friendly trading tutor chatbot. "
                "Explain concepts in **simple and short sentences** (3–5 lines max). "
                "If the user speaks in Hindi, reply in Hinglish. "
                "Avoid repeating sentences or giving very long paragraphs."
            )
        },
        {"role": "user", "content": user_message}
    ]

    response = client.chat.completions.create(
        model="Meta-Llama-3.1-8B-Instruct",
        messages=messages,
        max_tokens=250 
    )

    return response.choices[0].message.content
