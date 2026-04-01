import jsPDF from 'jspdf';

export function downloadReportPdf(report) {
  const doc = new jsPDF();
  const lines = [
    'AgriVision Crop Disease Report',
    '',
    `Report ID: ${report.id}`,
    `Crop: ${report.crop}`,
    `Disease: ${report.disease}`,
    `Severity: ${report.severity}`,
    `Confidence: ${report.confidence}%`,
    `Location: ${report.locationName}`,
    `Date: ${report.reportDate}`,
    '',
    'Summary:',
    report.summary,
    '',
    'Recommendations:',
    ...report.recommendations.map((item, index) => `${index + 1}. ${item}`),
  ];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AgriVision', 20, 20);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(lines, 20, 35);
  doc.save(`${report.id}.pdf`);
}

