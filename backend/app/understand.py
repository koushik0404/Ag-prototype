import json, re, httpx
from app.core.config import settings

URL = "https://openrouter.ai/api/v1/chat/completions"

# Every spelling we may see -> one standard crop name
CROPS = {
    "chilli": ["chilli", "chili", "chilly", "మిరప", "మిర్చి"],
    "cotton": ["cotton", "పత్తి"],
    "rice": ["rice", "paddy", "వరి", "ధాన్యం"],
    "turmeric": ["turmeric", "పసుపు"],
    "maize": ["maize", "corn", "మొక్కజొన్న"],
    "groundnut": ["groundnut", "peanut", "వేరుశనగ"],
}

ONES = {
    "ఒకటి": 1, "ఒక": 1, "రెండు": 2, "మూడు": 3, "నాలుగు": 4, "ఐదు": 5,
    "ఆరు": 6, "ఏడు": 7, "ఎనిమిది": 8, "తొమ్మిది": 9, "పది": 10,
    "పన్నెండు": 12, "పదిహేను": 15,
    "one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6,
    "seven": 7, "eight": 8, "nine": 9, "ten": 10, "twelve": 12, "fifteen": 15,
}
TENS = {
    "ఇరవై": 20, "ముప్పై": 30, "నలభై": 40, "యాభై": 50,
    "twenty": 20, "thirty": 30, "forty": 40, "fifty": 50,
}

PROMPT = (
    "Extract booking details from the farmer's sentence. "
    'Reply with only JSON like {"crop":"...","quintals":number,"months":number}. '
    "Write the crop name in English. Use null for anything not said. Sentence: "
)


def normalize_crop(name):
    if not name:
        return None
    n = str(name).strip().lower()
    for standard, spellings in CROPS.items():
        if any(s in n for s in spellings):
            return standard
    return n or None


def _to_number(value):
    try:
        v = float(value)
        return int(v) if v == int(v) and v > 0 else (v if v > 0 else None)
    except (TypeError, ValueError):
        return None


def _alt(words):
    return "|".join(sorted(words, key=len, reverse=True))


def _number_before(text, unit_pattern):
    """Finds a number just before a unit word, e.g. 'మూడు నెలలు' or '25 quintals'."""
    pattern = (
        r"(?:(" + _alt(TENS) + r")\s*)?"
        r"(\d+(?:\.\d+)?|" + _alt(ONES) + r")\s*(?:" + unit_pattern + r")"
    )
    m = re.search(pattern, text)
    if m:
        tens, base = m.group(1), m.group(2)
        total = TENS.get(tens, 0)
        total += ONES[base] if base in ONES else float(base)
        return _to_number(total)
    m = re.search(r"(" + _alt(TENS) + r")\s*(?:" + unit_pattern + r")", text)
    if m:
        return TENS[m.group(1)]
    return None


def word_match(text):
    """Reads clear numbers and crop words directly from the sentence."""
    t = text.lower()
    crop = None
    for standard, spellings in CROPS.items():
        if any(s in t for s in spellings):
            crop = standard
            break
    return {
        "crop": crop,
        "quintals": _number_before(t, r"quintal|క్వింటా"),
        "months": _number_before(t, r"month|నెల"),
    }


def ask_model(text):
    """Returns a dict from the model, or None if anything goes wrong."""
    if not settings.openrouter_api_key:
        return None
    try:
        r = httpx.post(
            URL,
            headers={"Authorization": f"Bearer {settings.openrouter_api_key}"},
            json={
                "model": settings.openrouter_model,
                "temperature": 0,
                "messages": [{"role": "user", "content": PROMPT + text}],
            },
            timeout=15,
        )
        if r.status_code != 200:
            return None
        content = r.json()["choices"][0]["message"].get("content") or ""
        found = re.search(r"\{.*\}", content, re.S)
        if not found:
            return None
        data = json.loads(found.group(0))
        return {
            "crop": normalize_crop(data.get("crop")),
            "quintals": _to_number(data.get("quintals")),
            "months": _to_number(data.get("months")),
        }
    except Exception:
        return None


def understand_booking(text):
    """Clear words in the sentence win. The model fills what the code could not read."""
    from_model = ask_model(text)
    backup = word_match(text)
    if from_model is None:
        return {**backup, "source": "backup"}
    merged = {
        k: backup[k] if backup[k] is not None else from_model[k]
        for k in ("crop", "quintals", "months")
    }
    return {**merged, "source": "model"}