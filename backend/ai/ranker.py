from difflib import SequenceMatcher


class Ranker:

    @staticmethod
    def score(query: str, text: str) -> float:

        query = query.lower().strip()

        text = text.lower().strip()

        similarity = SequenceMatcher(

            None,

            query,

            text

        ).ratio()

        keyword_matches = sum(

            1

            for word in query.split()

            if word in text

        )

        return similarity + (keyword_matches * 0.25)