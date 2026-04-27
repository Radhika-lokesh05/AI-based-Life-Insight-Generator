"""
prompt_builder.py
Constructs the structured prompt sent to the Gemini API.
Age is pre-calculated server-side and injected into the prompt.
"""

from datetime import date


def calculate_age(dob_str: str) -> int:
    """Calculate age from ISO date string (YYYY-MM-DD)."""
    birth = date.fromisoformat(dob_str)
    today = date.today()
    age = today.year - birth.year
    if (today.month, today.day) < (birth.month, birth.day):
        age -= 1
    return age


def get_life_stage(age: int) -> str:
    if age < 13:  return "Childhood"
    if age < 18:  return "Adolescence"
    if age < 23:  return "Early Adulthood"
    if age < 28:  return "Career Entry Phase"
    if age < 35:  return "Growth Phase"
    if age < 45:  return "Consolidation Phase"
    if age < 55:  return "Peak Performance Phase"
    if age < 65:  return "Wisdom Phase"
    return              "Reflective Phase"


def build_prompt(name: str, dob: str) -> str:
    age        = calculate_age(dob)
    life_stage = get_life_stage(age)
    birth_date = date.fromisoformat(dob).strftime("%B %d, %Y")

    return f"""
You are an AI life-pattern analysis system grounded in behavioral psychology.

Generate a CONCISE, realistic life overview based ONLY on the person's name, age, and life stage.

PERSON:
- Name: {name}
- Date of Birth: {birth_date}
- Current Age: {age}
- Life Stage: {life_stage}

STRICT RULES:
- Use probabilistic language only: "likely", "may", "tends to", "possible"
- Base insights on developmental psychology and realistic life-stage patterns
- Keep every field SHORT — max 1 sentence per field, 2 sentences only if essential
- Do NOT use astrology or superstition

Respond ONLY with valid JSON — no markdown, no code fences.

Return exactly this structure:
{{
  "core_nature": ["<1 sentence>", "<1 sentence>", "<1 sentence>", "<1 sentence>"],
  "family": {{
    "past": "<1 sentence>",
    "present": "<1 sentence>",
    "future": "<1 sentence>"
  }},
  "love": {{
    "type": "<1 sentence>",
    "near_future": "<1 sentence>",
    "mid_future": "<1 sentence>",
    "long_term": "<1 sentence>"
  }},
  "communication": ["<1 sentence>", "<1 sentence>", "<1 sentence>", "<1 sentence>"],
  "career_timeline": {{
    "past": "<1 sentence>",
    "present": "<1 sentence>",
    "near_term": "<1 sentence>",
    "mid_term": "<1 sentence>",
    "long_term": "<1 sentence>"
  }},
  "career_nature": ["<1 sentence>", "<1 sentence>", "<1 sentence>", "<1 sentence>"],
  "summary": "<2–3 sentences max. Realistic trajectory, gradual growth.>"
}}
""".strip()
