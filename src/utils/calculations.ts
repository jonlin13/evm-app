import { CompanyInputs, CalculationResults } from '../types/calculator';

import { ConfidenceInterval, StatisticalMetrics, UserEstimations } from '../types/calculator';

export const validationRules = {
  numberOfStores: { min: 1, max: 10000 },
  annualGrowthRate: { min: 0, max: 1.0 },
  associatesPerStore: { min: 1, max: 100 },
  hoursPerWeek: { min: 1, max: 168 },
  hourlyWageCost: { min: 1, max: 1000 },
  currentRetentionRate: { min: 0, max: 1.0 },
  trainingWeeks: { min: 0, max: 52 },
  recruitingCostPerHire: { min: 0, max: 100000 },
  retentionImprovement: { min: 0, max: 1.0 },
  averageTransactionValue: { min: 0, max: 10000 },
  customerSatisfactionScore: { min: 0, max: 100 },
  customerLoyaltyRate: { min: 0, max: 1.0 },
  marketShare: { min: 0, max: 1.0 }
};

const defaultEstimations: UserEstimations = {
  tenureServiceImpact: 0.3,        // 30% service improvement from tenure
  serviceTransactionImpact: 0.15,  // 15% transaction value increase from better service
  serviceRepeatImpact: 0.25,       // 25% repeat visit increase from better service
  baseTransactionsPerDay: 100,     // Average daily transactions
  seasonalityFactor: 0.2,          // 20% seasonal variation
  competitorStrength: 0.5,         // Moderate competition
  marketGrowthRate: 0.03           // 3% annual market growth
};

/**
 * Service Impact Calculator
 * Calculates the impact of improved employee tenure on service quality and revenue
 * 
 * Example calculation:
 * - Starting CSAT: 75
 * - Tenure impact: 0.3 (30% improvement potential from tenure)
 * - Retention improvement: 0.15 (15% better retention)
 * 
 * Service improvement = 75 * (1 + (0.3 * 0.15)) = 78.375
 * This represents a 4.5% improvement in service quality
 */
export class ServiceImpactCalculator {
  static calculateServiceQualityImpact(
    currentCSAT: number,
    retentionImprovement: number,
    tenureServiceImpact: number,
    estimations: UserEstimations = defaultEstimations
  ) {
    // Calculate service improvement based on tenure impact
    const serviceImprovement = retentionImprovement * (tenureServiceImpact || estimations.tenureServiceImpact);
    const projectedScore = Math.min(100, currentCSAT * (1 + serviceImprovement));
    
    return {
      current: currentCSAT,
      projected: projectedScore,
      improvement: ((projectedScore - currentCSAT) / currentCSAT) * 100
    };
  }

  static calculateTransactionImpact(
    averageTransactionValue: number,
    serviceImprovement: number,
    serviceTransactionImpact: number,
    estimations: UserEstimations = defaultEstimations
  ) {
    // Calculate transaction value increase based on service improvement
    const valueIncrease = serviceImprovement * (serviceTransactionImpact || estimations.serviceTransactionImpact);
    const projectedValue = averageTransactionValue * (1 + valueIncrease);
    const annualTransactions = estimations.baseTransactionsPerDay * 365 * 
      (1 + estimations.seasonalityFactor);
    
    return {
      averageValue: averageTransactionValue,
      projectedValue,
      annualIncrease: (projectedValue - averageTransactionValue) * annualTransactions
    };
  }
}

/**
 * Advanced Statistical Models for Revenue Impact Analysis
 */
export class AdvancedStatisticalModels {
  private static readonly INDUSTRY_BENCHMARKS = {
    MIN_TENURE_IMPACT: 0.2,
    MAX_TENURE_IMPACT: 0.8,
    SERVICE_ELASTICITY: 0.4,
    CONFIDENCE_LEVEL: 0.95,
  };

  static calculateConfidenceIntervals(
    estimate: number,
    sampleSize: number,
    varianceCoefficient: number = 0.2
  ): ConfidenceInterval {
    const standardError = estimate * varianceCoefficient / Math.sqrt(sampleSize);
    const zScore = 1.96; // 95% confidence level

    return {
      lower: Math.max(0, estimate - zScore * standardError),
      upper: Math.min(1, estimate + zScore * standardError),
      mean: estimate
    };
  }

  static simulateRevenueImpact(
    inputs: CompanyInputs,
    estimations: UserEstimations = defaultEstimations,
    iterations: number = 10000
  ): ConfidenceInterval {
    const results: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      // Generate random variations
      const tenureImpact = this.generateRandomVariation(
        estimations.tenureServiceImpact,
        0.1
      );
      
      const serviceImpact = this.generateRandomVariation(
        estimations.serviceTransactionImpact,
        0.1
      );

      // Calculate impact for this iteration
      const serviceImprovement = tenureImpact * inputs.retentionImprovement;
      const transactionImpact = serviceImprovement * serviceImpact;
      const revenueImpact = transactionImpact * 
        inputs.averageTransactionValue * 
        estimations.baseTransactionsPerDay * 365 * 
        inputs.numberOfStores;
      
      results.push(revenueImpact);
    }

    results.sort((a, b) => a - b);
    return {
      lower: results[Math.floor(iterations * 0.025)],
      upper: results[Math.floor(iterations * 0.975)],
      mean: results.reduce((a, b) => a + b) / iterations
    };
  }

  static validateEstimates(estimates: UserEstimations): {
    isValid: boolean;
    warnings: string[];
    adjustedEstimates?: Partial<UserEstimations>;
  } {
    const warnings: string[] = [];
    const adjustedEstimates: Partial<UserEstimations> = {};

    if (estimates.tenureServiceImpact < this.INDUSTRY_BENCHMARKS.MIN_TENURE_IMPACT) {
      warnings.push('Tenure impact estimate appears conservative based on industry data');
      adjustedEstimates.tenureServiceImpact = this.INDUSTRY_BENCHMARKS.MIN_TENURE_IMPACT;
    }

    if (estimates.tenureServiceImpact > this.INDUSTRY_BENCHMARKS.MAX_TENURE_IMPACT) {
      warnings.push('Tenure impact estimate appears aggressive based on industry data');
      adjustedEstimates.tenureServiceImpact = this.INDUSTRY_BENCHMARKS.MAX_TENURE_IMPACT;
    }

    const impliedElasticity = estimates.serviceTransactionImpact / 
                             this.INDUSTRY_BENCHMARKS.SERVICE_ELASTICITY;
    if (impliedElasticity > 2) {
      warnings.push('Service impact on transaction value may be overestimated');
      adjustedEstimates.serviceTransactionImpact = this.INDUSTRY_BENCHMARKS.SERVICE_ELASTICITY * 2;
    }

    return {
      isValid: warnings.length === 0,
      warnings,
      adjustedEstimates: Object.keys(adjustedEstimates).length > 0 ? adjustedEstimates : undefined
    };
  }

  private static generateRandomVariation(
    baseValue: number,
    maxVariation: number
  ): number {
    const variation = (Math.random() - 0.5) * 2 * maxVariation;
    return Math.max(0, Math.min(1, baseValue * (1 + variation)));
  }
}

export class CalculationEngine {
  static calculateCostSavings(inputs: CompanyInputs): CalculationResults {
    // Calculate Talent Summary
    const totalStoreManagers = inputs.numberOfStores;
    const totalStoreAssociates = inputs.numberOfStores * inputs.associatesPerStore;
    const newManagersNeeded = inputs.numberOfStores * inputs.annualGrowthRate;
    const newAssociatesGrowth = inputs.associatesPerStore * (inputs.numberOfStores * inputs.annualGrowthRate);
    const newAssociatesAttrition = totalStoreAssociates * (1 - inputs.currentRetentionRate);
    const totalNewAssociates = newAssociatesGrowth + newAssociatesAttrition;

    // Calculate Financial Impact
    const improvedRetentionRate = inputs.currentRetentionRate + inputs.retentionImprovement;
    const newAttritionHires = totalStoreAssociates * (1 - improvedRetentionRate);
    const reducedHiringNeeds = newAssociatesAttrition - newAttritionHires;
    
    // Calculate Total Savings
    const recruitingSavings = reducedHiringNeeds * inputs.recruitingCostPerHire;
    const trainingCostSavings = reducedHiringNeeds * inputs.hourlyWageCost * 
                               inputs.hoursPerWeek * inputs.trainingWeeks;
    const totalSavings = recruitingSavings + trainingCostSavings;

    return {
      totalStoreManagers,
      totalStoreAssociates,
      newManagersNeeded,
      newAssociatesGrowth,
      newAssociatesAttrition,
      totalNewAssociates,
      improvedRetentionRate,
      newAttritionHires,
      reducedHiringNeeds,
      totalSavings
    };
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  static formatPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }

  static calculateRevenueImpact(inputs: CompanyInputs): CalculationResults {
    const baseCostSavings = this.calculateCostSavings(inputs);
    const totalAssociates = inputs.numberOfStores * inputs.associatesPerStore;
    const estimations = defaultEstimations;
    
    // Calculate service quality impact
    const serviceQuality = ServiceImpactCalculator.calculateServiceQualityImpact(
      inputs.customerSatisfactionScore || 0,
      inputs.retentionImprovement,
      inputs.tenureServiceImpact,
      estimations
    );

    // Calculate transaction value impact
    const transactionMetrics = ServiceImpactCalculator.calculateTransactionImpact(
      inputs.averageTransactionValue || 0,
      serviceQuality.improvement / 100,
      inputs.serviceTransactionImpact,
      estimations
    );

    // Calculate repeat customer impact
    const repeatCustomers = RepeatCustomerCalculator.calculateImpact(
      inputs.averageTransactionValue || 0,
      estimations.baseTransactionsPerDay,
      inputs.customerLoyaltyRate || 0,
      inputs.retentionImprovement
    );

    // Calculate total revenue impacts
    const customerExperience = transactionMetrics.annualIncrease * inputs.numberOfStores;
    const teamExpertise = totalAssociates * transactionMetrics.projectedValue * 0.03;
    const customerLoyalty = repeatCustomers.revenueImpact * inputs.numberOfStores;
    
    // Calculate statistical metrics
    const statistics: StatisticalMetrics = {
      revenueImpact: AdvancedStatisticalModels.simulateRevenueImpact(inputs, estimations),
      serviceQuality: AdvancedStatisticalModels.calculateConfidenceIntervals(
        serviceQuality.improvement,
        inputs.numberOfStores * inputs.associatesPerStore
      ),
      customerRetention: AdvancedStatisticalModels.calculateConfidenceIntervals(
        inputs.retentionImprovement,
        inputs.numberOfStores
      ),
      sensitivityAnalysis: {
        tenureImpact: {},
        serviceImpact: {}
      },
      validationResults: AdvancedStatisticalModels.validateEstimates(estimations)
    };

    return {
      ...baseCostSavings,
      revenueImpact: {
        customerExperience,
        teamExpertise,
        customerLoyalty,
        statistics,
        serviceQuality,
        transactionMetrics,
        repeatCustomers
      },
    };
  }
}

export class RevenueCalculator {
  static calculateServiceQualityImpact(
    currentCSAT: number,
    tenureServiceImpact: number,
    retentionImprovement: number
  ) {
    const serviceImprovement = retentionImprovement * tenureServiceImpact;
    return {
      currentServiceScore: currentCSAT,
      projectedServiceScore: Math.min(100, currentCSAT * (1 + serviceImprovement)),
      serviceImprovement: serviceImprovement * 100
    };
  }

  static calculateTransactionImpact(
    averageTransactionValue: number,
    transactionsPerDay: number,
    serviceImprovement: number,
    serviceTransactionImpact: number
  ) {
    const transactionIncrease = serviceImprovement * serviceTransactionImpact;
    const projectedValue = averageTransactionValue * (1 + transactionIncrease);
    
    return {
      currentValue: averageTransactionValue,
      projectedValue,
      valueIncrease: projectedValue - averageTransactionValue,
      annualImpact: (projectedValue - averageTransactionValue) * transactionsPerDay * 365
    };
  }

  static calculateLoyaltyImpact(
    averageTransactionValue: number,
    transactionsPerDay: number,
    serviceImprovement: number,
    repeatCustomerRate: number,
    serviceRepeatImpact: number
  ) {
    const repeatIncrease = serviceImprovement * serviceRepeatImpact;
    const baselineTransactions = transactionsPerDay * 365;
    const additionalVisits = baselineTransactions * repeatIncrease;
    
    return {
      currentRepeatRate: repeatCustomerRate,
      projectedRepeatRate: Math.min(1, repeatCustomerRate * (1 + repeatIncrease)),
      additionalVisits,
      revenueImpact: additionalVisits * averageTransactionValue
    };
  }
}

interface RepeatCustomerMetrics {
  currentRepeatRate: number;
  projectedRepeatRate: number;
  additionalVisits: number;
  revenueImpact: number;
}

export class RepeatCustomerCalculator {
  /**
   * Calculates the impact of improved retention on repeat customer revenue
   * @param averageTransactionValue Average purchase amount per transaction
   * @param transactionsPerDay Number of daily transactions
   * @param currentRepeatRate Current percentage of customers who return (0-1)
   * @param retentionImprovement Expected improvement in retention rate (0-1)
   * @returns RepeatCustomerMetrics object with calculated impacts
   */
  static calculateImpact(
    averageTransactionValue: number,
    transactionsPerDay: number,
    currentRepeatRate: number,
    retentionImprovement: number
  ): RepeatCustomerMetrics {
    const repeatIncrease = retentionImprovement * 0.5; // 50% of retention improvement affects repeat rate
    const baselineTransactions = transactionsPerDay * 365;
    const additionalVisits = baselineTransactions * repeatIncrease;
    
    return {
      currentRepeatRate,
      projectedRepeatRate: Math.min(1, currentRepeatRate * (1 + repeatIncrease)),
      additionalVisits,
      revenueImpact: additionalVisits * averageTransactionValue
    };
  }

  /**
   * Provides a user-friendly explanation of the repeat customer metric
   * @returns string explaining the metric with an example
   */
  static getMetricExplanation(): string {
    return `The percentage of repeat customers measures how many customers return to make additional purchases. ` +
           `For example, if your business serves 1,000 customers and 300 of them make additional purchases, ` +
           `your repeat customer percentage would be 30%. This metric is a key indicator of customer satisfaction ` +
           `and business sustainability.`;
  }
}