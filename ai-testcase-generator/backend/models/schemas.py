from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from enum import Enum


class InterpretationStatus(str, Enum):
    OK = "OK"
    BLOCKED = "BLOCKED"


class TestType(str, Enum):
    BVA = "Boundary Value Analysis"
    EP = "Equivalence Partitioning"
    NEGATIVE = "Negative Testing"
    MCDC = "MC/DC"
    STATE = "State Transition"


class Priority(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class Validity(str, Enum):
    VALID = "VALID"
    INVALID = "INVALID"


class InputDefinition(BaseModel):
    name: str
    data_type: str
    unit: Optional[str] = None
    range_min: Optional[float] = None
    range_max: Optional[float] = None
    allowed_values: Optional[List[str]] = None
    description: Optional[str] = None


class OutputDefinition(BaseModel):
    name: str
    data_type: str
    unit: Optional[str] = None
    description: Optional[str] = None
    possible_values: Optional[List[str]] = None


class Rule(BaseModel):
    rule_id: str
    condition: str
    expected_behavior: str


class InterpretationResult(BaseModel):
    requirement_id: str
    interpretation_status: InterpretationStatus
    interpreted_requirement: str
    rules: List[Rule]
    constraints: List[str]
    boundary_values: Dict[str, Any]
    assumptions: List[str]
    ambiguities: List[str]


class Traceability(BaseModel):
    requirement: str
    rule: str


class TestCase(BaseModel):
    tc_id: str
    rule_id: str
    test_type: str
    scenario: str
    inputs: Dict[str, Any]
    expected_output: Dict[str, Any]
    priority: Priority
    validity: Validity
    traceability: Traceability


class CoverageReport(BaseModel):
    requirement_id: str
    total_rules: int
    rules_covered: int
    coverage_percentage: float
    techniques_used: List[str]
    valid_test_count: int
    invalid_test_count: int
    total_test_count: int


class TraceabilityMatrix(BaseModel):
    requirement_id: str
    rule_coverage: Dict[str, List[str]]  # rule_id -> [test_case_ids]


class GenerateTestCasesRequest(BaseModel):
    requirement_id: str
    requirement_text: str
    inputs: List[InputDefinition]
    outputs: List[OutputDefinition]
    gemini_api_key: str


class GenerateTestCasesResponse(BaseModel):
    interpretation: InterpretationResult
    test_cases: List[TestCase]
    traceability_matrix: TraceabilityMatrix
    coverage_report: CoverageReport
    generation_timestamp: str
