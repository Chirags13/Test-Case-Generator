import React, { useState } from 'react';

const OutputDefinition = ({ outputs, setOutputs, onNext, onBack }) => {
  const [currentOutput, setCurrentOutput] = useState({
    name: '',
    data_type: 'int',
    unit: '',
    description: '',
    possible_values: ''
  });

  const addOutput = () => {
    if (!currentOutput.name || !currentOutput.data_type) {
      alert('Please provide at least output name and data type');
      return;
    }

    const newOutput = {
      ...currentOutput,
      possible_values: currentOutput.possible_values
        ? currentOutput.possible_values.split(',').map(v => v.trim()).filter(v => v)
        : null
    };

    setOutputs([...outputs, newOutput]);
    setCurrentOutput({
      name: '',
      data_type: 'int',
      unit: '',
      description: '',
      possible_values: ''
    });
  };

  const removeOutput = (index) => {
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (outputs.length === 0) {
      alert('Please add at least one output');
      return;
    }
    onNext();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Output Definitions</h2>
      <p style={styles.subtitle}>Define expected outputs and their characteristics</p>

      <div style={styles.outputsPanel}>
        <div style={styles.addOutputSection}>
          <h3 style={styles.sectionTitle}>Add Output Parameter</h3>
          
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                value={currentOutput.name}
                onChange={(e) => setCurrentOutput({...currentOutput, name: e.target.value})}
                placeholder="e.g., result, status"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Data Type *</label>
              <select
                value={currentOutput.data_type}
                onChange={(e) => setCurrentOutput({...currentOutput, data_type: e.target.value})}
                style={styles.input}
              >
                <option value="int">Integer</option>
                <option value="float">Float</option>
                <option value="string">String</option>
                <option value="boolean">Boolean</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Unit</label>
              <input
                type="text"
                value={currentOutput.unit}
                onChange={(e) => setCurrentOutput({...currentOutput, unit: e.target.value})}
                placeholder="e.g., meters, seconds"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Possible Values (comma-separated)</label>
              <input
                type="text"
                value={currentOutput.possible_values}
                onChange={(e) => setCurrentOutput({...currentOutput, possible_values: e.target.value})}
                placeholder="e.g., SUCCESS, FAILURE, PENDING"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={currentOutput.description}
              onChange={(e) => setCurrentOutput({...currentOutput, description: e.target.value})}
              placeholder="Brief description of this output..."
              style={{...styles.input, ...styles.textarea}}
              rows={2}
            />
          </div>

          <button onClick={addOutput} style={styles.addButton}>
            + Add Output
          </button>
        </div>

        <div style={styles.outputsList}>
          <h3 style={styles.sectionTitle}>Defined Outputs ({outputs.length})</h3>
          {outputs.length === 0 ? (
            <p style={styles.emptyMessage}>No outputs defined yet</p>
          ) : (
            outputs.map((output, index) => (
              <div key={index} style={styles.outputCard}>
                <div style={styles.outputHeader}>
                  <span style={styles.outputName}>{output.name}</span>
                  <button onClick={() => removeOutput(index)} style={styles.removeButton}>
                    ✕
                  </button>
                </div>
                <div style={styles.outputDetails}>
                  <span style={styles.badge}>{output.data_type}</span>
                  {output.unit && <span style={styles.detail}>Unit: {output.unit}</span>}
                  {output.possible_values && (
                    <span style={styles.detail}>Values: {output.possible_values.join(', ')}</span>
                  )}
                </div>
                {output.description && (
                  <p style={styles.outputDescription}>{output.description}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.navigation}>
        <button onClick={onBack} style={styles.backButton}>
          ← Back
        </button>
        <button onClick={handleNext} style={styles.nextButton}>
          Generate Interpretation →
        </button>
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
    marginBottom: '10px',
    color: '#64ffda'
  },
  subtitle: {
    fontSize: '16px',
    color: '#8892b0',
    marginBottom: '30px',
    fontFamily: "'JetBrains Mono', monospace"
  },
  outputsPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  addOutputSection: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554'
  },
  outputsList: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554',
    maxHeight: '600px',
    overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: '20px',
    color: '#e6f1ff',
    marginBottom: '20px',
    fontFamily: "'JetBrains Mono', monospace"
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '15px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#e6f1ff',
    fontFamily: "'JetBrains Mono', monospace"
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    background: '#0a192f',
    border: '2px solid #233554',
    borderRadius: '6px',
    color: '#e6f1ff',
    fontSize: '14px',
    fontFamily: "'Crimson Pro', serif"
  },
  textarea: {
    resize: 'vertical'
  },
  addButton: {
    width: '100%',
    padding: '12px',
    background: '#1d3557',
    border: '2px solid #64ffda',
    borderRadius: '6px',
    color: '#64ffda',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer'
  },
  outputCard: {
    background: '#0a192f',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #233554'
  },
  outputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  outputName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace"
  },
  removeButton: {
    background: 'transparent',
    border: 'none',
    color: '#ff5370',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px 10px'
  },
  outputDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px'
  },
  badge: {
    padding: '4px 12px',
    background: '#1d3557',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  detail: {
    fontSize: '12px',
    color: '#8892b0',
    fontFamily: "'JetBrains Mono', monospace"
  },
  outputDescription: {
    fontSize: '13px',
    color: '#8892b0',
    lineHeight: '1.5'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#8892b0',
    padding: '40px',
    fontFamily: "'JetBrains Mono', monospace"
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

export default OutputDefinition;
