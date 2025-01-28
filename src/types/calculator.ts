export interface CompanyInputs {
  numberOfStores: number;
  annualGrowthRate: number;
  associatesPerStore: number;
  hoursPerWeek: number;
  hourlyWageCost: number;
  currentRetentionRate: number;
  trainingWeeks: number;
  recruitingCostPerHire: number;
  retentionImprovement: number;
  averageTransactionValue: number;
  customerSatisfactionScore: number;
  customerLoyaltyRate: number;
  marketShare: number;
  tenureServiceImpact: number;
  serviceTransactionImpact: number;
}

export interface UserEstimations {
  // Service quality impact weights (0-1)
  tenureServiceImpact: number;      // How much tenure affects service quality
  serviceTransactionImpact: number; // How service affects transaction value
  serviceRepeatImpact: number;      // How service affects repeat visits
  
  // Transaction value modifiers
  baseTransactionsPerDay: number;   // Average daily transactions per store
  seasonalityFactor: number;        // Seasonal variation in transactions (0-1)
  
  // Market factors
  competitorStrength: number;       // Local competition strength (0-1)
  marketGrowthRate: number;         // Annual market growth rate (0-1)
}

export interface ConfidenceInterval {
  lower: number;
  upper: number;
  mean: number;
}

export interface StatisticalMetrics {
  revenueImpact: ConfidenceInterval;
  serviceQuality: ConfidenceInterval;
  customerRetention: ConfidenceInterval;
  sensitivityAnalysis: {
    tenureImpact: Record<string, number>;
    serviceImpact: Record<string, number>;
  };
  validationResults: {
    isValid: boolean;
    warnings: string[];
    adjustedEstimates?: Partial<UserEstimations>;
  };
}

export interface CalculationResults {
  // Talent Summary
  totalStoreManagers: number;
  totalStoreAssociates: number;
  newManagersNeeded: number;
  newAssociatesGrowth: number;
  newAssociatesAttrition: number;
  totalNewAssociates: number;
  
  // Financial Impact
  improvedRetentionRate: number;
  newAttritionHires: number;
  reducedHiringNeeds: number;
  totalSavings: number;
  
  revenueImpact?: {
    customerExperience: number;
    teamExpertise: number;
    customerLoyalty: number;
    statistics: StatisticalMetrics;
    serviceQuality: {
      current: number;
      projected: number;
      improvement: number;
    };
    transactionMetrics: {
      averageValue: number;
      projectedValue: number;
      annualIncrease: number;
    };
    repeatCustomers: {
      currentRate: number;
      projectedRate: number;
      additionalVisits: number;
      revenueImpact: number;
    };
  }
}

export interface LeadCapture {
  email: string;
  companyName: string;
  role: string;
  calculationResults: CalculationResults;
  timestamp: Date;
}

export type ScreenState = {
  currentScreen: 'welcome' | 'costCalculator' | 'revenueCalculator' | 'results' | 'leadCapture';
  calculatorMode: 'cost' | 'revenue';
  calculationComplete: boolean;
}

export type NavigationProps = {
  onCalculatorStart: () => void;
  onSkipToRevenue: () => void;
  onBackToCalculator: () => void;
  onShowResults: () => void;
  onCaptureLeads: () => void;
}