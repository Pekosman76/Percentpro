
import React, { useState } from 'react';
import { CalculatorCard } from './components/CalculatorCard';
import { InputGroup } from './components/InputGroup';

const App: React.FC = () => {
  // Calc 1: Percentage of Value
  const [c1Perc, setC1Perc] = useState('');
  const [c1Total, setC1Total] = useState('');
  const [c1Res, setC1Res] = useState<string | null>(null);
  const [c1Err, setC1Err] = useState<string | null>(null);

  // Calc 2: Value as Percentage
  const [c2Val, setC2Val] = useState('');
  const [c2Total, setC2Total] = useState('');
  const [c2Res, setC2Res] = useState<string | null>(null);
  const [c2Err, setC2Err] = useState<string | null>(null);

  // Calc 3: Increase/Decrease
  const [c3Val, setC3Val] = useState('');
  const [c3Perc, setC3Perc] = useState('');
  const [c3Mode, setC3Mode] = useState<'inc' | 'dec'>('inc');
  const [c3Res, setC3Res] = useState<string | null>(null);
  const [c3Err, setC3Err] = useState<string | null>(null);

  // Calc 4: Variation Rate
  const [c4Start, setC4Start] = useState('');
  const [c4End, setC4End] = useState('');
  const [c4Res, setC4Res] = useState<string | null>(null);
  const [c4Err, setC4Err] = useState<string | null>(null);

  const formatNum = (n: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(n);
  };

  const handleCalc1 = () => {
    const p = parseFloat(c1Perc);
    const t = parseFloat(c1Total);
    if (isNaN(p) || isNaN(t)) return setC1Err('Nombres invalides');
    setC1Err(null);
    setC1Res(formatNum((p / 100) * t));
  };

  const handleCalc2 = () => {
    const v = parseFloat(c2Val);
    const t = parseFloat(c2Total);
    if (isNaN(v) || isNaN(t)) return setC2Err('Nombres invalides');
    if (t === 0) return setC2Err('Total nul');
    setC2Err(null);
    setC2Res(`${formatNum((v / t) * 100)}%`);
  };

  const handleCalc3 = () => {
    const v = parseFloat(c3Val);
    const p = parseFloat(c3Perc);
    if (isNaN(v) || isNaN(p)) return setC3Err('Nombres invalides');
    setC3Err(null);
    const multiplier = c3Mode === 'inc' ? (1 + p / 100) : (1 - p / 100);
    setC3Res(formatNum(v * multiplier));
  };

  const handleCalc4 = () => {
    const s = parseFloat(c4Start);
    const e = parseFloat(c4End);
    if (isNaN(s) || isNaN(e)) return setC4Err('Nombres invalides');
    if (s === 0) return setC4Err('Départ nul');
    setC4Err(null);
    const res = ((e - s) / s) * 100;
    const sign = res > 0 ? '+' : '';
    setC4Res(`${sign}${formatNum(res)}%`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar plus compacte */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">%</div>
            <h1 className="text-lg font-bold text-slate-800">PercentPro</h1>
          </div>
          <nav className="flex gap-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
            <a href="#" className="text-indigo-600">Calculatrice</a>
            <a href="#" className="hover:text-slate-800 transition-colors">Aide</a>
          </nav>
        </div>
      </header>

      {/* Hero Section réduit */}
      <main className="flex-grow max-w-6xl mx-auto px-4 w-full">
        <section className="py-6 md:py-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
            Calculatrice de <span className="text-indigo-600">Pourcentages</span>
          </h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto">
            Quatre outils essentiels regroupés sur une seule page pour des résultats instantanés.
          </p>
        </section>

        {/* Grille 2x2 optimisée */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          {/* Bloc 1 */}
          <CalculatorCard
            title="Part d'un total"
            description="Calculer X% d'une valeur totale."
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>}
            result={c1Res}
            error={c1Err}
            onCalculate={handleCalc1}
          >
            <InputGroup label="Pourcentage" value={c1Perc} onChange={setC1Perc} placeholder="20" suffix="%" />
            <InputGroup label="Total" value={c1Total} onChange={setC1Total} placeholder="500" />
          </CalculatorCard>

          {/* Bloc 2 */}
          <CalculatorCard
            title="Ratio en %"
            description="Quelle part représente X par rapport à Y ?"
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>}
            result={c2Res}
            error={c2Err}
            onCalculate={handleCalc2}
          >
            <InputGroup label="Valeur" value={c2Val} onChange={setC2Val} placeholder="50" />
            <InputGroup label="Total" value={c2Total} onChange={setC2Total} placeholder="200" />
          </CalculatorCard>

          {/* Bloc 3 */}
          <CalculatorCard
            title="Évolution"
            description="Appliquer une hausse ou une baisse."
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>}
            result={c3Res}
            error={c3Err}
            onCalculate={handleCalc3}
          >
            <div className="flex flex-col gap-1 sm:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Opération</label>
              <div className="flex p-0.5 bg-slate-100 rounded-lg">
                <button 
                  onClick={() => setC3Mode('inc')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${c3Mode === 'inc' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  Hausse
                </button>
                <button 
                  onClick={() => setC3Mode('dec')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${c3Mode === 'dec' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
                >
                  Baisse
                </button>
              </div>
            </div>
            <InputGroup label="Base" value={c3Val} onChange={setC3Val} placeholder="120" />
            <InputGroup label="Taux" value={c3Perc} onChange={setC3Perc} placeholder="15" suffix="%" />
          </CalculatorCard>

          {/* Bloc 4 */}
          <CalculatorCard
            title="Taux de variation"
            description="Calculer le % de changement entre deux valeurs."
            icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>}
            result={c4Res}
            error={c4Err}
            onCalculate={handleCalc4}
          >
            <InputGroup label="Départ" value={c4Start} onChange={setC4Start} placeholder="100" />
            <InputGroup label="Arrivée" value={c4End} onChange={setC4End} placeholder="150" />
          </CalculatorCard>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400 text-[11px] font-medium uppercase tracking-widest">
          <p>© 2024 PercentPro — Outil de précision</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
