import React, { useState } from 'react';
import { HijabStyle, LoadingState } from './types';
import { generateHijabStyles } from './services/geminiService';
import StyleCard from './components/StyleCard';
import { SparklesIcon, ScarfIcon } from './components/Icons';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [styles, setStyles] = useState<HijabStyle[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoadingState('generating-plan');
    setError(null);
    setStyles([]);

    try {
      const generatedStyles = await generateHijabStyles(input);
      setStyles(generatedStyles);
      setLoadingState('complete');
    } catch (err) {
      console.error(err);
      setError("We couldn't generate styles right now. Please try a different description or check your connection.");
      setLoadingState('error');
    }
  };

  return (
    <div className="min-h-screen font-sans bg-[#F9F7F2] text-modest-dark">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="bg-modest-rose p-1.5 rounded-lg text-white">
                <ScarfIcon className="w-6 h-6" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-stone-800">Modest Chic</span>
            </div>
            <div className="text-sm font-medium text-stone-500 hidden sm:block">
              AI Stylist for the Modern Muslimah
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-800 mb-6 leading-tight">
            Discover Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-modest-gold to-orange-400">Hijab Style</span>
          </h1>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed">
            Whether it's for a casual college day, a formal wedding, or a quick errand run. 
            Describe your need, and let our AI suggest fabrics, colors, and tying techniques tailored to you.
          </p>

          {/* Input Area */}
          <form onSubmit={handleGenerate} className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <SparklesIcon className="h-5 w-5 text-modest-gold" />
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., A bridal look with crystals for a round face..."
              className="w-full pl-12 pr-32 py-4 bg-white border border-stone-200 rounded-full shadow-lg text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-modest-rose/50 focus:border-modest-rose transition-all text-base md:text-lg"
              disabled={loadingState === 'generating-plan'}
            />
            <button
              type="submit"
              disabled={loadingState === 'generating-plan' || !input.trim()}
              className="absolute right-2 top-2 bottom-2 bg-stone-800 hover:bg-black text-white px-6 rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loadingState === 'generating-plan' ? 'Thinking...' : 'Get Ideas'}
            </button>
          </form>

          {/* Preset Chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {['Casual College Look', 'Bridal with Veil', 'Professional Work Style', 'Quick 2-min Style', 'Gym/Active Wear'].map((preset) => (
              <button
                key={preset}
                onClick={() => setInput(preset)}
                className="px-4 py-1.5 bg-white border border-stone-200 rounded-full text-xs md:text-sm text-stone-600 hover:border-modest-rose hover:text-modest-rose transition-colors shadow-sm"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loadingState === 'generating-plan' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-modest-rose border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-stone-500 font-serif italic text-lg animate-pulse">Curating elegant styles for you...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center p-8 bg-red-50 rounded-xl border border-red-100 max-w-2xl mx-auto">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Results Grid */}
        {styles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {styles.map((style) => (
              <StyleCard key={style.id} styleData={style} />
            ))}
          </div>
        )}
        
        {/* Empty State / Tips */}
        {styles.length === 0 && loadingState === 'idle' && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 opacity-60">
                <div className="text-center p-6">
                    <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">🧕</div>
                    <h3 className="font-serif font-bold text-stone-700 mb-2">Personalized Advice</h3>
                    <p className="text-sm text-stone-500">Get suggestions based on your specific face shape and skin tone.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">✨</div>
                    <h3 className="font-serif font-bold text-stone-700 mb-2">Step-by-Step</h3>
                    <p className="text-sm text-stone-500">Clear instructions on how to achieve complex looks easily.</p>
                </div>
                <div className="text-center p-6">
                    <div className="w-12 h-12 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">👗</div>
                    <h3 className="font-serif font-bold text-stone-700 mb-2">Complete Look</h3>
                    <p className="text-sm text-stone-500">Fabric and color palette recommendations to match your outfit.</p>
                </div>
            </div>
        )}
      </main>

      <footer className="bg-white border-t border-stone-200 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-400 text-sm">
          <p>© {new Date().getFullYear()} Modest Chic. AI styling powered by Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
