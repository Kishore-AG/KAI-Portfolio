from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.session import get_db

from schemas.kai_chat import (
    ChatRequest,
    ChatResponse
)

from ai.intent_classifier import IntentClassifier
from ai.retriever import Retriever
from ai.context_builder import ContextBuilder
from ai.prompt_builder import PromptBuilder
from ai.providers.groq import GroqProvider

from schemas.kai_explain import (
    ExplainRequest,
    ExplainResponse
)

from ai.explainer import Explainer


router = APIRouter(
    prefix="/kai",
    tags=["KAI"]
)


@router.post(
    "/chat",
    response_model=ChatResponse
)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    

    # Detect intent
    intent = IntentClassifier.classify(
        request.message
    )

    # Retrieve portfolio data
    portfolio = Retriever.retrieve(db)

    context = ContextBuilder.build(portfolio)

    # Build AI prompt
    prompt = PromptBuilder.build(
        request.message,
        context
    )

    # Generate response
    ai = GroqProvider()

    answer = ai.generate(prompt)

    return ChatResponse(

        response=answer,

        intent=intent,

        sources=[intent]

    )

@router.post(
    "/explain",
    response_model=ExplainResponse
)
def explain(
    request: ExplainRequest,
    db: Session = Depends(get_db)
):

    response = Explainer.explain(

        db,

        request.type,

        request.id

    )

    return ExplainResponse(

        response=response

    )

