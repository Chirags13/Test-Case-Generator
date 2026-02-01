from typing import List, Dict, Any
from models.schemas import Rule, InputDefinition


class TestStrategyEngine:
    """Determines which test techniques to apply based on interpreted rules"""
    
    @staticmethod
    def determine_strategies(
        rules: List[Rule],
        inputs: List[InputDefinition],
        boundary_values: Dict[str, Any]
    ) -> Dict[str, List[str]]:
        """
        Returns mapping of rule_id -> [applicable_techniques]
        
        Strategies:
        - BVA: For numeric ranges (explicit or inferred)
        - EP: For discrete values or partitions
        - NEGATIVE: Always applicable
        - MCDC: For compound conditions (AND/OR)
        - STATE: For state-based behavior
        """
        
        strategies = {}
        
        for rule in rules:
            techniques = []
            rule_text_lower = (rule.condition + " " + rule.expected_behavior).lower()
            
            # Check for numeric inputs (BVA) - now always applicable for numeric types
            has_numeric_input = any(
                inp.data_type.lower() in ["int", "integer", "float", "double", "number"]
                for inp in inputs
            )
            
            if has_numeric_input or boundary_values:
                techniques.append("BVA")
            
            # Check for discrete values (EP)
            has_discrete_input = any(
                inp.allowed_values is not None
                for inp in inputs
            )
            
            # Always use EP for partitioning
            if has_discrete_input or any(kw in rule_text_lower for kw in ["category", "type", "class", "partition"]) or has_numeric_input:
                techniques.append("EP")
            
            # Check for compound conditions (MC/DC)
            if any(kw in rule_text_lower for kw in [" and ", " or ", " && ", " || ", "both", "either"]):
                techniques.append("MCDC")
            
            # Check for state-based behavior
            if any(kw in rule_text_lower for kw in ["state", "mode", "status", "phase", "transition"]):
                techniques.append("STATE")
            
            # Always include negative testing
            techniques.append("NEGATIVE")
            
            # Remove duplicates and ensure at least one technique
            techniques = list(set(techniques))
            if not techniques:
                techniques = ["EP", "NEGATIVE"]
            
            strategies[rule.rule_id] = techniques
        
        return strategies
