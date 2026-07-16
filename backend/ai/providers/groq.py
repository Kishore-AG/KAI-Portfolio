import os

from groq import Groq


class GroqProvider:

    def __init__(self):

        api_key = os.getenv("GROQ_API_KEY")

        if not api_key:

            raise ValueError(
                "GROQ_API_KEY not found."
            )

        self.client = Groq(
            api_key=api_key
        )

        self.model = "llama-3.3-70b-versatile"

    def generate(self, prompt: str) -> str:

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[

                {
                    "role": "user",
                    "content": prompt
                }

            ],

            temperature=0.3,

            max_tokens=1024

        )

        return response.choices[0].message.content.strip()