from flask import Flask, render_template, request, Response
from dotenv import load_dotenv
import requests
import os
import json

load_dotenv()

app = Flask(__name__)


openia_key = os.getenv("OPENAI_KEY")
OPENAI_URL = "https://api.openai.com/v1/images/generations"
headers = {"Content-Type": "application/json", "Authorization": f"Bearer {openia_key}"}


@app.route("/")
def index():
    return render_template("index.html")


@app.post("/make_image/")
def make_image():
    data = request.get_json()
    prompt = data.get("prompt")
    size = data.get("size")
    print("from request.get_json()", data)
    data_to_send = json.dumps({"prompt": prompt, "n": 1, "size": size})
    print(data_to_send)
    url = ""
    try:
        response = requests.post(OPENAI_URL, headers=headers, data=data_to_send)
        response.raise_for_status()
        resp_dict = response.json()
        url = resp_dict.get("data")[0]
    except requests.exceptions.HTTPError as err:
        print(err)
        return Response("Failed for some reason", status=400)

    # { "prompt": "coder cat drinking coffee ", "n": 1, "size": "512x512" }
    # return make_response({"prompt": prompt, "size": size, "openai_key": openia_key})
    # return {
    #     "prompt": prompt,
    #     "size": size,
    #     "openai_key": openia_key,
    #     "dataToSend": data_to_send,
    # }
    return {"url": url}
