import React from 'react';

const RequirementForm = ({ formData, onChange, onNext }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.requirement_id && formData.requirement_text && formData.gemini_api_key) {
      onNext();
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Requirement Specification</h2>
      <p style={styles.subtitle}>Define your software requirement for test case generation</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Requirement ID <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.requirement_id}
            onChange={(e) => onChange('requirement_id', e.target.value)}
            placeholder="e.g., REQ-001"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Requirement Text <span style={styles.required}>*</span>
          </label>
          <textarea
            value={formData.requirement_text}
            onChange={(e) => onChange('requirement_text', e.target.value)}
            placeholder="Enter the complete requirement specification..."
            style={{...styles.input, ...styles.textarea}}
            rows={8}
            required
          />
          <div style={styles.hint}>
            Be specific and include all constraints, conditions, and expected behaviors
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Gemini API Key <span style={styles.required}>*</span>
          </label>
          <input
            type="password"
            value={formData.gemini_api_key}
            onChange={(e) => onChange('gemini_api_key', e.target.value)}
            placeholder="Enter your Gemini API key"
            style={styles.input}
            required
          />
          <div style={styles.hint}>
            Get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={styles.link}>Google AI Studio</a>
          </div>
        </div>

        <button type="submit" style={styles.button}>
          Continue to Inputs →
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#64ffda',
    fontFamily: "'Crimson Pro', serif"
  },
  subtitle: {
    fontSize: '16px',
    color: '#8892b0',
    marginBottom: '30px',
    fontFamily: "'JetBrains Mono', monospace"
  },
  form: {
    background: '#112240',
    padding: '40px',
    borderRadius: '12px',
    border: '1px solid #233554',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#e6f1ff',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.5px'
  },
  required: {
    color: '#ff6b35'
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    background: '#0a192f',
    border: '2px solid #233554',
    borderRadius: '8px',
    color: '#e6f1ff',
    fontSize: '15px',
    fontFamily: "'Crimson Pro', serif",
    transition: 'all 0.3s ease',
    outline: 'none'
  },
  textarea: {
    resize: 'vertical',
    fontFamily: "'Crimson Pro', serif",
    lineHeight: '1.6'
  },
  hint: {
    marginTop: '8px',
    fontSize: '13px',
    color: '#8892b0',
    fontFamily: "'JetBrains Mono', monospace"
  },
  link: {
    color: '#64ffda',
    textDecoration: 'none',
    borderBottom: '1px solid transparent',
    transition: 'border-color 0.3s ease'
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #64ffda 0%, #ff6b35 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a192f',
    fontSize: '16px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    marginTop: '15px',
    boxShadow: '0 4px 15px rgba(100, 255, 218, 0.3)'
  }
};

export default RequirementForm;
