from flask import Blueprint, render_template, request, jsonify, current_app, redirect, url_for, flash,session
from .chatbot import get_chatbot_response
from flask_mail import Message
import random
from datetime import datetime

main = Blueprint('main', __name__)
otp_storage = {}


@main.route('/')
def home():
    return render_template('index.html')

@main.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.get_json() or {}
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    api_key = current_app.config.get('OPENAI_API_KEY')
    if not api_key:
        return jsonify({'error': 'Missing API key in server config'}), 500

    try:
        response = get_chatbot_response(user_message, api_key)
        return jsonify({'response': response})
    except Exception as e:
        print("Chatbot error:", e)
        return jsonify({'response': ' Sorry, there was an error processing your request.'}), 500


# SIGNUP ROUTE
@main.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '').strip()
        photo = request.files.get('photo')

        supabase = current_app.config["SUPABASE_CLIENT"]
        SUPABASE_URL = current_app.config["SUPABASE_URL"]

        public_url = None

        if photo:
            try:
                bucket_name = "user_photos"  # same as Supabase bucket name
                file_name = f"{email.replace('@', '_').replace('.', '_')}_{photo.filename}"
                file_path = file_name

                upload_response = supabase.storage.from_(bucket_name).upload(
                    file_path,
                    photo.read(),
                    {"content-type": photo.content_type}
                )

                

                public_url = f"{SUPABASE_URL}/storage/v1/object/public/{bucket_name}/{file_path}"
                

            except Exception as e:
                print("Image upload error:", e)
                flash("Image upload failed.", "danger")
                return render_template("signup.html")

        try:
            response = supabase.table("users").insert({
                "name": full_name,
                "email": email,
                "password": password,
                "google_picture": public_url,
            }).execute()


            # Set session for newly signed-up user
            session["user_name"] = full_name
            session["is_new_user"] = True  # new user signup

            flash("Account created successfully!", "success")
            return redirect(url_for("main.dashboard"))

        except Exception as e:
            print("Signup error:", e)
            flash("Server error while creating account.", "danger")

    return render_template("signup.html")




# LOGIN ROUTE
@main.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        print("Checking credentials for:", email)

        supabase = current_app.config["SUPABASE_CLIENT"]
        response = supabase.table("users").select("*").eq("email", email).execute()

        if not response.data:
            return render_template('login.html', message="User not found!")

        user = response.data[0]
        stored_password = user['password']

        if stored_password == password:
            # ✅ Set session values for logged-in user
            session["user_name"] = user["name"]
            session["is_new_user"] = False  # returning user
            return redirect(url_for('main.dashboard'))
        else:
            return render_template('login.html', message="Incorrect password!")

    return render_template('login.html')




#  FORGOT PASSWORD ROUTE
@main.route('/forgot', methods=['GET', 'POST'])
def forgot_password():
    supabase = current_app.config["SUPABASE_CLIENT"]
    mail = current_app.extensions['mail']

    email_verified = False
    otp_verified = False
    message = ""
    email = ""

    if request.method == 'POST':
        action = request.form.get('action')
        email = request.form.get('email')

        #  Step 1️: Verify email exists
        if action == "verify_email":
            response = supabase.table("users").select("*").eq("email", email).execute()
            if not response.data:
                message = "No account found with this email."
            else:
                otp = str(random.randint(1000, 9999))
                otp_storage[email] = otp

                # Send OTP mail
                msg = Message("Your Trading Tutor OTP",
                              sender=current_app.config["MAIL_USERNAME"],
                              recipients=[email])
                msg.body = f"Your OTP for password reset is: {otp}"
                mail.send(msg)

                email_verified = True
                message = "OTP has been sent to your email."

        #  Step 2️: Verify OTP
        elif action == "verify_otp":
            otp = request.form.get('otp')
            if otp_storage.get(email) == otp:
                email_verified = True
                otp_verified = True
                message = "OTP verified successfully."
            else:
                email_verified = True
                message = "Invalid OTP. Please try again."

        #  Step 3️: Reset password + store change time
        elif action == "reset_password":
            new_pass = request.form.get('new_pass')

            # Update password + password_changed_at
            response = supabase.table("users").update({
                "password": new_pass,
                "password_changed_at": datetime.utcnow().isoformat()  # save in UTC format
            }).eq("email", email).execute()

            if response.data:
                otp_storage.pop(email, None)
                flash("Password reset successful! Please log in.", "success")
                return redirect(url_for('main.login'))
            else:
                message = "Something went wrong. Please try again."

    return render_template(
        'forgot.html',
        message=message,
        email_verified=email_verified,
        otp_verified=otp_verified,
        email=email
    )



# DASHBOARD ROUTE
@main.route('/dashboard')
def dashboard():
    if "user_name" not in session:
        return redirect(url_for('main.login'))
    
    return render_template(
        'dashboard.html',
        name=session["user_name"],
        is_new=session.get("is_new_user", False)
    )



