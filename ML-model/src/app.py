from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
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
model = None
df = None

def load_model_and_data():
    """Load the ML model and embeddings data"""
    global model, df
    
    try:
        # Load the sentence transformer model
        model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Sentence transformer model loaded successfully")
        
        # Load the embeddings data
        file_path = os.path.join(os.path.dirname(__file__), 'embeddings_final.pkl')
        if os.path.exists(file_path):
            df = pd.read_pickle(file_path)
            logger.info(f"Embeddings data loaded successfully with {len(df)} records")
        else:
            raise FileNotFoundError(f"Embeddings file not found at {file_path}")
            
    except Exception as e:
        logger.error(f"Error loading model or data: {str(e)}")
        raise

def compare_embeddings(sentence_emb, scheme_embedding):
    """Compare sentence embeddings with scheme embeddings using cosine similarity"""
    try:
        sentence_embedding_2d = sentence_emb.numpy().reshape(1, -1)
        scheme_embedding_2d = scheme_embedding.numpy().reshape(1, -1)
        similarity = cosine_similarity(sentence_embedding_2d, scheme_embedding_2d)
        return similarity.item()
    except Exception as e:
        logger.error(f"Error in similarity calculation: {str(e)}")
        return 0.0

def get_top_k_schemes(df, sentence_emb, k=5):
    """Get top k most similar schemes"""
    try:
        df_copy = df.copy()
        df_copy["similarity"] = df_copy["embeddings"].apply(
            lambda emb: compare_embeddings(sentence_emb, emb)
        )
        top_k = df_copy.sort_values("similarity", ascending=False).head(k)
        return top_k
    except Exception as e:
        logger.error(f"Error getting top k schemes: {str(e)}")
        return pd.DataFrame()

def get_schemes(prompt, k=5):
    """Main function to get relevant schemes based on user prompt"""
    try:
        if model is None or df is None:
            return {"error": "Model or data not loaded"}
        
        # Encode the user prompt
        sentence_emb = model.encode([prompt], convert_to_tensor=True)
        
        # Get top k schemes
        top_schemes = get_top_k_schemes(df, sentence_emb, k)
        
        if top_schemes.empty:
            return {"error": "No schemes found"}
        
        # Prepare output
        output = top_schemes[["scheme_name", "details", "benefits", "schemeCategory"]]
        return output.to_dict('records')
        
    except Exception as e:
        logger.error(f"Error in get_schemes: {str(e)}")
        return {"error": f"Internal server error: {str(e)}"}

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "model_loaded": model is not None,
        "data_loaded": df is not None
    })

@app.route('/schemes', methods=['POST'])
def get_schemes_endpoint():
    """Main endpoint to get scheme recommendations"""
    try:
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({"error": "Missing 'prompt' field in request body"}), 400
        
        prompt = data['prompt']
        k = data.get('k', 5)  # Default to 5 results
        
        if not prompt.strip():
            return jsonify({"error": "Prompt cannot be empty"}), 400
        
        logger.info(f"Processing request for prompt: {prompt}")
        results = get_schemes(prompt, k)
        
        return jsonify({
            "success": True,
            "data": results,
            "query": prompt
        })
        
    except Exception as e:
        logger.error(f"Error in main endpoint: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/schemes/<string:text>', methods=['GET'])
def get_schemes_by_text(text):
    """Alternative endpoint using URL parameter"""
    try:
        if not text.strip():
            return jsonify({"error": "Text parameter cannot be empty"}), 400
        
        logger.info(f"Processing request for text: {text}")
        results = get_schemes(text, 5)
        
        return jsonify({
            "success": True,
            "data": results,
            "query": text
        })
        
    except Exception as e:
        logger.error(f"Error in text endpoint: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    # Load model and data before starting the server
    load_model_and_data()
    
    port = int(os.environ.get('PORT', 5000))
    host = os.environ.get('HOST', '0.0.0.0')
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting server on {host}:{port}")
    app.run(host=host, port=port, debug=debug)
