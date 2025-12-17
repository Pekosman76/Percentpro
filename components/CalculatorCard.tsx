
import React, { useState } from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  result: string | null;
  resultPhrase?: string | null;
  error: string | null;
  onCalculate: () => void;
  onReset: () => void;
  onExample: () => void;
  icon: React.ReactNode;
  onCopy?: (text: string) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ 
  title, 
  description, 
  children, 
  result, 
  resultPhrase,
  error, 
  onCalculate,
  onReset,
  onExample,
  icon,
  onCopy
}) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = () => {
    if (!result || !onCopy) return;
    onCopy(result);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1200);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group">
      <div className="p-5 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
              {/* Fix: Check if icon is a valid React element and cast to a type that supports className to avoid TypeScript error on line 46 */}
              {React.isValidElement(icon) 
                ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" }) 
                : icon}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">{title}</h3>
              <p className="text-[11px] text-slate-500 line-clamp-1">{description}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={onExample}
              title="Exemple"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>
            <button 
              onClick={onReset}
              title="Réinitialiser"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {children}
          </div>

          <button
            onClick={onCalculate}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md shadow-indigo-100 active:scale-[0.98]"
          >
            Calculer
          </button>

          {(result !== null || error !== null) && (
            <div className={`p-3 rounded-lg animate-in fade-in zoom-in-95 duration-200 relative ${
              error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
            }`}>
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-widest font-bold mb-0.5 opacity-70">
                  {error ? 'Erreur' : 'Résultat'}
                </span>
                <div className="flex items-center gap-2 max-w-full">
                  <span className="text-xl font-black break-all">
                    {error || result}
                  </span>
                  {!error && onCopy && (
                    <button 
                      onClick={handleCopy}
                      className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors relative"
                      title="Copier le résultat"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                      {copyFeedback && (
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap animate-bounce">
                          Copié !
                        </span>
                      )}
                    </button>
                  )}
                </div>
                {resultPhrase && !error && (
                   <p className="text-[10px] mt-1 opacity-60 font-medium italic">{resultPhrase}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
