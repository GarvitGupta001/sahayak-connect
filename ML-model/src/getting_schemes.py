# import keras_nlp
# import seaborn as sns
# from transformers import BertTokenizer
import pandas as pd
from tqdm import tqdm
tqdm.pandas()
from sentence_transformers import SentenceTransformer
from dotenv import load_dotenv
import os
from sklearn.metrics.pairwise import cosine_similarity

file_path = os.path.join(os.path.dirname(__file__),'embeddings_final.pkl')
if os.path.exists(file_path):
    df = pd.read_pickle(file_path)
else:
    raise FileNotFoundError(f"File not found at {file_path}")

model = SentenceTransformer('all-MiniLM-L6-v2')

def compare(sentence_emb,scheme_embedding):
  sentence_embedding_2d = sentence_emb.numpy().reshape(1, -1)
  scheme_embedding_2d = scheme_embedding.numpy().reshape(1, -1)
  # Calculate the cosine similarity
  similarity = cosine_similarity(sentence_embedding_2d, scheme_embedding_2d)
  return similarity.item()

def get_top_k(df, sentence_emb, compare_fn, emb_col="embeddings", k=5):
    # Apply the compare function to each embedding in the column
    df = df.copy()  # avoid modifying original
    df["similarity"] = df[emb_col].apply(lambda emb: compare_fn(sentence_emb, emb))
    # Sort by similarity in descending order
    top_k = df.sort_values("similarity", ascending=False).head(k)
    return top_k

def get_schemes(sentence):
  sentence_emb = model.encode([sentence], convert_to_tensor=True)
  return get_top_k(df, sentence_emb,compare, emb_col="embeddings", k=5)

# def get_api_response(text):
#   import google.generativeai as genai
#   genai.configure(api_key)
#   model = genai.GenerativeModel("gemini-2.5-flash")
#   response=model.generate_content(f"""
#   this dataset have just 5 rows, display the schemes, followed by corresponding details, benefits,and documents required
#   {output}
#   only the info of this data should be given as output, nothing else
#   make it look easy to read for a normal person, make sure the output is in a json format
#   and the keys should be scheme_name, details, benefits, schemeCategory. nothing else should be there in the output
#   """)
#   return response.text