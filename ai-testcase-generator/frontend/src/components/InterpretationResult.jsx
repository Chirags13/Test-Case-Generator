import React from 'react';

const InterpretationResult = ({ interpretation, onNext, onBack }) => {
  const isBlocked = interpretation.interpretation_status === 'BLOCKED';

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>AI Interpretation Result</h2>
      
      <div style={{
        ...styles.statusCard,
        ...(isBlocked ? styles.statusBlocked : styles.statusOk)
      }}>
        <div style={styles.statusHeader}>
          <span style={styles.statusIcon}>{isBlocked ? '⚠' : '✓'}</span>
          <span style={styles.statusText}>
            {isBlocked ? 'BLOCKED - Cannot Generate Tests' : 'OK - Ready to Generate Tests'}
          </span>
        </div>
      </div>

      {isBlocked && interpretation.ambiguities && interpretation.ambiguities.length > 0 && (
        <div style={styles.ambiguitiesSection}>
          <h3 style={styles.sectionTitle}>⚠ Ambiguities Detected</h3>
          <div style={styles.ambiguitiesBox}>
            {interpretation.ambiguities.map((amb, index) => (
              <div key={index} style={styles.ambiguityItem}>
                <span style={styles.ambiguityBullet}>•</span>
                <span>{amb}</span>
              </div>
            ))}
          </div>
          <p style={styles.blockedMessage}>
            Please refine your requirement to address these ambiguities before proceeding.
          </p>
        </div>
      )}

      <div style={styles.contentGrid}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Interpreted Requirement</h3>
          <div style={styles.card}>
            <p style={styles.interpretedText}>{interpretation.interpreted_requirement}</p>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Extracted Rules ({interpretation.rules.length})</h3>
          {interpretation.rules.map((rule, index) => (
            <div key={index} style={styles.ruleCard}>
              <div style={styles.ruleHeader}>
                <span style={styles.ruleId}>{rule.rule_id}</span>
              </div>
              <div style={styles.ruleContent}>
                <div style={styles.ruleRow}>
                  <span style={styles.ruleLabel}>Condition:</span>
                  <span style={styles.ruleValue}>{rule.condition}</span>
                </div>
                <div style={styles.ruleRow}>
                  <span style={styles.ruleLabel}>Expected:</span>
                  <span style={styles.ruleValue}>{rule.expected_behavior}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {interpretation.constraints && interpretation.constraints.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Constraints</h3>
            <div style={styles.card}>
              <ul style={styles.list}>
                {interpretation.constraints.map((constraint, index) => (
                  <li key={index} style={styles.listItem}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {interpretation.boundary_values && Object.keys(interpretation.boundary_values).length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Boundary Values</h3>
            <div style={styles.card}>
              <pre style={styles.codeBlock}>
                {JSON.stringify(interpretation.boundary_values, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {interpretation.assumptions && interpretation.assumptions.length > 0 && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Assumptions</h3>
            <div style={styles.card}>
              <ul style={styles.list}>
                {interpretation.assumptions.map((assumption, index) => (
                  <li key={index} style={styles.listItem}>{assumption}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div style={styles.navigation}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back
        </button>
        {!isBlocked && (
          <button onClick={onNext} style={styles.nextButton}>
            Generate Test Cases →
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px',
    color: '#64ffda'
  },
  statusCard: {
    padding: '20px 30px',
    borderRadius: '12px',
    marginBottom: '30px',
    border: '2px solid'
  },
  statusOk: {
    background: 'rgba(0, 255, 159, 0.1)',
    borderColor: '#00ff9f'
  },
  statusBlocked: {
    background: 'rgba(255, 83, 112, 0.1)',
    borderColor: '#ff5370'
  },
  statusHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  statusIcon: {
    fontSize: '28px'
  },
  statusText: {
    fontSize: '20px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '1px'
  },
  ambiguitiesSection: {
    marginBottom: '30px'
  },
  ambiguitiesBox: {
    background: '#112240',
    padding: '20px',
    borderRadius: '8px',
    border: '2px solid #ff5370',
    marginBottom: '15px'
  },
  ambiguityItem: {
    display: 'flex',
    gap: '10px',
    marginBottom: '10px',
    color: '#e6f1ff',
    fontSize: '15px'
  },
  ambiguityBullet: {
    color: '#ff5370',
    fontWeight: '700'
  },
  blockedMessage: {
    color: '#ff5370',
    fontSize: '15px',
    fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace"
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '25px',
    marginBottom: '30px'
  },
  section: {
    background: '#112240',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #233554'
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#64ffda',
    marginBottom: '15px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  card: {
    background: '#0a192f',
    padding: '20px',
    borderRadius: '8px'
  },
  interpretedText: {
    color: '#e6f1ff',
    fontSize: '16px',
    lineHeight: '1.7'
  },
  ruleCard: {
    background: '#0a192f',
    padding: '18px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #233554'
  },
  ruleHeader: {
    marginBottom: '12px'
  },
  ruleId: {
    padding: '5px 12px',
    background: '#1d3557',
    borderRadius: '4px',
    color: '#64ffda',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  ruleContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  ruleRow: {
    display: 'flex',
    gap: '10px'
  },
  ruleLabel: {
    color: '#8892b0',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace",
    minWidth: '90px',
    fontWeight: '600'
  },
  ruleValue: {
    color: '#e6f1ff',
    fontSize: '14px',
    flex: 1
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    color: '#e6f1ff',
    fontSize: '15px',
    marginBottom: '10px',
    paddingLeft: '20px',
    position: 'relative',
    lineHeight: '1.6'
  },
  codeBlock: {
    color: '#64ffda',
    fontSize: '13px',
    fontFamily: "'JetBrains Mono', monospace",
    overflow: 'auto',
    whiteSpace: 'pre-wrap'
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px'
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
    cursor: 'pointer'
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
  }
};

export default InterpretationResult;
