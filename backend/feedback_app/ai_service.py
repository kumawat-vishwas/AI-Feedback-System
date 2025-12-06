import os
import google.generativeai as genai
from django.conf import settings


def generate_ai_responses(rating, review):
    """
    Generate AI responses for user feedback
    Returns: (user_response, summary, recommended_actions)
    """
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = f"""You are an AI assistant for a feedback management system. 
                A user has submitted the following feedback:

                Rating: {rating}/5 stars
                Review: {review}

                Please provide three things in your response, clearly separated:

                1. USER_RESPONSE: A friendly, empathetic response to thank the user for their feedback (2-3 sentences)
                2. SUMMARY: A concise summary of the feedback (1-2 sentence)
                3. RECOMMENDED_ACTIONS: Specific, actionable recommendations for the business based on this feedback (2-4 bullet points)

                Format your response exactly like this:
                USER_RESPONSE:
                [your response here]

                SUMMARY:
                [your summary here]

                RECOMMENDED_ACTIONS:
                [your actions here]"""

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(
            contents=prompt, 
            generation_config=genai.GenerationConfig(
                temperature=0.7, max_output_tokens=1000
            ),
        )

        response_text = response.text

        # Parse the response
        user_response = ""
        summary = ""
        recommended_actions = ""

        sections = response_text.split("\n\n")
        current_section = None

        for section in sections:
            if "USER_RESPONSE:" in section:
                current_section = "user_response"
                user_response = section.replace("USER_RESPONSE:", "").strip()
            elif "SUMMARY:" in section:
                current_section = "summary"
                summary = section.replace("SUMMARY:", "").strip()
            elif "RECOMMENDED_ACTIONS:" in section:
                current_section = "actions"
                recommended_actions = section.replace(
                    "RECOMMENDED_ACTIONS:", ""
                ).strip()
            elif current_section == "user_response":
                user_response += "\n" + section
            elif current_section == "summary":
                summary += "\n" + section
            elif current_section == "actions":
                recommended_actions += "\n" + section

        return (user_response.strip(), summary.strip(), recommended_actions.strip())

    except Exception as e:
        print(f"Error calling Gemini API: {str(e)}")
        raise Exception("Failed to generate responses from the AI service")
