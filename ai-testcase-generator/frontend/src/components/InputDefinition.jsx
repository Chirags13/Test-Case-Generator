import React, { useState } from 'react';

const InputDefinition = ({ inputs, setInputs, onNext, onBack }) => {
  const [currentInput, setCurrentInput] = useState({
    name: '',
    data_type: 'int',
    unit: '',
    range_min: '',
    range_max: '',
    allowed_values: '',
    description: ''
  });

  const addInput = () => {
    if (!currentInput.name || !currentInput.data_type) {
      alert('Please provide at least input name and data type');
      return;
    }

    const newInput = {
      ...currentInput,
      range_min: currentInput.range_min ? parseFloat(currentInput.range_min) : null,
      range_max: currentInput.range_max ? parseFloat(currentInput.range_max) : null,
      allowed_values: currentInput.allowed_values 
        ? currentInput.allowed_values.split(',').map(v => v.trim()).filter(v => v)
        : null
    };

    setInputs([...inputs, newInput]);
    setCurrentInput({
      name: '',
      data_type: 'int',
      unit: '',
      range_min: '',
      range_max: '',
      allowed_values: '',
      description: ''
    });
  };

  const removeInput = (index) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (inputs.length === 0) {
      alert('Please add at least one input');
      return;
    }
    onNext();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Input Definitions</h2>
      <p style={styles.subtitle}>Define all input parameters for your requirement</p>

      <div style={styles.inputsPanel}>
        <div style={styles.addInputSection}>
          <h3 style={styles.sectionTitle}>Add Input Parameter</h3>
          
          <div style={styles.grid}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Name *</label>
              <input
                type="text"
                value={currentInput.name}
                onChange={(e) => setCurrentInput({...currentInput, name: e.target.value})}
                placeholder="e.g., altitude"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Data Type *</label>
              <select
                value={currentInput.data_type}
                onChange={(e) => setCurrentInput({...currentInput, data_type: e.target.value})}
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
                value={currentInput.unit}
                onChange={(e) => setCurrentInput({...currentInput, unit: e.target.value})}
                placeholder="e.g., meters, kg"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Min Value</label>
              <input
                type="number"
                value={currentInput.range_min}
                onChange={(e) => setCurrentInput({...currentInput, range_min: e.target.value})}
                placeholder="Optional - will be inferred"
                style={styles.input}
              />
              <div style={styles.hint}>Leave empty to auto-infer from context</div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Max Value</label>
              <input
                type="number"
                value={currentInput.range_max}
                onChange={(e) => setCurrentInput({...currentInput, range_max: e.target.value})}
                placeholder="Optional - will be inferred"
                style={styles.input}
              />
              <div style={styles.hint}>Leave empty to auto-infer from context</div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Allowed Values (comma-separated)</label>
              <input
                type="text"
                value={currentInput.allowed_values}
                onChange={(e) => setCurrentInput({...currentInput, allowed_values: e.target.value})}
                placeholder="e.g., ON, OFF, IDLE"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={currentInput.description}
              onChange={(e) => setCurrentInput({...currentInput, description: e.target.value})}
              placeholder="Brief description of this input..."
              style={{...styles.input, ...styles.textarea}}
              rows={2}
            />
          </div>

          <button onClick={addInput} style={styles.addButton}>
            + Add Input
          </button>
        </div>

        <div style={styles.inputsList}>
          <h3 style={styles.sectionTitle}>Defined Inputs ({inputs.length})</h3>
          {inputs.length === 0 ? (
            <p style={styles.emptyMessage}>No inputs defined yet</p>
          ) : (
            inputs.map((input, index) => (
              <div key={index} style={styles.inputCard}>
                <div style={styles.inputHeader}>
                  <span style={styles.inputName}>{input.name}</span>
                  <button onClick={() => removeInput(index)} style={styles.removeButton}>
                    ✕
                  </button>
                </div>
                <div style={styles.inputDetails}>
                  <span style={styles.badge}>{input.data_type}</span>
                  {input.unit && <span style={styles.detail}>Unit: {input.unit}</span>}
                  {input.range_min !== null && <span style={styles.detail}>Min: {input.range_min}</span>}
                  {input.range_max !== null && <span style={styles.detail}>Max: {input.range_max}</span>}
                  {input.allowed_values && (
                    <span style={styles.detail}>Values: {input.allowed_values.join(', ')}</span>
                  )}
                </div>
                {input.description && (
                  <p style={styles.inputDescription}>{input.description}</p>
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
          Continue to Outputs →
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
  inputsPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    marginBottom: '30px'
  },
  addInputSection: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554'
  },
  inputsList: {
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
  hint: {
    marginTop: '4px',
    fontSize: '11px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontStyle: 'italic'
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
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  inputCard: {
    background: '#0a192f',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #233554'
  },
  inputHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  inputName: {
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
  inputDetails: {
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
  inputDescription: {
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
  }
};

export default InputDefinition;
