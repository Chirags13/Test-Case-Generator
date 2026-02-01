import React, { useState } from 'react';
import Stepper from '../components/Stepper';
import RequirementForm from '../components/RequirementForm';
import InputDefinition from '../components/InputDefinition';
import OutputDefinition from '../components/OutputDefinition';
import InterpretationResult from '../components/InterpretationResult';
import TestCaseTable from '../components/TestCaseTable';
import ExportPanel from '../components/ExportPanel';
import { generateTestCases } from '../services/api';

const STEPS = ['Requirement', 'Inputs', 'Outputs', 'Interpretation', 'Test Cases', 'Export'];

const GeneratorPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    requirement_id: '',
    requirement_text: '',
    gemini_api_key: ''
  });
  
  const [inputs, setInputs] = useState([]);
  const [outputs, setOutputs] = useState([]);
  const [interpretation, setInterpretation] = useState(null);
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCases, setSelectedTestCases] = useState([]);
  const [coverageReport, setCoverageReport] = useState(null);
  const [traceabilityMatrix, setTraceabilityMatrix] = useState(null);

  const updateFormData = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const goToStep = (step) => {
    setCurrentStep(step);
    setError(null);
  };

  const handleGenerateInterpretation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await generateTestCases({
        requirement_id: formData.requirement_id,
        requirement_text: formData.requirement_text,
        inputs: inputs,
        outputs: outputs,
        gemini_api_key: formData.gemini_api_key
      });

      setInterpretation(response.interpretation);
      setTestCases(response.test_cases);
      setSelectedTestCases(response.test_cases.map(tc => tc.tc_id));
      setCoverageReport(response.coverage_report);
      setTraceabilityMatrix(response.traceability_matrix);

      goToStep(3); // Move to interpretation step
    } catch (err) {
      setError(err.message || 'Failed to generate test cases');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCases = () => {
    if (interpretation.interpretation_status === 'OK') {
      goToStep(4); // Move to test cases step
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <RequirementForm
            formData={formData}
            onChange={updateFormData}
            onNext={() => goToStep(1)}
          />
        );
      
      case 1:
        return (
          <InputDefinition
            inputs={inputs}
            setInputs={setInputs}
            onNext={() => goToStep(2)}
            onBack={() => goToStep(0)}
          />
        );
      
      case 2:
        return (
          <OutputDefinition
            outputs={outputs}
            setOutputs={setOutputs}
            onNext={handleGenerateInterpretation}
            onBack={() => goToStep(1)}
          />
        );
      
      case 3:
        return interpretation ? (
          <InterpretationResult
            interpretation={interpretation}
            onNext={handleGenerateTestCases}
            onBack={() => goToStep(2)}
          />
        ) : null;
      
      case 4:
        return testCases.length > 0 ? (
          <>
            <TestCaseTable
              testCases={testCases}
              selectedTestCases={selectedTestCases}
              setSelectedTestCases={setSelectedTestCases}
            />
            <div style={styles.navigation}>
              <button onClick={() => goToStep(3)} style={styles.backButton}>
                ← Back to Interpretation
              </button>
              <button onClick={() => goToStep(5)} style={styles.nextButton}>
                Continue to Export →
              </button>
            </div>
          </>
        ) : null;
      
      case 5:
        return coverageReport && traceabilityMatrix ? (
          <>
            <ExportPanel
              testCases={testCases}
              selectedTestCases={selectedTestCases}
              coverageReport={coverageReport}
              traceabilityMatrix={traceabilityMatrix}
              requirementId={formData.requirement_id}
            />
            <div style={styles.navigation}>
              <button onClick={() => goToStep(4)} style={styles.backButton}>
                ← Back to Test Cases
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Start a new test generation? Current progress will be lost.')) {
                    window.location.reload();
                  }
                }} 
                style={styles.resetButton}
              >
                🔄 New Generation
              </button>
            </div>
          </>
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>
            <span style={styles.logoAccent}>AI</span> Test Case Generator
          </h1>
          <p style={styles.tagline}>
            Safety-Critical V&V Tool • Certification-Grade Testing
          </p>
        </div>
      </header>

      <main style={styles.main}>
        <Stepper currentStep={currentStep} steps={STEPS} />

        {error && (
          <div style={styles.errorBanner}>
            <span style={styles.errorIcon}>⚠</span>
            <span style={styles.errorText}>{error}</span>
            <button onClick={() => setError(null)} style={styles.errorClose}>✕</button>
          </div>
        )}

        {loading && (
          <div style={styles.loadingOverlay}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>
              AI is analyzing your requirement...
            </p>
          </div>
        )}

        <div style={styles.content}>
          {renderStepContent()}
        </div>
      </main>

      <footer style={styles.footer}>
        <p style={styles.footerText}>
          Powered by Gemini AI • Deterministic Test Generation • MC/DC Coverage
        </p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    background: 'linear-gradient(135deg, #0a192f 0%, #1d3557 100%)',
    borderBottom: '3px solid #64ffda',
    padding: '40px 20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  logo: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#e6f1ff',
    marginBottom: '10px',
    fontFamily: "'Crimson Pro', serif",
    letterSpacing: '-1px'
  },
  logoAccent: {
    color: '#64ffda',
    textShadow: '0 0 20px rgba(100, 255, 218, 0.5)'
  },
  tagline: {
    fontSize: '16px',
    color: '#8892b0',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  main: {
    flex: 1,
    padding: '40px 20px',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto'
  },
  content: {
    minHeight: '400px'
  },
  errorBanner: {
    background: 'rgba(255, 83, 112, 0.2)',
    border: '2px solid #ff5370',
    borderRadius: '8px',
    padding: '15px 20px',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  errorIcon: {
    fontSize: '24px'
  },
  errorText: {
    flex: 1,
    color: '#ff5370',
    fontSize: '15px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  errorClose: {
    background: 'transparent',
    border: 'none',
    color: '#ff5370',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px 10px'
  },
  loadingOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(10, 25, 47, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  loadingSpinner: {
    width: '60px',
    height: '60px',
    border: '4px solid #233554',
    borderTop: '4px solid #64ffda',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
    marginTop: '30px'
  },
  backButton: {
    padding: '14px 30px',
    background: '#1d3557',
    border: '2px solid #233554',
    borderRadius: '8px',
    color: '#8892b0',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  nextButton: {
    flex: 1,
    padding: '14px',
    background: 'linear-gradient(135deg, #64ffda 0%, #ff6b35 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a192f',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  resetButton: {
    padding: '14px 30px',
    background: '#1d3557',
    border: '2px solid #ff6b35',
    borderRadius: '8px',
    color: '#ff6b35',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px'
  },
  footer: {
    background: '#0a192f',
    borderTop: '1px solid #233554',
    padding: '20px',
    textAlign: 'center'
  },
  footerText: {
    color: '#8892b0',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '1px'
  }
};

// Add keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
  }
`;
document.head.appendChild(styleSheet);

export default GeneratorPage;
