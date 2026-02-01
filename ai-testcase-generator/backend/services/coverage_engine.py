from typing import List, Dict
from models.schemas import (
    Rule, TestCase, CoverageReport, TraceabilityMatrix
)


class CoverageEngine:
    """Generates traceability and coverage metrics"""
    
    @staticmethod
    def generate_traceability_matrix(
        rules: List[Rule],
        test_cases: List[TestCase]
    ) -> TraceabilityMatrix:
        """
        Creates requirement -> rule -> test case mapping
        """
        
        rule_coverage = {}
        
        for rule in rules:
            rule_id = rule.rule_id
            # Find all test cases for this rule
            related_tcs = [
                tc.tc_id for tc in test_cases
                if tc.rule_id == rule_id
            ]
            rule_coverage[rule_id] = related_tcs
        
        # Get requirement_id from first test case
        requirement_id = test_cases[0].traceability.requirement if test_cases else "UNKNOWN"
        
        return TraceabilityMatrix(
            requirement_id=requirement_id,
            rule_coverage=rule_coverage
        )
    
    @staticmethod
    def generate_coverage_report(
        rules: List[Rule],
        test_cases: List[TestCase],
        requirement_id: str
    ) -> CoverageReport:
        """
        Generates coverage metrics
        """
        
        total_rules = len(rules)
        
        # Count rules covered (rules with at least one test case)
        covered_rules = set()
        for tc in test_cases:
            covered_rules.add(tc.rule_id)
        
        rules_covered = len(covered_rules)
        coverage_percentage = (rules_covered / total_rules * 100) if total_rules > 0 else 0
        
        # Extract techniques used
        techniques_used = list(set([tc.test_type for tc in test_cases]))
        
        # Count valid vs invalid
        valid_count = sum(1 for tc in test_cases if tc.validity.value == "VALID")
        invalid_count = sum(1 for tc in test_cases if tc.validity.value == "INVALID")
        total_count = len(test_cases)
        
        return CoverageReport(
            requirement_id=requirement_id,
            total_rules=total_rules,
            rules_covered=rules_covered,
            coverage_percentage=round(coverage_percentage, 2),
            techniques_used=techniques_used,
            valid_test_count=valid_count,
            invalid_test_count=invalid_count,
            total_test_count=total_count
        )
