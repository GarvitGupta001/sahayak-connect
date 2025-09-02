import os
from flask import Flask, jsonify, request
from src.getting_schemes import get_schemes
from src.getting_state_schemes import get_schemes as get_state_schemes
from dotenv import load_dotenv
load_dotenv()

port = os.getenv("PORT") or 5000;

app = Flask(__name__)
@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()
        prompt = data.get('prompt')

        #checking if there is prompt
        if not prompt:
            return jsonify({"success": False, "message": "Missing 'prompt'"}), 400
        data = get_schemes(prompt)
        output = data[["scheme_id", "scheme_name", "details"]]
        output = output.to_dict(orient='records')
        return jsonify({"success": True, "message": "SUCCESS", "data": output}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    
@app.route('/submit_state', methods=['POST'])
def submit_state_data():
    try:
        data = request.get_json()
        prompt = data.get('prompt')
        state=data.get('state')
        #checking if there's both prompt and state or not
        if not prompt:
            return jsonify({"success": False, "message": "Missing 'prompt'"}), 400
        if '/submit_state' in request.path and not state:
            return jsonify({"success": False, "message": "Missing 'state'"}), 400
        data = get_state_schemes(prompt,state)
        output = data[["scheme_id", "scheme_name", "details","state"]]
        output = output.to_dict(orient='records')
        return jsonify({"success": True, "message": "SUCCESS", "data": output}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5000)