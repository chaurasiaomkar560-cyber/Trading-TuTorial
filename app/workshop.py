from flask import Blueprint, request, redirect, flash, session, url_for, current_app
import uuid

workshop_bp = Blueprint('workshop_bp', __name__)

# ============================================================
# HOSTER SIGNUP
# ============================================================
@workshop_bp.route('/hoster_signup', methods=['POST'])
def hoster_signup():
    supabase = current_app.config['SUPABASE_CLIENT']

    try:
        # -------- STEP 1: Hoster Info --------
        full_name = request.form.get('full_name', '').strip()
        email = request.form.get('email', '').strip().lower()
        company_name = request.form.get('company_name', '').strip()
        socialmd = request.form.get('linkdin', '').strip()
        expertise = request.form.get('Expertise', '').strip()
        national_id_file = request.files.get('KYC')

        # Upload KYC to Supabase Storage
        national_id_url = None
        if national_id_file:
            bucket_name = "user_photos"
            file_name = f"{email.replace('@','_')}_{uuid.uuid4()}_{national_id_file.filename}"
            supabase.storage.from_(bucket_name).upload(
                file_name,
                national_id_file.read(),
                {"content-type": national_id_file.content_type}
            )
            national_id_url = f"{current_app.config['SUPABASE_URL']}/storage/v1/object/public/{bucket_name}/{file_name}"

        # Insert Hoster
        hoster_resp = supabase.table("hoster").insert({
            "name": full_name,
            "email": email,
            "company": company_name,
            "socialmd": socialmd,
            "expertise": expertise,
            "national_id": national_id_url
        }).execute()

        if not hoster_resp.data:
            flash("❌ Hoster information could not be saved.", "error")
            return redirect(url_for("main.dashboard"))

        hoster_id = hoster_resp.data[0]['id']
        session['hoster_id'] = hoster_id  # save for finance/workshop links

        # -------- STEP 2: Workshop Info --------
        workshop_name = request.form.get('hostTitle', '').strip()
        workshop_desc = request.form.get('hostDesc', '').strip()
        workshop_price = request.form.get('hostPrice', '').strip()
        workshop_date = request.form.get('hostDate', '').strip()
        workshop_duration = request.form.get('hostDuration', '').strip()
        workshop_language = request.form.get('hostLang', '').strip()
        workshop_audience = request.form.get('hostAudience', '').strip()
        workshop_seats = int(request.form.get('hostSeats') or 0)
        workshop_video = request.form.get('hostVideo', '').strip()
        is_active = request.form.get('is_active') == 'true'

        workshop_resp = supabase.table("workshop").insert({
            "hoster_id": hoster_id,
            "workshop_name": workshop_name,
            "workshop_desc": workshop_desc,
            "workshop_price": workshop_price,
            "workshop_date": workshop_date,
            "workshop_duration": workshop_duration,
            "workshop_language": workshop_language,
            "workshop_audience": workshop_audience,
            "workshop_seats": workshop_seats,
            "workshop_video": workshop_video or None,
            "is_active": is_active,
            "seat_booked": 0,
            "seat_remaining": workshop_seats
        }).execute()

        if not workshop_resp.data:
            flash("❌ Workshop information could not be saved.", "error")
            return redirect(url_for("main.dashboard"))

        # -------- STEP 3: Finance Info --------
        bank_name = request.form.get('finBankName', '').strip()
        account_number = request.form.get('finAccount', '').strip()
        ifsc = request.form.get('finIFSC', '').strip()
        tax_id = request.form.get('finTaxID', '').strip()
        is_verified = request.form.get('is_verified') == 'true'

        finance_resp = supabase.table("finance").insert({
            "hoster_id": hoster_id,
            "bank_name": bank_name,
            "account_number": account_number,
            "ifsc": ifsc,
            "tax_id": tax_id,
            "is_verified": is_verified
        }).execute()

        if not finance_resp.data:
            flash("❌ Finance information could not be saved.", "error")
            return redirect(url_for("main.dashboard"))

        flash("✅ Workshop, hoster, and finance info submitted successfully!", "success")
        return redirect(url_for("main.dashboard"))

    except Exception as e:
        print("Error in hoster_signup:", e)
        flash("⚠️ Something went wrong during submission. Please try again.", "error")
        return redirect(url_for("main.dashboard"))


# ============================================================
# BUYER REGISTER
# ============================================================
@workshop_bp.route('/buyer_register', methods=['POST'])
def buyer_register():
    supabase = current_app.config['SUPABASE_CLIENT']

    try:
        # -------- Step 1: Buyer Info --------
        buyer_name = request.form.get('buyerName', '').strip()
        buyer_mobile = request.form.get('buyerMobile', '').strip()
        buyer_terms = request.form.get('buyerTerms') == 'on'

        # Workshop reference (passed via form or session)
        workshop_id = request.form.get('workshop_id') or session.get('selected_workshop_id')

        if not workshop_id:
            flash("⚠️ No workshop selected.", "error")
            return redirect(url_for("main.dashboard"))

        # -------- Step 2: Payment Status --------
        workshop_data = supabase.table("workshop").select("workshop_price, seat_booked, seat_remaining").eq("id", workshop_id).execute()
        if not workshop_data.data:
            flash("⚠️ Workshop not found.", "error")
            return redirect(url_for("main.dashboard"))

        workshop = workshop_data.data[0]
        is_paid = False

        if str(workshop["workshop_price"]).lower() == "free":
            is_paid = True
        else:
            is_paid = request.form.get('payment_confirmed') == 'true'

        # -------- Step 3: Insert Buyer --------
        buyer_resp = supabase.table("buyer").insert({
            "buyer_name": buyer_name,
            "buyer_mobile": buyer_mobile,
            "accepted_terms": buyer_terms,
            "workshop_id": workshop_id,
            "is_paid": is_paid
        }).execute()

        if not buyer_resp.data:
            flash("❌ Buyer registration failed.", "error")
            return redirect(url_for("main.dashboard"))

        # -------- Step 4: Update Workshop Seats --------
        seat_booked = int(workshop["seat_booked"] or 0) + 1
        seat_remaining = max(int(workshop["seat_remaining"] or 0) - 1, 0)

        supabase.table("workshop").update({
            "seat_booked": seat_booked,
            "seat_remaining": seat_remaining
        }).eq("id", workshop_id).execute()

        flash("✅ Buyer registered successfully for the workshop!", "success")
        return redirect(url_for("main.dashboard"))

    except Exception as e:
        print("Error in buyer_register:", e)
        flash("⚠️ Something went wrong while registering. Please try again.", "error")
        return redirect(url_for("main.dashboard"))
