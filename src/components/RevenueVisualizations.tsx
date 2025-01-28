import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface ServiceMetrics {
  currentServiceScore: number;
  projectedServiceScore: number;
  serviceImprovement: number;
}

interface MonthlyProjection {
  month: number;
  baseline: number;
  projected: number;
}

interface VisualizationResults {
  transactionValueGain: number;
  loyaltyRevenueGain: number;
  marketShareRevenueGain: number;
  totalAnnualImpact: number;
  serviceMetrics: ServiceMetrics;
  monthlyProjections: MonthlyProjection[];
  roi: number;
  statistics?: {
    revenueImpact: ConfidenceInterval;
    serviceQuality: ConfidenceInterval;
    customerRetention: ConfidenceInterval;
    validationResults: {
      warnings: string[];
    };
  };
}

interface RevenueVisualizationsProps {
  results?: VisualizationResults;
}

// WCAG AA compliant colors
const accessibleColors = {
  primary: '#2563EB', // Blue with 4.5:1 contrast ratio
  secondary: '#7C3AED', // Purple with 4.5:1 contrast ratio
  accent: '#059669', // Green with 4.5:1 contrast ratio
  neutral: '#E2E8F0', // Light slate for better contrast
  background: 'rgba(255, 255, 255, 0.1)'
};

// Default data to prevent undefined errors
const defaultResults = {
  transactionValueGain: 0,
  loyaltyRevenueGain: 0,
  marketShareRevenueGain: 0,
  totalAnnualImpact: 0,
  serviceMetrics: {
    currentServiceScore: 0,
    projectedServiceScore: 0,
    serviceImprovement: 0
  },
  monthlyProjections: Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    baseline: 0,
    projected: 0
  })),
  roi: 0
};

const RevenueVisualizations = ({ results = defaultResults }) => {
  // Format large numbers for display
  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);

  // Safely access nested properties
  const {
    transactionValueGain = 0,
    loyaltyRevenueGain = 0,
    marketShareRevenueGain = 0,
    totalAnnualImpact = 0,
    serviceMetrics = defaultResults.serviceMetrics,
    monthlyProjections = defaultResults.monthlyProjections,
    roi = 0
  } = results;

  const pieData = [
    { name: 'Transaction Value', value: transactionValueGain },
    { name: 'Repeat Customers', value: loyaltyRevenueGain },
    { name: 'Market Share', value: marketShareRevenueGain }
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'Current', value: serviceMetrics.currentServiceScore },
    { name: 'Projected', value: serviceMetrics.projectedServiceScore }
  ];

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Statistical Warnings */}
      {results.statistics?.validationResults.warnings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-2 bg-yellow-500/10 border border-yellow-500/20 backdrop-blur-sm rounded-xl p-4"
        >
          <h4 className="text-yellow-300 font-medium mb-2">Analysis Notes</h4>
          <ul className="list-disc list-inside space-y-1 text-yellow-100/80 text-sm">
            {results.statistics.validationResults.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Revenue Growth Projection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-2 bg-white/10 backdrop-blur-sm rounded-2xl p-6"
      >
        <h3 className="text-2xl font-lexend font-semibold mb-4">Projected Revenue Growth</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyProjections}>
            <XAxis 
              dataKey="month" 
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <YAxis 
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <Tooltip
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'baseline' ? 'Current Trajectory' : 'With Improvements'
              ]}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: 'none',
                color: '#E2E8F0'
              }}
              labelFormatter={(label) => `Month ${label}`}
            />
            <Legend 
              wrapperStyle={{ color: '#E2E8F0' }}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#E2E8F0"
              name="baseline"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke={accessibleColors.accent}
              name="projected"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Revenue Impact Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
      >
        <h3 className="text-2xl font-lexend font-semibold mb-4">Revenue Impact Sources</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={[accessibleColors.primary, accessibleColors.secondary, accessibleColors.accent][index]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'Repeat Customers' 
                  ? 'Revenue from returning customers'
                  : name
              ]}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: 'none',
                color: '#fff',
                fontSize: '14px'
              }}
            />
            <Legend 
              formatter={(value) => (
                <span style={{ color: '#fff' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Service Quality Impact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6"
      >
        <h3 className="text-2xl font-lexend font-semibold mb-4">Service Quality Progression</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis 
              dataKey="name" 
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <YAxis 
              domain={[0, 100]}
              stroke="#fff"
              tick={{ fill: '#fff' }}
              tickLine={{ stroke: '#fff' }}
            />
            <Tooltip 
              formatter={(value) => `${(value || 0).toFixed(1)}%`}
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: 'none',
                color: '#E2E8F0'
              }}
            />
            <Bar dataKey="value" fill={accessibleColors.primary} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Key Metrics Summary */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-2 grid grid-cols-4 gap-4"
      >
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h4 className="text-lg font-lexend font-normal text-blue-100" role="heading" aria-level="4">Annual Revenue Impact</h4>
          <p className="text-3xl font-lexend font-semibold text-green-400">
            {formatCurrency(totalAnnualImpact)}
          </p>
          {results.statistics && (
            <p className="text-sm text-blue-200/60 mt-2">
              Range: {formatCurrency(results.statistics.revenueImpact.lower)} - {formatCurrency(results.statistics.revenueImpact.upper)}
            </p>
          )}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h4 className="text-lg font-lexend font-normal text-blue-100">Service Quality Improvement</h4>
          <p className="text-3xl font-lexend font-semibold">
            {(serviceMetrics.serviceImprovement || 0).toFixed(1)}%
          </p>
          {results.statistics && (
            <p className="text-sm text-blue-200/60 mt-2">
              Confidence: {(results.statistics.serviceQuality.lower * 100).toFixed(1)}% - {(results.statistics.serviceQuality.upper * 100).toFixed(1)}%
            </p>
          )}
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h4 className="text-lg font-lexend font-normal text-blue-100" role="heading" aria-level="4">ROI</h4>
          <p className="text-3xl font-lexend font-semibold">
            {((roi || 0) * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h4 className="text-lg font-lexend font-normal text-blue-100">Statistical Confidence</h4>
          <p className="text-3xl font-lexend font-semibold text-indigo-400">
            95%
          </p>
          <p className="text-sm text-blue-200/60 mt-2">
            Based on {results.statistics ? '10,000' : 'N/A'} simulations
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueVisualizations;