from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer("all-MiniLM-L6-v2")

def evaluate_outputs(outputs: dict) -> dict:
    keys = list(outputs.keys())
    values = list(outputs.values())
    scores = {}

    embeddings = model.encode(values, convert_to_tensor=True)
    cosine_matrix = util.pytorch_cos_sim(embeddings, embeddings)

    for i in range(len(keys)):
        similarities = []
        for j in range(len(keys)):
            if i != j:
                similarities.append(float(cosine_matrix[i][j]))
        scores[keys[i]] = {
            "avg_similarity": sum(similarities) / len(similarities),
            "length_tokens": len(values[i].split())
        }

    return scores
