
import React from 'react';

interface CalculatorCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  result: string | null;
  error: string | null;
  onCalculate: () => void;
  icon: React.ReactNode;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ 
  title, 
  description, 
  children, 
  result, 
  error, 
  onCalculate,
  icon
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
      <div className="p-5 sm:p-6 flex-grow">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{title}</h3>
            <p className="text-xs text-slate-500 line-clamp-1">{description}</p>
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
            <div className={`p-3 rounded-lg animate-in fade-in zoom-in-95 duration-200 ${
              error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
            }`}>
              <div className="flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-widest font-bold mb-0.5 opacity-70">
                  {error ? 'Erreur' : 'Résultat'}
                </span>
                <span className="text-xl font-black break-all">
                  {error || result}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
