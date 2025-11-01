import os

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
