import pandas as pd
import os
file_path = os.path.join(os.path.dirname(__file__),'state_scheme.pkl')
if os.path.exists(file_path):
    df = pd.read_pickle(file_path)
else:
    raise FileNotFoundError(f"File not found at {file_path}")
print(df.head())