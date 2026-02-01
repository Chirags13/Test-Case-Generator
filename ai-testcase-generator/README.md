# AI Test Case Generator

A production-ready, certification-grade test case generation tool that combines AI-powered requirement interpretation with deterministic test generation logic.

## 🎯 Overview

This tool is designed for safety-critical software verification and validation (V&V). It uses AI for intelligent requirement understanding while generating test cases using deterministic, proven testing techniques.

### Key Features

- **Intelligent AI Interpretation**: Uses Gemini AI to extract rules, infer boundaries, and understand context
- **Smart Range Inference**: Automatically infers reasonable ranges from data types, names, and domain knowledge
- **Context-Aware Testing**: Understands common domains (altitude, temperature, age, etc.) without explicit ranges
- **Deterministic Test Generation**: Uses established testing techniques (BVA, EP, MC/DC, etc.)
- **Lenient Yet Safe**: Works with incomplete specifications while documenting assumptions
- **Complete Traceability**: Full requirement → rule → test case mapping
- **Coverage Metrics**: Detailed coverage reports and statistics
- **Excel Export**: Professional exports for documentation and certification
- **Modern UI**: Professional stepper-based interface with real-time feedback

### 🧠 Intelligent Features

**Auto-Range Inference**
- Temperature inputs → Infers -273°C to 5000°C
- Altitude inputs → Infers 0 to 100,000 feet
- Age inputs → Infers 0 to 120 years
- Percentage inputs → Infers 0 to 100%
- And many more domain-specific defaults

**Context Understanding**
- Analyzes input names, units, and data types
- Applies domain knowledge automatically
- Documents all assumptions made
- Only blocks on truly ambiguous requirements

## 🏗️ Architecture

### Backend (Python + FastAPI)
- **FastAPI**: High-performance REST API
- **Pydantic**: Data validation and schemas
- **Gemini AI**: Requirement interpretation only
- **Deterministic Engines**: BVA, EP, MC/DC, State-based testing

### Frontend (React + Vite)
- **React 18**: Modern component-based UI
- **Vite**: Lightning-fast development and builds
- **SheetJS**: Excel export functionality
- **Axios**: HTTP client

## 📦 Installation

### Prerequisites
- Python 3.9+
- Node.js 18+
- Gemini API Key (get from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt --break-system-packages

# Run the server
python main.py
```

The backend will start on `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🚀 Usage

### Step 1: Define Requirement
- Enter a unique Requirement ID (e.g., `REQ-001`)
- Write the complete requirement specification
- Provide your Gemini API key

### Step 2: Define Inputs
- Add all input parameters with:
  - Name and data type (required)
  - Range (min/max) - **optional, will be inferred if not provided**
  - Allowed values for discrete inputs
  - Units and descriptions

**Smart Inference Examples**:
- Input "altitude" (feet) → Auto-infers 0-100,000
- Input "temperature" (celsius) → Auto-infers -273-5,000
- Input "age" → Auto-infers 0-120
- Input "speed" (mph) → Auto-infers 0-500
- Input "percentage" → Auto-infers 0-100

**Tip**: You can leave min/max empty and let the system infer sensible defaults!

### Step 3: Define Outputs
- Add expected outputs with:
  - Name and data type
  - Possible values
  - Units and descriptions

### Step 4: Review Interpretation
- AI extracts rules, constraints, and boundaries
- **BLOCKED** if ambiguities detected
- **OK** if ready to proceed

### Step 5: View Test Cases
- Browse generated test cases
- Select specific tests for export
- View complete traceability

### Step 6: Export & Reports
- Export all test cases to Excel
- Export selected test cases
- Generate coverage reports
- Copy JSON for integration

## 🧪 Testing Techniques

### Boundary Value Analysis (BVA)
Tests values at boundaries:
- Minimum, Minimum+1
- Nominal (midpoint)
- Maximum-1, Maximum
- Below minimum, Above maximum (invalid)

### Equivalence Partitioning (EP)
Tests representative values from each partition:
- Valid partitions
- Invalid partitions

### Negative Testing
Tests invalid inputs:
- Null/None values
- Wrong data types
- Empty strings
- Out-of-range values

### Modified Condition/Decision Coverage (MC/DC)
For compound conditions (AND/OR):
- All conditions true
- Each condition false individually

### State Transition Testing
For state-based systems:
- All valid state transitions
- Invalid state inputs

## 📊 Outputs

### Test Case Format
```json
{
  "tc_id": "TC_REQ-001_1",
  "rule_id": "R1",
  "test_type": "Boundary Value Analysis",
  "scenario": "Description of test scenario",
  "inputs": {"param": "value"},
  "expected_output": {"result": "expected"},
  "priority": "HIGH",
  "validity": "VALID",
  "traceability": {
    "requirement": "REQ-001",
    "rule": "R1"
  }
}
```

### Coverage Report
- Total rules and coverage percentage
- Test count breakdown (valid/invalid)
- Techniques used
- Traceability matrix

### Excel Export
- One sheet per requirement
- Complete test case details
- Formatted for readability
- Professional presentation

## 🔐 Safety & Compliance

### AI Usage Policy
- AI interprets requirements ONLY
- AI does NOT generate test cases
- AI does NOT guess values
- Ambiguities BLOCK generation

### Validation Rules
- All AI outputs validated
- Invention detection
- Completeness checks
- Schema enforcement

### Certification Support
- Complete traceability
- Coverage metrics
- Deterministic generation
- Audit-ready exports

## 🛠️ API Endpoints

### POST /generate-test-cases
Generate test cases from requirement

**Request:**
```json
{
  "requirement_id": "REQ-001",
  "requirement_text": "The system shall...",
  "inputs": [...],
  "outputs": [...],
  "gemini_api_key": "your-api-key"
}
```

**Response:**
```json
{
  "interpretation": {...},
  "test_cases": [...],
  "traceability_matrix": {...},
  "coverage_report": {...},
  "generation_timestamp": "2024-01-01T00:00:00"
}
```

### GET /health
Health check endpoint

## 🎨 UI Features

- **Stepper Navigation**: Clear progress tracking
- **Real-time Validation**: Immediate feedback
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Clear progress indicators
- **Error Handling**: User-friendly error messages
- **Dark Theme**: Professional appearance

## 📝 Example

### Requirement
"The altitude sensor shall accept values between 0 and 50000 feet. Values outside this range shall be rejected."

### Generated Tests
- BVA: 0, 1, 25000, 49999, 50000, -1, 50001
- EP: Valid range (25000), Below range (-100), Above range (60000)
- Negative: null, "not_a_number", empty string

### Coverage
- 100% rule coverage
- 3 techniques applied
- 10 total test cases
- 5 valid, 5 invalid

## 🔧 Configuration

### Backend Port
Edit `backend/main.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8000)
```

### Frontend Port
Edit `frontend/vite.config.js`:
```javascript
server: { port: 5173 }
```

### CORS Settings
Edit `backend/main.py`:
```python
allow_origins=["http://localhost:5173"]
```

## 🐛 Troubleshooting

### Backend Issues
- **Import errors**: Ensure all dependencies installed
- **Port conflicts**: Change port in main.py
- **API errors**: Check Gemini API key validity

### Frontend Issues
- **Build errors**: Run `npm install` again
- **Connection errors**: Verify backend is running
- **Display issues**: Clear browser cache

## 📚 Documentation

### Code Structure
```
backend/
├── ai/                 # AI integration
├── models/            # Data schemas
├── services/          # Business logic
├── validators/        # Output validation
└── main.py           # FastAPI app

frontend/
├── src/
│   ├── components/   # UI components
│   ├── pages/        # Main pages
│   ├── services/     # API client
│   └── utils/        # Utilities
```

### Deployment

**Ready to deploy online?** We provide multiple deployment options:

📖 **[Full Deployment Guide](DEPLOYMENT.md)** - All platforms covered
🐳 **[Docker Deployment](DOCKER_DEPLOYMENT.md)** - Easiest containerized deployment

**Quick Options**:
- **Free/Testing**: Render.com (free tier)
- **Recommended**: Vercel (frontend) + Railway (backend) - $5/month
- **Best Value**: DigitalOcean Droplet - $12/month
- **Enterprise**: AWS, GCP, Azure

**Docker Quick Start**:
```bash
# 1. Setup environment
cp .env.docker.example .env
# Edit .env with your Gemini API key

# 2. Deploy
docker-compose up -d

# 3. Access at http://localhost
```

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for complete Docker guide.
See [DEPLOYMENT.md](DEPLOYMENT.md) for all hosting options.

### Key Principles
1. AI for understanding, not generation
2. Deterministic test logic
3. Complete traceability
4. Safety-first approach
5. Certification-ready outputs

## 🤝 Contributing

This is a demonstration project showcasing best practices for AI-assisted test generation in safety-critical systems.

## 📄 License

This project is provided as-is for educational and professional use.

## 🌟 Credits

- Gemini AI by Google
- FastAPI Framework
- React & Vite
- SheetJS Library

---

**Note**: This tool is designed for professional V&V engineers working on safety-critical systems. Always verify test cases against your specific certification requirements.
