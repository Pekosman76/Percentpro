
import React from 'react';
import { Precision } from '../types';

interface HelpSectionProps {
  precision: number;
  onPrecisionChange: (p: number) => void;
}

export const HelpSection: React.FC<HelpSectionProps> = ({ 
  precision, 
  onPrecisionChange
}) => {
  const sections = [
    { id: 'settings', title: 'Réglages d\'affichage' },
    { id: 'intro', title: 'Introduction' },
    { id: 'part', title: 'Part d\'un total' },
    { id: 'ratio', title: 'Ratio en %' },
    { id: 'evolution', title: 'Évolution (Hausse/Baisse)' },
    { id: 'variation', title: 'Taux de variation' },
    { id: 'total', title: 'Retrouver le total' },
    { id: 'tva', title: 'TVA (France)' },
    { id: 'privacy', title: 'Confidentialité' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-10">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Aide & Réglages</h2>
        
        <nav className="mb-10 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Sommaire</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map(s => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-indigo-200 rounded-full"></span>
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-12 text-slate-600 leading-relaxed">
          {/* Settings Section */}
          <section id="settings" className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Réglages d'affichage
            </h3>
            
            <div className="max-w-md">
              <p className="text-sm font-semibold text-slate-700 mb-3">Décimales après la virgule</p>
              <div className="flex bg-slate-200/50 p-1 rounded-xl">
                {[0, 1, 2, 3].map((v) => (
                  <button 
                    key={v}
                    onClick={() => onPrecisionChange(v as Precision)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${precision === v ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {v} déc.
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-slate-400">Appliqué instantanément à tous les résultats.</p>
            </div>
          </section>

          <section id="intro">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Introduction</h3>
            <p>Cet outil gratuit vous permet de réaliser les calculs de pourcentage les plus courants de manière instantanée. Que ce soit pour des remises commerciales, des évolutions de budget ou des déclarations de TVA, PercentPro garantit rapidité et précision.</p>
            <p className="mt-2 text-sm italic">Note : Les résultats sont indicatifs et arrondis selon votre préférence (voir Réglages ci-dessus).</p>
          </section>

          <section id="part">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Part d'un total</h3>
            <p className="mb-2"><strong>À quoi ça sert :</strong> Calculer un montant spécifique à partir d'un pourcentage (ex: "Quelle est la remise de 20% sur 103€ ?").</p>
            <p className="mb-2"><strong>Formule :</strong> <code>Résultat = Total × (Pourcentage / 100)</code></p>
            <div className="bg-slate-50 p-3 rounded-lg text-sm border-l-4 border-indigo-500">
              <strong>Exemple :</strong> 20% de 103 = 20,6
            </div>
          </section>

          <section id="ratio">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Ratio en %</h3>
            <p className="mb-2"><strong>À quoi ça sert :</strong> Trouver quel pourcentage représente une valeur par rapport à un ensemble (ex: "J'ai eu 50 bonnes réponses sur 200, quel est mon taux ?").</p>
            <p className="mb-2"><strong>Formule :</strong> <code>Pourcentage = (Valeur / Total) × 100</code></p>
            <div className="bg-slate-50 p-3 rounded-lg text-sm border-l-4 border-indigo-500">
              <strong>Exemple :</strong> 50 sur 200 = 25%
            </div>
          </section>

          <section id="evolution">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Évolution (Hausse / Baisse)</h3>
            <p className="mb-2"><strong>À quoi ça sert :</strong> Appliquer une variation à un prix ou une quantité de base.</p>
            <p className="mb-2"><strong>Formules :</strong> <br/>Hausse : <code>Nouveau = Base × (1 + Taux/100)</code> <br/>Baisse : <code>Nouveau = Base × (1 - Taux/100)</code></p>
            <div className="bg-slate-50 p-3 rounded-lg text-sm border-l-4 border-indigo-500">
              <strong>Exemple :</strong> 120 + 15% = 138
            </div>
          </section>

          <section id="total">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Retrouver le total</h3>
            <p className="mb-2"><strong>À quoi ça sert :</strong> Retrouver le total initial si vous connaissez une part et le pourcentage correspondant.</p>
            <p className="mb-2"><strong>Formule :</strong> <code>Total = Part / (Pourcentage / 100)</code></p>
            <div className="bg-slate-50 p-3 rounded-lg text-sm border-l-4 border-indigo-500">
              <strong>Exemple :</strong> 20,6 représente 20% d'un total de 103.
            </div>
          </section>

          <section id="tva">
            <h3 className="text-xl font-bold text-slate-900 mb-3">TVA (France)</h3>
            <p className="mb-2"><strong>À quoi ça sert :</strong> Passer du prix Hors Taxes (HT) au prix Toutes Taxes Comprises (TTC) ou inversement.</p>
            <ul className="list-disc ml-5 mb-4 text-sm">
              <li><strong>20% :</strong> Taux normal (majorité des biens et services).</li>
              <li><strong>10% :</strong> Restauration, produits agricoles transformés.</li>
              <li><strong>5,5% :</strong> Alimentation, livres, énergie.</li>
              <li><strong>2,1% :</strong> Presse, médicaments remboursés.</li>
            </ul>
            <div className="bg-slate-50 p-3 rounded-lg text-sm border-l-4 border-indigo-500">
              <strong>Exemple :</strong> 100€ HT avec 20% TVA = 120€ TTC.
            </div>
          </section>

          <section id="privacy" className="pt-6 border-t border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Confidentialité</h3>
            <p><strong>Zéro serveur :</strong> Tous les calculs s'effectuent localement dans votre navigateur via JavaScript. Aucune des données numériques que vous saisissez n'est transmise ou enregistrée à distance.</p>
            <p className="mt-2"><strong>Sécurité :</strong> Nous n'utilisons aucun cookie de tracking intrusif.</p>
          </section>
        </div>

        <div className="mt-12 text-center">
           <p className="text-slate-400 text-sm">Besoin d'une fonctionnalité ? Contactez-nous.</p>
        </div>
      </div>
    </div>
  );
};
