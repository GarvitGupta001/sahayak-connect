import pandas as pd
from tqdm import tqdm
tqdm.pandas()
from dotenv import load_dotenv
import os
from sklearn.metrics.pairwise import cosine_similarity
from huggingface_hub import InferenceClient
import numpy as np

load_dotenv()

file_path = os.path.join(os.path.dirname(__file__),'embeddings_final.pkl')
if os.path.exists(file_path):
    df = pd.read_pickle(file_path)
else:
    raise FileNotFoundError(f"File not found at {file_path}")

hf_token = os.getenv("HF_TOKEN")

# It's good practice to check if the token is available
if not hf_token:
    raise ValueError("HF_TOKEN environment variable is not set.")

client = InferenceClient(model="sentence-transformers/all-MiniLM-L6-v2", token=hf_token)


def compare(sentence_emb, scheme_embedding):
    """
    Compares two embeddings using cosine similarity.
    """

    if not isinstance(sentence_emb, np.ndarray):
        sentence_emb = np.array(sentence_emb)
    if not isinstance(scheme_embedding, np.ndarray):
        scheme_embedding = np.array(scheme_embedding)

    sentence_embedding_2d = sentence_emb.reshape(1, -1)
    scheme_embedding_2d = scheme_embedding.reshape(1, -1)

    similarity = cosine_similarity(sentence_embedding_2d, scheme_embedding_2d)
    return similarity.item()

def get_top_k(df, sentence_emb, compare_fn, emb_col="embeddings", k=5):
    """
    Finds the top k most similar schemes based on sentence embedding.
    """
    df = df.copy()
    df["similarity"] = df[emb_col].apply(lambda emb: compare_fn(sentence_emb, emb))
    top_k = df.sort_values("similarity", ascending=False).head(k)
    return top_k


def get_schemes(sentence):
    """
    Gets the top 5 schemes by first getting the sentence embedding
    from the Hugging Face Inference API.
    """
    sentence_emb_list = client.feature_extraction(text=sentence)
    
    sentence_emb = np.array(sentence_emb_list)
    
    return get_top_k(df, sentence_emb, compare, emb_col="embeddings", k=5)