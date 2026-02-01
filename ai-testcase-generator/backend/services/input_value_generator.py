from typing import List, Dict, Any, Set
from models.schemas import InputDefinition


class InputValueGenerator:
    """Deterministic generation of test input values with intelligent defaults"""
    
    # Domain-specific default ranges
    DOMAIN_DEFAULTS = {
        # Numeric types
        'age': (0, 120),
        'temperature': (-273, 5000),
        'altitude': (0, 100000),
        'speed': (0, 500),
        'pressure': (0, 10000),
        'distance': (0, 1000000),
        'weight': (0, 100000),
        'height': (0, 300),
        'percentage': (0, 100),
        'count': (0, 1000000),
        'index': (0, 10000),
        'time': (0, 86400),
        'duration': (0, 3600),
        'latitude': (-90, 90),
        'longitude': (-180, 180),
        # String types
        'name': 100,
        'email': 255,
        'password': 128,
        'username': 50,
        'address': 500,
        'description': 1000,
        'message': 5000,
        'url': 2048,
        'phone': 20,
        'code': 50,
    }
    
    @staticmethod
    def infer_range(input_def: InputDefinition) -> tuple:
        """
        Intelligently infer range from input name, type, and context
        """
        # If range already defined, use it
        if input_def.range_min is not None and input_def.range_max is not None:
            return (input_def.range_min, input_def.range_max)
        
        name_lower = input_def.name.lower()
        data_type = input_def.data_type.lower()
        
        # Check for domain-specific defaults
        for domain_key, default_range in InputValueGenerator.DOMAIN_DEFAULTS.items():
            if domain_key in name_lower:
                if isinstance(default_range, tuple):
                    return default_range
                else:
                    # String length
                    return (0, default_range)
        
        # Check units for hints
        if input_def.unit:
            unit_lower = input_def.unit.lower()
            if 'feet' in unit_lower or 'ft' in unit_lower:
                if 'alt' in name_lower:
                    return (0, 100000)
                return (0, 10000)
            elif 'meter' in unit_lower or 'm' == unit_lower:
                return (0, 10000)
            elif 'celsius' in unit_lower or '°c' in unit_lower:
                return (-273, 5000)
            elif 'fahrenheit' in unit_lower or '°f' in unit_lower:
                return (-459, 9000)
            elif 'mph' in unit_lower or 'km/h' in unit_lower:
                return (0, 500)
            elif 'kg' in unit_lower or 'lb' in unit_lower:
                return (0, 10000)
            elif '%' in unit_lower or 'percent' in unit_lower:
                return (0, 100)
        
        # Data type defaults
        if data_type in ['int', 'integer']:
            # Check for specific patterns
            if 'id' in name_lower:
                return (1, 1000000)
            elif 'year' in name_lower:
                return (1900, 2100)
            elif 'month' in name_lower:
                return (1, 12)
            elif 'day' in name_lower:
                return (1, 31)
            elif 'hour' in name_lower:
                return (0, 23)
            elif 'minute' in name_lower or 'second' in name_lower:
                return (0, 59)
            else:
                return (0, 1000)  # Generic integer
        
        elif data_type in ['float', 'double', 'decimal']:
            return (0.0, 1000.0)
        
        elif data_type in ['string', 'str', 'text']:
            return (0, 255)  # String length
        
        # Ultimate fallback
        return (0, 100)
    
    @staticmethod
    def generate_bva_values(input_def: InputDefinition) -> List[Dict[str, Any]]:
        """
        Boundary Value Analysis: min, min+1, nominal, max-1, max
        Now with intelligent range inference
        """
        # Get range (either explicit or inferred)
        min_val, max_val = InputValueGenerator.infer_range(input_def)
        
        if min_val is None or max_val is None:
            return []
        
        # Determine increment based on data type
        is_integer = input_def.data_type.lower() in ["int", "integer"]
        increment = 1 if is_integer else 0.1
        
        values = []
        
        # Minimum boundary
        values.append({
            "value": min_val,
            "description": "Minimum boundary",
            "validity": "VALID"
        })
        
        # Just above minimum
        if min_val + increment <= max_val:
            values.append({
                "value": min_val + increment,
                "description": "Just above minimum",
                "validity": "VALID"
            })
        
        # Nominal (midpoint)
        nominal = (min_val + max_val) / 2
        if is_integer:
            nominal = int(nominal)
        values.append({
            "value": nominal,
            "description": "Nominal value",
            "validity": "VALID"
        })
        
        # Just below maximum
        if max_val - increment >= min_val:
            values.append({
                "value": max_val - increment,
                "description": "Just below maximum",
                "validity": "VALID"
            })
        
        # Maximum boundary
        values.append({
            "value": max_val,
            "description": "Maximum boundary",
            "validity": "VALID"
        })
        
        # Below minimum (invalid)
        values.append({
            "value": min_val - increment,
            "description": "Below minimum (invalid)",
            "validity": "INVALID"
        })
        
        # Above maximum (invalid)
        values.append({
            "value": max_val + increment,
            "description": "Above maximum (invalid)",
            "validity": "INVALID"
        })
        
        return values
    
    @staticmethod
    def generate_ep_values(input_def: InputDefinition) -> List[Dict[str, Any]]:
        """
        Equivalence Partitioning: representative from each partition
        Now with intelligent range inference
        """
        values = []
        
        if input_def.allowed_values:
            # Each allowed value is a partition
            for val in input_def.allowed_values:
                values.append({
                    "value": val,
                    "description": f"Valid partition: {val}",
                    "validity": "VALID"
                })
            
            # Invalid partition: value not in allowed list
            values.append({
                "value": "INVALID_VALUE",
                "description": "Invalid partition (not in allowed values)",
                "validity": "INVALID"
            })
        
        else:
            # Get range (either explicit or inferred)
            min_val, max_val = InputValueGenerator.infer_range(input_def)
            
            if min_val is not None and max_val is not None:
                # Valid partition: within range
                mid = (min_val + max_val) / 2
                values.append({
                    "value": mid,
                    "description": "Valid partition (within range)",
                    "validity": "VALID"
                })
                
                # Invalid partitions: below and above range
                values.append({
                    "value": min_val - 10,
                    "description": "Invalid partition (below range)",
                    "validity": "INVALID"
                })
                
                values.append({
                    "value": max_val + 10,
                    "description": "Invalid partition (above range)",
                    "validity": "INVALID"
                })
        
        return values
    
    @staticmethod
    def generate_negative_values(input_def: InputDefinition) -> List[Dict[str, Any]]:
        """
        Negative testing: null, wrong type, extreme values
        """
        values = []
        
        # Null/None
        values.append({
            "value": None,
            "description": "Null/None input",
            "validity": "INVALID"
        })
        
        # Wrong type
        if input_def.data_type.lower() in ["int", "integer", "float", "double", "number"]:
            values.append({
                "value": "NOT_A_NUMBER",
                "description": "Wrong type (string instead of number)",
                "validity": "INVALID"
            })
        elif input_def.data_type.lower() in ["string", "str"]:
            values.append({
                "value": 12345,
                "description": "Wrong type (number instead of string)",
                "validity": "INVALID"
            })
        
        # Empty string (if string type)
        if input_def.data_type.lower() in ["string", "str"]:
            values.append({
                "value": "",
                "description": "Empty string",
                "validity": "INVALID"
            })
        
        return values
    
    @staticmethod
    def generate_mcdc_combinations(
        inputs: List[InputDefinition],
        condition_variables: Set[str]
    ) -> List[Dict[str, Any]]:
        """
        MC/DC: Generate minimal combinations showing each condition's independence
        
        For simplicity, generates all combinations for up to 3 conditions
        For more complex cases, uses a simplified approach
        """
        
        # Filter inputs that are part of the condition
        relevant_inputs = [inp for inp in inputs if inp.name in condition_variables]
        
        if len(relevant_inputs) > 3:
            # Simplified: test each variable true/false while others are true
            combinations = []
            for inp in relevant_inputs:
                # All true
                combo_all_true = {i.name: True for i in relevant_inputs}
                combinations.append({
                    "combination": combo_all_true,
                    "description": "All conditions true"
                })
                
                # One false
                combo_one_false = {i.name: True for i in relevant_inputs}
                combo_one_false[inp.name] = False
                combinations.append({
                    "combination": combo_one_false,
                    "description": f"{inp.name} false, others true"
                })
            
            return combinations
        
        # Full combinatorial for <= 3 variables
        import itertools
        combinations = []
        
        for values in itertools.product([True, False], repeat=len(relevant_inputs)):
            combo = {relevant_inputs[i].name: values[i] for i in range(len(relevant_inputs))}
            combinations.append({
                "combination": combo,
                "description": ", ".join([f"{k}={v}" for k, v in combo.items()])
            })
        
        return combinations
