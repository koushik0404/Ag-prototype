import sys
from app.understand import understand_booking, word_match

sys.stdout.reconfigure(encoding="utf-8")

SENTENCES = [
        "ఇరవై ఐదు క్వింటాళ్ల పత్తి రెండు నెలలు",
    "twenty five quintals of rice for six months",
    "నాకు 15 quintals chilli మూడు months కావాలి",
    "నాకు ఇరవై క్వింటాళ్ల మిరపకాయలు మూడు నెలలు నిల్వ చేయాలి",
    "I want to store 30 quintals of cotton for 4 months",
    "నాకు 15 quintals chilli మూడు months కావాలి",
    "hello",
]

for s in SENTENCES:
    print(s)
    print("   with model :", understand_booking(s))
    print("   backup only:", word_match(s))