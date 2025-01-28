import React from 'react';
import { useState } from 'react';
import { useCalculator } from '../context/CalculatorContext';
import { ChevronLeft, DollarSign, TrendingUp, Users, Mail } from 'lucide-react';
import { CalculationEngine } from '../utils/calculations';
import EmailModal from './EmailModal';
import { motion } from 'framer-motion';
import Disclaimer from './Disclaimer';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const staggerDelay = 0.15;

export default function Results() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { state, dispatch } = useCalculator();
  const { inputs } = state;
  const results = React.useMemo(() => {
    return state.screen.calculatorMode === 'revenue' 
      ? CalculationEngine.calculateRevenueImpact(inputs)
      : CalculationEngine.calculateCostSavings(inputs);
  }, [state.screen.calculatorMode, inputs]);

  const handleBack = () => {
    dispatch({ 
      type: 'SET_SCREEN', 
      payload: { 
        currentScreen: state.screen.calculatorMode === 'revenue' ? 'revenueCalculator' : 'costCalculator' 
      } 
    });
  };

  const handleCalculateRevenue = () => {
    dispatch({ 
      type: 'SET_SCREEN', 
      payload: { 
        currentScreen: 'revenueCalculator',
        calculatorMode: 'revenue'
      } 
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number, decimals: number = 1) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#312E81] text-white p-8">
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        inputs={inputs}
        results={results}
      />
      <button
        onClick={handleBack}
        className="flex items-center text-indigo-300 hover:text-indigo-200 transition-colors mb-8"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back
      </button>

      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Your ROI Analysis
          </h1>
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-indigo-300 hover:text-indigo-200 hover:bg-white/20 transition-all duration-300"
          >
            <Mail size={20} />
            Share via Email
          </button>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: staggerDelay
              }
            }
          }}
        >
          <motion.button
            as={motion.button}
            variants={fadeInUp}
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: { currentScreen: 'costCalculator', calculatorMode: 'cost' } })}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-left transition-all hover:bg-white/[0.15] focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="text-indigo-400" size={24} />
              <h2 className="text-xl font-medium">Cost Savings</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-indigo-200 mb-1">Annual Hiring Needs</div>
                <div className="text-2xl font-semibold">{formatNumber(Math.round(results.totalNewAssociates), 0)} hires</div>
              </div>
              <div>
                <div className="text-sm text-indigo-200 mb-1">Current Recruiting Costs</div>
                <div className="text-2xl font-semibold">{formatCurrency(results.totalNewAssociates * inputs.recruitingCostPerHire)}</div>
              </div>
              <div>
                <div className="text-sm text-indigo-200 mb-1">Projected Savings</div>
                <div className="text-2xl font-semibold text-emerald-400">{formatCurrency(results.totalSavings)}</div>
              </div>
            </div>
          </motion.button>

          <motion.button
            as={motion.button}
            variants={fadeInUp}
            onClick={() => dispatch({ type: 'SET_SCREEN', payload: { currentScreen: 'revenueCalculator', calculatorMode: 'revenue' } })}
            className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-left transition-all hover:bg-white/[0.15] focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {results.revenueImpact ? (
              <>
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="text-indigo-400" size={24} />
                <h2 className="text-xl font-medium">Revenue Impact</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-indigo-200 mb-1">Customer Experience Impact</div>
                  <div className="text-2xl font-semibold">{formatCurrency(results.revenueImpact.customerExperience)}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-200 mb-1">Team Expertise Value</div>
                  <div className="text-2xl font-semibold">{formatCurrency(results.revenueImpact.teamExpertise)}</div>
                </div>
                <div>
                  <div className="text-sm text-indigo-200 mb-1">Customer Loyalty Benefit</div>
                  <div className="text-2xl font-semibold">{formatCurrency(results.revenueImpact.customerLoyalty)}</div>
                </div>
              </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="bg-indigo-400/10 rounded-full p-4 mb-4">
                  <TrendingUp className="text-indigo-400 w-8 h-8" />
                </div>
                <h2 className="text-xl font-medium mb-2">Revenue Impact</h2>
                <p className="text-indigo-200 mb-6 max-w-sm">
                  Discover how improved retention can boost your revenue through enhanced customer experience and team performance
                </p>
                <div
                  className="group flex items-center gap-2 px-6 py-3 bg-white/10 rounded-lg text-indigo-300 hover:text-indigo-200 hover:bg-white/20 transition-all duration-300"
                >
                  Calculate Revenue Impact
                  <TrendingUp className="w-4 h-4 transition-transform group-hover:translate-y-[-2px]" />
                </div>
              </div>
            )}
          </motion.button>
        </motion.div>

        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-lg p-6"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: staggerDelay * 2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-indigo-400" size={24} />
            <h2 className="text-xl font-medium">Company Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-indigo-200 mb-1">Total Stores</div>
              <div className="text-2xl font-semibold">{formatNumber(inputs.numberOfStores, 0)}</div>
            </div>
            <div>
              <div className="text-sm text-indigo-200 mb-1">Associates per Store</div>
              <div className="text-2xl font-semibold">{formatNumber(Number(inputs.associatesPerStore), 0)}</div>
            </div>
            <div>
              <div className="text-sm text-indigo-200 mb-1">Current Retention Rate</div>
              <div className="text-2xl font-semibold">{(inputs.currentRetentionRate * 100).toFixed(1)}%</div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="mt-8 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: staggerDelay * 3, duration: 0.5 }}
        >
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-indigo-300 hover:text-indigo-200 hover:bg-white/20 transition-all duration-300"
          >
            <Mail size={20} />
            Share via Email
          </button>
        </motion.div>
      </div>
      <Disclaimer />
    </div>
  );
}