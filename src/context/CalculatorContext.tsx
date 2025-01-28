import { createContext, useContext, useReducer, ReactNode } from 'react';
import { CompanyInputs, CalculationResults, ScreenState } from '../types/calculator';

interface CalculatorState {
  inputs: CompanyInputs;
  results: CalculationResults | null;
  screen: ScreenState;
}

type CalculatorAction =
  | { type: 'SET_INPUTS'; payload: Partial<CompanyInputs> }
  | { type: 'SET_RESULTS'; payload: CalculationResults }
  | { type: 'SET_SCREEN'; payload: Partial<ScreenState> }
  | { type: 'RESET' };

const initialState: CalculatorState = {
  inputs: {
    numberOfStores: 100,
    annualGrowthRate: 0.20,
    associatesPerStore: 10, // Changed from '' to number
    hoursPerWeek: 25,
    hourlyWageCost: 26,
    currentRetentionRate: 0.45,
    trainingWeeks: 8,
    recruitingCostPerHire: 2000,
    retentionImprovement: 0.10,
    averageTransactionValue: 50, // Ensure initial values are numbers
    customerSatisfactionScore: 75, // Ensure initial values are numbers
    customerLoyaltyRate: 0.3, // Ensure initial values are numbers
    marketShare: 0.15, // Ensure initial values are numbers
    tenureServiceImpact: 0.3,
    serviceTransactionImpact: 0.15,
  },
  results: null,
  screen: {
    currentScreen: 'welcome',
    calculatorMode: 'cost',
    calculationComplete: false,
  },
};

const CalculatorContext = createContext<{
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
} | null>(null);

function calculatorReducer(state: CalculatorState, action: CalculatorAction): CalculatorState {
  switch (action.type) {
    case 'SET_INPUTS':
      return {
        ...state,
        inputs: { ...state.inputs, ...action.payload },
      };
    case 'SET_RESULTS':
      return {
        ...state,
        results: action.payload,
      };
    case 'SET_SCREEN':
      return {
        ...state,
        screen: { ...state.screen, ...action.payload },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculatorReducer, initialState);

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

export function useCalculator() {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
}