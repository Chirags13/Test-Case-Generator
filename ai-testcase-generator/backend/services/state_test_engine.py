from typing import List, Dict, Any
from models.schemas import Rule, InputDefinition, OutputDefinition, TestCase, Priority, Validity, Traceability


class StateTestEngine:
    """State transition testing engine"""
    
    @staticmethod
    def generate_state_tests(
        rule: Rule,
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition],
        requirement_id: str,
        tc_counter: Dict[str, int]
    ) -> List[TestCase]:
        """
        Generates state transition test cases
        """
        
        test_cases = []
        
        # Identify state variable
        state_input = StateTestEngine._find_state_variable(inputs)
        
        if not state_input:
            return []
        
        # Get possible states
        if state_input.allowed_values:
            states = state_input.allowed_values
        else:
            # Default states if not specified
            states = ["INIT", "ACTIVE", "IDLE", "ERROR"]
        
        # Generate transition tests between states
        for i, from_state in enumerate(states):
            for to_state in states:
                if from_state != to_state:
                    tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
                    tc_counter['count'] += 1
                    
                    test_inputs = {state_input.name: from_state}
                    
                    # Add other inputs with nominal values
                    for inp in inputs:
                        if inp.name != state_input.name:
                            if inp.range_min is not None and inp.range_max is not None:
                                test_inputs[inp.name] = (inp.range_min + inp.range_max) / 2
                            elif inp.allowed_values:
                                test_inputs[inp.name] = inp.allowed_values[0]
                    
                    test_cases.append(TestCase(
                        tc_id=tc_id,
                        rule_id=rule.rule_id,
                        test_type="State Transition",
                        scenario=f"Transition from {from_state} to {to_state}",
                        inputs=test_inputs,
                        expected_output={"next_state": to_state},
                        priority=Priority.MEDIUM,
                        validity=Validity.VALID,
                        traceability=Traceability(
                            requirement=requirement_id,
                            rule=rule.rule_id
                        )
                    ))
        
        # Test invalid state
        tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
        tc_counter['count'] += 1
        
        test_cases.append(TestCase(
            tc_id=tc_id,
            rule_id=rule.rule_id,
            test_type="State Transition",
            scenario="Invalid state input",
            inputs={state_input.name: "INVALID_STATE"},
            expected_output={"status": "REJECTED"},
            priority=Priority.HIGH,
            validity=Validity.INVALID,
            traceability=Traceability(
                requirement=requirement_id,
                rule=rule.rule_id
            )
        ))
        
        return test_cases
    
    @staticmethod
    def _find_state_variable(inputs: List[InputDefinition]) -> InputDefinition:
        """Find the input that represents state"""
        for inp in inputs:
            if any(keyword in inp.name.lower() for keyword in ["state", "status", "mode", "phase"]):
                return inp
        return None
