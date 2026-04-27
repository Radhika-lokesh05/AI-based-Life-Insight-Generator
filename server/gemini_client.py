"""
gemini_client.py
Wrapper around the Google Gemini API.
Sends the structured prompt and returns parsed JSON.
"""

import os
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini client
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Model configuration
GENERATION_CONFIG = genai.types.GenerationConfig(
    temperature=0.75,          # Balanced: creative but grounded
    top_p=0.9,
    top_k=40,
    max_output_tokens=2048,
    response_mime_type="application/json",  # Force JSON output
)

MODEL_NAME = "gemini-1.5-flash"   # Fast, cost-effective, free-tier available


def get_model():
    return genai.GenerativeModel(
        model_name=MODEL_NAME,
        generation_config=GENERATION_CONFIG,
        system_instruction=(
            "You are a grounded AI life-pattern analyst. "
            "You only use probabilistic language and realistic behavioral insights. "
            "You never use astrology, superstition, or absolute claims. "
            "You always respond with valid JSON exactly matching the requested schema."
        ),
    )


def generate_life_insights(prompt: str) -> dict:
    """
    Send the prompt to Gemini and return the parsed JSON response.
    Raises ValueError if parsing fails.
    """
    model    = get_model()
    response = model.generate_content(prompt)
    raw_text = response.text.strip()

    # Strip markdown code fences if Gemini adds them despite instructions
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    try:
        data = json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\nRaw response:\n{raw_text[:500]}")

    return data
