
from flask import Blueprint, request, render_template, redirect, url_for

from . import webinar_bp

@webinar_bp.route("/admin-login", methods=["GET", "POST"])
def admin_login():
    if request.method == "GET":
        return render_template("auth.html")

    fullname = request.form.get("fullname", "").strip().lower()
    keycode = request.form.get("keycode", "").strip().lower()

    if fullname == "rohit sharma" and keycode == "test123":
        return redirect(url_for("webinar.meeting_page", meeting_id="test123"))
    else:
        return render_template("auth.html", error="Invalid credentials! Try again.")

@webinar_bp.route("/meeting/<meeting_id>")
def meeting_page(meeting_id):
    # Render meeting.html which loads Jitsi Meet
    return render_template("webinar.html", meeting_id=meeting_id)

@webinar_bp.route("/")
def home():
    return "<p>Go to <a href='/webinar/admin-login'>Admin Login</a></p>"
