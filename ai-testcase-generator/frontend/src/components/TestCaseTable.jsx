import React from 'react';

const TestCaseTable = ({ testCases, selectedTestCases, setSelectedTestCases }) => {
  const toggleTestCase = (tcId) => {
    if (selectedTestCases.includes(tcId)) {
      setSelectedTestCases(selectedTestCases.filter(id => id !== tcId));
    } else {
      setSelectedTestCases([...selectedTestCases, tcId]);
    }
  };

  const toggleAll = () => {
    if (selectedTestCases.length === testCases.length) {
      setSelectedTestCases([]);
    } else {
      setSelectedTestCases(testCases.map(tc => tc.tc_id));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Generated Test Cases ({testCases.length})</h2>
        <div style={styles.selectionInfo}>
          <span style={styles.selectionText}>
            {selectedTestCases.length} of {testCases.length} selected
          </span>
          <button onClick={toggleAll} style={styles.selectAllButton}>
            {selectedTestCases.length === testCases.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={{...styles.th, width: '50px'}}>
                <input
                  type="checkbox"
                  checked={selectedTestCases.length === testCases.length && testCases.length > 0}
                  onChange={toggleAll}
                  style={styles.checkbox}
                />
              </th>
              <th style={{...styles.th, width: '120px'}}>Test Case ID</th>
              <th style={{...styles.th, width: '80px'}}>Rule</th>
              <th style={{...styles.th, width: '180px'}}>Type</th>
              <th style={styles.th}>Scenario</th>
              <th style={{...styles.th, width: '100px'}}>Priority</th>
              <th style={{...styles.th, width: '100px'}}>Validity</th>
            </tr>
          </thead>
          <tbody>
            {testCases.map((tc, index) => (
              <React.Fragment key={tc.tc_id}>
                <tr
                  style={{
                    ...styles.row,
                    ...(index % 2 === 0 ? styles.rowEven : styles.rowOdd),
                    ...(selectedTestCases.includes(tc.tc_id) ? styles.rowSelected : {})
                  }}
                  onClick={() => toggleTestCase(tc.tc_id)}
                >
                  <td style={styles.td}>
                    <input
                      type="checkbox"
                      checked={selectedTestCases.includes(tc.tc_id)}
                      onChange={() => toggleTestCase(tc.tc_id)}
                      style={styles.checkbox}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td style={styles.td}>
                    <code style={styles.code}>{tc.tc_id}</code>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.badge}>{tc.rule_id}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.typeBadge}>{tc.test_type}</span>
                  </td>
                  <td style={styles.td}>{tc.scenario}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.priorityBadge,
                      ...(tc.priority === 'HIGH' ? styles.priorityHigh : {}),
                      ...(tc.priority === 'MEDIUM' ? styles.priorityMedium : {}),
                      ...(tc.priority === 'LOW' ? styles.priorityLow : {})
                    }}>
                      {tc.priority}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.validityBadge,
                      ...(tc.validity === 'VALID' ? styles.validityValid : styles.validityInvalid)
                    }}>
                      {tc.validity}
                    </span>
                  </td>
                </tr>
                <tr style={styles.detailsRow}>
                  <td colSpan="7" style={styles.detailsCell}>
                    <div style={styles.detailsContent}>
                      <div style={styles.detailBlock}>
                        <h4 style={styles.detailTitle}>Inputs:</h4>
                        <pre style={styles.detailCode}>{JSON.stringify(tc.inputs, null, 2)}</pre>
                      </div>
                      <div style={styles.detailBlock}>
                        <h4 style={styles.detailTitle}>Expected Output:</h4>
                        <pre style={styles.detailCode}>{JSON.stringify(tc.expected_output, null, 2)}</pre>
                      </div>
                      <div style={styles.detailBlock}>
                        <h4 style={styles.detailTitle}>Traceability:</h4>
                        <p style={styles.detailText}>
                          Requirement: <code style={styles.inlineCode}>{tc.traceability.requirement}</code>
                          {' → '}
                          Rule: <code style={styles.inlineCode}>{tc.traceability.rule}</code>
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554',
    marginBottom: '30px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px'
  },
  title: {
    fontSize: '24px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace"
  },
  selectionInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  selectionText: {
    color: '#8892b0',
    fontSize: '14px',
    fontFamily: "'JetBrains Mono', monospace"
  },
  selectAllButton: {
    padding: '8px 16px',
    background: '#1d3557',
    border: '2px solid #64ffda',
    borderRadius: '6px',
    color: '#64ffda',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  tableWrapper: {
    overflowX: 'auto',
    overflowY: 'auto',
    maxHeight: '600px',
    borderRadius: '8px',
    border: '1px solid #233554'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0
  },
  headerRow: {
    background: '#0a192f',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  th: {
    padding: '15px 12px',
    textAlign: 'left',
    color: '#64ffda',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '2px solid #233554'
  },
  row: {
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  },
  rowEven: {
    background: '#0d1b2a'
  },
  rowOdd: {
    background: '#0a192f'
  },
  rowSelected: {
    background: 'rgba(100, 255, 218, 0.1)',
    borderLeft: '3px solid #64ffda'
  },
  td: {
    padding: '12px',
    color: '#e6f1ff',
    fontSize: '14px',
    borderBottom: '1px solid #233554'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#64ffda'
  },
  code: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    color: '#64ffda',
    background: '#0a192f',
    padding: '4px 8px',
    borderRadius: '4px'
  },
  badge: {
    padding: '4px 10px',
    background: '#1d3557',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  typeBadge: {
    padding: '4px 10px',
    background: '#1d3557',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#e6f1ff',
    fontFamily: "'JetBrains Mono', monospace",
    display: 'inline-block',
    maxWidth: '170px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  priorityBadge: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  priorityHigh: {
    background: 'rgba(255, 83, 112, 0.2)',
    color: '#ff5370'
  },
  priorityMedium: {
    background: 'rgba(255, 203, 71, 0.2)',
    color: '#ffcb47'
  },
  priorityLow: {
    background: 'rgba(139, 146, 176, 0.2)',
    color: '#8892b0'
  },
  validityBadge: {
    padding: '4px 10px',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  validityValid: {
    background: 'rgba(0, 255, 159, 0.2)',
    color: '#00ff9f'
  },
  validityInvalid: {
    background: 'rgba(255, 107, 53, 0.2)',
    color: '#ff6b35'
  },
  detailsRow: {
    background: '#0a192f'
  },
  detailsCell: {
    padding: '20px',
    borderBottom: '2px solid #233554'
  },
  detailsContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '20px'
  },
  detailBlock: {},
  detailTitle: {
    fontSize: '13px',
    color: '#64ffda',
    marginBottom: '8px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  detailCode: {
    background: '#0d1b2a',
    padding: '12px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#e6f1ff',
    fontFamily: "'JetBrains Mono', monospace",
    overflow: 'auto',
    border: '1px solid #233554'
  },
  detailText: {
    fontSize: '13px',
    color: '#e6f1ff',
    fontFamily: "'Crimson Pro', serif"
  },
  inlineCode: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#64ffda',
    background: '#0d1b2a',
    padding: '2px 6px',
    borderRadius: '3px'
  }
};

export default TestCaseTable;
