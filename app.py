
from flask import Flask, render_template, jsonify, send_file, send_from_directory, request
from flask_sse import sse
import os


app = Flask(__name__)


app.config['DOWNLOAD_FOLDER'] = os.path.join(app.root_path, 'downloads', 'audios')


# Mettre en place des éléments nécessaires pour supporter le sse 
app.config["REDIS_URL"] = "redis://localhost:6379/0"
app.register_blueprint(sse, url_prefix="/stream")


@app.route("/")
def index():
    return render_template("index.html")


# Endpoint pour ajouter un fichier
@app.route("/audios/add", methods=["POST"])
def add_new_audio():
    file = request.files["file"]
    if not file:
        return jsonify({"message": "Unable to add a new file"}), 400
    elif file.filename == '':
        return jsonify({"message": "No file part."}), 400
    else:
        try:
            filename = file.filename
            upload_path = os.path.join(app.root_path, 'downloads', 'audios', filename)
            file.save(upload_path)
            # Notify SSE clients
            sse.publish({"file": file.filename}, type="new_audio")
            return jsonify({"message": f"File {filename} successfully uploaded!"})
        except FileNotFoundError:
            return jsonify({"message": f"Something went wrong when uploading {filename} file."}), 500


@app.route("/audios/filenames", methods=['GET'])
def list_audio_files():
    files = [file for file in os.listdir(app.config['DOWNLOAD_FOLDER'])  if file.endswith('.mp3')]
    return jsonify(audios=files)


@app.route("/audios/<filename>", methods=['GET'])
def get_audio_file(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')