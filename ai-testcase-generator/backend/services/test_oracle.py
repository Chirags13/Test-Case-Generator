from typing import Dict, Any, List, Optional
from models.schemas import Rule, InputDefinition, OutputDefinition


class TestOracle:
    """
    Computes expected outputs for test cases using logic extraction and common sense.
    Uses intelligent inference when exact computation isn't possible.
    """
    
    @staticmethod
    def compute_expected_output(
        rule: Rule,
        test_inputs: Dict[str, Any],
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition],
        is_valid_input: bool
    ) -> Dict[str, Any]:
        """
        Computes expected output using rule logic, common sense, and intelligent inference.
        Always returns a reasonable output - never blocks.
        """
        
        # If input is invalid, always reject
        if not is_valid_input:
            return {"status": "REJECTED"}
        
        # Try to extract and evaluate the logic
        rule_text = rule.condition.lower()
        behavior_text = rule.expected_behavior.lower()
        
        # 1. Try discrete output values
        for output in outputs:
            if output.possible_values:
                computed = TestOracle._compute_discrete_output(
                    rule, test_inputs, inputs, output
                )
                if computed is not None:
                    return {output.name: computed}
        
        # 2. Try boolean logic
        for output in outputs:
            if output.data_type.lower() in ['bool', 'boolean']:
                computed = TestOracle._compute_boolean_output(
                    rule, test_inputs, inputs, output
                )
                if computed is not None:
                    return {output.name: computed}
        
        # 3. Try arithmetic logic
        for output in outputs:
            if output.data_type.lower() in ['int', 'integer', 'float', 'double']:
                computed = TestOracle._compute_arithmetic_output(
                    rule, test_inputs, inputs, output
                )
                if computed is not None:
                    return {output.name: computed}
        
        # 4. Use common sense inference for valid inputs
        return TestOracle._infer_common_sense_output(
            rule, test_inputs, inputs, outputs
        )
    
    @staticmethod
    def _infer_common_sense_output(
        rule: Rule,
        test_inputs: Dict[str, Any],
        inputs: List[InputDefinition],
        outputs: List[OutputDefinition]
    ) -> Dict[str, Any]:
        """
        Uses common sense to infer reasonable expected output.
        This ensures we always generate test cases.
        """
        
        result = {}
        
        for output in outputs:
            output_name_lower = output.name.lower()
            
            # Status-type outputs
            if 'status' in output_name_lower:
                if output.possible_values:
                    # Use first "success" type value if available
                    for val in output.possible_values:
                        if any(word in val.lower() for word in ['accept', 'success', 'ok', 'valid', 'pass']):
                            result[output.name] = val
                            break
                    if output.name not in result:
                        result[output.name] = output.possible_values[0]
                else:
                    result[output.name] = "ACCEPTED"
            
            # Result-type outputs
            elif 'result' in output_name_lower:
                if output.possible_values:
                    result[output.name] = output.possible_values[0]
                elif output.data_type.lower() in ['bool', 'boolean']:
                    result[output.name] = True
                elif output.data_type.lower() in ['int', 'integer']:
                    result[output.name] = 1
                elif output.data_type.lower() in ['float', 'double']:
                    result[output.name] = 1.0
                else:
                    result[output.name] = "SUCCESS"
            
            # Boolean outputs (alarms, warnings, flags)
            elif output.data_type.lower() in ['bool', 'boolean']:
                # Check if input violates any constraint
                has_violation = False
                for input_def in inputs:
                    if input_def.name in test_inputs:
                        value = test_inputs[input_def.name]
                        if isinstance(value, (int, float)):
                            min_val, max_val = TestOracle._get_input_range(input_def)
                            if min_val is not None and value < min_val:
                                has_violation = True
                            if max_val is not None and value > max_val:
                                has_violation = True
                
                # Alarm/warning outputs activate on violation
                if any(word in output_name_lower for word in ['alarm', 'warning', 'alert', 'error', 'flag']):
                    result[output.name] = has_violation
                else:
                    result[output.name] = not has_violation
            
            # Numeric outputs
            elif output.data_type.lower() in ['int', 'integer', 'float', 'double']:
                # Default to 0 or reasonable value
                if output.data_type.lower() in ['int', 'integer']:
                    result[output.name] = 0
                else:
                    result[output.name] = 0.0
            
            # String outputs with possible values
            elif output.possible_values:
                result[output.name] = output.possible_values[0]
            
            # Generic string outputs
            else:
                result[output.name] = "OK"
        
        # If no outputs defined, return generic success
        if not result:
            result = {"status": "ACCEPTED"}
        
        return result
    
    @staticmethod
    def _get_input_range(input_def: InputDefinition) -> tuple:
        """Get input range, inferring if needed"""
        from services.input_value_generator import InputValueGenerator
        return InputValueGenerator.infer_range(input_def)
    
    @staticmethod
    def _compute_discrete_output(
        rule: Rule,
        test_inputs: Dict[str, Any],
        inputs: List[InputDefinition],
        output: OutputDefinition
    ) -> Optional[str]:
        """Compute output when possible values are defined"""
        
        if not output.possible_values:
            return None
        
        rule_text = (rule.condition + " " + rule.expected_behavior).lower()
        
        # Check for threshold-based discrete outputs
        for input_def in inputs:
            if input_def.name in test_inputs:
                value = test_inputs[input_def.name]
                
                # Look for threshold patterns
                for possible_value in output.possible_values:
                    pv_lower = possible_value.lower()
                    
                    if pv_lower in rule_text:
                        import re
                        numbers = re.findall(r'\d+(?:\.\d+)?', rule_text)
                        
                        if numbers:
                            threshold = float(numbers[0])
                            
                            if '>' in rule_text or 'exceed' in rule_text or 'above' in rule_text:
                                if isinstance(value, (int, float)) and value > threshold:
                                    return possible_value
                            elif '<' in rule_text or 'below' in rule_text:
                                if isinstance(value, (int, float)) and value < threshold:
                                    return possible_value
        
        # Default to first "acceptance" value
        for val in output.possible_values:
            if any(word in val.lower() for word in ['accept', 'ok', 'valid', 'pass', 'success']):
                return val
        
        return output.possible_values[0]
    
    @staticmethod
    def _compute_boolean_output(
        rule: Rule,
        test_inputs: Dict[str, Any],
        inputs: List[InputDefinition],
        output: OutputDefinition
    ) -> Optional[bool]:
        """Compute boolean output from comparison logic"""
        
        rule_text = (rule.condition + " " + rule.expected_behavior).lower()
        
        # Look for comparison operators
        for input_def in inputs:
            if input_def.name.lower() in rule_text and input_def.name in test_inputs:
                value = test_inputs[input_def.name]
                
                if not isinstance(value, (int, float)):
                    continue
                
                import re
                numbers = re.findall(r'\d+(?:\.\d+)?', rule_text)
                
                if numbers:
                    threshold = float(numbers[0])
                    
                    if '>=' in rule_text or 'at least' in rule_text:
                        return value >= threshold
                    elif '>' in rule_text or 'greater' in rule_text or 'exceed' in rule_text:
                        return value > threshold
                    elif '<=' in rule_text or 'at most' in rule_text:
                        return value <= threshold
                    elif '<' in rule_text or 'less' in rule_text or 'below' in rule_text:
                        return value < threshold
                    elif '==' in rule_text or 'equal' in rule_text:
                        return value == threshold
        
        # Common sense for alarm/warning types
        output_name_lower = output.name.lower()
        if any(word in output_name_lower for word in ['alarm', 'warning', 'alert', 'error']):
            return False  # No alarm by default
        
        return True  # Success by default
    
    @staticmethod
    def _compute_arithmetic_output(
        rule: Rule,
        test_inputs: Dict[str, Any],
        inputs: List[InputDefinition],
        output: OutputDefinition
    ) -> Optional[float]:
        """Compute arithmetic output from mathematical logic"""
        
        behavior_text = rule.expected_behavior.lower()
        
        # Get numeric inputs
        numeric_inputs = {k: v for k, v in test_inputs.items() if isinstance(v, (int, float))}
        
        if not numeric_inputs:
            return None
        
        # Look for arithmetic operations
        if 'sum' in behavior_text or '+' in behavior_text or 'add' in behavior_text:
            total = sum(numeric_inputs.values())
            return int(total) if output.data_type.lower() in ['int', 'integer'] else total
        
        elif 'product' in behavior_text or '*' in behavior_text or 'multiply' in behavior_text:
            import functools
            import operator
            product = functools.reduce(operator.mul, numeric_inputs.values(), 1)
            return int(product) if output.data_type.lower() in ['int', 'integer'] else product
        
        elif 'difference' in behavior_text or '-' in behavior_text or 'subtract' in behavior_text:
            values = list(numeric_inputs.values())
            if len(values) >= 2:
                result = values[0] - values[1]
                return int(result) if output.data_type.lower() in ['int', 'integer'] else result
        
        elif 'average' in behavior_text or 'mean' in behavior_text:
            avg = sum(numeric_inputs.values()) / len(numeric_inputs)
            return int(avg) if output.data_type.lower() in ['int', 'integer'] else avg
        
        return None
