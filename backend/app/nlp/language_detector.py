from langdetect import detect, DetectorFactory
from langdetect.lang_detect_exception import LangDetectException

# To ensure consistent results
DetectorFactory.seed = 0

def detect_language(text):
    """
    Detects the language of a given text.
    """
    try:
        lang = detect(text)
        return {"language": lang}
    except LangDetectException:
        return {"language": "unknown"}
