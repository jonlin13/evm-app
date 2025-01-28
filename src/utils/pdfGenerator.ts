import { jsPDF } from 'jspdf';
import { CompanyInputs, CalculationResults } from '../types/calculator';

interface UserData {
  name: string;
  organization: string;
  email: string;
}

export async function generatePDFReport(
  inputs: CompanyInputs,
  results: CalculationResults,
  userData: UserData
): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 20; // Track vertical position
  const margin = 20;
  const lineHeight = 7;

  // Helper function to add text and update position
  const addText = (text: string, size = 12, isBold = false, isTitle = false, color = [0, 0, 0]) => {
    doc.setFontSize(size);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(text, margin, currentY);
    currentY += lineHeight + (isTitle ? 5 : 0);
  };

  // Helper function to format numbers
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => (num * 100).toFixed(1) + '%';
  const formatCurrency = (num: number) => '$' + num.toLocaleString();

  // Title
  addText('ROI Analysis Report', 24, true, true);

  // Company Information
  addText(`Prepared for: ${userData.name}`);
  addText(`Organization: ${userData.organization}`);
  addText(`Date: ${new Date().toLocaleDateString()}`);
  currentY += 10;

  // Company Overview
  addText('Input Variables', 16, true, true);
  addText(`Number of Stores: ${formatNumber(inputs.numberOfStores)}`);
  addText(`Associates per Store: ${formatNumber(inputs.associatesPerStore)}`);
  addText(`Annual Growth Rate: ${formatPercent(inputs.annualGrowthRate)}`);
  addText(`Hours per Week: ${formatNumber(inputs.hoursPerWeek)}`);
  addText(`Hourly Wage Cost: ${formatCurrency(inputs.hourlyWageCost)}`);
  addText(`Current Retention Rate: ${formatPercent(inputs.currentRetentionRate)}`);
  addText(`Training Weeks: ${formatNumber(inputs.trainingWeeks)}`);
  addText(`Recruiting Cost per Hire: ${formatCurrency(inputs.recruitingCostPerHire)}`);
  addText(`Expected Retention Improvement: ${formatPercent(inputs.retentionImprovement)}`);
  currentY += 10;

  // Cost Savings
  addText('Cost Savings Calculations', 16, true, true);
  addText('Talent Summary:');
  addText(`• Total Store Managers: ${formatNumber(results.totalStoreManagers)}`);
  addText(`• Total Store Associates: ${formatNumber(results.totalStoreAssociates)}`);
  addText(`• New Managers Needed: ${formatNumber(results.newManagersNeeded)}`);
  addText(`• New Associates (Growth): ${formatNumber(results.newAssociatesGrowth)}`);
  addText(`• New Associates (Attrition): ${formatNumber(results.newAssociatesAttrition)}`);
  addText(`• Total New Associates Needed: ${formatNumber(results.totalNewAssociates)}`);
  currentY += 5;

  addText('Financial Impact:');
  addText(`• Improved Retention Rate: ${formatPercent(results.improvedRetentionRate)}`);
  addText(`• New Attrition Hires: ${formatNumber(results.newAttritionHires)}`);
  addText(`• Reduced Hiring Needs: ${formatNumber(results.reducedHiringNeeds)}`);
  addText(`• Total Annual Savings: ${formatCurrency(results.totalSavings)}`);
  currentY += 10;

  // Revenue Impact (if available)
  if (results.revenueImpact) {
    // Add new page if needed
    if (currentY > pageHeight - 100) {
      doc.addPage();
      currentY = 20;
    }

    addText('Revenue Impact Analysis', 16, true, true);
    
    addText('Service Quality Metrics:');
    addText(`• Current Service Score: ${formatNumber(results.revenueImpact.serviceQuality.current)}`);
    addText(`• Projected Service Score: ${formatNumber(results.revenueImpact.serviceQuality.projected)}`);
    addText(`• Service Improvement: ${formatPercent(results.revenueImpact.serviceQuality.improvement/100)}`);
    currentY += 5;

    addText('Transaction Impact:');
    addText(`• Current Transaction Value: ${formatCurrency(results.revenueImpact.transactionMetrics.averageValue)}`);
    addText(`• Projected Transaction Value: ${formatCurrency(results.revenueImpact.transactionMetrics.projectedValue)}`);
    addText(`• Annual Transaction Impact: ${formatCurrency(results.revenueImpact.transactionMetrics.annualIncrease)}`);
    currentY += 5;

    addText('Customer Loyalty Impact:');
    addText(`• Current Repeat Rate: ${formatPercent(results.revenueImpact.repeatCustomers.currentRepeatRate)}`);
    addText(`• Projected Repeat Rate: ${formatPercent(results.revenueImpact.repeatCustomers.projectedRepeatRate)}`);
    addText(`• Additional Annual Visits: ${formatNumber(results.revenueImpact.repeatCustomers.additionalVisits)}`);
    currentY += 5;

    addText('Total Revenue Impact:');
    addText(`• Customer Experience: ${formatCurrency(results.revenueImpact.customerExperience)}`);
    addText(`• Team Expertise: ${formatCurrency(results.revenueImpact.teamExpertise)}`);
    addText(`• Customer Loyalty: ${formatCurrency(results.revenueImpact.customerLoyalty)}`);

    if (results.revenueImpact.statistics) {
      currentY += 10;
      addText('Statistical Analysis:', 14, true);
      addText(`• Confidence Level: 95%`);
      addText(`• Revenue Impact Range:`);
      addText(`  - Lower Bound: ${formatCurrency(results.revenueImpact.statistics.revenueImpact.lower)}`);
      addText(`  - Upper Bound: ${formatCurrency(results.revenueImpact.statistics.revenueImpact.upper)}`);
    }
  }

  // Footer
  const footerY = pageHeight - 30;
  doc.setFontSize(10);
  doc.setTextColor(199, 210, 254); // text-indigo-200
  doc.setFont('helvetica', 'normal');
  
  // Add contact information
  doc.text('Learn more by visiting sigmasquared.io', margin, footerY);
  doc.text('Contact us at info@sigmasquared.io', margin, footerY + 7);
  
  // Add generator text centered at bottom
  doc.setPage(doc.getNumberOfPages());
  const generatorText = 'Generated by Sigma Squared ROI Calculator';
  const generatorWidth = doc.getStringUnitWidth(generatorText) * 10 / doc.internal.scaleFactor;
  doc.text(generatorText, (pageWidth - generatorWidth) / 2, pageHeight - 15);

  return doc.output('blob');
}