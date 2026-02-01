import React from 'react';
import { 
  exportTestCasesToExcel, 
  exportSelectedTestCases, 
  exportCoverageReport 
} from '../utils/excelExporter';

const ExportPanel = ({ 
  testCases, 
  selectedTestCases, 
  coverageReport, 
  traceabilityMatrix,
  requirementId 
}) => {
  const handleExportAll = () => {
    exportTestCasesToExcel(testCases, requirementId);
  };

  const handleExportSelected = () => {
    const selected = testCases.filter(tc => selectedTestCases.includes(tc.tc_id));
    exportSelectedTestCases(selected, requirementId);
  };

  const handleExportCoverage = () => {
    exportCoverageReport(coverageReport, traceabilityMatrix, requirementId);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Export & Reports</h2>
      
      <div style={styles.grid}>
        {/* Coverage Report Card */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>📊</div>
          <h3 style={styles.cardTitle}>Coverage Report</h3>
          <div style={styles.statsGrid}>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Rules Covered</span>
              <span style={styles.statValue}>
                {coverageReport.rules_covered}/{coverageReport.total_rules}
              </span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Coverage</span>
              <span style={styles.statValue}>{coverageReport.coverage_percentage}%</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Total Tests</span>
              <span style={styles.statValue}>{coverageReport.total_test_count}</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Valid Tests</span>
              <span style={styles.statValueGreen}>{coverageReport.valid_test_count}</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Invalid Tests</span>
              <span style={styles.statValueOrange}>{coverageReport.invalid_test_count}</span>
            </div>
            <div style={styles.stat}>
              <span style={styles.statLabel}>Techniques</span>
              <span style={styles.statValue}>{coverageReport.techniques_used.length}</span>
            </div>
          </div>
          <div style={styles.techniquesSection}>
            <h4 style={styles.techniquesTitle}>Techniques Used:</h4>
            <div style={styles.techniquesGrid}>
              {coverageReport.techniques_used.map((tech, index) => (
                <span key={index} style={styles.techniqueBadge}>{tech}</span>
              ))}
            </div>
          </div>
          <button onClick={handleExportCoverage} style={styles.exportButton}>
            📥 Export Coverage Report
          </button>
        </div>

        {/* Test Cases Export Card */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>📋</div>
          <h3 style={styles.cardTitle}>Test Cases Export</h3>
          <p style={styles.cardDescription}>
            Download test cases in Excel format. Each requirement gets its own sheet with complete traceability.
          </p>
          <div style={styles.exportStats}>
            <div style={styles.exportStat}>
              <span style={styles.exportStatNumber}>{testCases.length}</span>
              <span style={styles.exportStatLabel}>Total Test Cases</span>
            </div>
            <div style={styles.exportStat}>
              <span style={styles.exportStatNumber}>{selectedTestCases.length}</span>
              <span style={styles.exportStatLabel}>Selected</span>
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <button 
              onClick={handleExportAll} 
              style={styles.exportButton}
              disabled={testCases.length === 0}
            >
              📥 Export All Test Cases
            </button>
            <button 
              onClick={handleExportSelected} 
              style={styles.exportButtonSecondary}
              disabled={selectedTestCases.length === 0}
            >
              📥 Export Selected ({selectedTestCases.length})
            </button>
          </div>
        </div>

        {/* Traceability Matrix Card */}
        <div style={styles.card}>
          <div style={styles.cardIcon}>🔗</div>
          <h3 style={styles.cardTitle}>Traceability Matrix</h3>
          <p style={styles.cardDescription}>
            Complete mapping from requirements to rules to test cases for certification compliance.
          </p>
          <div style={styles.traceabilityPreview}>
            {Object.entries(traceabilityMatrix.rule_coverage).map(([ruleId, tcIds]) => (
              <div key={ruleId} style={styles.traceRow}>
                <span style={styles.traceRuleId}>{ruleId}</span>
                <span style={styles.traceArrow}>→</span>
                <span style={styles.traceTcCount}>{tcIds.length} test cases</span>
              </div>
            ))}
          </div>
          <p style={styles.traceNote}>
            Included in coverage report export
          </p>
        </div>
      </div>

      <div style={styles.jsonSection}>
        <h3 style={styles.jsonTitle}>Raw JSON Export</h3>
        <p style={styles.jsonDescription}>
          Copy the complete test generation data in JSON format for integration with other tools.
        </p>
        <button 
          onClick={() => {
            const data = {
              test_cases: testCases,
              coverage_report: coverageReport,
              traceability_matrix: traceabilityMatrix
            };
            navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            alert('JSON copied to clipboard!');
          }}
          style={styles.copyButton}
        >
          📋 Copy JSON to Clipboard
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
    marginBottom: '30px',
    color: '#64ffda'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '25px',
    marginBottom: '30px'
  },
  card: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554'
  },
  cardIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  },
  cardTitle: {
    fontSize: '22px',
    color: '#e6f1ff',
    marginBottom: '15px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  cardDescription: {
    fontSize: '14px',
    color: '#8892b0',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '20px'
  },
  stat: {
    background: '#0a192f',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #233554'
  },
  statLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#8892b0',
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: '5px'
  },
  statValue: {
    display: 'block',
    fontSize: '24px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  statValueGreen: {
    display: 'block',
    fontSize: '24px',
    color: '#00ff9f',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  statValueOrange: {
    display: 'block',
    fontSize: '24px',
    color: '#ff6b35',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  techniquesSection: {
    marginBottom: '20px'
  },
  techniquesTitle: {
    fontSize: '14px',
    color: '#8892b0',
    marginBottom: '10px',
    fontFamily: "'JetBrains Mono', monospace"
  },
  techniquesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px'
  },
  techniqueBadge: {
    padding: '6px 12px',
    background: '#1d3557',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  exportStats: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px'
  },
  exportStat: {
    flex: 1,
    background: '#0a192f',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #233554',
    textAlign: 'center'
  },
  exportStatNumber: {
    display: 'block',
    fontSize: '32px',
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700',
    marginBottom: '5px'
  },
  exportStatLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#8892b0',
    fontFamily: "'JetBrains Mono', monospace"
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  exportButton: {
    width: '100%',
    padding: '14px',
    background: 'linear-gradient(135deg, #64ffda 0%, #ff6b35 100%)',
    border: 'none',
    borderRadius: '8px',
    color: '#0a192f',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px'
  },
  exportButtonSecondary: {
    width: '100%',
    padding: '14px',
    background: '#1d3557',
    border: '2px solid #64ffda',
    borderRadius: '8px',
    color: '#64ffda',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px'
  },
  traceabilityPreview: {
    background: '#0a192f',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #233554'
  },
  traceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    fontSize: '13px'
  },
  traceRuleId: {
    color: '#64ffda',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '600'
  },
  traceArrow: {
    color: '#8892b0'
  },
  traceTcCount: {
    color: '#e6f1ff',
    fontFamily: "'JetBrains Mono', monospace"
  },
  traceNote: {
    fontSize: '12px',
    color: '#8892b0',
    fontStyle: 'italic',
    fontFamily: "'JetBrains Mono', monospace"
  },
  jsonSection: {
    background: '#112240',
    padding: '30px',
    borderRadius: '12px',
    border: '1px solid #233554'
  },
  jsonTitle: {
    fontSize: '22px',
    color: '#e6f1ff',
    marginBottom: '10px',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: '700'
  },
  jsonDescription: {
    fontSize: '14px',
    color: '#8892b0',
    marginBottom: '20px',
    lineHeight: '1.6'
  },
  copyButton: {
    padding: '14px 30px',
    background: '#1d3557',
    border: '2px solid #64ffda',
    borderRadius: '8px',
    color: '#64ffda',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: "'JetBrains Mono', monospace",
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.5px'
  }
};

export default ExportPanel;
