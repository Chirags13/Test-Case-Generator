import * as XLSX from 'xlsx';

export const exportTestCasesToExcel = (testCases, requirementId, filename = null) => {
  if (!testCases || testCases.length === 0) {
    alert('No test cases to export');
    return;
  }

  // Group test cases by requirement ID
  const groupedByReq = testCases.reduce((acc, tc) => {
    const reqId = tc.traceability.requirement;
    if (!acc[reqId]) {
      acc[reqId] = [];
    }
    acc[reqId].push(tc);
    return acc;
  }, {});

  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Create a sheet for each requirement
  Object.keys(groupedByReq).forEach(reqId => {
    const cases = groupedByReq[reqId];
    
    // Prepare data for sheet
    const sheetData = cases.map(tc => ({
      'Test Case ID': tc.tc_id,
      'Rule ID': tc.rule_id,
      'Test Type': tc.test_type,
      'Scenario': tc.scenario,
      'Inputs': JSON.stringify(tc.inputs, null, 2),
      'Expected Output': JSON.stringify(tc.expected_output, null, 2),
      'Priority': tc.priority,
      'Validity': tc.validity,
      'Requirement': tc.traceability.requirement,
      'Rule': tc.traceability.rule
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(sheetData);

    // Set column widths
    const colWidths = [
      { wch: 15 },  // Test Case ID
      { wch: 10 },  // Rule ID
      { wch: 25 },  // Test Type
      { wch: 40 },  // Scenario
      { wch: 35 },  // Inputs
      { wch: 35 },  // Expected Output
      { wch: 10 },  // Priority
      { wch: 10 },  // Validity
      { wch: 15 },  // Requirement
      { wch: 10 }   // Rule
    ];
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook with requirement ID as sheet name
    const sheetName = reqId.substring(0, 31); // Excel sheet name limit
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  // Generate filename
  const finalFilename = filename || `test_cases_${requirementId}_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, finalFilename);
};

export const exportSelectedTestCases = (selectedTestCases, requirementId) => {
  if (selectedTestCases.length === 0) {
    alert('Please select test cases to export');
    return;
  }

  const filename = `selected_test_cases_${requirementId}_${new Date().toISOString().split('T')[0]}.xlsx`;
  exportTestCasesToExcel(selectedTestCases, requirementId, filename);
};

export const exportCoverageReport = (coverageReport, traceabilityMatrix, requirementId) => {
  const workbook = XLSX.utils.book_new();

  // Coverage Summary Sheet
  const coverageData = [
    ['Metric', 'Value'],
    ['Requirement ID', coverageReport.requirement_id],
    ['Total Rules', coverageReport.total_rules],
    ['Rules Covered', coverageReport.rules_covered],
    ['Coverage Percentage', `${coverageReport.coverage_percentage}%`],
    ['Total Test Cases', coverageReport.total_test_count],
    ['Valid Test Cases', coverageReport.valid_test_count],
    ['Invalid Test Cases', coverageReport.invalid_test_count],
    ['Techniques Used', coverageReport.techniques_used.join(', ')]
  ];

  const coverageSheet = XLSX.utils.aoa_to_sheet(coverageData);
  coverageSheet['!cols'] = [{ wch: 25 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(workbook, coverageSheet, 'Coverage Summary');

  // Traceability Matrix Sheet
  const traceData = [['Rule ID', 'Test Case IDs']];
  Object.entries(traceabilityMatrix.rule_coverage).forEach(([ruleId, tcIds]) => {
    traceData.push([ruleId, tcIds.join(', ')]);
  });

  const traceSheet = XLSX.utils.aoa_to_sheet(traceData);
  traceSheet['!cols'] = [{ wch: 15 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(workbook, traceSheet, 'Traceability');

  const filename = `coverage_report_${requirementId}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
};
