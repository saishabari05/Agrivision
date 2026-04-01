import jsPDF from 'jspdf';

export function downloadReportPdf(report) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const lineHeight = 5;
  let yPosition = 15;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(45, 105, 65); // moss green
  doc.text('CROP DISEASE INTELLIGENCE REPORT', pageWidth / 2, yPosition, { align: 'center' });
  
  yPosition += 8;
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('Powered by AgriVision AI | EfficientNetB3 + LLM Advisory', pageWidth / 2, yPosition, { align: 'center' });
  
  // Horizontal line
  yPosition += 5;
  doc.setDrawColor(180, 180, 180);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  
  yPosition += 8;

  // 1. Report Information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(45, 105, 65);
  doc.text('1. Report Information', margin, yPosition);
  yPosition += 7;

  const reportInfo = [
    [`Report ID:`, report.id || 'AUTO-GENERATED UUID'],
    [`Date & Time:`, formatDate(report.reportDate) || 'DD/MM/YYYY HH:MM'],
    [`Farm/Field:`, report.locationName || 'Farm Name / Plot ID'],
    [`Location (Geocoded):`, report.locationName || 'Village, District, State'],
    [`GPS Coordinates:`, report.coordinates ? `${report.coordinates[0]?.toFixed(4)}, ${report.coordinates[1]?.toFixed(4)}` : 'Lat, Long'],
    [`Image Source:`, 'Mobile Camera / Drone'],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  reportInfo.forEach(([label, value]) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    const wrappedValue = doc.splitTextToSize(value, pageWidth - margin * 2 - 50);
    doc.text(wrappedValue, margin + 50, yPosition);
    yPosition += wrappedValue.length > 1 ? wrappedValue.length * 4 : lineHeight;
  });

  yPosition += 3;

  // 2. AI Prediction Results
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(45, 105, 65);
  doc.text('2. AI Prediction Results', margin, yPosition);
  yPosition += 7;

  const predictions = [
    [`Crop Type:`, report.crop || 'Tomato / Apple / Grape'],
    [`Disease Detected:`, report.disease || 'Disease Name'],
    [`Confidence Score:`, `${report.confidence || 0}%`],
    [`Severity Level:`, report.severity || 'Mild / Moderate / Severe'],
    [`Health Score:`, `${report.healthScore || 0}%`],
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  predictions.forEach(([label, value]) => {
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = margin;
    }
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value), margin + 50, yPosition);
    yPosition += lineHeight;
  });

  yPosition += 3;

  // 3. Treatment Plan & Recommendations
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(45, 105, 65);
  doc.text('3. AI Treatment Plan & Recommendations', margin, yPosition);
  yPosition += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);

  const recommendationText = report.summary || report.recommendation || 'No recommendations available.';
  const wrappedRec = doc.splitTextToSize(recommendationText, pageWidth - margin * 2);
  doc.text(wrappedRec, margin, yPosition);
  yPosition += wrappedRec.length * 4 + 5;

  yPosition += 3;

  // 4. Weather Context
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = margin;
  }

  if (report.weather) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(45, 105, 65);
    doc.text('4. Weather & Conditions', margin, yPosition);
    yPosition += 6;

    const weatherInfo = [
      ['Temperature:', `${report.weather.temp || 'N/A'}°C`],
      ['Humidity:', `${report.weather.humidity || 'N/A'}%`],
      ['Rainfall (24h):', `${report.weather.rainfall || 'N/A'} mm`],
      ['Wind Speed:', `${report.weather.windSpeed || 'N/A'} km/h`],
    ];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    weatherInfo.forEach(([label, value]) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 45, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 3;
  }

  // 5. Immediate Actions
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(45, 105, 65);
  doc.text('5. Immediate Actions (Do Today)', margin, yPosition);
  yPosition += 6;

  const immediateActions = [
    '• Remove and destroy infected plant parts immediately',
    '• Isolate affected areas to prevent spread',
    '• Avoid overhead watering to reduce spore dispersal',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  immediateActions.forEach((action) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }
    const wrappedAction = doc.splitTextToSize(action, pageWidth - margin * 2);
    doc.text(wrappedAction, margin, yPosition);
    yPosition += wrappedAction.length * 4;
  });

  yPosition += 3;

  // 6. Preventive Measures
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(45, 105, 65);
  doc.text('6. Preventive Measures for Future', margin, yPosition);
  yPosition += 6;

  const preventiveMeasures = [
    '• Maintain proper plant spacing for air circulation',
    '• Rotate crops to break disease cycles',
    '• Remove crop residue promptly after harvest',
    '• Monitor crops weekly during high-risk seasons',
  ];

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  preventiveMeasures.forEach((measure) => {
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }
    const wrappedMeasure = doc.splitTextToSize(measure, pageWidth - margin * 2);
    doc.text(wrappedMeasure, margin, yPosition);
    yPosition += wrappedMeasure.length * 4;
  });

  // Footer
  const totalPages = doc.internal.getPages().length;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.text('Confidential — For Agronomist & Farmer Use Only', margin, pageHeight - 10);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  }

  // Save PDF
  doc.save(`${report.id || 'disease-report'}.pdf`);
}

function formatDate(dateString) {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  } catch {
    return dateString;
  }
}

