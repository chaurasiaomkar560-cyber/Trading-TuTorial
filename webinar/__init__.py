from flask import Blueprint

# Create the Blueprint object
webinar_bp = Blueprint(
    'webinar',
    __name__,
    template_folder='templates',
    static_folder='static'
)

# Import routes after defining blueprint
from . import route  # 👈 match your file name, not "routes"
