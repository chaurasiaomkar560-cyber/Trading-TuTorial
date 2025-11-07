
from flask import Blueprint, request, jsonify, current_app
import uuid
from datetime import datetime

workshop_bp = Blueprint('workshop_bp', __name__)

@workshop_bp.route("/hoster_signup", methods=["POST"])
def hoster_signup():
    supabase = current_app.config["SUPABASE_CLIENT"]

    # Step 1: Get hoster info
    full_name = request.form.get("full_name")
    email = request.form.get("email")
    contact_number = request.form.get("hostContactNumber")
    age = request.form.get("hostAge")
    gender = request.form.get("hostGender")
    country = request.form.get("hostCountry")
    city = request.form.get("hostCity")
    company_name = request.form.get("company_name")
    company_email = request.form.get("company_email")
    company_linkedin = request.form.get("company_linkedin")
    company_mobile = request.form.get("company_mobile")
    company_address = request.form.get("companyAddress")
    expertise = request.form.get("Expertise")
    # For file, assume you uploaded to Supabase storage and have URL
    employee_id_file = request.form.get("companyEmployeeID")  

    # Insert hoster
    hoster_data = {
        "full_name": full_name,
        "email": email,
        "contact_number": contact_number,
        "age": age,
        "gender": gender,
        "country": country,
        "city": city,
        "company_name": company_name,
        "company_email": company_email,
        "company_linkedin": company_linkedin,
        "company_mobile": company_mobile,
        "company_address": company_address,
        "expertise": expertise,
        "employee_id_file": employee_id_file
    }

    hoster_response = supabase.table("hosters").insert(hoster_data).execute()
    if hoster_response.error:
        return jsonify({"error": hoster_response.error.message}), 400

    hoster_id = hoster_response.data[0]["id"]

    # Step 2: Get workshop info
    title = request.form.get("workshop_title")
    description = request.form.get("workshop_desc")
    price = request.form.get("workshop_price", 0)
    duration = request.form.get("workshop_duration")
    date_time = request.form.get("workshop_date")
    image_url = request.form.get("image_url")  # Optional

    workshop_data = {
        "hoster_id": hoster_id,
        "title": title,
        "description": description,
        "price": price,
        "duration": duration,
        "date_time": date_time,
        "image_url": image_url,
        "badge_class": "free" if float(price) == 0 else "price"
    }

    workshop_response = supabase.table("workshops").insert(workshop_data).execute()
    if workshop_response.error:
        return jsonify({"error": workshop_response.error.message}), 400

    return jsonify({"message": "Workshop added successfully!", "workshop": workshop_response.data[0]})


@workshop_bp.route("/buyer_register", methods=["POST"])
def buyer_register():
    supabase = current_app.config["SUPABASE_CLIENT"]

    full_name = request.form.get("buyerName")
    mobile = request.form.get("buyerMobile")
    workshop_id = request.form.get("workshop_id")  # You should pass this in the form
    payment_status = "paid"  # Simulate payment

    # Insert buyer
    buyer_response = supabase.table("buyers").insert({
        "full_name": full_name,
        "mobile": mobile
    }).execute()
    if buyer_response.error:
        return jsonify({"error": buyer_response.error.message}), 400

    buyer_id = buyer_response.data[0]["id"]

    # Insert registration
    registration_response = supabase.table("registrations").insert({
        "workshop_id": workshop_id,
        "buyer_id": buyer_id,
        "payment_status": payment_status
    }).execute()
    if registration_response.error:
        return jsonify({"error": registration_response.error.message}), 400

    return jsonify({"message": "Registration successful!", "registration": registration_response.data[0]})


@workshop_bp.route("/get_workshops", methods=["GET"])
def get_workshops():
    try:
        supabase = current_app.config["SUPABASE_CLIENT"]
        response = supabase.table("workshops").select("*").execute()

        # New SDK: check if data is present
        workshops = response.data if hasattr(response, "data") else None

        if not workshops:
            return jsonify({"error": "No workshops found"}), 404

        return jsonify(workshops), 200

    except Exception as e:
        print("Error fetching workshops:", e)
        return jsonify({"error": str(e)}), 500

