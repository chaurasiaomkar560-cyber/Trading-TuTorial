from flask import Flask
from dotenv import load_dotenv
from .config import Config
from .model import init_supabase
from .route import main
from .auth import auth
from flask_mail import Mail
from webinar import webinar_bp
from app.workshop import workshop_bp

load_dotenv()

mail = Mail()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize Supabase once
    supabase_client = init_supabase()
    app.config["SUPABASE_CLIENT"] = supabase_client 

    # Register routes
    app.register_blueprint(main)
    app.register_blueprint(auth)
    app.register_blueprint(webinar_bp)
    app.register_blueprint(workshop_bp)


    #Config gmail server
    mail.init_app(app)
   
    

    return app
