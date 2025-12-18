import React, { useState, useEffect } from 'react';
import { CalculatorCard } from './components/CalculatorCard';
import { InputGroup } from './components/InputGroup';
import { HelpSection } from './components/HelpSection';
import { Precision, View, VATMode, VATResult } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.CALCULATOR);
  const [precision, setPrecision] = useState<Precision>(2);

  // Load precision from localStorage using the brand-specific key
  useEffect(() => {
    const saved = localStorage.getItem('calculerunpourcentage_precision');
    if (saved !== null) {
      const val = parseInt(saved, 10);
      if ([0, 1, 2, 3].includes(val)) {
        setPrecision(val as Precision);
      }
    }
  }, []);

  // Save precision to localStorage
  useEffect(() => {
    localStorage.setItem('calculerunpourcentage_precision', precision.toString());
  }, [precision]);

  // Calc 1: Percentage of Value
  const [c1Perc, setC1Perc] = useState('');
  const [c1Total, setC1Total] = useState('');
  const [c1Res, setC1Res] = useState<string | null>(null);
  const [c1Phrase, setC1Phrase] = useState<string | null>(null);
  const [c1Err, setC1Err] = useState<string | null>(null);

  // Calc 2: Value as Percentage
  const [c2Val, setC2Val] = useState('');
  const [c2Total, setC2Total] = useState('');
  const [c2Res, setC2Res] = useState<string | null>(null);
  const [c2Phrase, setC2Phrase] = useState<string | null>(null);
  const [c2Err, setC2Err] = useState<string | null>(null);

  // Calc 3: Increase/Decrease
  const [c3Val, setC3Val] = useState('');
  const [c3Perc, setC3Perc] = useState('');
  const [c3Mode, setC3Mode] = useState<'inc' | 'dec'>('inc');
  const [c3Res, setC3Res] = useState<string | null>(null);
  const [c3Phrase, setC3Phrase] = useState<string | null>(null);
  const [c3Err, setC3Err] = useState<string | null>(null);

  // Calc 4: Variation Rate
  const [c4Start, setC4Start] = useState('');
  const [c4End, setC4End] = useState('');
  const [c4Res, setC4Res] = useState<string | null>(null);
  const [c4Phrase, setC4Phrase] = useState<string | null>(null);
  const [c4Err, setC4Err] = useState<string | null>(null);

  // Calc 5: Find Total
  const [c5Part, setC5Part] = useState('');
  const [c5Perc, setC5Perc] = useState('');
  const [c5Res, setC5Res] = useState<string | null>(null);
  const [c5Phrase, setC5Phrase] = useState<string | null>(null);
  const [c5Err, setC5Err] = useState<string | null>(null);

  // Calc 6: VAT France
  const [c6Mode, setC6Mode] = useState<VATMode>('HT_TO_TTC');
  const [c6Amt, setC6Amt] = useState('');
  const [c6Rate, setC6Rate] = useState('20');
  const [c6Res, setC6Res] = useState<string | null>(null);
  const [c6Phrase, setC6Phrase] = useState<string | null>(null);
  const [c6Err, setC6Err] = useState<string | null>(null);

  const formatNum = (n: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      maximumFractionDigits: precision,
      minimumFractionDigits: 0
    }).format(n);
  };

  const handleCopy = (text: string) => {
    const content = text.replace(/\s/g, '').replace(',', '.');
    navigator.clipboard.writeText(content);
  };

  // Recalculate results when precision changes
  useEffect(() => {
    if (c1Res) handleCalc1();
    if (c2Res) handleCalc2();
    if (c3Res) handleCalc3();
    if (c4Res) handleCalc4();
    if (c5Res) handleCalc5();
    if (c6Res) handleCalc6();
  }, [precision]);

  const handleCalc1 = () => {
    const p = parseFloat(c1Perc.replace(',', '.'));
    const t = parseFloat(c1Total.replace(',', '.'));
    if (isNaN(p) || isNaN(t)) return setC1Err('Nombres invalides');
    setC1Err(null);
    const res = (p / 100) * t;
    setC1Res(formatNum(res));
    setC1Phrase(`${p}% de ${t} = ${formatNum(res)}`);
  };

  const handleCalc2 = () => {
    const v = parseFloat(c2Val.replace(',', '.'));
    const t = parseFloat(c2Total.replace(',', '.'));
    if (isNaN(v) || isNaN(t)) return setC2Err('Nombres invalides');
    if (t === 0) return setC2Err('Total nul');
    setC2Err(null);
    const res = (v / t) * 100;
    setC2Res(`${formatNum(res)}%`);
    setC2Phrase(`${v} sur ${t} représente ${formatNum(res)}%`);
  };

  const handleCalc3 = () => {
    const v = parseFloat(c3Val.replace(',', '.'));
    const p = parseFloat(c3Perc.replace(',', '.'));
    if (isNaN(v) || isNaN(p)) return setC3Err('Nombres invalides');
    setC3Err(null);
    const multiplier = c3Mode === 'inc' ? (1 + p / 100) : (1 - p / 100);
    const res = v * multiplier;
    setC3Res(formatNum(res));
    setC3Phrase(`${v} ${c3Mode === 'inc' ? '+' : '-'} ${p}% = ${formatNum(res)}`);
  };

  const handleCalc4 = () => {
    const s = parseFloat(c4Start.replace(',', '.'));
    const e = parseFloat(c4End.replace(',', '.'));
    if (isNaN(s) || isNaN(e)) return setC4Err('Nombres invalides');
    if (s === 0) return setC4Err('Départ nul');
    setC4Err(null);
    const res = ((e - s) / s) * 100;
    const sign = res > 0 ? '+' : '';
    setC4Res(`${sign}${formatNum(res)}%`);
    setC4Phrase(`De ${s} à ${e}, la variation est de ${sign}${formatNum(res)}%`);
  };

  const handleCalc5 = () => {
    const part = parseFloat(c5Part.replace(',', '.'));
    const p = parseFloat(c5Perc.replace(',', '.'));
    if (isNaN(part) || isNaN(p)) return setC5Err('Nombres invalides');
    if (p === 0) return setC5Err('Pourcentage nul');
    setC5Err(null);
    const res = part / (p / 100);
    setC5Res(formatNum(res));
    setC5Phrase(`Si ${part} représente ${p}%, alors le total est ${formatNum(res)}`);
  };

  const handleCalc6 = () => {
    const amt = parseFloat(c6Amt.replace(',', '.'));
    const r = parseFloat(c6Rate.replace(',', '.'));
    if (isNaN(amt) || isNaN(r)) return setC6Err('Nombres invalides');
    setC6Err(null);

    let ht = 0, tva = 0, ttc = 0;
    const rateFactor = r / 100;

    if (c6Mode === 'HT_TO_TTC') {
      ht = amt;
      tva = ht * rateFactor;
      ttc = ht + tva;
    } else if (c6Mode === 'TTC_TO_HT') {
      ttc = amt;
      ht = ttc / (1 + rateFactor);
      tva = ttc - ht;
    } else {
      tva = amt;
      ht = tva / rateFactor;
      ttc = ht + tva;
    }

    const resStr = c6Mode === 'HT_TO_TTC' ? `TTC: ${formatNum(ttc)} €` : 
                   c6Mode === 'TTC_TO_HT' ? `HT: ${formatNum(ht)} €` : 
                   `HT: ${formatNum(ht)} / TTC: ${formatNum(ttc)}`;
    
    setC6Res(resStr);
    setC6Phrase(`HT: ${formatNum(ht)} € | TVA (${r}%): ${formatNum(tva)} € | TTC: ${formatNum(ttc)} €`);
  };

  const resetAll = (setters: React.Dispatch<React.SetStateAction<string>>[]) => {
    setters.forEach(s => s(''));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveView(View.CALCULATOR)}>
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg">%</div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">CalculerUn<span className="text-indigo-600">Pourcentage</span></h1>
          </div>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setActiveView(activeView === View.CALCULATOR ? View.HELP : View.CALCULATOR)}
              className={`text-sm font-bold uppercase tracking-wider transition-colors ${activeView === View.HELP ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {activeView === View.CALCULATOR ? 'Aide & Réglages' : 'Calculatrice'}
            </button>
          </nav>
        </div>
      </header>

      {activeView === View.CALCULATOR ? (
        <main className="flex-grow max-w-7xl mx-auto px-4 w-full py-6 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <CalculatorCard
              title="Part d'un total"
              description="Calculer X% d'une valeur totale."
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>}
              result={c1Res}
              resultPhrase={c1Phrase}
              error={c1Err}
              onCalculate={handleCalc1}
              onReset={() => { resetAll([setC1Perc, setC1Total]); setC1Res(null); }}
              onExample={() => { setC1Perc('20'); setC1Total('103'); }}
              onCopy={(t) => handleCopy(t)}
            >
              <InputGroup label="Pourcentage" value={c1Perc} onChange={setC1Perc} onEnter={handleCalc1} placeholder="20" suffix="%" />
              <InputGroup label="Total" value={c1Total} onChange={setC1Total} onEnter={handleCalc1} placeholder="103" />
            </CalculatorCard>

            <CalculatorCard
              title="Ratio en %"
              description="Quelle part représente X par rapport à Y ?"
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>}
              result={c2Res}
              resultPhrase={c2Phrase}
              error={c2Err}
              onCalculate={handleCalc2}
              onReset={() => { resetAll([setC2Val, setC2Total]); setC2Res(null); }}
              onExample={() => { setC2Val('50'); setC2Total('200'); }}
              onCopy={(t) => handleCopy(t)}
            >
              <InputGroup label="Valeur" value={c2Val} onChange={setC2Val} onEnter={handleCalc2} placeholder="50" />
              <InputGroup label="Total" value={c2Total} onChange={setC2Total} onEnter={handleCalc2} placeholder="200" />
            </CalculatorCard>

            <CalculatorCard
              title="Évolution"
              description="Appliquer une hausse ou une baisse."
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
              result={c3Res}
              resultPhrase={c3Phrase}
              error={c3Err}
              onCalculate={handleCalc3}
              onReset={() => { resetAll([setC3Val, setC3Perc]); setC3Res(null); }}
              onExample={() => { setC3Val('120'); setC3Perc('15'); setC3Mode('inc'); }}
              onCopy={(t) => handleCopy(t)}
            >
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opération</label>
                <div className="flex p-1 bg-slate-100 rounded-lg">
                  <button onClick={() => setC3Mode('inc')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${c3Mode === 'inc' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Hausse</button>
                  <button onClick={() => setC3Mode('dec')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${c3Mode === 'dec' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>Baisse</button>
                </div>
              </div>
              <InputGroup label="Base" value={c3Val} onChange={setC3Val} onEnter={handleCalc3} placeholder="120" />
              <InputGroup label="Taux" value={c3Perc} onChange={setC3Perc} onEnter={handleCalc3} placeholder="15" suffix="%" />
            </CalculatorCard>

            <CalculatorCard
              title="Taux de variation"
              description="Variation entre deux valeurs."
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>}
              result={c4Res}
              resultPhrase={c4Phrase}
              error={c4Err}
              onCalculate={handleCalc4}
              onReset={() => { resetAll([setC4Start, setC4End]); setC4Res(null); }}
              onExample={() => { setC4Start('100'); setC4End('150'); }}
              onCopy={(t) => handleCopy(t)}
            >
              <InputGroup label="Départ" value={c4Start} onChange={setC4Start} onEnter={handleCalc4} placeholder="100" />
              <InputGroup label="Arrivée" value={c4End} onChange={setC4End} onEnter={handleCalc4} placeholder="150" />
            </CalculatorCard>

            <CalculatorCard
              title="Retrouver le total"
              description="Trouver le total à partir d'une part connue."
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>}
              result={c5Res}
              resultPhrase={c5Phrase}
              error={c5Err}
              onCalculate={handleCalc5}
              onReset={() => { resetAll([setC5Part, setC5Perc]); setC5Res(null); }}
              onExample={() => { setC5Part('20.6'); setC5Perc('20'); }}
              onCopy={(t) => handleCopy(t)}
            >
              <InputGroup label="Part connue" value={c5Part} onChange={setC5Part} onEnter={handleCalc5} placeholder="20.6" />
              <InputGroup label="Pourcentage" value={c5Perc} onChange={setC5Perc} onEnter={handleCalc5} placeholder="20" suffix="%" />
            </CalculatorCard>

            <CalculatorCard
              title="TVA (France)"
              description="Calculs HT / TVA / TTC instantanés."
              icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
              result={c6Res}
              resultPhrase={c6Phrase}
              error={c6Err}
              onCalculate={handleCalc6}
              onReset={() => { resetAll([setC6Amt]); setC6Res(null); }}
              onExample={() => { setC6Amt('100'); setC6Rate('20'); setC6Mode('HT_TO_TTC'); }}
              onCopy={(t) => handleCopy(t)}
            >
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Mode</label>
                <div className="flex p-0.5 bg-slate-100 rounded-lg overflow-x-auto no-scrollbar">
                  <button onClick={() => setC6Mode('HT_TO_TTC')} className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded transition-all whitespace-nowrap ${c6Mode === 'HT_TO_TTC' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>HT → TTC</button>
                  <button onClick={() => setC6Mode('TTC_TO_HT')} className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded transition-all whitespace-nowrap ${c6Mode === 'TTC_TO_HT' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>TTC → HT</button>
                  <button onClick={() => setC6Mode('TVA_ONLY')} className={`flex-1 py-1.5 px-2 text-[10px] font-bold rounded transition-all whitespace-nowrap ${c6Mode === 'TVA_ONLY' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}`}>TVA → Tout</button>
                </div>
              </div>
              <InputGroup label="Montant (€)" value={c6Amt} onChange={setC6Amt} onEnter={handleCalc6} placeholder="100" />
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Taux (%)</label>
                <div className="grid grid-cols-2 gap-1">
                  {['20', '10', '5.5', '2.1'].map(r => (
                    <button key={r} onClick={() => setC6Rate(r)} className={`py-1 text-[10px] font-bold border rounded-md transition-all ${c6Rate === r ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300'}`}>{r}%</button>
                  ))}
                  <input type="number" step="any" value={c6Rate} onChange={(e) => setC6Rate(e.target.value)} className="col-span-2 mt-1 px-2 py-1 text-[10px] bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-indigo-400" placeholder="Autre %" />
                </div>
              </div>
            </CalculatorCard>

          </div>
        </main>
      ) : (
        <HelpSection 
          precision={precision} 
          onPrecisionChange={(p) => setPrecision(p as Precision)} 
        />
      )}

      <footer className="border-t border-slate-200 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
          <p>© 2024 CalculerUnPourcentage — Outil confidentiel sans serveur</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Opérationnel
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
