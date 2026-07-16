from sqlalchemy.orm import Session

from models.project import Project
from models.research import Research
from models.kai_knowledge import KAIKnowledge

from ai.providers.groq import GroqProvider


class Explainer:

    @staticmethod
    def explain(db: Session, item_type: str, item_id: int):

        if item_type == "project":

            item = db.query(Project).filter(
                Project.id == item_id
            ).first()

        elif item_type == "research":

            item = db.query(Research).filter(
                Research.id == item_id
            ).first()

        else:

            return "Invalid explanation request."

        if not item:

            return "Requested item was not found."

        context = Explainer.build_context(
            db,
            item
        )

        prompt = f"""
You are KAI, Kishore's AI assistant.

Explain the following {item_type} in detail by using keywords and technologies.

Use the project/research information first.

Then enrich the explanation using any relevant AI knowledge.

Write naturally upto 5 to 7 lines.

Context:

{context}
"""

        return GroqProvider().generate(prompt)
    
    @staticmethod
    def build_context(db: Session, item):

        context = ""

        for key, value in vars(item).items():

            if key.startswith("_"):

                continue

            if value is None:

                continue

            context += f"{key}: {value}\n"

        knowledge = db.query(KAIKnowledge).filter(
            KAIKnowledge.active == True
        ).all()

        context += "\n\n========== KNOWLEDGE ==========\n\n"

        for row in knowledge:

            context += f"""
Title: {row.title}
Category: {row.category}
Content: {row.content}

"""

        return context