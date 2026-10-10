"""Rules for the agent: understanding the farmer's yes or no in English and Telugu."""
import re

_YES_LATIN = re.compile(
    r"\b(yes|yeah|yep|yup|ok|okay|sure|correct|right|avunu|avnu|sare|sari|alage)\b", re.I
)
_NO_LATIN = re.compile(r"\b(no|nope|wrong|not|kadu|kaadu|vaddu|vaddhu)\b", re.I)
_YES_TELUGU = ("అవును", "ఔను", "సరే", "సరి", "అలాగే", "కరెక్ట్")
_NO_TELUGU = ("కాదు", "వద్దు", "లేదు", "తప్పు")


def is_no(text: str) -> bool:
    return bool(_NO_LATIN.search(text)) or any(w in text for w in _NO_TELUGU)


def is_yes(text: str) -> bool:
    if is_no(text):  # "not right" must never count as a yes
        return False
    return bool(_YES_LATIN.search(text)) or any(w in text for w in _YES_TELUGU)