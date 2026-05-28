import pandas as pd
df = pd.read_excel('buyer_intent_keywords.xlsx')
print(df.head(20).to_string())
