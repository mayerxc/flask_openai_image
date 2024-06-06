from flask import Flask, render_template, request, abort
from dotenv import load_dotenv
import requests
import os
import json

load_dotenv()

app = Flask(__name__)


openia_key = os.getenv("OPENAI_KEY")
OPENAI_URL = "https://api.openai.com/v1/images/generations"
model = "dall-e-3"
headers = {"Content-Type": "application/json", "Authorization": f"Bearer {openia_key}"}
size_dict = {"small": "1024x1024", "medium": "1792x1024", "large": "1024x1792"}


@app.route("/")
def index():
    return render_template("index.html")


@app.post("/make_image")
def make_image():
    data = request.get_json()
    prompt = data.get("prompt")
    size_from_frontend = data.get("size")
    size = size_dict.get(size_from_frontend, "1024x1024")
    data_to_send = json.dumps(
        {"model": model, "prompt": prompt, "n": 1, "size": size, "style": "natural"}
    )
    url = ""
    try:
        response = requests.post(OPENAI_URL, headers=headers, data=data_to_send)
        if response.json().get("error"):
            error_message = response.json().get("error").get("message")
            print("Error message from API", error_message)
            return {"error": error_message}
        response.raise_for_status()
        resp_dict = response.json()
        url = resp_dict.get("data")[0].get("url")
    except requests.exceptions.HTTPError as err:
        print("requests error:", err)
        abort(400, f"Error: {err}")
    return {"url": url}
