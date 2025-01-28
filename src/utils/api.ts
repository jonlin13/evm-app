import { CompanyInputs, CalculationResults } from '../types/calculator';
import Airtable from 'airtable';

interface UserData {
  name: string;
  email: string;
  organization: string;
}

interface SubmitResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export async function submitResults(
  inputs: CompanyInputs,
  results: CalculationResults,
  userData: UserData,
  retryCount = 0
): Promise<SubmitResponse> {
  try {
    const apiKey = import.meta.env.VITE_AIRTABLE_API_KEY?.trim();
    const baseId = import.meta.env.VITE_AIRTABLE_BASE_ID?.trim();

    // Early check for demo mode
    if (!apiKey || !baseId || apiKey === 'undefined' || baseId === 'undefined' || apiKey.startsWith('pat')) {
      return {
        success: false,
        error: 'Demo mode: Report generation only. Email delivery is not available in demo mode.'
      };
    }

    // Initialize Airtable with retry mechanism
    if (retryCount >= 3) {
      console.warn('Max retry attempts reached for Airtable submission');
      return {
        success: false,
        error: 'Unable to connect to the server. Your report has been generated but email delivery is unavailable.'
      };
    }

    const base = new Airtable({ apiKey }).base(baseId);

    const record = await base('ROI Calculator Results').create([
      {
        fields: {
          // Company Information
          'Number of Stores': inputs.numberOfStores,
          'Associates per Store': inputs.associatesPerStore,
          'Current Retention Rate': inputs.currentRetentionRate * 100,
          'Average Transaction Value': Number(inputs.averageTransactionValue) || 0,
          'Customer Satisfaction Score': Number(inputs.customerSatisfactionScore) || 0,
          // Cost Savings Results
          'Annual Hiring Needs': results.totalNewAssociates,
          'Current Recruiting Costs': results.totalNewAssociates * inputs.recruitingCostPerHire,
          'Projected Savings': results.totalSavings,
          // Revenue Impact (if available)
          'Customer Experience Impact': Number(results.revenueImpact?.customerExperience) || 0,
          'Team Expertise Value': Number(results.revenueImpact?.teamExpertise) || 0,
          'Customer Loyalty Benefit': Number(results.revenueImpact?.customerLoyalty) || 0,
          // User Information
          'Name': userData.name,
          'Email': userData.email,
          'Organization': userData.organization,
          'Submission Date': new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        }
      }
    ]);

    return { success: true, id: record[0].id };
  } catch (error: unknown) {
    console.error('Error submitting results:', error);

    // Handle rate limiting
    if (error instanceof Error && error.message.includes('429')) {
      if (retryCount < 3) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return submitResults(inputs, results, userData, retryCount + 1);
      }
    }
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('NOT_AUTHORIZED') ||
          error.message.includes('403') || 
          error.message.includes('invalid_api_key') ||
          error.message.includes('INVALID_API_KEY')) {
        return {
          success: false,
          error: 'Demo mode: Report generation only. Email delivery is not available in demo mode.'
        };
      }
      
      // Network errors
      if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
        return {
          success: false,
          error: 'Unable to connect to the server. Your report has been generated but email delivery is unavailable.'
        };
      }
      
      return { 
        success: false, 
        error: 'There was an error sending the email, but your report has been generated successfully.'
      };
    }
    
    return { 
      success: false, 
      error: 'An unexpected error occurred, but your report has been generated successfully.'
    };
  }
}