import random

# Define personas with different response styles
PERSONAS = {
    "friendly": {
        "greetings": ["Hi there!", "Hello!", "Hey, how can I help?"],
        "responses": {
            "joy": "That's wonderful to hear!",
            "sadness": "I'm sorry to hear that. I hope things get better.",
            "anger": "Take a deep breath. It's going to be okay.",
            "fear": "It's alright to be scared sometimes.",
            "surprise": "Wow, that's unexpected!",
            "disgust": "That sounds unpleasant.",
            "neutral": "I see. Tell me more.",
            "default": "Thanks for sharing."
        },
        "farewells": ["Goodbye!", "Talk to you later!", "Bye for now!"]
    },
    "professional": {
        "greetings": ["Good day.", "Hello, how may I assist you?"],
        "responses": {
            "joy": "I'm pleased to hear that.",
            "sadness": "I understand. Please let me know if there's anything I can do.",
            "anger": "I recommend taking a moment to collect your thoughts.",
            "fear": "I understand your concern.",
            "surprise": "That is surprising.",
            "disgust": "That is noted.",
            "neutral": "Understood.",
            "default": "Thank you for the information."
        },
        "farewells": ["Sincerely.", "Goodbye."]
    }
}

def get_persona(persona_name: str):
    """
    Retrieves a persona by name.
    """
    return PERSONAS.get(persona_name.lower(), PERSONAS["friendly"])

def get_all_personas():
    """
    Returns a list of all available persona names.
    """
    return list(PERSONAS.keys())
