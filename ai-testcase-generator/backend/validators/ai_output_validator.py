from typing import Dict, Any


class AIOutputValidator:
    """Validates AI interpretation output for safety and completeness"""
    
    @staticmethod
    def validate_interpretation(interpretation: Dict[str, Any]) -> tuple[bool, str]:
        """
        Validates AI interpretation result.
        Returns (is_valid, error_message)
        """
        
        # Check required fields
        required_fields = [
            "requirement_id",
            "interpretation_status",
            "interpreted_requirement",
            "rules",
            "constraints",
            "boundary_values",
            "assumptions",
            "ambiguities"
        ]
        
        for field in required_fields:
            if field not in interpretation:
                return False, f"Missing required field: {field}"
        
        # Validate interpretation_status
        if interpretation["interpretation_status"] not in ["OK", "BLOCKED"]:
            return False, "interpretation_status must be 'OK' or 'BLOCKED'"
        
        # If BLOCKED, ensure ambiguities are listed
        if interpretation["interpretation_status"] == "BLOCKED":
            if not interpretation["ambiguities"]:
                return False, "Status is BLOCKED but no ambiguities listed"
        
        # Validate rules structure
        if not isinstance(interpretation["rules"], list):
            return False, "rules must be a list"
        
        for idx, rule in enumerate(interpretation["rules"]):
            if not isinstance(rule, dict):
                return False, f"Rule {idx} must be a dictionary"
            
            if "rule_id" not in rule or "condition" not in rule or "expected_behavior" not in rule:
                return False, f"Rule {idx} missing required fields (rule_id, condition, expected_behavior)"
        
        # Validate lists
        if not isinstance(interpretation["constraints"], list):
            return False, "constraints must be a list"
        
        if not isinstance(interpretation["assumptions"], list):
            return False, "assumptions must be a list"
        
        if not isinstance(interpretation["ambiguities"], list):
            return False, "ambiguities must be a list"
        
        # Validate boundary_values structure
        if not isinstance(interpretation["boundary_values"], dict):
            return False, "boundary_values must be a dictionary"
        
        # If OK status, ensure at least one rule exists
        if interpretation["interpretation_status"] == "OK":
            if not interpretation["rules"]:
                return False, "Status is OK but no rules extracted"
        
        return True, "Validation passed"
    
    @staticmethod
    def check_for_inventions(interpretation: Dict[str, Any], inputs: list, outputs: list) -> tuple[bool, str]:
        """
        Checks if AI invented values not present in inputs/outputs
        Returns (is_safe, warning_message)
        """
        warnings = []
        
        # Check if boundary values reference valid inputs
        input_names = {inp["name"] for inp in inputs}
        
        for input_name in interpretation["boundary_values"].keys():
            if input_name not in input_names:
                warnings.append(f"Boundary value references unknown input: {input_name}")
        
        if warnings:
            return False, "; ".join(warnings)
        
        return True, "No inventions detected"
