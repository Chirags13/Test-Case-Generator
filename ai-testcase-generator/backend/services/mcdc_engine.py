from typing import List, Dict, Any
from models.schemas import Rule, InputDefinition, TestCase, Priority, Validity, Traceability


class MCDCEngine:
    """Modified Condition/Decision Coverage test generation"""
    
    @staticmethod
    def generate_mcdc_tests(
        rule: Rule,
        inputs: List[InputDefinition],
        requirement_id: str,
        tc_counter: Dict[str, int]
    ) -> List[TestCase]:
        """
        Generates MC/DC test cases for compound conditions
        """
        
        test_cases = []
        
        # Extract condition variables from rule
        condition_vars = MCDCEngine._extract_condition_variables(rule.condition, inputs)
        
        if len(condition_vars) == 0:
            return []
        
        # Generate MC/DC combinations
        # For simplicity: all true, then each false individually
        
        # Base case: all true
        all_true_inputs = {}
        for var in condition_vars:
            inp = next((i for i in inputs if i.name == var), None)
            if inp:
                all_true_inputs[var] = MCDCEngine._get_true_value(inp)
        
        tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
        tc_counter['count'] += 1
        
        test_cases.append(TestCase(
            tc_id=tc_id,
            rule_id=rule.rule_id,
            test_type="MC/DC",
            scenario=f"All conditions true for {rule.rule_id}",
            inputs=all_true_inputs,
            expected_output={"result": "All conditions satisfied"},
            priority=Priority.HIGH,
            validity=Validity.VALID,
            traceability=Traceability(
                requirement=requirement_id,
                rule=rule.rule_id
            )
        ))
        
        # Each condition false individually
        for var in condition_vars:
            test_inputs = all_true_inputs.copy()
            inp = next((i for i in inputs if i.name == var), None)
            if inp:
                test_inputs[var] = MCDCEngine._get_false_value(inp)
            
            tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
            tc_counter['count'] += 1
            
            test_cases.append(TestCase(
                tc_id=tc_id,
                rule_id=rule.rule_id,
                test_type="MC/DC",
                scenario=f"Condition {var} false for {rule.rule_id}",
                inputs=test_inputs,
                expected_output={"result": f"Condition {var} not satisfied"},
                priority=Priority.MEDIUM,
                validity=Validity.VALID,
                traceability=Traceability(
                    requirement=requirement_id,
                    rule=rule.rule_id
                )
            ))
        
        return test_cases
    
    @staticmethod
    def _extract_condition_variables(condition: str, inputs: List[InputDefinition]) -> List[str]:
        """Extract variable names from condition text"""
        variables = []
        for inp in inputs:
            if inp.name.lower() in condition.lower():
                variables.append(inp.name)
        return variables
    
    @staticmethod
    def _get_true_value(input_def: InputDefinition) -> Any:
        """Get a value that makes condition true"""
        if input_def.data_type.lower() in ["bool", "boolean"]:
            return True
        elif input_def.range_min is not None and input_def.range_max is not None:
            return (input_def.range_min + input_def.range_max) / 2
        elif input_def.allowed_values:
            return input_def.allowed_values[0]
        else:
            return "VALID_VALUE"
    
    @staticmethod
    def _get_false_value(input_def: InputDefinition) -> Any:
        """Get a value that makes condition false"""
        if input_def.data_type.lower() in ["bool", "boolean"]:
            return False
        elif input_def.range_min is not None:
            return input_def.range_min - 1
        elif input_def.allowed_values:
            return "INVALID_VALUE"
        else:
            return None
