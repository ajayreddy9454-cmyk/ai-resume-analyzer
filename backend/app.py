from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF

from gemini_service import analyze_resume

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return "AI Resume Analyzer Backend Running"


@app.route("/analyze", methods=["POST"])
def analyze():

    # Check if resume exists
    if "resume" not in request.files:
        return jsonify({
            "error": "No file uploaded."
        }), 400

    file = request.files["resume"]

    # Check filename
    if file.filename == "":
        return jsonify({
            "error": "No file selected."
        }), 400

    try:

        # Read PDF
        pdf = fitz.open(
            stream=file.read(),
            filetype="pdf"
        )

        resume_text = ""

        # Extract text from all pages
        for page in pdf:
            resume_text += page.get_text()

        # Get Job Description
        job_description = request.form.get(
            "job_description",
            ""
        )

        # Send Resume + Job Description to Gemini
        result = analyze_resume(
            resume_text,
            job_description
        )

        # Return JSON
        return jsonify(result)

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True)