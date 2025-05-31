# /backend/app/services/validators.py

import re
from fastapi import HTTPException

# A list of patterns (regex) we refuse to accept in the user’s prompt.
# You can expand this with more “red flags” over time.
FORBIDDEN_PATTERNS = [
    r"ignore\s+previous\s+instructions",    # classic prompt injection
    r"system\s*prompt",                     # asking for internal state
    r"</?script>",                          # simple XSS attempts
    r"\$\{.*\}",                            # stripping out potential template injections
]

def sanitize_prompt(prompt: str) -> str:
    """
    1) Lowercases the prompt for pattern matching.
    2) If any forbidden pattern is found, immediately reject with 400.
    3) Otherwise, return the original prompt (or a lightly stripped version).
    """
    lowered = prompt.lower()
    for pattern in FORBIDDEN_PATTERNS:
        if re.search(pattern, lowered):
            raise HTTPException(
                status_code=400,
                detail=f"Prompt contains disallowed pattern: {pattern}"
            )
    # Optionally: strip out control characters
    cleaned = re.sub(r"[\x00-\x1f\x7f]", "", prompt)
    return cleaned