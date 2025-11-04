from flask import Blueprint, request, jsonify, render_template, current_app
import datetime, os

from . import webinar_bp


# 🟢 1️⃣ Upload a Recording
@webinar_bp.route('/api/upload_recording', methods=['POST'])
def upload_recording():
    """
    Uploads a meeting recording (zip, mp4, etc.), saves locally, 
    and uploads to Supabase Storage and updates workshop record.
    """
    try:
        file = request.files.get('file')
        meeting_id = request.form.get('meeting_id')

        if not file or not meeting_id:
            return jsonify({"error": "Missing file or meeting_id"}), 400

        supabase = current_app.config["SUPABASE_CLIENT"]
        bucket_name = "session_recordings"

        # Create local folder if not exists
        local_folder = os.path.join(os.getcwd(), "recordings")
        os.makedirs(local_folder, exist_ok=True)

        # Save file locally
        filename = f"{meeting_id}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.zip"
        local_path = os.path.join(local_folder, filename)
        file.save(local_path)

        # Upload to Supabase
        with open(local_path, "rb") as f:
            supabase.storage.from_(bucket_name).upload(filename, f)

        # Get public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)

        # Update workshop record with recording URL
        supabase.table("workshops").update({
            "recording_url": public_url,
            "updated_at": datetime.datetime.utcnow().isoformat()
        }).eq("meeting_link", meeting_id).execute()

        return jsonify({
            "message": "Recording saved locally and uploaded successfully",
            "local_path": local_path,
            "url": public_url
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🟠 2️⃣ List All Recordings
@webinar_bp.route('/api/recordings', methods=['GET'])
def list_recordings():
    """
    Lists all uploaded recordings from Supabase Storage.
    """
    try:
        supabase = current_app.config["SUPABASE_CLIENT"]
        bucket_name = "session_recordings"

        # List all files in bucket
        files = supabase.storage.from_(bucket_name).list()

        # Create public URLs for each
        recordings = [
            {
                "name": f["name"],
                "url": supabase.storage.from_(bucket_name).get_public_url(f["name"]),
                "last_modified": f.get("updated_at"),
                "size_bytes": f.get("metadata", {}).get("size")
            }
            for f in files
        ]

        return jsonify({"recordings": recordings})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🔵 3️⃣ Delete a Recording
@webinar_bp.route('/api/delete_recording', methods=['POST'])
def delete_recording():
    """
    Deletes a specific recording by filename from Supabase Storage and local folder.
    """
    try:
        filename = request.form.get('filename')

        if not filename:
            return jsonify({"error": "Missing filename"}), 400

        supabase = current_app.config["SUPABASE_CLIENT"]
        bucket_name = "session_recordings"

        # Delete from Supabase
        supabase.storage.from_(bucket_name).remove(filename)

        # Delete locally (if exists)
        local_path = os.path.join(os.getcwd(), "recordings", filename)
        if os.path.exists(local_path):
            os.remove(local_path)

        return jsonify({"message": f"Recording '{filename}' deleted successfully."})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🟣 4️⃣ Webinar UI (HTML Page)
@webinar_bp.route('/webinar', methods=['GET'])
def webinar_page():
    """
    Displays the webinar recordings dashboard (HTML UI).
    """
    supabase = current_app.config["SUPABASE_CLIENT"]
    bucket_name = "session_recordings"

    try:
        files = supabase.storage.from_(bucket_name).list()
        recordings = [
            {
                "name": f["name"],
                "url": supabase.storage.from_(bucket_name).get_public_url(f["name"]),
                "last_modified": f.get("updated_at"),
                "size_bytes": f.get("metadata", {}).get("size")
            }
            for f in files
        ]

        return render_template("webinar.html", recordings=recordings)

    except Exception as e:
        return render_template("webinar.html", error=str(e))
