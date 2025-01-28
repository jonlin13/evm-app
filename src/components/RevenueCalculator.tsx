import React, { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { DollarSign, TrendingUp, ChevronLeft, ArrowRight, BarChart3, Users, Target } from 'lucide-react';
import Disclaimer from './Disclaimer';
import RevenueVisualizations from './RevenueVisualizations';
import LoadingSpinner from './LoadingSpinner';

export default function RevenueCalculator() {
  const { state, dispatch } = useCalculator();
  const { inputs } = state;
  const [isCalculating, setIsCalculating] = useState(false);

  // Sync with Cost Calculator inputs when component mounts
  React.useEffect(() => {
    if (state.screen.calculatorMode === 'revenue') {
      dispatch({
        type: 'SET_INPUTS',
        payload: {
          numberOfStores: state.inputs.numberOfStores,
          associatesPerStore: state.inputs.associatesPerStore,
          annualGrowthRate: state.inputs.annualGrowthRate
        }
      });
    }
  }, [state.screen.calculatorMode, state.inputs.numberOfStores, state.inputs.associatesPerStore, state.inputs.annualGrowthRate, dispatch]);

  const [showVisualizations, setShowVisualizations] = React.useState(false);

  const handleInputChange = (field: string, value: number) => {
    if (isNaN(value)) return;
    dispatch({
      type: 'SET_INPUTS',
      payload: { [field]: value },
    });
    setShowVisualizations(true);
  };

  const handleBack = () => {
    dispatch({ type: 'SET_SCREEN', payload: { currentScreen: 'welcome' } });
  };

  const handleNext = () => {
    setIsCalculating(true);
    setTimeout(() => {
    dispatch({ 
      type: 'SET_SCREEN', 
      payload: { 
        currentScreen: 'results',
        calculatorMode: 'revenue'
      } 
    });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#312E81] text-white p-8">
      <button
        onClick={handleBack}
        className="flex items-center text-indigo-300 hover:text-indigo-200 transition-colors mb-8"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Calculate Revenue Impact
          <span className="block text-lg font-normal text-indigo-200 mt-2">See how improved retention affects your bottom line</span>
        </h1>

        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-indigo-400" size={24} />
              <h2 className="text-xl font-medium">Financial Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Average Transaction Value ($)
                </label>
                <input
                  type="number"
                  value={inputs.averageTransactionValue}
                  onChange={(e) => handleInputChange('averageTransactionValue', Number(e.target.value))}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Service Quality Score (0-100)
                </label>
                <input
                  type="number"
                  value={inputs.customerSatisfactionScore}
                  onChange={(e) => handleInputChange('customerSatisfactionScore', Number(e.target.value))}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Percentage of Repeat Customers (%)
                </label>
                <input
                  type="number"
                  value={Math.round(inputs.customerLoyaltyRate * 100)}
                  onChange={(e) => handleInputChange('customerLoyaltyRate', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="1"
                />
                <p className="mt-2 text-xs text-indigo-300/60">
                  The percentage of customers who make additional purchases. For example, if 30% means that out of 1,000 customers, 300 return for more purchases.
                </p>
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Market Share (%)
                </label>
                <input
                  type="number"
                  value={Math.round(inputs.marketShare * 100)}
                  onChange={(e) => handleInputChange('marketShare', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="1"
                />
                <p className="mt-2 text-xs text-indigo-300/60">
                  Your estimated share of the local market
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-indigo-400" size={24} />
              <h2 className="text-xl font-medium">Impact Estimations</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Tenure Impact on Service Quality (%)
                </label>
                <input
                  type="number"
                  value={Math.round(inputs.tenureServiceImpact * 100)}
                  onChange={(e) => handleInputChange('tenureServiceImpact', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="1"
                />
                <p className="mt-2 text-xs text-indigo-300/60">
                  Estimate how much longer tenure improves service quality. For example, 30% means experienced staff provides 30% better service.
                </p>
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Service Impact on Transaction Value (%)
                </label>
                <input
                  type="number"
                  value={Math.round(inputs.serviceTransactionImpact * 100)}
                  onChange={(e) => handleInputChange('serviceTransactionImpact', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="1"
                />
                <p className="mt-2 text-xs text-indigo-300/60">
                  Estimate how much better service quality increases transaction value. For example, 15% means better service leads to 15% higher sales per transaction.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-indigo-400" size={24} />
              <h2 className="text-xl font-medium">Growth Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Number of Stores
                </label>
                <input
                  type="number"
                  value={inputs.numberOfStores}
                  onChange={(e) => handleInputChange('numberOfStores', Number(e.target.value))}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Annual Growth Rate (%)
                </label>
                <input
                  type="number"
                  value={Math.round(inputs.annualGrowthRate * 100)}
                  onChange={(e) => handleInputChange('annualGrowthRate', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="0"
                  max="100"
                  step="1"
                />
                <p className="mt-2 text-xs text-indigo-300/60">
                  Pre-populated from Cost Calculator. Adjust if needed.
                </p>
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Associates per Store
                </label>
                <input
                  type="number"
                  value={inputs.associatesPerStore}
                  onChange={(e) => handleInputChange('associatesPerStore', Number(e.target.value))}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min="1"
                  step="1"
                />
              </div>
            </div>
          </div>
        </div>
        
        {showVisualizations && (
          <div className="mt-12 space-y-8 animate-fade-in">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-indigo-400" size={24} />
                <h2 className="text-xl font-medium">Impact Analysis</h2>
              </div>
              <RevenueVisualizations
                results={{
                  transactionValueGain: inputs.averageTransactionValue * inputs.numberOfStores * 12,
                  loyaltyRevenueGain: inputs.averageTransactionValue * inputs.numberOfStores * (inputs.customerLoyaltyRate || 0) * 12,
                  marketShareRevenueGain: inputs.averageTransactionValue * inputs.numberOfStores * (inputs.marketShare || 0) * 12,
                  totalAnnualImpact: inputs.averageTransactionValue * inputs.numberOfStores * 
                    (1 + (inputs.customerLoyaltyRate || 0) + (inputs.marketShare || 0)) * 12,
                  serviceMetrics: {
                    currentServiceScore: inputs.customerSatisfactionScore,
                    projectedServiceScore: Math.min(100, inputs.customerSatisfactionScore * 1.2),
                    serviceImprovement: ((inputs.customerSatisfactionScore * 1.2 - inputs.customerSatisfactionScore) / 
                      inputs.customerSatisfactionScore) * 100
                  },
                  monthlyProjections: Array.from({ length: 12 }, (_, i) => ({
                    month: i + 1,
                    baseline: inputs.averageTransactionValue * inputs.numberOfStores * (i + 1),
                    projected: inputs.averageTransactionValue * inputs.numberOfStores * (i + 1) * 1.2
                  })),
                  roi: 2.5
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={isCalculating}
            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                Analyzing <div className="pl-2.5 relative top-[1px]"><LoadingSpinner /></div>
              </span>
            ) : (
              <span className="flex items-center">
                Calculate Impact
                <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" size={20} />
              </span>
            )}
          </button>
        </div>
      </div>
      <Disclaimer />
    </div>
  );
}