class ContextBuilder:

    @staticmethod
    def build(data):

        context = ""

        for section, records in data.items():

            context += f"\n========== {section.upper()} ==========\n\n"

            if not records:

                context += "No records.\n\n"

                continue

            for record in records:

                for key, value in vars(record).items():

                    if key.startswith("_"):

                        continue

                    if value is None:

                        continue

                    context += f"{key}: {value}\n"

                context += "\n--------------------------\n\n"

        return context