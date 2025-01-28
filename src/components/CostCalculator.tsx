import React from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { DollarSign, Users, ChevronLeft, ArrowRight, Settings2 } from 'lucide-react';
import { validationRules } from '../utils/calculations';
import Disclaimer from './Disclaimer';
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';

export default function CostCalculator() {
  const { state, dispatch } = useCalculator();
  const { inputs } = state;
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleInputChange = (field: string, value: number) => {
    const rule = validationRules[field as keyof typeof validationRules];
    if (rule) {
      value = Math.max(rule.min, Math.min(rule.max, value));
    }
    
    dispatch({
      type: 'SET_INPUTS',
      payload: { [field]: value },
    });
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
        calculatorMode: 'cost'
      } 
    });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#312E81] text-white p-8">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full mix-blend-soft-light blur-3xl opacity-30 animate-float-${i + 1}`}
            style={{
              background: i === 0 
                ? 'radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(99,102,241,0) 70%)'
                : i === 1
                ? 'radial-gradient(circle, rgba(168,85,247,1) 0%, rgba(168,85,247,0) 70%)'
                : 'radial-gradient(circle, rgba(79,70,229,1) 0%, rgba(79,70,229,0) 70%)',
              width: `${400 + i * 100}px`,
              height: `${400 + i * 100}px`,
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <button
        onClick={handleBack}
        className="flex items-center text-indigo-300 hover:text-indigo-200 transition-colors mb-8"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Calculate Your Cost Savings
        </h1>

        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-indigo-400" size={24} />
              <h2 className="text-xl font-medium">Store Information</h2>
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
                  min={validationRules.numberOfStores.min}
                  max={validationRules.numberOfStores.max}
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Annual Growth Rate (%)
                </label>
                <input
                  type="number"
                  value={inputs.annualGrowthRate * 100}
                  onChange={(e) => handleInputChange('annualGrowthRate', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min={validationRules.annualGrowthRate.min * 100}
                  max={validationRules.annualGrowthRate.max * 100}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-indigo-400" size={24} />
              <h2 className="text-xl font-medium">Workforce Metrics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Associates per Store
                </label>
                <input
                  type="number"
                  value={inputs.associatesPerStore}
                  onChange={(e) => handleInputChange('associatesPerStore', Number(e.target.value))}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min={validationRules.associatesPerStore.min}
                  max={validationRules.associatesPerStore.max}
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-2">
                  Current Retention Rate (%)
                </label>
                <input
                  type="number"
                  value={inputs.currentRetentionRate * 100}
                  onChange={(e) => handleInputChange('currentRetentionRate', Number(e.target.value) / 100)}
                  className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                  min={validationRules.currentRetentionRate.min * 100}
                  max={validationRules.currentRetentionRate.max * 100}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg overflow-hidden">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Settings2 className="text-indigo-400" size={24} />
                <h2 className="text-xl font-medium">Advanced Settings</h2>
              </div>
              <div className="text-indigo-300">
                {showAdvanced ? 'Hide' : 'Show'}
              </div>
            </button>

            {showAdvanced && (
              <div className="p-6 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2">
                      Hours per Week
                    </label>
                    <input
                      type="number"
                      value={inputs.hoursPerWeek}
                      onChange={(e) => handleInputChange('hoursPerWeek', Number(e.target.value))}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                      min={validationRules.hoursPerWeek.min}
                      max={validationRules.hoursPerWeek.max}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2">
                      Hourly Wage Cost ($ including benefits)
                    </label>
                    <input
                      type="number"
                      value={inputs.hourlyWageCost}
                      onChange={(e) => handleInputChange('hourlyWageCost', Number(e.target.value))}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                      min={validationRules.hourlyWageCost.min}
                      max={validationRules.hourlyWageCost.max}
                    />
                    <p className="mt-2 text-xs text-indigo-300/60">
                      Include both hourly wages and the cost of benefits (healthcare, PTO, etc.)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2">
                      Training Weeks
                    </label>
                    <input
                      type="number"
                      value={inputs.trainingWeeks}
                      onChange={(e) => handleInputChange('trainingWeeks', Number(e.target.value))}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                      min={validationRules.trainingWeeks.min}
                      max={validationRules.trainingWeeks.max}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2">
                      Recruiting Cost per Hire ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.recruitingCostPerHire}
                      onChange={(e) => handleInputChange('recruitingCostPerHire', Number(e.target.value))}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                      min={validationRules.recruitingCostPerHire.min}
                      max={validationRules.recruitingCostPerHire.max}
                    />
                    <p className="mt-2 text-xs text-indigo-300/60">
                      Average recruiting cost per hire: $2,000. Source: Center for Hospitality Research at Cornell
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2">
                      Expected Retention Improvement (%)
                    </label>
                    <input
                      type="number"
                      value={inputs.retentionImprovement * 100}
                      onChange={(e) => handleInputChange('retentionImprovement', Number(e.target.value) / 100)}
                      className="w-full bg-white/5 border border-indigo-500/30 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all"
                      min={validationRules.retentionImprovement.min * 100}
                      max={validationRules.retentionImprovement.max * 100}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleNext}
            disabled={isCalculating}
            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                Calculating <div className="pl-2.5 relative top-[1px]"><LoadingSpinner /></div>
              </span>
            ) : (
              <span className="flex items-center">
                See Your Results
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