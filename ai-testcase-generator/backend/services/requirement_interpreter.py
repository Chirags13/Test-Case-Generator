from ai.gemini_client import GeminiClient
from validators.ai_output_validator import AIOutputValidator
from models.schemas import InterpretationResult, Rule


class RequirementInterpreter:
    """Orchestrates AI interpretation and validation"""
    
    def __init__(self, api_key: str):
        self.ai_client = GeminiClient(api_key)
        self.validator = AIOutputValidator()
    
    def interpret(
        self,
        requirement_id: str,
        requirement_text: str,
        inputs: list,
        outputs: list
    ) -> InterpretationResult:
        """
        Interprets requirement using AI and validates output
        """
        
        # Call AI
        ai_result = self.ai_client.interpret_requirement(
            requirement_id,
            requirement_text,
            inputs,
            outputs
        )
        
        # Validate AI output structure
        is_valid, error_msg = self.validator.validate_interpretation(ai_result)
        if not is_valid:
            raise ValueError(f"AI output validation failed: {error_msg}")
        
        # Check for inventions
        is_safe, warning_msg = self.validator.check_for_inventions(ai_result, inputs, outputs)
        if not is_safe:
            # Add warning to assumptions
            ai_result["assumptions"].append(f"WARNING: {warning_msg}")
        
        # Convert to Pydantic model
        rules = [
            Rule(
                rule_id=r["rule_id"],
                condition=r["condition"],
                expected_behavior=r["expected_behavior"]
            )
            for r in ai_result["rules"]
        ]
        
        interpretation = InterpretationResult(
            requirement_id=ai_result["requirement_id"],
            interpretation_status=ai_result["interpretation_status"],
            interpreted_requirement=ai_result["interpreted_requirement"],
            rules=rules,
            constraints=ai_result["constraints"],
            boundary_values=ai_result["boundary_values"],
            assumptions=ai_result["assumptions"],
            ambiguities=ai_result["ambiguities"]
        )
        
        return interpretation
