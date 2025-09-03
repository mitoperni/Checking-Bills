export function parseDate(dateStr) {
  return new Date(dateStr);
}

export function getDaysDifference(startDate, endDate) {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
}

export function getOverlapDays(period1, period2) {
  const start1 = parseDate(period1.start);
  const end1 = parseDate(period1.end);
  const start2 = parseDate(period2.start);
  const end2 = parseDate(period2.end);
  
  const overlapStart = new Date(Math.max(start1, start2));
  const overlapEnd = new Date(Math.min(end1, end2));
  
  if (overlapStart > overlapEnd) {
    return 0;
  }
  
  return getDaysDifference(overlapStart.toISOString().split('T')[0], overlapEnd.toISOString().split('T')[0]);
}

export function calculateResidentDays(residents, housePeriod) {
  const residentDays = {};
  
  for (const [name, period] of Object.entries(residents)) {
    residentDays[name] = getOverlapDays(period, housePeriod);
  }
  
  return residentDays;
}

export function generateCSV(billTotals, individualAmounts) {
  let csv = 'Persona,Total a Pagar,Días en Casa,Porcentaje,Gas,Electricidad,Basuras,Internet\n';
  
  Object.entries(individualAmounts).forEach(([person, data]) => {
    csv += `${person},€${data.total.toFixed(2)},${data.days},${(data.proportion * 100).toFixed(1)}%,€${data.billTypes.gas.total.toFixed(2)},€${data.billTypes.electricidad.total.toFixed(2)},€${data.billTypes.basuras.total.toFixed(2)},€${data.billTypes.internet.total.toFixed(2)}\n`;
  });
  
  csv += '\n';
  csv += 'TOTALES POR TIPO DE FACTURA\n';
  csv += 'Tipo,Total Acumulado\n';
  
  Object.entries(billTotals).forEach(([type, total]) => {
    csv += `${type},€${total.toFixed(2)}\n`;
  });
  
  const grandTotal = Object.values(billTotals).reduce((sum, amount) => sum + amount, 0);
  csv += `\nGRAN TOTAL,€${grandTotal.toFixed(2)}\n`;
  
  return csv;
}

export function downloadCSV(csvContent, filename = 'facturas_resultado.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}