
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const h = React.createElement;
const Fragment = React.Fragment;

// --- COMPONENS ---

const InputGroup = ({ label, value, onChange, onEnter, placeholder, suffix, id }) => {
  return h('div', { className: "flex flex-col gap-1 w-full" }, [
    h('label', { htmlFor: id, className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest" }, label),
    h('div', { className: "relative" }, [
      h('input', {
        id,
        type: "number",
        step: "any",
        value,
        onChange: (e) => onChange(e.target.value),
        onKeyDown: (e) => e.key === 'Enter' && onEnter && onEnter(),
        placeholder,
        className: "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-900 shadow-sm text-sm"
      }),
      suffix && h('span', { className: "absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none" }, suffix)
    ])
  ]);
};

const CalculatorCard = ({ title, description, children, result, resultPhrase, error, onCalculate, onReset, onExample, icon, onCopy }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);

  const handleCopy = () => {
    if (!result || !onCopy) return;
    onCopy(result);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1200);
  };

  const clonedIcon = React.isValidElement(icon) 
    ? React.cloneElement(icon, { className: "w-5 h-5" }) 
    : icon;

  return h('div', { className: "bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group" }, [
    h('div', { className: "p-5 flex-grow" }, [
      h('div', { className: "flex items-start justify-between mb-4" }, [
        h('div', { className: "flex items-center gap-3" }, [
          h('div', { className: "p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0" }, clonedIcon),
          h('div', {}, [
            h('h3', { className: "text-base font-bold text-slate-900 leading-tight" }, title),
            h('p', { className: "text-[11px] text-slate-500 line-clamp-1" }, description)
          ])
        ]),
        h('div', { className: "flex gap-1" }, [
          h('button', { onClick: onExample, title: "Exemple", className: "p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" }, 
            h('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, 
              h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })
            )
          ),
          h('button', { onClick: onReset, title: "Réinitialiser", className: "p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" }, 
            h('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, 
              h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" })
            )
          )
        ])
      ]),
      h('div', { className: "space-y-4" }, [
        h('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, children),
        h('button', { onClick: onCalculate, className: "w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md shadow-indigo-100 active:scale-[0.98]" }, "Calculer"),
        (result !== null || error !== null) && h('div', { className: `p-3 rounded-lg animate-in fade-in zoom-in-95 duration-200 relative ${error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}` }, [
          h('div', { className: "flex flex-col items-center text-center" }, [
            h('span', { className: "text-[10px] uppercase tracking-widest font-bold mb-0.5 opacity-70" }, error ? 'Erreur' : 'Résultat'),
            h('div', { className: "flex items-center gap-2 max-w-full" }, [
              h('span', { className: "text-xl font-black break-all" }, error || result),
              !error && onCopy && h('button', { onClick: handleCopy, className: "p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors relative", title: "Copier" }, [
                h('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, 
                  h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" })
                ),
                copyFeedback && h('span', { className: "absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap animate-bounce" }, "Copié !")
              ])
            ]),
            resultPhrase && !error && h('p', { className: "text-[10px] mt-1 opacity-60 font-medium italic" }, resultPhrase)
          ])
        ])
      ])
    ])
  ]);
};

const HelpSection = ({ precision, onPrecisionChange }) => {
  const sections = [
    { id: 'settings', title: 'Réglages d\'affichage' },
    { id: 'intro', title: 'Introduction' },
    { id: 'part', title: 'Part d\'un total' },
    { id: 'ratio', title: 'Ratio en %' },
    { id: 'evolution', title: 'Évolution' },
    { id: 'variation', title: 'Taux de variation' },
    { id: 'total', title: 'Retrouver le total' },
    { id: 'tva', title: 'TVA (France)' },
    { id: 'privacy', title: 'Confidentialité' }
  ];

  return h('div', { className: "max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500" }, [
    h('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10" }, [
      h('h2', { className: "text-3xl font-black text-slate-900 mb-6" }, "Aide & Réglages"),
      h('nav', { className: "mb-10 bg-slate-50 p-4 rounded-xl border border-slate-100" }, [
        h('p', { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3" }, "Sommaire"),
        h('ul', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, sections.map(s => 
          h('li', { key: s.id, className: "text-sm text-slate-600 font-medium flex items-center gap-2" }, [
            h('span', { className: "w-1.5 h-1.5 bg-indigo-300 rounded-full" }),
            s.title
          ])
        ))
      ]),
      h('div', { className: "space-y-12 text-slate-600 leading-relaxed" }, [
        h('section', { id: "settings", className: "bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2" }, "Réglages d'affichage"),
          h('div', { className: "max-w-md" }, [
            h('p', { className: "text-sm font-semibold text-slate-700 mb-3" }, "Décimales après la virgule"),
            h('div', { className: "flex bg-slate-200/50 p-1 rounded-xl" }, [0, 1, 2, 3].map(v => 
              h('button', {
                key: v,
                onClick: () => onPrecisionChange(v),
                className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${precision === v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`
              }, `${v} déc.`)
            ))
          ])
        ]),
        h('section', { id: "privacy" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Confidentialité"),
          h('p', {}, "Tous les calculs s'effectuent localement dans votre navigateur. Aucune donnée n'est transmise à un serveur.")
        ])
      ])
    ])
  ]);
};

// --- MAIN APP ---

const App = () => {
  const [activeView, setActiveView] = useState('CALCULATOR');
  const [precision, setPrecision] = useState(2);

  const formatNum = (n) => new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: precision,
    minimumFractionDigits: 0
  }).format(n);

  const handleCopy = (text) => {
    const content = text.replace(/\s/g, '').replace(',', '.');
    navigator.clipboard.writeText(content);
  };

  // State for all calculators
  const [c1, setC1] = useState({ p: '', t: '', res: null, ph: null, err: null });
  const [c2, setC2] = useState({ v: '', t: '', res: null, ph: null, err: null });
  const [c3, setC3] = useState({ v: '', p: '', mode: 'inc', res: null, ph: null, err: null });

  const calc1 = () => {
    const p = parseFloat(c1.p.replace(',', '.')), t = parseFloat(c1.t.replace(',', '.'));
    if (isNaN(p) || isNaN(t)) return setC1({ ...c1, err: 'Nombres invalides' });
    const res = (p / 100) * t;
    setC1({ ...c1, res: formatNum(res), ph: `${p}% de ${t} = ${formatNum(res)}`, err: null });
  };

  const calc2 = () => {
    const v = parseFloat(c2.v.replace(',', '.')), t = parseFloat(c2.t.replace(',', '.'));
    if (isNaN(v) || isNaN(t) || t === 0) return setC2({ ...c2, err: 'Invalide' });
    const res = (v / t) * 100;
    setC2({ ...c2, res: `${formatNum(res)}%`, ph: `${v} sur ${t} = ${formatNum(res)}%`, err: null });
  };

  const calc3 = () => {
    const v = parseFloat(c3.v.replace(',', '.')), p = parseFloat(c3.p.replace(',', '.'));
    if (isNaN(v) || isNaN(p)) return setC3({ ...c3, err: 'Invalide' });
    const res = c3.mode === 'inc' ? v * (1 + p/100) : v * (1 - p/100);
    setC3({ ...c3, res: formatNum(res), ph: `${v} ${c3.mode === 'inc' ? '+' : '-'} ${p}% = ${formatNum(res)}`, err: null });
  };

  return h('div', { className: "min-h-screen flex flex-col bg-slate-50" }, [
    h('header', { className: "bg-white border-b border-slate-200 sticky top-0 z-50" }, 
      h('div', { className: "max-w-7xl mx-auto px-4 h-14 flex items-center justify-between" }, [
        h('div', { className: "flex items-center gap-2 cursor-pointer", onClick: () => setActiveView('CALCULATOR') }, [
          h('div', { className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg" }, "%"),
          h('h1', { className: "text-xl font-black text-slate-800" }, [ "CalculerUn", h('span', { className: "text-indigo-600" }, "Pourcentage") ])
        ]),
        h('nav', {}, h('button', { 
          onClick: () => setActiveView(activeView === 'CALCULATOR' ? 'HELP' : 'CALCULATOR'),
          className: `text-sm font-bold uppercase tracking-wider ${activeView === 'HELP' ? 'text-indigo-600' : 'text-slate-400'}`
        }, activeView === 'CALCULATOR' ? 'Aide' : 'Calculatrice'))
      ])
    ),

    activeView === 'CALCULATOR' ? 
      h('main', { className: "flex-grow max-w-7xl mx-auto px-4 w-full py-10" }, 
        h('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
          h(CalculatorCard, {
            title: "Part d'un total",
            description: "Calculer X% d'une valeur.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", strokeWidth: "2" })),
            result: c1.res, resultPhrase: c1.ph, error: c1.err,
            onCalculate: calc1, onReset: () => setC1({ ...c1, p: '', t: '', res: null }), onExample: () => setC1({ ...c1, p: '20', t: '100' }),
            onCopy: handleCopy
          }, [
            h(InputGroup, { label: "Pourcentage", value: c1.p, onChange: (v) => setC1({...c1, p: v}), placeholder: "20", suffix: "%" }),
            h(InputGroup, { label: "Total", value: c1.t, onChange: (v) => setC1({...c1, t: v}), placeholder: "100" })
          ]),

          h(CalculatorCard, {
            title: "Ratio en %",
            description: "Quelle part représente X sur Y ?",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", strokeWidth: "2" })),
            result: c2.res, resultPhrase: c2.ph, error: c2.err,
            onCalculate: calc2, onReset: () => setC2({ ...c2, v: '', t: '', res: null }), onExample: () => setC2({ ...c2, v: '50', t: '200' }),
            onCopy: handleCopy
          }, [
            h(InputGroup, { label: "Valeur", value: c2.v, onChange: (v) => setC2({...c2, v: v}), placeholder: "50" }),
            h(InputGroup, { label: "Total", value: c2.t, onChange: (v) => setC2({...c2, t: v}), placeholder: "200" })
          ]),

          h(CalculatorCard, {
            title: "Évolution",
            description: "Hausse ou baisse en %.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", strokeWidth: "2" })),
            result: c3.res, resultPhrase: c3.ph, error: c3.err,
            onCalculate: calc3, onReset: () => setC3({ ...c3, v: '', p: '', res: null }), onExample: () => setC3({ ...c3, v: '100', p: '10' }),
            onCopy: handleCopy
          }, [
            h('div', { className: "flex flex-col gap-1 sm:col-span-2" }, [
              h('label', { className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest" }, "Mode"),
              h('div', { className: "flex p-1 bg-slate-100 rounded-lg" }, [
                h('button', { onClick: () => setC3({...c3, mode: 'inc'}), className: `flex-1 py-1 text-xs font-bold rounded ${c3.mode === 'inc' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, "Hausse"),
                h('button', { onClick: () => setC3({...c3, mode: 'dec'}), className: `flex-1 py-1 text-xs font-bold rounded ${c3.mode === 'dec' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, "Baisse")
              ])
            ]),
            h(InputGroup, { label: "Valeur", value: c3.v, onChange: (v) => setC3({...c3, v: v}), placeholder: "100" }),
            h(InputGroup, { label: "Taux", value: c3.p, onChange: (v) => setC3({...c3, p: v}), placeholder: "10", suffix: "%" })
          ])
        ])
      ) : 
      h(HelpSection, { precision, onPrecisionChange: setPrecision }),

    h('footer', { className: "border-t border-slate-200 py-6 bg-white mt-auto" }, 
      h('div', { className: "max-w-7xl mx-auto px-4 flex justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest" }, [
        h('p', {}, "© 2024 CalculerUnPourcentage"),
        h('span', { className: "flex items-center gap-1" }, [ h('span', { className: "w-1.5 h-1.5 bg-emerald-500 rounded-full" }), "Opérationnel" ])
      ])
    )
  ]);
};

// --- RENDER ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));
