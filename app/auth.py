from flask import Blueprint, redirect, request, session, url_for, jsonify, current_app
from google_auth_oauthlib.flow import Flow
from datetime import datetime
import requests
import os

auth = Blueprint('auth', __name__)

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'  # Allow local OAuth redirects

# Google OAuth config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
REDIRECT_URI = "http://127.0.0.1:5000/auth/callback"

SCOPES = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid"
]

# START GOOGLE LOGIN
@auth.route("/login/google")
def google_login():
    """Redirects to Google's OAuth consent screen."""
    try:
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI],
                }
            },
            scopes=SCOPES,
        )
        flow.redirect_uri = REDIRECT_URI
        authorization_url, state = flow.authorization_url(
            access_type="offline", include_granted_scopes="true"
        )
        session["state"] = state
        return redirect(authorization_url)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GOOGLE OAUTH CALLBACK
@auth.route("/auth/callback")
def google_callback():
    """Handles Google callback, stores user info in Supabase DB, and creates a session."""
    try:
        state = session.get("state")
        if not state:
            return jsonify({"error": "Missing OAuth state"}), 400

        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": GOOGLE_CLIENT_ID,
                    "client_secret": GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [REDIRECT_URI],
                }
            },
            scopes=SCOPES,
            state=state,
        )
        flow.redirect_uri = REDIRECT_URI

        # Exchange code for token
        flow.fetch_token(authorization_response=request.url)
        credentials = flow.credentials

        # Get Google user info
        response = requests.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {credentials.token}"},
        )
        profile = response.json()

        google_email = profile.get("email")
        google_name = profile.get("name")
        google_picture = profile.get("picture")
        google_id = profile.get("id")

        # Store in Supabase
        supabase = current_app.config["SUPABASE_CLIENT"]
        last_signin = datetime.utcnow().isoformat()

        user_info = {
            "google_id": google_id,
            "name": google_name,
            "email": google_email,
            "google_picture": google_picture,
            "last_signin_date": last_signin,
            "created_at": last_signin,
        }

        # Check if exists
        existing = supabase.table("users").select("*").eq("email", google_email).execute()
        if not existing.data:
            supabase.table("users").insert(user_info).execute()
            is_new = True
        else:
            supabase.table("users").update({
                "last_signin_date": last_signin,
                "google_picture": google_picture
            }).eq("email", google_email).execute()
            is_new = False

        # Save consistent session keys (same as normal login)
        session["user_name"] = google_name
        session["is_new_user"] = is_new
        session["user_email"] = google_email
        session["user_picture"] = google_picture

        # Directly go to dashboard
        return redirect(url_for("main.dashboard"))

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# LOGOUT
@auth.route("/logout")
def logout():
    """Clears session and redirects to home."""
    session.clear()
    return redirect(url_for("main.home"))
