import React from 'react';
import { CalculatorProvider } from './context/CalculatorContext';
import WelcomeScreen from './components/WelcomeScreen';
import CostCalculator from './components/CostCalculator';
import RevenueCalculator from './components/RevenueCalculator';
import Results from './components/Results';
import { useCalculator } from './context/CalculatorContext';

function CalculatorApp() {
  const { state } = useCalculator();

  return (
    <div className="min-h-screen">
      {state.screen.currentScreen === 'welcome' && <WelcomeScreen />}
      {state.screen.currentScreen === 'costCalculator' && <CostCalculator />}
      {state.screen.currentScreen === 'revenueCalculator' && <RevenueCalculator />}
      {state.screen.currentScreen === 'results' && <Results />}
    </div>
  );
}

function App() {
  return (
    <CalculatorProvider>
      <CalculatorApp />
    </CalculatorProvider>
  );

}
export default App;
