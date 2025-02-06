from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__)

# Function to scan file for suspicious keywords
def scan_file(file_path):
    suspicious_keywords = ["GetAsyncKeyState", "SetWindowsHookEx", "keylogger", "keyboard hook"]
    
    with open(file_path, "r", errors="ignore") as file:
        content = file.read()

    for keyword in suspicious_keywords:
        if keyword in content:
            return True  # Suspicious content found

    return False  # No threats detected

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded", "is_suspicious": False}), 400

    uploaded_file = request.files["file"]
    file_path = os.path.join("uploads", uploaded_file.filename)

    # Save the uploaded file
    uploaded_file.save(file_path)

    # Scan the file for keylogger behavior
    is_suspicious = scan_file(file_path)

    # Cleanup: Delete the file after scanning
    os.remove(file_path)

    if is_suspicious:
        return jsonify({"message": "⚠️ WARNING: Potential Keylogger Detected!", "is_suspicious": True})
    else:
        return jsonify({"message": "✅ File is Safe!", "is_suspicious": False})

if __name__ == "__main__":
    os.makedirs("uploads", exist_ok=True)  # Create uploads folder if not exists
    app.run(debug=True)
