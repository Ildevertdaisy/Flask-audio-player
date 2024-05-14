
from flask import Flask, render_template, jsonify, send_file, send_from_directory, request
import os


app = Flask(__name__)

app.config['DOWNLOAD_FOLDER'] = os.path.join(app.root_path, 'downloads', 'audios')


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/audios/filenames", methods=['GET'])
def list_audio_files():
    files = [file for file in os.listdir(app.config['DOWNLOAD_FOLDER'])  if file.endswith('.mp3')]
    return jsonify(audios=files)


@app.route("/audios/<filename>", methods=['GET'])
def get_audio_file(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')