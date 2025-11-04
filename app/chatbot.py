
from openai import OpenAI

def get_chatbot_response(user_message, api_key):
    
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
