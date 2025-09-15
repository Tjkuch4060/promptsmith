from sentence_transformers import SentenceTransformer, util
import logging

# Global variable to hold the model, loaded lazily
_model = None
_model_load_error = None

def _get_model():
    """Load the sentence transformer model lazily."""
    global _model, _model_load_error
    
    if _model is not None:
        return _model
    
    if _model_load_error is not None:
        raise _model_load_error
    
    try:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
        return _model
    except Exception as e:
        _model_load_error = e
        logging.warning(f"Failed to load sentence transformer model: {e}")
        raise e

def evaluate_outputs(outputs: dict) -> dict:
    """Evaluate outputs using semantic similarity."""
    keys = list(outputs.keys())
    values = list(outputs.values())
    scores = {}

    try:
        model = _get_model()
        embeddings = model.encode(values, convert_to_tensor=True)
        cosine_matrix = util.pytorch_cos_sim(embeddings, embeddings)

        for i in range(len(keys)):
            similarities = []
            for j in range(len(keys)):
                if i != j:
                    similarities.append(float(cosine_matrix[i][j]))
            
            avg_similarity = sum(similarities) / len(similarities) if len(similarities) > 0 else 0.0
            scores[keys[i]] = {
                "avg_similarity": avg_similarity,
                "length_tokens": len(values[i].split())
            }
    except Exception as e:
        # Fallback to basic metrics when model is not available
        logging.warning(f"Semantic similarity evaluation unavailable: {e}")
        for i, key in enumerate(keys):
            scores[key] = {
                "avg_similarity": 0.0,  # Default similarity
                "length_tokens": len(values[i].split())
            }

    return scores
