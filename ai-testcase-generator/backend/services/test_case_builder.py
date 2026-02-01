from typing import List, Dict, Any
from models.schemas import (
    Rule, InputDefinition, OutputDefinition, TestCase,
    Priority, Validity, Traceability
)
from services.input_value_generator import InputValueGenerator
from services.mcdc_engine import MCDCEngine
from services.state_test_engine import StateTestEngine
from services.test_oracle import TestOracle


class TestCaseBuilder:
    """Builds complete test cases using deterministic logic and test oracle"""
    
    def __init__(self):
        self.value_generator = InputValueGenerator()
        self.oracle = TestOracle()
    
    def build_test_cases(
        self,
        rules: List[Rule],
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition],
        strategies: Dict[str, List[str]],
        requirement_id: str
    ) -> List[TestCase]:
        """
        Generates all test cases based on strategies using intelligent output inference
        """
        
        test_cases = []
        tc_counter = {"count": 1}
        
        for rule in rules:
            rule_strategies = strategies.get(rule.rule_id, [])
            
            for strategy in rule_strategies:
                if strategy == "BVA":
                    test_cases.extend(
                        self._generate_bva_tests(rule, inputs, outputs, requirement_id, tc_counter)
                    )
                elif strategy == "EP":
                    test_cases.extend(
                        self._generate_ep_tests(rule, inputs, outputs, requirement_id, tc_counter)
                    )
                elif strategy == "NEGATIVE":
                    test_cases.extend(
                        self._generate_negative_tests(rule, inputs, outputs, requirement_id, tc_counter)
                    )
                elif strategy == "MCDC":
                    test_cases.extend(
                        MCDCEngine.generate_mcdc_tests(rule, inputs, requirement_id, tc_counter)
                    )
                elif strategy == "STATE":
                    test_cases.extend(
                        StateTestEngine.generate_state_tests(rule, inputs, outputs, requirement_id, tc_counter)
                    )
        
        return test_cases
    
    def _generate_bva_tests(
        self,
        rule: Rule,
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition],
        requirement_id: str,
        tc_counter: Dict[str, int]
    ) -> List[TestCase]:
        """Generate BVA test cases with computed expected outputs"""
        
        test_cases = []
        
        for inp in inputs:
            # Check if numeric type
            if inp.data_type.lower() not in ["int", "integer", "float", "double", "number"]:
                continue
            
            bva_values = self.value_generator.generate_bva_values(inp)
            
            for val_info in bva_values:
                tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
                tc_counter['count'] += 1
                
                test_inputs = {inp.name: val_info["value"]}
                
                # Add nominal values for other inputs
                for other_inp in inputs:
                    if other_inp.name != inp.name:
                        test_inputs[other_inp.name] = self._get_nominal_value(other_inp)
                
                # Determine if input is valid
                is_valid = val_info["validity"] == "VALID"
                
                # Compute expected output using oracle
                try:
                    expected_output = self.oracle.compute_expected_output(
                        rule, test_inputs, inputs, outputs, is_valid
                    )
                except Exception:
                    # If oracle fails, use rejection for invalid, acceptance for valid
                    expected_output = {"status": "REJECTED"} if not is_valid else {"status": "ACCEPTED"}
                
                validity = Validity.VALID if is_valid else Validity.INVALID
                
                test_cases.append(TestCase(
                    tc_id=tc_id,
                    rule_id=rule.rule_id,
                    test_type="Boundary Value Analysis",
                    scenario=f"BVA: {inp.name} = {val_info['value']} ({val_info['description']})",
                    inputs=test_inputs,
                    expected_output=expected_output,
                    priority=Priority.HIGH,
                    validity=validity,
                    traceability=Traceability(
                        requirement=requirement_id,
                        rule=rule.rule_id
                    )
                ))
        
        return test_cases
    
    def _generate_ep_tests(
        self,
        rule: Rule,
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition],
        requirement_id: str,
        tc_counter: Dict[str, int]
    ) -> List[TestCase]:
        """Generate Equivalence Partitioning test cases with computed outputs"""
        
        test_cases = []
        
        for inp in inputs:
            ep_values = self.value_generator.generate_ep_values(inp)
            
            for val_info in ep_values:
                tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
                tc_counter['count'] += 1
                
                test_inputs = {inp.name: val_info["value"]}
                
                # Add nominal values for other inputs
                for other_inp in inputs:
                    if other_inp.name != inp.name:
                        test_inputs[other_inp.name] = self._get_nominal_value(other_inp)
                
                # Determine if input is valid
                is_valid = val_info["validity"] == "VALID"
                
                # Compute expected output using oracle
                try:
                    expected_output = self.oracle.compute_expected_output(
                        rule, test_inputs, inputs, outputs, is_valid
                    )
                except Exception:
                    expected_output = {"status": "REJECTED"} if not is_valid else {"status": "ACCEPTED"}
                
                validity = Validity.VALID if is_valid else Validity.INVALID
                
                test_cases.append(TestCase(
                    tc_id=tc_id,
                    rule_id=rule.rule_id,
                    test_type="Equivalence Partitioning",
                    scenario=f"EP: {inp.name} = {val_info['value']} ({val_info['description']})",
                    inputs=test_inputs,
                    expected_output=expected_output,
                    priority=Priority.MEDIUM,
                    validity=validity,
                    traceability=Traceability(
                        requirement=requirement_id,
                        rule=rule.rule_id
                    )
                ))
        
        return test_cases
    
    def _generate_negative_tests(
        self,
        rule: Rule,
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition],
        requirement_id: str,
        tc_counter: Dict[str, int]
    ) -> List[TestCase]:
        """Generate Negative test cases"""
        
        test_cases = []
        
        for inp in inputs:
            neg_values = self.value_generator.generate_negative_values(inp)
            
            for val_info in neg_values:
                tc_id = f"TC_{requirement_id}_{tc_counter['count']}"
                tc_counter['count'] += 1
                
                test_inputs = {inp.name: val_info["value"]}
                
                # Add nominal values for other inputs
                for other_inp in inputs:
                    if other_inp.name != inp.name:
                        test_inputs[other_inp.name] = self._get_nominal_value(other_inp)
                
                expected_output = {"status": "REJECTED"}
                
                test_cases.append(TestCase(
                    tc_id=tc_id,
                    rule_id=rule.rule_id,
                    test_type="Negative Testing",
                    scenario=f"Negative: {inp.name} = {val_info['value']} ({val_info['description']})",
                    inputs=test_inputs,
                    expected_output=expected_output,
                    priority=Priority.HIGH,
                    validity=Validity.INVALID,
                    traceability=Traceability(
                        requirement=requirement_id,
                        rule=rule.rule_id
                    )
                ))
        
        return test_cases
    
    def _get_nominal_value(self, input_def: InputDefinition) -> Any:
        """Get nominal/typical value for an input with intelligent inference"""
        # Use inferred range if needed
        min_val, max_val = self.value_generator.infer_range(input_def)
        
        if input_def.allowed_values:
            return input_def.allowed_values[0]
        elif min_val is not None and max_val is not None:
            nominal = (min_val + max_val) / 2
            if input_def.data_type.lower() in ["int", "integer"]:
                return int(nominal)
            return nominal
        elif input_def.data_type.lower() in ["bool", "boolean"]:
            return True
        else:
            return 0  # Default numeric value instead of placeholder string
