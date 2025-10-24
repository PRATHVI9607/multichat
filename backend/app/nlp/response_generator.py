from app.nlp.persona_engine import get_persona
import random

def generate_response(persona_name: str, emotion: str, user_input: str):
    """
    Generates a response based on the persona, emotion, and user input.
    """
    persona = get_persona(persona_name)
    
    # Check for keywords in user input for more specific responses (optional)
    # For now, we'll just use the emotion-based response
    
    response = persona["responses"].get(emotion, persona["responses"]["default"])
    
    return response
