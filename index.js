
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const h = React.createElement;

// --- COMPOSANTS UI DE BASE ---

const InputGroup = ({ label, value, onChange, onEnter, placeholder, suffix, id }) => {
  return h('div', { className: "flex flex-col gap-1 w-full" }, [
    h('label', { htmlFor: id, className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest" }, label),
    h('div', { className: "relative" }, [
      h('input', {
        id,
        type: "text",
        inputMode: "decimal",
        value,
        onChange: (e) => onChange(e.target.value.replace('.', ',')),
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
    onCopy(resultPhrase || result);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1200);
  };

  return h('div', { className: "bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group" }, [
    h('div', { className: "p-5 flex-grow" }, [
      h('div', { className: "flex items-start justify-between mb-4" }, [
        h('div', { className: "flex items-center gap-3" }, [
          h('div', { className: "p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0" }, 
            React.cloneElement(icon, { className: "w-5 h-5" })
          ),
          h('div', {}, [
            h('h3', { className: "text-base font-bold text-slate-900 leading-tight" }, title),
            h('p', { className: "text-[11px] text-slate-500 line-clamp-1" }, description)
          ])
        ]),
        h('div', { className: "flex gap-1" }, [
          h('button', { onClick: onExample, title: "Exemple", className: "p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" }, 
            h('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }))
          ),
          h('button', { onClick: onReset, title: "Réinitialiser", className: "p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" }, 
            h('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }))
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
                h('svg', { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" })),
                copyFeedback && h('span', { className: "absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap animate-bounce shadow-lg" }, "Copié !")
              ])
            ]),
            resultPhrase && !error && h('p', { className: "text-[10px] mt-1 opacity-60 font-medium italic" }, resultPhrase)
          ])
        ])
      ])
    ])
  ]);
};

// --- SECTION AIDE DÉTAILLÉE ---

const HelpSection = ({ precision, onPrecisionChange }) => {
  const sections = [
    { id: 'settings', title: 'Réglages d\'affichage' },
    { id: 'intro', title: 'Introduction' },
    { id: 'part', title: 'Part d\'un total' },
    { id: 'ratio', title: 'Ratio en %' },
    { id: 'evolution', title: 'Évolution (Hausse/Baisse)' },
    { id: 'variation', title: 'Taux de variation' },
    { id: 'total', title: 'Retrouver le total' },
    { id: 'tva', title: 'TVA (France)' },
    { id: 'faq', title: 'FAQ' },
    { id: 'privacy', title: 'Confidentialité' },
  ];

  return h('div', { className: "max-w-4xl mx-auto py-8 px-4" }, [
    h('div', { className: "bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10" }, [
      h('h2', { className: "text-3xl font-black text-slate-900 mb-6" }, "Aide & Réglages"),
      
      h('nav', { className: "mb-10 bg-slate-50 p-4 rounded-xl border border-slate-100" }, [
        h('p', { className: "text-xs font-bold text-slate-400 uppercase tracking-widest mb-3" }, "Sommaire"),
        h('ul', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2" }, sections.map(s => 
          h('li', { key: s.id, className: "text-sm" }, 
            h('a', { href: `#${s.id}`, className: "text-slate-600 hover:text-indigo-600 flex items-center gap-2 transition-colors" }, [
              h('span', { className: "w-1 h-1 bg-indigo-300 rounded-full" }),
              s.title
            ])
          )
        ))
      ]),

      h('div', { className: "space-y-12 text-slate-600 leading-relaxed" }, [
        
        h('section', { id: "settings", className: "bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-4 flex items-center gap-2" }, "Réglages d'affichage"),
          h('div', { className: "max-w-md" }, [
            h('p', { className: "text-sm font-semibold text-slate-700 mb-3" }, "Nombre de décimales"),
            h('div', { className: "flex bg-slate-200/50 p-1 rounded-xl" }, [0, 1, 2, 3].map(v => 
              h('button', {
                key: v,
                onClick: () => onPrecisionChange(v),
                className: `flex-1 py-2 text-xs font-bold rounded-lg transition-all ${precision === v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`
              }, `${v} déc.`)
            )),
            h('p', { className: "mt-4 text-xs" }, "Le site utilise le format français (virgule pour les décimales et espaces pour les milliers). Les réglages sont conservés localement sur votre appareil.")
          ])
        ]),

        h('section', { id: "intro", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Introduction"),
          h('p', {}, "CalculerUnPourcentage est un outil complet conçu pour répondre à tous vos besoins numériques quotidiens. Que ce soit pour vérifier une remise lors des soldes, calculer une commission, gérer la fiscalité d'une entreprise ou analyser une évolution budgétaire, notre interface modulaire vous offre des réponses instantanées."),
          h('p', { className: "mt-2" }, "Tous les modules ont été optimisés pour un usage mobile-first : saisie facilitée, boutons de copie rapide et fonctionnement hors-ligne (une fois la page chargée).")
        ]),

        h('section', { id: "part", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Part d'un total"),
          h('p', {}, "C'est l'opération la plus classique. Elle permet de trouver le montant d'une portion à partir d'un pourcentage connu."),
          h('p', { className: "font-semibold mt-4 text-slate-800" }, "Cas d'usage :"),
          h('ul', { className: "list-disc ml-5 text-sm" }, [
            h('li', {}, "Calculer une remise de 15% sur un article à 80€."),
            h('li', {}, "Déterminer le montant d'un pourboire de 10% sur une addition."),
            h('li', {}, "Connaître la part de marché d'un produit (ex: 20% des ventes).")
          ]),
          h('div', { className: "mt-4 bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 font-mono text-sm" }, "Valeur = Total × (Pourcentage / 100)"),
          h('p', { className: "mt-2 italic text-xs" }, "Exemple : 20% de 103 = 20,6")
        ]),

        h('section', { id: "ratio", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Ratio en %"),
          h('p', {}, "Ce module répond à la question : 'Quelle part représente ce montant par rapport à l'ensemble ?'."),
          h('p', { className: "font-semibold mt-4 text-slate-800" }, "Exemple :"),
          h('p', {}, "Si vous avez 50 bonnes réponses sur un test de 200 questions, vous voulez savoir quel est votre pourcentage de réussite."),
          h('div', { className: "mt-4 bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 font-mono text-sm" }, "Pourcentage = (Valeur / Total) × 100"),
          h('p', { className: "mt-2 text-xs text-red-500" }, "Attention : Le total ne peut pas être égal à 0.")
        ]),

        h('section', { id: "evolution", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Évolution (Hausse / Baisse)"),
          h('p', {}, "Appliquez directement un changement à une valeur de départ. Très utile pour les prix après remise ou après inflation."),
          h('div', { className: "mt-4 space-y-2" }, [
            h('div', { className: "bg-slate-50 p-3 rounded-lg border-l-4 border-emerald-500 font-mono text-sm" }, "Hausse : Nouveau = Base × (1 + Taux/100)"),
            h('div', { className: "bg-slate-50 p-3 rounded-lg border-l-4 border-rose-500 font-mono text-sm" }, "Baisse : Nouveau = Base × (1 - Taux/100)")
          ]),
          h('p', { className: "mt-4 italic" }, "Saviez-vous qu'une baisse de 20% suivie d'une hausse de 20% ne ramène pas au prix initial ? (100€ → 80€ → 96€).")
        ]),

        h('section', { id: "variation", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Taux de variation"),
          h('p', {}, "Comparez deux valeurs pour connaître la variation relative entre elles."),
          h('p', { className: "font-semibold mt-4 text-slate-800" }, "Application :"),
          h('p', {}, "Mesurer la croissance du chiffre d'affaires entre deux années ou l'évolution du prix de l'essence entre deux pleins."),
          h('div', { className: "mt-4 bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 font-mono text-sm" }, "Variation % = ((Arrivée - Départ) / Départ) × 100"),
          h('p', { className: "mt-2 italic text-xs" }, "Exemple : de 100€ à 150€ = +50%.")
        ]),

        h('section', { id: "total", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Retrouver le total"),
          h('p', {}, "Cette opération 'inverse' permet de déduire le montant total à partir d'une portion connue. C'est l'outil parfait pour retrouver un prix avant remise si vous connaissez le montant de la remise et son pourcentage."),
          h('div', { className: "mt-4 bg-slate-50 p-3 rounded-lg border-l-4 border-indigo-500 font-mono text-sm" }, "Total = Part / (Pourcentage / 100)"),
          h('p', { className: "mt-2 italic text-xs" }, "Exemple : Si 20€ représente 10% d'un budget, alors le budget total est de 200€.")
        ]),

        h('section', { id: "tva", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "TVA (France)"),
          h('p', {}, "Gérez votre fiscalité en un clic. Ce module permet de basculer entre le Hors Taxes (HT) et le Toutes Taxes Comprises (TTC)."),
          h('div', { className: "mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4" }, [
            h('div', { className: "p-4 bg-slate-50 rounded-xl" }, [
              h('p', { className: "font-bold text-indigo-600 mb-2" }, "Taux standards :"),
              h('ul', { className: "text-xs space-y-1" }, [
                h('li', {}, "• 20% : Taux normal (biens/services)"),
                h('li', {}, "• 10% : Restauration, travaux"),
                h('li', {}, "• 5,5% : Alimentation, livres"),
                h('li', {}, "• 2,1% : Presse, médicaments")
              ])
            ]),
            h('div', { className: "p-4 bg-slate-50 rounded-xl" }, [
              h('p', { className: "font-bold text-indigo-600 mb-2" }, "Calculs :"),
              h('p', { className: "text-[11px]" }, "TTC = HT × (1 + Taux/100)"),
              h('p', { className: "text-[11px]" }, "HT = TTC / (1 + Taux/100)"),
              h('p', { className: "text-[11px] mt-2 font-semibold" }, "Note : En mode TTC vers HT, le résultat affiché est le montant net sans taxes.")
            ])
          ])
        ]),

        h('section', { id: "faq", className: "scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "FAQ"),
          h('div', { className: "space-y-4" }, [
            h('div', {}, [
              h('p', { className: "font-bold text-slate-800 text-sm" }, "Pourquoi mon résultat affiche 'Invalide' ?"),
              h('p', { className: "text-xs" }, "Cela arrive généralement quand une division par zéro est tentée (ex: ratio sur un total de 0) ou si les caractères saisis ne sont pas des nombres.")
            ]),
            h('div', {}, [
              h('p', { className: "font-bold text-slate-800 text-sm" }, "Le site gère-t-il les arrondis ?"),
              h('p', { className: "text-xs" }, "Oui, vous pouvez choisir entre 0 et 3 décimales dans la section Réglages. Par défaut, nous utilisons 2 décimales pour les montants monétaires.")
            ])
          ])
        ]),

        h('section', { id: "privacy", className: "pt-6 border-t border-slate-100 scroll-mt-20" }, [
          h('h3', { className: "text-xl font-bold text-slate-900 mb-3" }, "Confidentialité"),
          h('p', {}, "Contrairement à de nombreux outils en ligne, vos données ne quittent jamais votre navigateur. "),
          h('ul', { className: "list-disc ml-5 mt-2 space-y-1 text-sm font-medium text-slate-500" }, [
            h('li', {}, "Aucun envoi de données vers un serveur."),
            h('li', {}, "Pas de tracking publicitaire intrusif."),
            h('li', {}, "Conservation locale de vos préférences uniquement."),
            h('li', {}, "Code source transparent fonctionnant à 100% en JavaScript local.")
          ])
        ])
      ])
    ])
  ]);
};

// --- APP PRINCIPALE ---

const App = () => {
  const [activeView, setActiveView] = useState('CALCULATOR');
  const [precision, setPrecision] = useState(2);

  const formatNum = useCallback((n) => {
    return new Intl.NumberFormat('fr-FR', { 
      maximumFractionDigits: precision,
      minimumFractionDigits: 0
    }).format(n);
  }, [precision]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text.replace(/\s/g, '').replace(',', '.'));
  };

  // States pour les calculateurs
  const [c1, setC1] = useState({ p: '', t: '', res: null, ph: null, err: null });
  const [c2, setC2] = useState({ v: '', t: '', res: null, ph: null, err: null });
  const [c3, setC3] = useState({ v: '', p: '', mode: 'inc', res: null, ph: null, err: null });
  const [c4, setC4] = useState({ s: '', e: '', res: null, ph: null, err: null });
  const [c5, setC5] = useState({ part: '', p: '', res: null, ph: null, err: null });
  const [c6, setC6] = useState({ mode: 'HT_TO_TTC', amt: '', rate: '20', res: null, ph: null, err: null });

  // Logique des calculs
  const runC1 = () => {
    const p = parseFloat((c1.p || '0').replace(',', '.')), t = parseFloat((c1.t || '0').replace(',', '.'));
    if (isNaN(p) || isNaN(t)) return setC1({ ...c1, err: 'Nombres invalides' });
    const r = (p / 100) * t;
    setC1({ ...c1, res: formatNum(r), ph: `${p}% de ${t} = ${formatNum(r)}`, err: null });
  };

  const runC2 = () => {
    const v = parseFloat((c2.v || '0').replace(',', '.')), t = parseFloat((c2.t || '0').replace(',', '.'));
    if (isNaN(v) || isNaN(t) || t === 0) return setC2({ ...c2, err: 'Total nul impossible' });
    const r = (v / t) * 100;
    setC2({ ...c2, res: `${formatNum(r)}%`, ph: `${v} sur ${t} = ${formatNum(r)}%`, err: null });
  };

  const runC3 = () => {
    const v = parseFloat((c3.v || '0').replace(',', '.')), p = parseFloat((c3.p || '0').replace(',', '.'));
    if (isNaN(v) || isNaN(p)) return setC3({ ...c3, err: 'Invalide' });
    const r = c3.mode === 'inc' ? v * (1 + p/100) : v * (1 - p/100);
    setC3({ ...c3, res: formatNum(r), ph: `${v} ${c3.mode === 'inc' ? '+' : '-'} ${p}% = ${formatNum(r)}`, err: null });
  };

  const runC4 = () => {
    const s = parseFloat((c4.s || '0').replace(',', '.')), e = parseFloat((c4.e || '0').replace(',', '.'));
    if (isNaN(s) || isNaN(e) || s === 0) return setC4({ ...c4, err: 'Base nulle' });
    const r = ((e - s) / s) * 100;
    const sign = r > 0 ? '+' : '';
    setC4({ ...c4, res: `${sign}${formatNum(r)}%`, ph: `Variation: ${sign}${formatNum(r)}%`, err: null });
  };

  const runC5 = () => {
    const part = parseFloat((c5.part || '0').replace(',', '.')), p = parseFloat((c5.p || '0').replace(',', '.'));
    if (isNaN(part) || isNaN(p) || p === 0) return setC5({ ...c5, err: 'Pourcentage invalide' });
    const r = part / (p / 100);
    setC5({ ...c5, res: formatNum(r), ph: `Si ${part} = ${p}%, alors total = ${formatNum(r)}`, err: null });
  };

  const runC6 = () => {
    const amt = parseFloat((c6.amt || '0').replace(',', '.')), r = parseFloat((c6.rate || '0').replace(',', '.'));
    if (isNaN(amt) || isNaN(r)) return setC6({ ...c6, err: 'Nombres invalides' });
    let ht, tva, ttc, mainRes;
    const rateFactor = r / 100;

    if (c6.mode === 'HT_TO_TTC') {
      ht = amt;
      tva = ht * rateFactor;
      ttc = ht + tva;
      mainRes = `${formatNum(ttc)} € (TTC)`;
    } else if (c6.mode === 'TTC_TO_HT') {
      ttc = amt;
      ht = ttc / (1 + rateFactor);
      tva = ttc - ht;
      mainRes = `${formatNum(ht)} € (HT)`;
    } else {
      tva = amt;
      ht = tva / rateFactor;
      ttc = ht + tva;
      mainRes = `${formatNum(ht)} € (HT) / ${formatNum(ttc)} € (TTC)`;
    }
    setC6({ ...c6, res: mainRes, ph: `HT: ${formatNum(ht)}€ | TVA: ${formatNum(tva)}€ | TTC: ${formatNum(ttc)}€`, err: null });
  };

  return h('div', { className: "min-h-screen flex flex-col" }, [
    h('header', { className: "bg-white border-b border-slate-200 sticky top-0 z-50 h-14" }, 
      h('div', { className: "max-w-7xl mx-auto px-4 h-full flex items-center justify-between" }, [
        h('div', { className: "flex items-center gap-2 cursor-pointer", onClick: () => setActiveView('CALCULATOR') }, [
          h('div', { className: "w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg" }, "%"),
          h('h1', { className: "text-lg font-black text-slate-800 tracking-tighter sm:text-xl" }, [ "CalculerUn", h('span', { className: "text-indigo-600" }, "Pourcentage") ])
        ]),
        h('button', { 
          onClick: () => setActiveView(activeView === 'CALCULATOR' ? 'HELP' : 'CALCULATOR'),
          className: "text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
        }, activeView === 'CALCULATOR' ? 'Aide & Réglages' : 'Fermer l\'aide')
      ])
    ),

    activeView === 'CALCULATOR' ? 
      h('main', { className: "flex-grow max-w-7xl mx-auto px-4 w-full py-8" }, 
        h('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, [
          
          h(CalculatorCard, {
            title: "Part d'un total", description: "Calculer X% d'une valeur.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z", strokeWidth: "2" })),
            result: c1.res, resultPhrase: c1.ph, error: c1.err,
            onCalculate: runC1, onReset: () => setC1({ ...c1, p: '', t: '', res: null }), onExample: () => setC1({ ...c1, p: '20', t: '103' }),
            onCopy: handleCopy
          }, [
            h(InputGroup, { label: "Pourcentage", value: c1.p, onChange: (v) => setC1({...c1, p: v}), placeholder: "20", suffix: "%" }),
            h(InputGroup, { label: "Total", value: c1.t, onChange: (v) => setC1({...c1, t: v}), placeholder: "103" })
          ]),

          h(CalculatorCard, {
            title: "Ratio en %", description: "Quelle part représente X sur Y ?",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z", strokeWidth: "2" })),
            result: c2.res, resultPhrase: c2.ph, error: c2.err,
            onCalculate: runC2, onReset: () => setC2({ ...c2, v: '', t: '', res: null }), onExample: () => setC2({ ...c2, v: '50', t: '200' }),
            onCopy: handleCopy
          }, [
            h(InputGroup, { label: "Valeur", value: c2.v, onChange: (v) => setC2({...c2, v: v}), placeholder: "50" }),
            h(InputGroup, { label: "Total", value: c2.t, onChange: (v) => setC2({...c2, t: v}), placeholder: "200" })
          ]),

          h(CalculatorCard, {
            title: "Évolution", description: "Hausse ou baisse en %.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", strokeWidth: "2" })),
            result: c3.res, resultPhrase: c3.ph, error: c3.err,
            onCalculate: runC3, onReset: () => setC3({ ...c3, v: '', p: '', res: null }), onExample: () => setC3({ ...c3, v: '120', p: '15' }),
            onCopy: handleCopy
          }, [
            h('div', { className: "flex flex-col gap-1 sm:col-span-2" }, [
              h('div', { className: "flex p-1 bg-slate-100 rounded-lg" }, [
                h('button', { onClick: () => setC3({...c3, mode: 'inc'}), className: `flex-1 py-1 text-xs font-bold rounded ${c3.mode === 'inc' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, "Hausse"),
                h('button', { onClick: () => setC3({...c3, mode: 'dec'}), className: `flex-1 py-1 text-xs font-bold rounded ${c3.mode === 'dec' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, "Baisse")
              ])
            ]),
            h(InputGroup, { label: "Base", value: c3.v, onChange: (v) => setC3({...c3, v: v}), placeholder: "120" }),
            h(InputGroup, { label: "Taux", value: c3.p, onChange: (v) => setC3({...c3, p: v}), placeholder: "15", suffix: "%" })
          ]),

          h(CalculatorCard, {
            title: "Taux de variation", description: "Variation entre deux valeurs.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M7 12l3-3 3 3 4-4M8 21l4-4 4 4", strokeWidth: "2" })),
            result: c4.res, resultPhrase: c4.ph, error: c4.err,
            onCalculate: runC4, onReset: () => setC4({ ...c4, s: '', e: '', res: null }), onExample: () => setC4({ ...c4, s: '100', e: '150' }),
            onCopy: handleCopy
          }, [
            h(InputGroup, { label: "Départ", value: c4.s, onChange: (v) => setC4({...c4, s: v}), placeholder: "100" }),
            h(InputGroup, { label: "Arrivée", value: c4.e, onChange: (v) => setC4({...c4, e: v}), placeholder: "150" })
          ]),

          h(CalculatorCard, {
            title: "Retrouver le total", description: "Inverser un pourcentage.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", strokeWidth: "2" })),
            result: c5.res, resultPhrase: c5.ph, error: c5.err,
            onCalculate: runC5, onReset: () => setC5({ ...c5, part: '', p: '', res: null }), onExample: () => setC5({ ...c5, part: '20,6', p: '20' }),
            onCopy: handleCopy
          }, [
            h(InputGroup, { label: "Part connue", value: c5.part, onChange: (v) => setC5({...c5, part: v}), placeholder: "20,6" }),
            h(InputGroup, { label: "Pourcentage", value: c5.p, onChange: (v) => setC5({...c5, p: v}), placeholder: "20", suffix: "%" })
          ]),

          h(CalculatorCard, {
            title: "TVA (France)", description: "HT, TTC et Montant TVA.",
            icon: h('svg', { fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, h('path', { d: "M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z", strokeWidth: "2" })),
            result: c6.res, resultPhrase: c6.ph, error: c6.err,
            onCalculate: runC6, onReset: () => setC6({ ...c6, amt: '', res: null }), onExample: () => setC6({ ...c6, amt: '100', rate: '20' }),
            onCopy: handleCopy
          }, [
            h('div', { className: "flex flex-col gap-1 sm:col-span-2" }, [
              h('div', { className: "flex p-0.5 bg-slate-100 rounded-lg no-scrollbar overflow-x-auto" }, [
                h('button', { onClick: () => setC6({...c6, mode: 'HT_TO_TTC'}), className: `flex-1 py-1.5 px-2 text-[10px] font-bold rounded whitespace-nowrap transition-all ${c6.mode === 'HT_TO_TTC' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}` }, "HT → TTC"),
                h('button', { onClick: () => setC6({...c6, mode: 'TTC_TO_HT'}), className: `flex-1 py-1.5 px-2 text-[10px] font-bold rounded whitespace-nowrap transition-all ${c6.mode === 'TTC_TO_HT' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}` }, "TTC → HT"),
                h('button', { onClick: () => setC6({...c6, mode: 'TVA_ONLY'}), className: `flex-1 py-1.5 px-2 text-[10px] font-bold rounded whitespace-nowrap transition-all ${c6.mode === 'TVA_ONLY' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}` }, "TVA → Tout")
              ])
            ]),
            h(InputGroup, { label: "Montant (€)", value: c6.amt, onChange: (v) => setC6({...c6, amt: v}), placeholder: "100" }),
            h('div', { className: "flex flex-col gap-1" }, [
              h('label', { className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest" }, "Taux (%)"),
              h('div', { className: "grid grid-cols-2 gap-1" }, ['20', '10', '5.5', '2.1'].map(r => 
                h('button', { key: r, onClick: () => setC6({...c6, rate: r}), className: `py-1 text-[10px] font-bold border rounded transition-all ${c6.rate === r ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white text-slate-600 hover:border-indigo-300'}` }, `${r}%`)
              ))
            ])
          ])

        ])
      ) : 
      h(HelpSection, { precision, onPrecisionChange: setPrecision }),

    h('footer', { className: "mt-auto py-8 bg-white border-t border-slate-200" }, 
      h('div', { className: "max-w-7xl mx-auto px-4 text-center" }, [
        h('p', { className: "text-slate-400 text-[10px] font-bold uppercase tracking-widest" }, "© 2024 CalculerUnPourcentage — Outil 100% Confidentiel")
      ])
    )
  ]);
};

// --- RENDU FINAL ---
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(App));
