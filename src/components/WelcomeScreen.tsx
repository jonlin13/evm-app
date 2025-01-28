import React from 'react';
import { ArrowRight, TrendingUp, DollarSign, Users } from 'lucide-react';
import { useCalculator } from '../context/CalculatorContext';

export default function WelcomeScreen() {
  const { dispatch } = useCalculator();

  const handleCalculatorStart = () => {
    dispatch({ type: 'SET_SCREEN', payload: { currentScreen: 'costCalculator' } });
  };

  const handleSkipToRevenue = () => {
    dispatch({ type: 'SET_SCREEN', payload: { currentScreen: 'revenueCalculator' } });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#312E81] text-white">
      {/* Ambient Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div
          className="absolute rounded-full mix-blend-soft-light blur-3xl opacity-30 animate-float-1"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,1) 0%, rgba(99,102,241,0) 70%)',
            width: '500px',
            height: '500px',
            left: '20%',
            top: '20%',
          }}
        />
        <div
          className="absolute rounded-full mix-blend-soft-light blur-3xl opacity-30 animate-float-2"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,1) 0%, rgba(168,85,247,0) 70%)',
            width: '600px',
            height: '600px',
            left: '50%',
            top: '40%',
          }}
        />
        <div
          className="absolute rounded-full mix-blend-soft-light blur-3xl opacity-30 animate-float-3"
          style={{
            background: 'radial-gradient(circle, rgba(79,70,229,1) 0%, rgba(79,70,229,0) 70%)',
            width: '700px',
            height: '700px',
            left: '80%',
            top: '60%',
          }}
        />
      </div>

      <div className="absolute top-8 right-8">
        <svg width="32" height="28" viewBox="0 0 120 105" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-50">
          <path d="M79.5537 36.1075V46.3582H60.524C62.8122 50.4918 65.5406 54.293 67.1541 58.5145C74.2438 77.0812 63.7315 97.6608 44.4768 103.348C39.9712 104.716 35.2329 105.146 30.5544 104.613C25.8758 104.079 21.3563 102.593 17.2748 100.247C13.1933 97.9 9.63637 94.7423 6.82358 90.9685C4.01079 87.1947 2.00181 82.8849 0.920635 78.3051C-0.160535 73.7253 -0.290954 68.9726 0.537428 64.3405C1.36581 59.7083 3.13542 55.295 5.73702 51.3728C8.33863 47.4506 11.717 44.1029 15.6637 41.5362C19.6104 38.9695 24.0416 37.2383 28.6839 36.4495C30.2825 36.1683 31.9014 36.018 33.5244 36C48.2254 36 62.9198 36 77.6077 36C78.1847 36 78.7225 36.0489 79.5537 36.1075ZM34.6294 46.4657C28.2857 46.4774 22.2064 49.0068 17.7289 53.4976C13.2514 57.9884 10.7426 64.0726 10.7543 70.4118C10.7659 76.7511 13.2972 82.826 17.7911 87.3003C22.2851 91.7746 28.3737 94.2816 34.7175 94.27C37.8586 94.2642 40.9678 93.6402 43.8676 92.4337C46.7674 91.2272 49.401 89.4617 51.618 87.2381C53.835 85.0145 55.592 82.3763 56.7888 79.4742C57.9855 76.572 58.5984 73.4627 58.5927 70.3239C58.5869 67.185 57.9625 64.078 56.7551 61.1803C55.5477 58.2826 53.781 55.6508 51.5558 53.4354C49.3306 51.22 46.6905 49.4642 43.7863 48.2683C40.8821 47.0725 37.7706 46.46 34.6294 46.4657Z" fill="currentColor"/>
          <path d="M120 36.0368V46.3364H83.6521C83.6521 43.1117 83.5738 39.9749 83.7205 36.8577C83.7205 36.242 84.5713 35.5482 85.1776 35.1085C90.067 31.5515 95.1325 28.1118 100.012 24.4864C102.05 23.0047 103.911 21.2931 105.557 19.3855C106.359 18.5546 106.845 17.4688 106.929 16.3172C107.013 15.1655 106.69 14.0209 106.016 13.0826C105.319 12.1624 104.326 11.5097 103.205 11.2339C102.083 10.9582 100.901 11.0761 99.8557 11.5679C97.2251 12.8578 94.9662 14.8122 92.1792 16.6786L84.1703 10.0631C89.7345 0.447474 104.266 -3.02156 113.458 2.93932C115.145 4.07612 116.573 5.55578 117.648 7.28162C118.724 9.00746 119.423 10.9406 119.7 12.9549C119.977 14.9691 119.825 17.019 119.255 18.9707C118.685 20.9224 117.709 22.732 116.392 24.2812C114.114 26.6957 111.609 28.885 108.911 30.8186C106.769 32.5092 104.442 33.975 102.271 36.0075L120 36.0368Z" fill="currentColor"/>
        </svg>
      </div>
      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center py-20">
        <div className="max-w-2xl text-center px-6">
          <h2 className="text-4xl font-medium tracking-[-0.02em] text-white mb-12">
            Sigma Squared
          </h2>
          <h1 className="text-5xl font-semibold mb-8 leading-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Unlock Your Hidden Savings
          </h1>
          <p className="text-xl text-indigo-200 mb-12">
            See how better hiring drives profit through improved retention and performance
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleCalculatorStart}
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              Calculate Your ROI
              <ArrowRight className="inline-block ml-2 transition-transform group-hover:translate-x-1" size={20} />
            </button>
            
            <button
              onClick={handleSkipToRevenue}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg text-lg font-medium transition-all duration-300 hover:bg-white/20 focus:ring-2 focus:ring-indigo-400"
            >
              Skip to Revenue Impact
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}