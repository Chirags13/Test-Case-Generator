import google.generativeai as genai
import json
import time
from typing import Dict, Any


class GeminiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
    
    def interpret_requirement(
        self,
        requirement_id: str,
        requirement_text: str,
        inputs: list,
        outputs: list
    ) -> Dict[str, Any]:
        """
        Use Gemini AI to interpret requirements and extract rules, constraints, boundaries.
        AI MUST NOT invent test cases or guess values.
        """
        
        system_prompt = """You are an intelligent software verification engineer with deep domain knowledge.

Your task is to interpret requirements and extract:
1. Rules and conditions
2. Constraints
3. Boundary values (infer from context if not explicit)
4. Assumptions made
5. Critical ambiguities only

INTELLIGENT INTERPRETATION RULES:
- Infer reasonable boundary values from data types and context
- For integers without ranges: use sensible defaults based on domain (e.g., age: 0-120, temperature: -273-5000)
- For strings: infer max length from context (e.g., name: 100 chars, email: 255 chars)
- For enums/states: extract all mentioned values
- ONLY mark as BLOCKED if requirement is fundamentally unclear or contradictory
- Make reasonable assumptions and document them
- Use domain knowledge (altitude in feet: 0-100000, speed in mph: 0-500, etc.)
- Extract implicit boundary values from context clues

Return ONLY valid JSON in this exact format:
{
  "requirement_id": "string",
  "interpretation_status": "OK or BLOCKED",
  "interpreted_requirement": "string - formal restatement",
  "rules": [
    {
      "rule_id": "R1",
      "condition": "when X happens",
      "expected_behavior": "system shall do Y"
    }
  ],
  "constraints": ["constraint1", "constraint2"],
  "boundary_values": {
    "input_name": {
      "min": value,
      "max": value,
      "critical_points": [values]
    }
  },
  "assumptions": ["assumption1"],
  "ambiguities": ["ambiguity1"]
}

If ambiguities exist and are critical, set interpretation_status to "BLOCKED".
"""

        inputs_desc = "\n".join([
            f"- {inp['name']}: {inp['data_type']}" + 
            (f" (range: {inp.get('range_min')} to {inp.get('range_max')})" if inp.get('range_min') is not None else "") +
            (f" (unit: {inp.get('unit')})" if inp.get('unit') else "") +
            (f" (allowed: {inp.get('allowed_values')})" if inp.get('allowed_values') else "")
            for inp in inputs
        ])
        
        outputs_desc = "\n".join([
            f"- {out['name']}: {out['data_type']}" +
            (f" (unit: {out.get('unit')})" if out.get('unit') else "") +
            (f" (possible values: {out.get('possible_values')})" if out.get('possible_values') else "")
            for out in outputs
        ])

        user_prompt = f"""
Requirement ID: {requirement_id}

Requirement Text:
{requirement_text}

Inputs:
{inputs_desc}

Outputs:
{outputs_desc}

Analyze this requirement and return the JSON interpretation.
"""

        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(
                    system_prompt + "\n\n" + user_prompt,
                    generation_config={
                        "temperature": 0.1,
                        "top_p": 0.8,
                        "top_k": 20,
                    }
                )
                
                response_text = response.text.strip()
                
                # Clean JSON from markdown
                if response_text.startswith("```json"):
                    response_text = response_text[7:]
                if response_text.startswith("```"):
                    response_text = response_text[3:]
                if response_text.endswith("```"):
                    response_text = response_text[:-3]
                response_text = response_text.strip()
                
                result = json.loads(response_text)
                
                # Ensure requirement_id matches
                result["requirement_id"] = requirement_id
                
                return result
                
            except json.JSONDecodeError as e:
                if attempt == max_retries - 1:
                    raise ValueError(f"Failed to parse AI response as JSON after {max_retries} attempts: {str(e)}")
                time.sleep(1)
            except Exception as e:
                if attempt == max_retries - 1:
                    raise ValueError(f"AI interpretation failed: {str(e)}")
                time.sleep(1)
        
        # Fallback (should not reach here)
        raise ValueError("AI interpretation failed after all retries")
