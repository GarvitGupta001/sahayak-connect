import os
from flask import Flask, jsonify, request
from src.getting_schemes import get_schemes
from dotenv import load_dotenv
load_dotenv()

port = os.getenv("PORT") or 5000;

app = Flask(__name__)

@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.get_json()
    prompt = data.get('prompt')
    data = get_schemes(prompt)
    output = data[["scheme_id", "scheme_name", "schemeCategory"]]
    output = output.to_dict(orient='records')
    return jsonify({"success": True, "message": "SUCCESS", "data": output}), 200

if __name__ == '__main__':
    app.run(debug=True, port=port)