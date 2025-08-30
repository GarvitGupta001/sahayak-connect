from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Global variables
df = None

def load_data():
    """Load the embeddings data"""
    global df
    
    try:
        # Load the embeddings data
        file_path = os.path.join(os.path.dirname(__file__), 'embeddings_final.pkl')
        if os.path.exists(file_path):
            df = pd.read_pickle(file_path)
            logger.info(f"Embeddings data loaded successfully with {len(df)} records")
        else:
            raise FileNotFoundError(f"Embeddings file not found at {file_path}")
            
    except Exception as e:
        logger.error(f"Error loading data: {str(e)}")
        raise

def simple_search(prompt, k=5):
    """Simple text-based search without ML"""
    try:
        if df is None:
            return {"error": "Data not loaded"}
        
        # Simple text matching (fallback when ML model is not available)
        prompt_lower = prompt.lower()
        
        # Filter schemes based on text matching
        matching_schemes = df[
            df['scheme_name'].str.lower().str.contains(prompt_lower, na=False) |
            df['details'].str.lower().str.contains(prompt_lower, na=False) |
            df['schemeCategory'].str.lower().str.contains(prompt_lower, na=False)
        ]
        
        if matching_schemes.empty:
            return {"error": "No schemes found"}
        
        # Return top k results
        top_schemes = matching_schemes.head(k)
        output = top_schemes[["scheme_name", "details", "benefits", "schemeCategory"]]
        return output.to_dict('records')
        
    except Exception as e:
        logger.error(f"Error in simple_search: {str(e)}")
        return {"error": f"Internal server error: {str(e)}"}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "data_loaded": df is not None,
        "mode": "simple_search"
    })

@app.route('/schemes', methods=['POST'])
def get_schemes():
    """Get scheme recommendations"""
    try:
        data = request.get_json()
        prompt = data.get('prompt', '')
        k = data.get('k', 5)
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        results = simple_search(prompt, k)
        
        if "error" in results:
            return jsonify(results), 500
        
        return jsonify({
            "success": True,
            "data": results,
            "query": prompt
        })
        
    except Exception as e:
        logger.error(f"Error in get_schemes: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/schemes/<text>', methods=['GET'])
def get_schemes_by_text(text):
    """Get scheme recommendations using URL parameter"""
    try:
        results = simple_search(text, 5)
        
        if "error" in results:
            return jsonify(results), 500
        
        return jsonify({
            "success": True,
            "data": results,
            "query": text
        })
        
    except Exception as e:
        logger.error(f"Error in get_schemes_by_text: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "message": "Government Scheme Recommendation API (Simple Mode)",
        "status": "running",
        "mode": "simple_search"
    })

if __name__ == '__main__':
    # Load data on startup
    load_data()
    
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    logger.info(f"Starting simple server on {host}:{port}")
    app.run(host=host, port=port, debug=False)
