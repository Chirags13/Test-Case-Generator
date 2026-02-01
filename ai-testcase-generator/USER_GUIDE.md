# AI Test Case Generator - User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Step-by-Step Workflow](#step-by-step-workflow)
3. [Best Practices](#best-practices)
4. [Understanding Results](#understanding-results)
5. [Troubleshooting](#troubleshooting)
6. [Advanced Usage](#advanced-usage)

## Getting Started

### What You Need
- Gemini API Key from [Google AI Studio](https://makersuite.google.com/app/apikey)
- A well-defined software requirement
- Knowledge of input parameters and expected outputs

### First Time Setup
1. Obtain your Gemini API key
2. Prepare your requirement documentation
3. Identify all input parameters with their constraints
4. Define expected outputs

## Step-by-Step Workflow

### Step 1: Requirement Definition

**What to Enter:**
- **Requirement ID**: Unique identifier (e.g., `REQ-SYS-001`)
- **Requirement Text**: Complete, formal requirement statement
- **API Key**: Your Gemini API key

**Best Practices:**
- Use formal language: "The system shall..."
- Include all conditions and constraints
- Specify exact numerical ranges when applicable
- Avoid ambiguous terms like "approximately" or "about"

**Good Example:**
```
The altitude sensor shall accept altitude values between 0 and 50000 feet.
The system shall reject any value outside this range.
When altitude exceeds 45000 feet, a warning shall be issued.
```

**Bad Example:**
```
The sensor should handle altitude properly and warn when too high.
```

### Step 2: Input Definition

**For Each Input, Define:**
1. **Name**: Variable or parameter name
2. **Data Type**: int, float, string, boolean
3. **Unit**: Physical unit (meters, kg, seconds, etc.)
4. **Range**: Minimum and maximum values (for numeric)
5. **Allowed Values**: List of valid values (for discrete)
6. **Description**: Brief explanation

**Example - Numeric Input:**
- Name: `altitude`
- Type: `int`
- Unit: `feet`
- Min: `0`
- Max: `50000`
- Description: "Aircraft altitude above sea level"

**Example - Discrete Input:**
- Name: `mode`
- Type: `string`
- Allowed Values: `TAKEOFF, CRUISE, LANDING`
- Description: "Aircraft flight mode"

### Step 3: Output Definition

**For Each Output, Define:**
1. **Name**: Output variable name
2. **Data Type**: Expected data type
3. **Unit**: If applicable
4. **Possible Values**: Expected outcomes
5. **Description**: What this output represents

**Example:**
- Name: `status`
- Type: `string`
- Possible Values: `ACCEPTED, REJECTED, WARNING`
- Description: "Validation status of input"

### Step 4: AI Interpretation

**What Happens:**
- AI analyzes your requirement
- Extracts formal rules and conditions
- Identifies boundary values
- Detects ambiguities

**Possible Outcomes:**

**✓ OK - Ready to Generate**
- Clear rules extracted
- No critical ambiguities
- Proceed to test generation

**⚠ BLOCKED - Cannot Generate**
- Critical ambiguities detected
- Missing information
- Contradictory statements

**If Blocked:**
1. Review listed ambiguities
2. Refine your requirement text
3. Add missing constraints
4. Try again

### Step 5: Test Cases Review

**What You'll See:**
- Complete list of generated test cases
- Each test shows:
  - Test ID and Rule mapping
  - Test technique used
  - Scenario description
  - Inputs and expected outputs
  - Priority and validity

**Test Case Types:**

**Boundary Value Analysis (BVA)**
- Tests at min, max, and boundaries
- Critical for numeric ranges

**Equivalence Partitioning (EP)**
- Representative from each partition
- Efficient coverage

**Negative Testing**
- Invalid inputs
- Error handling verification

**MC/DC**
- For compound conditions
- Each condition tested independently

**State Transition**
- For state-based systems
- All valid transitions

**Actions:**
- Select specific test cases for export
- Review traceability
- Check coverage

### Step 6: Export & Reports

**Export Options:**

**1. All Test Cases**
- Downloads complete Excel file
- One sheet per requirement
- Includes all traceability

**2. Selected Test Cases**
- Only exports checked tests
- Same format as full export

**3. Coverage Report**
- Detailed metrics
- Traceability matrix
- Technique usage

**4. JSON Export**
- Raw data format
- For tool integration
- Copy to clipboard

## Best Practices

### Writing Requirements

**DO:**
- Use "shall" for mandatory requirements
- Include numerical ranges explicitly
- Define all constraints
- Use consistent terminology
- Specify units clearly

**DON'T:**
- Use vague terms ("fast", "soon", "about")
- Leave implicit assumptions
- Mix multiple requirements
- Use ambiguous pronouns

### Defining Inputs

**DO:**
- Specify exact ranges
- Include units
- List all valid values for discrete inputs
- Provide clear descriptions

**DON'T:**
- Leave ranges unbounded
- Forget edge cases
- Mix units (e.g., meters and feet)

### Reviewing Test Cases

**DO:**
- Review traceability for each test
- Verify expected outputs make sense
- Check priority assignments
- Validate boundary values

**DON'T:**
- Export without reviewing
- Ignore negative test cases
- Skip traceability checks

## Understanding Results

### Coverage Metrics

**Rules Covered**
- Number of extracted rules with test cases
- Should be 100% for complete coverage

**Coverage Percentage**
- (Rules Covered / Total Rules) × 100
- Target: 100%

**Test Counts**
- Valid: Tests expecting success
- Invalid: Tests expecting rejection
- Total: Complete test suite

**Techniques Used**
- List of applied testing techniques
- More techniques = better coverage

### Traceability Matrix

Shows mapping:
```
Requirement → Rule → Test Cases
```

Example:
```
REQ-001 → R1 → TC_REQ-001_1, TC_REQ-001_2, TC_REQ-001_3
       → R2 → TC_REQ-001_4, TC_REQ-001_5
```

### Priority Levels

**HIGH**
- Boundary tests
- Critical paths
- Safety-critical scenarios

**MEDIUM**
- Normal operation tests
- State transitions

**LOW**
- Edge cases
- Rare scenarios

## Troubleshooting

### "Interpretation Blocked"

**Cause**: AI detected ambiguities

**Solution**:
1. Read listed ambiguities
2. Add missing details
3. Clarify vague terms
4. Specify exact ranges
5. Resubmit

### "No Response from Server"

**Cause**: Backend not running

**Solution**:
1. Check backend is running on port 8000
2. Verify no firewall blocking
3. Check terminal for errors

### "Invalid API Key"

**Cause**: Gemini API key issue

**Solution**:
1. Verify key is correct
2. Check key has not expired
3. Ensure API is enabled
4. Get new key if needed

### "No Test Cases Generated"

**Cause**: Interpretation blocked or no rules extracted

**Solution**:
1. Check interpretation status
2. Ensure rules were extracted
3. Verify inputs/outputs defined
4. Review requirement clarity

## Advanced Usage

### Integration with Other Tools

**JSON Export**
- Use for CI/CD pipelines
- Import into test management tools
- Custom processing scripts

**Excel Export**
- Load into test management systems
- Share with QA teams
- Archive for compliance

### Custom Workflows

**Regression Testing**
- Export baseline test suite
- Compare with new generation
- Track coverage changes

**Certification Documents**
- Use traceability matrix
- Include coverage reports
- Attach to compliance packages

### API Direct Usage

For automation, call API directly:

```bash
curl -X POST http://localhost:8000/generate-test-cases \
  -H "Content-Type: application/json" \
  -d '{
    "requirement_id": "REQ-001",
    "requirement_text": "...",
    "inputs": [...],
    "outputs": [...],
    "gemini_api_key": "..."
  }'
```

## Tips for Maximum Effectiveness

1. **Start Simple**: Begin with one clear requirement
2. **Iterate**: Refine based on interpretation feedback
3. **Complete Coverage**: Define all inputs/outputs
4. **Review Carefully**: Don't skip the review step
5. **Document**: Keep requirement IDs consistent
6. **Version Control**: Track changes to requirements
7. **Team Review**: Have peers validate test cases
8. **Continuous Improvement**: Learn from blocked interpretations

## Getting Help

If you encounter issues:
1. Check this guide first
2. Review the README.md
3. Check backend logs for errors
4. Verify all prerequisites installed
5. Ensure API key is valid

## Conclusion

This tool combines AI understanding with deterministic test generation to create certification-grade test suites. Following these guidelines will help you generate comprehensive, traceable test cases efficiently.

Remember: The quality of your test cases depends on the clarity of your requirements!
