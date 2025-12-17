
import React from 'react';

interface InputGroupProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onEnter?: () => void;
  placeholder: string;
  suffix?: string;
  id?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, onEnter, placeholder, suffix, id }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={id} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      <div className="relative">
        <input
          id={id}
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onEnter && onEnter()}
          placeholder={placeholder}
          className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-900 shadow-sm text-sm"
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};
