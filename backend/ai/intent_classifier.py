import re


class IntentClassifier:

    """
    Classifies the user's question into a portfolio intent.
    """

    INTENTS = {

        "profile": [
            "yourself",
            "who are you",
            "introduction",
            "bio",
            "profile",
            "contact",
            "email",
            "location"
        ],

        "project": [
            "project",
            "projects",
            "github",
            "demo",
            "application",
            "built",
            "developed",
            "portfolio"
        ],

        "research": [
            "research",
            "paper",
            "publication",
            "journal",
            "conference"
        ],

        "skill": [
            "skill",
            "skills",
            "technology",
            "technologies",
            "language",
            "framework",
            "python",
            "javascript",
            "fastapi",
            "tensorflow",
            "opencv"
        ],

        "education": [
            "education",
            "college",
            "degree",
            "cgpa",
            "study",
            "school",
            "university"
        ],

        "certification": [
            "certificate",
            "certification",
            "course",
            "credential"
        ],

        "resume": [
            "resume",
            "cv"
        ],

        "knowledge": [
            "explain",
            "what is",
            "define",
            "knowledge",
            "concept"
        ]

    }

    @classmethod
    def classify(cls, message: str) -> str:

        message = message.lower()

        message = re.sub(r"[^\w\s]", "", message)

        for intent, keywords in cls.INTENTS.items():

            for keyword in keywords:

                if keyword in message:

                    return intent

        return "general"