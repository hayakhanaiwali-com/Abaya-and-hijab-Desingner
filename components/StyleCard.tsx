import React, { useEffect, useState } from 'react';
import { HijabStyle } from '../types';
import { generateStyleImage } from '../services/geminiService';
import { CheckCircleIcon } from './Icons';

interface StyleCardProps {
  styleData: HijabStyle;
}

const StyleCard: React.FC<StyleCardProps> = ({ styleData }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      // Use a placeholder immediately if needed, but we want to generate
      // Only generate if we don't have one
      if (styleData.imagePrompt) {
        const url = await generateStyleImage(styleData.imagePrompt);
        if (isMounted && url) {
            setImageUrl(url);
        }
      }
      if (isMounted) setLoadingImage(false);
    };

    fetchImage();

    return () => { isMounted = false; };
  }, [styleData.imagePrompt]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl border border-stone-100 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-64 w-full bg-stone-200 overflow-hidden group">
        {loadingImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-stone-100 animate-pulse">
            <span className="text-stone-400 font-serif italic">Designing visual...</span>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt={styleData.styleName} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-modest-rose/20">
            <span className="text-stone-500">Visual unavailable</span>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-stone-700 shadow-sm">
          {styleData.occasion}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
            <h3 className="font-serif text-2xl font-bold text-modest-dark">{styleData.styleName}</h3>
        </div>
        
        <p className="text-stone-600 mb-4 text-sm leading-relaxed italic border-l-2 border-modest-rose pl-3">
          "{styleData.description}"
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-md font-medium">
                Face: {styleData.faceShape}
            </span>
            <span className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-md font-medium">
                Fabric: {styleData.fabric}
            </span>
        </div>

        {/* Steps */}
        <div className="mt-auto">
            <h4 className="font-serif text-lg font-semibold mb-3 text-stone-800">How to Style</h4>
            <ul className="space-y-3">
            {styleData.steps.map((step, idx) => (
                <li key={idx} className="flex items-start text-sm text-stone-600">
                <CheckCircleIcon className="w-5 h-5 text-modest-gold mr-2 flex-shrink-0 mt-0.5" />
                <span>{step}</span>
                </li>
            ))}
            </ul>
        </div>

        {/* Colors */}
        <div className="mt-6 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2">Recommended Palette</p>
            <div className="flex gap-2">
                {styleData.colorPalette.map((color, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div 
                            className="w-6 h-6 rounded-full border border-stone-200 shadow-sm"
                            style={{ backgroundColor: color.toLowerCase().includes('gold') ? '#D4AF37' : color }}
                            title={color}
                        />
                        <span className="text-[10px] text-stone-500 mt-1 max-w-[50px] truncate">{color}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StyleCard;
