import React from 'react';

const Stepper = ({ currentStep, steps }) => {
  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <div key={index} style={styles.stepWrapper}>
          <div style={styles.stepItem}>
            <div
              style={{
                ...styles.stepCircle,
                ...(index < currentStep ? styles.stepCompleted : {}),
                ...(index === currentStep ? styles.stepActive : {}),
                ...(index > currentStep ? styles.stepPending : {})
              }}
            >
              {index < currentStep ? '✓' : index + 1}
            </div>
            <div style={styles.stepLabel}>{step}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              style={{
                ...styles.stepLine,
                ...(index < currentStep ? styles.lineCompleted : styles.linePending)
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '30px 0',
    marginBottom: '30px',
    position: 'relative'
  },
  stepWrapper: {
    display: 'flex',
    alignItems: 'center',
    flex: 1
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2
  },
  stepCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600',
    fontSize: '18px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
  },
  stepCompleted: {
    background: 'linear-gradient(135deg, #00ff9f 0%, #00b8d4 100%)',
    color: '#0a192f',
    transform: 'scale(1.05)'
  },
  stepActive: {
    background: 'linear-gradient(135deg, #64ffda 0%, #ff6b35 100%)',
    color: '#0a192f',
    animation: 'pulse 2s infinite',
    transform: 'scale(1.1)'
  },
  stepPending: {
    background: '#1d3557',
    color: '#8892b0',
    border: '2px solid #233554'
  },
  stepLabel: {
    marginTop: '12px',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace",
    textAlign: 'center',
    color: '#e6f1ff',
    fontWeight: '500',
    letterSpacing: '0.5px'
  },
  stepLine: {
    flex: 1,
    height: '3px',
    margin: '0 10px',
    transition: 'all 0.3s ease',
    position: 'relative',
    top: '-20px'
  },
  lineCompleted: {
    background: 'linear-gradient(90deg, #00ff9f 0%, #00b8d4 100%)'
  },
  linePending: {
    background: '#233554'
  }
};

export default Stepper;
