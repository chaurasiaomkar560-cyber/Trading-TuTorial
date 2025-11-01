from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()  

def create_app():
    app = Flask(__name__)

  
    app.config.from_object('app.config.Config')

    
    from .route import main
    app.register_blueprint(main)

    from .route import bp as main
    app.register_blueprint(main)


    return app
