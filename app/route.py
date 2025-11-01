from flask import Blueprint, render_template, request, jsonify, current_app
from .chatbot import get_chatbot_response

main = Blueprint('main', __name__)

@main.route('/')
def home():
    return render_template('index.html')

@main.route('/chatbot')
def chatbot_page():
    return render_template('chatbot.html')

@main.route('/api/chat', methods=['POST'])
def chat_api():
    data = request.get_json()
    user_message = data.get('message', '')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    api_key = current_app.config['OPENAI_API_KEY']
    response = get_chatbot_response(user_message, api_key)
    return jsonify({'response': response})




#Webinaar Logic
# from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
# from aiortc.contrib.media import MediaRecorder
# import cv2, asyncio

# bp = Blueprint('webinar', __name__)

# pcs = set()

# class CameraStreamTrack(VideoStreamTrack):
#     def __init__(self):
#         super().__init__()
#         self.cap = cv2.VideoCapture(0)  # webcam

#     async def recv(self):
#         pts, time_base = await self.next_timestamp()
#         ret, frame = self.cap.read()
#         if not ret:
#             return None
#         frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
#         from av import VideoFrame
#         video_frame = VideoFrame.from_ndarray(frame, format="rgb24")
#         video_frame.pts = pts
#         video_frame.time_base = time_base
#         return video_frame

# @bp.route('/')
# def home():
#     return render_template('index.html')

# @bp.route('/webinar')
# def webinar_page():
#     return render_template('webinar.html')

# @bp.route('/offer', methods=['POST'])
# async def offer():
#     params =  request.get_json()
#     offer = RTCSessionDescription(sdp=params['sdp'], type=params['type'])
#     pc = RTCPeerConnection()
#     pcs.add(pc)

#     local_video = CameraStreamTrack()
#     recorder = MediaRecorder('recordings/session.mp4')  # save if you want
#     await recorder.start()
#     pc.addTrack(local_video)

#     @pc.on("connectionstatechange")
#     async def on_state_change():
#         print("Connection state:", pc.connectionState)
#         if pc.connectionState in ["failed", "closed"]:
#             await recorder.stop()
#             await pc.close()
#             pcs.discard(pc)

#     await pc.setRemoteDescription(offer)
#     answer = await pc.createAnswer()
#     await pc.setLocalDescription(answer)

#     return {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}

# Webinaar Logic (updated) — replace your previous Webinaar block with this
from aiortc import RTCPeerConnection, RTCSessionDescription
from aiortc.contrib.media import MediaRecorder
import asyncio
import datetime
from pathlib import Path

bp = Blueprint('webinar', __name__)

pcs = set()
RECORDINGS_DIR = Path("recordings")
RECORDINGS_DIR.mkdir(exist_ok=True)

@bp.route('/')
def home():
    return render_template('index.html')

@bp.route('/webinar')
def webinar_page():
    return render_template('webinar.html')

@bp.route('/offer', methods=['POST'])
async def offer():
    """
    Expects JSON { sdp: "...", type: "offer" }
    Returns JSON { sdp: "...", type: "answer" }
    """
    # Note: use synchronous request.get_json() here (works with Flask 2/3)
    params = request.get_json()
    if not params or "sdp" not in params:
        return {"error": "missing sdp"}, 400

    offer = RTCSessionDescription(sdp=params["sdp"], type=params.get("type", "offer"))

    pc = RTCPeerConnection()
    pcs.add(pc)
    print("Created PeerConnection:", pc)

    # Prepare recorder file path (unique per connection)
    ts = datetime.datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    filename = str(RECORDINGS_DIR / f"session-{ts}.mp4")
    recorder = MediaRecorder(filename)
    recorder_started = False

    # When a remote track arrives, add it to the recorder
    @pc.on("track")
    def on_track(track):
        nonlocal recorder_started
        print("Received track:", track.kind)

        # Add the track to the recorder so it records incoming audio/video
        recorder.addTrack(track)

        # Start recorder only once (when first track arrives)
        async def start_recorder_once():
            nonlocal recorder_started
            if not recorder_started:
                try:
                    await recorder.start()
                    recorder_started = True
                    print("Recorder started:", filename)
                except Exception as e:
                    print("Failed to start recorder:", e)

        # Schedule start in event loop
        asyncio.create_task(start_recorder_once())

        @track.on("ended")
        async def on_ended():
            print("Track %s ended" % track.kind)

    @pc.on("connectionstatechange")
    async def on_connectionstatechange():
        print("Connection state:", pc.connectionState)
        if pc.connectionState in ("failed", "closed", "disconnected"):
            # Stop recorder and cleanup
            try:
                if recorder_started:
                    await recorder.stop()
                    print("Recorder stopped.")
            except Exception as e:
                print("Error stopping recorder:", e)
            try:
                await pc.close()
            except Exception:
                pass
            pcs.discard(pc)
            print("PeerConnection closed and removed.")

    # Apply remote description (the offer from the browser)
    await pc.setRemoteDescription(offer)

    # Create answer and set local description
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    print("Sending answer")
    return {"sdp": pc.localDescription.sdp, "type": pc.localDescription.type}
