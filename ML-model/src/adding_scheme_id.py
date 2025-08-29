import pandas as pd
import pickle
df=pd.read_pickle(r"./ML-model\src/embeddings_new.pkl")
df["scheme_id"] = None
n=4
for i in range(df.shape[0]):
    df["scheme_id"][i]="C"+str(i).zfill(n)
print(df.iloc[54:56])
#df.to_pickle(".\ML-model\src\embeddings_final.pkl")
df_for_garvit=df.drop(columns=["embeddings","tokens"])
df_for_garvit.to_json("./ML-model/src/data_json.json",orient="records", indent=2)
