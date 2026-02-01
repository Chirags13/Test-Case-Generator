from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from models.schemas import (
    GenerateTestCasesRequest,
    GenerateTestCasesResponse,
    InterpretationStatus
)
from services.requirement_interpreter import RequirementInterpreter
from services.test_strategy_engine import TestStrategyEngine
from services.test_case_builder import TestCaseBuilder
from services.coverage_engine import CoverageEngine

app = FastAPI(title="AI Test Case Generator API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "service": "AI Test Case Generator",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/generate-test-cases", response_model=GenerateTestCasesResponse)
async def generate_test_cases(request: GenerateTestCasesRequest):
    """
    Main endpoint for test case generation
    
    Flow:
    1. Interpret requirement using AI
    2. Validate interpretation
    3. If BLOCKED, return with empty test cases
    4. Check if outputs are computable (Oracle validation)
    5. Determine test strategies
    6. Generate test cases deterministically with computed outputs
    7. Calculate coverage
    8. Return complete response
    """
    
    try:
        # Step 1: Interpret requirement using AI
        interpreter = RequirementInterpreter(request.gemini_api_key)
        
        inputs_dict = [inp.dict() for inp in request.inputs]
        outputs_dict = [out.dict() for out in request.outputs]
        
        interpretation = interpreter.interpret(
            request.requirement_id,
            request.requirement_text,
            inputs_dict,
            outputs_dict
        )
        
        # Step 2: Check if interpretation is BLOCKED
        if interpretation.interpretation_status == InterpretationStatus.BLOCKED:
            return GenerateTestCasesResponse(
                interpretation=interpretation,
                test_cases=[],
                traceability_matrix={
                    "requirement_id": request.requirement_id,
                    "rule_coverage": {}
                },
                coverage_report={
                    "requirement_id": request.requirement_id,
                    "total_rules": len(interpretation.rules),
                    "rules_covered": 0,
                    "coverage_percentage": 0.0,
                    "techniques_used": [],
                    "valid_test_count": 0,
                    "invalid_test_count": 0,
                    "total_test_count": 0
                },
                generation_timestamp=datetime.utcnow().isoformat()
            )
        
        # Step 3: Determine test strategies
        strategies = TestStrategyEngine.determine_strategies(
            interpretation.rules,
            request.inputs,
            interpretation.boundary_values
        )
        
        # Step 4: Generate test cases with intelligent output inference
        builder = TestCaseBuilder()
        test_cases = builder.build_test_cases(
            interpretation.rules,
            request.inputs,
            request.outputs,
            strategies,
            request.requirement_id
        )
        
        # Step 5: Generate traceability matrix
        traceability_matrix = CoverageEngine.generate_traceability_matrix(
            interpretation.rules,
            test_cases
        )
        
        # Step 6: Generate coverage report
        coverage_report = CoverageEngine.generate_coverage_report(
            interpretation.rules,
            test_cases,
            request.requirement_id
        )
        
        # Step 7: Return complete response
        return GenerateTestCasesResponse(
            interpretation=interpretation,
            test_cases=test_cases,
            traceability_matrix=traceability_matrix,
            coverage_report=coverage_report,
            generation_timestamp=datetime.utcnow().isoformat()
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
