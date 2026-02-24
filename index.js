import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

const h = React.createElement;
const BASE_URL = 'https://calculerunpoucentage.fr';
const LAST_UPDATED = '24/02/2026';

const navItems = [
  { path: '/', label: 'Accueil' },
  { path: '/a-propos', label: 'À propos' },
  { path: '/mentions-legales', label: 'Mentions légales' },
  { path: '/politique-de-confidentialite', label: 'Confidentialité' },
  { path: '/contact', label: 'Contact' }
];

const FAQ_ITEMS = [
  ['Comment calculer 20% d\'un prix ?', 'Multipliez le prix par 20 puis divisez par 100. Exemples : 20% de 80 = 16, 20% de 250 = 50.'],
  ['Comment trouver le pourcentage entre deux valeurs ?', 'Utilisez (partie / total) × 100. Exemple : 36 sur 120 = 30%.'],
  ['Quelle différence entre points de pourcentage et pourcentage ?', 'Passer de 10% à 12% représente +2 points, soit +20% en variation relative.'],
  ['Comment passer de HT à TTC ?', 'TTC = HT × (1 + taux TVA/100). Avec 20% : 100 € HT deviennent 120 € TTC.'],
  ['Comment passer de TTC à HT ?', 'HT = TTC ÷ (1 + taux TVA/100). Avec 20% : 120 € TTC deviennent 100 € HT.'],
  ['Pourquoi une baisse de 20% puis une hausse de 20% ne compensent pas ?', 'Parce que la base change entre les deux opérations : 100 → 80 → 96.'],
  ['Quel est le taux de variation entre 150 et 180 ?', '((180 - 150) / 150) × 100 = +20%.'],
  ['Comment retrouver la valeur initiale ?', 'Si 20,6 représente 20%, la valeur vaut 20,6 ÷ 0,20 = 103.'],
  ['Le calculateur enregistre-t-il mes données ?', 'Les saisies sont traitées localement dans le navigateur. Seule la préférence d\'arrondi peut être conservée en localStorage.'],
  ['Ce site remplace-t-il un conseil comptable ?', 'Non. Les résultats sont fournis à titre indicatif et doivent être vérifiés avant toute décision juridique, fiscale ou contractuelle.']
];

const seoByPath = {
  '/': {
    title: 'Calculer un pourcentage (%, TVA, évolution, ratio) | calculerunpoucentage.fr',
    description: 'Calculateur de pourcentage gratuit : TVA, ratio, évolution, remise et taux de variation. Formules claires, exemples et FAQ en français.',
    ogType: 'website'
  },
  '/a-propos': {
    title: 'À propos | Méthodes de calcul de pourcentage et TVA',
    description: 'Pourquoi calculerunpoucentage.fr existe, comment les formules fonctionnent, limites, arrondis et engagements de transparence.',
    ogType: 'article'
  },
  '/mentions-legales': {
    title: 'Mentions légales | calculerunpoucentage.fr',
    description: 'Mentions légales, éditeur, hébergeur OVHcloud, responsabilité et propriété intellectuelle du site calculerunpoucentage.fr.',
    ogType: 'article'
  },
  '/politique-de-confidentialite': {
    title: 'Politique de confidentialité | calculerunpoucentage.fr',
    description: 'Politique de confidentialité : traitement local des calculs, cookies, publicité Google AdSense, droits RGPD et contact.',
    ogType: 'article'
  },
  '/contact': {
    title: 'Contact | calculerunpoucentage.fr',
    description: 'Contacter calculerunpoucentage.fr pour signaler un bug de calcul, poser une question ou proposer une amélioration.',
    ogType: 'website'
  }
};

const InputGroup = ({ label, value, onChange, onEnter, placeholder, suffix, id }) => h('div', { className: 'flex flex-col gap-1 w-full' }, [
  h('label', { htmlFor: id, className: 'text-[10px] font-bold text-slate-500 uppercase tracking-widest' }, label),
  h('div', { className: 'relative' }, [
    h('input', {
      id,
      type: 'text',
      inputMode: 'decimal',
      value,
      onChange: (e) => onChange(e.target.value.replace('.', ',')),
      onKeyDown: (e) => e.key === 'Enter' && onEnter && onEnter(),
      placeholder,
      className: 'w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-slate-900 shadow-sm text-sm'
    }),
    suffix && h('span', { className: 'absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm pointer-events-none' }, suffix)
  ])
]);

const CalculatorCard = ({ title, description, children, result, resultPhrase, error, onCalculate, onReset, onExample, icon, onCopy }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const handleCopy = () => {
    if (!result || !onCopy) return;
    onCopy(resultPhrase || result);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 1200);
  };

  return h('div', { className: 'bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col group' }, [
    h('div', { className: 'p-5 flex-grow' }, [
      h('div', { className: 'flex items-start justify-between mb-4' }, [
        h('div', { className: 'flex items-center gap-3' }, [
          h('div', { className: 'p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0' }, React.cloneElement(icon, { className: 'w-5 h-5' })),
          h('div', {}, [
            h('h3', { className: 'text-base font-bold text-slate-900 leading-tight' }, title),
            h('p', { className: 'text-[11px] text-slate-500 line-clamp-1' }, description)
          ])
        ]),
        h('div', { className: 'flex gap-1' }, [
          h('button', { onClick: onExample, title: 'Exemple', className: 'p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors', 'aria-label': `Exemple ${title}` }, 'ⓘ'),
          h('button', { onClick: onReset, title: 'Réinitialiser', className: 'p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors', 'aria-label': `Réinitialiser ${title}` }, '✕')
        ])
      ]),
      h('div', { className: 'space-y-4' }, [
        h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-3' }, children),
        h('button', { onClick: onCalculate, className: 'w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md shadow-indigo-100 active:scale-[0.98]' }, 'Calculer'),
        (result !== null || error !== null) && h('div', { className: `p-3 rounded-lg relative ${error ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'}` }, [
          h('div', { className: 'flex flex-col items-center text-center' }, [
            h('span', { className: 'text-[10px] uppercase tracking-widest font-bold mb-0.5 opacity-70' }, error ? 'Erreur' : 'Résultat'),
            h('div', { className: 'flex items-center gap-2 max-w-full' }, [
              h('span', { className: 'text-xl font-black break-all' }, error || result),
              !error && onCopy && h('button', { onClick: handleCopy, className: 'p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors relative', title: 'Copier le résultat' }, copyFeedback ? '✓' : '📋')
            ]),
            resultPhrase && !error && h('p', { className: 'text-[10px] mt-1 opacity-60 font-medium italic' }, resultPhrase)
          ])
        ])
      ])
    ])
  ]);
};

const editorialHome = `
<p>Calculer un pourcentage est un besoin quotidien : promotions, budget, TVA, commissions, notes, statistiques, performance commerciale ou évolution de salaire. Cette page rassemble les formules essentielles et les cas concrets réellement utiles, sans jargon inutile. L’objectif n’est pas seulement de donner un résultat, mais de vous aider à comprendre la logique du calcul pour éviter les erreurs fréquentes.</p>
<p>Les outils ci-dessus vous donnent un résultat instantané. Le guide ci-dessous vous explique quand utiliser chaque formule, comment interpréter un taux, comment éviter les confusions entre variation relative et différence absolue, et comment gérer les arrondis.</p>
<h2 id="sommaire">Sommaire</h2>
<ul><li><a href="#comment-calculer">Comment calculer un pourcentage</a></li><li><a href="#x-pourcent">Calculer X % d’une valeur</a></li><li><a href="#entre-deux">Trouver le pourcentage entre deux valeurs</a></li><li><a href="#evolution">Évolution : hausse/baisse</a></li><li><a href="#variation">Taux de variation</a></li><li><a href="#retrouver">Retrouver une valeur à partir d’un pourcentage</a></li><li><a href="#tva-france">TVA France : HT ↔ TTC</a></li><li><a href="#erreurs">Erreurs fréquentes</a></li><li><a href="#faq">FAQ</a></li><li><a href="#glossaire">Glossaire</a></li></ul>
<h2 id="comment-calculer">Comment calculer un pourcentage (formule + exemples)</h2>
<p>La formule universelle est simple : <strong>pourcentage = (partie / total) × 100</strong>. Elle répond à la question : « quelle part représente cette valeur dans l’ensemble ? »</p>
<p>Exemple : 45 élèves sur 180 ont validé un test. Le taux de réussite est (45 / 180) × 100 = 25%. Exemple business : 2 400 € de marge pour 12 000 € de chiffre d’affaires représente une marge de 20%.</p>
<details><summary><strong>Exemple rapide</strong> – pourcentage d’absentéisme</summary><p>12 absents sur 320 salariés : (12 / 320) × 100 = 3,75%.</p></details>
<h3>Méthode mentale utile</h3>
<p>Pour aller plus vite, vous pouvez calculer 10% puis ajuster. Si vous cherchez 15% de 80, commencez par 10% = 8, puis ajoutez 5% = 4, total 12. Cette méthode évite de sortir la calculatrice sur des montants courants.</p>
<h2 id="x-pourcent">Calculer X % d’une valeur</h2>
<p>La formule est : <strong>partie = valeur × (taux / 100)</strong>. C’est l’opération la plus fréquente.</p>
<ol>
<li><strong>Remise commerciale :</strong> 30% de remise sur 79 € → 23,70 € de réduction. Prix final : 55,30 €.</li>
<li><strong>Commission :</strong> 8% sur 2 500 € → 200 €.</li>
<li><strong>Note :</strong> 14/20 correspond à 70%.</li>
<li><strong>Impôt simplifié :</strong> 11% de 18 000 € → 1 980 € (simulation brute).</li>
<li><strong>Réduction panier e-commerce :</strong> 12% sur 146 € → 17,52 €.</li>
</ol>
<details><summary><strong>Exemple rapide</strong> – remise immédiate</summary><p>Une veste à 120 € avec -25% : remise = 30 €, prix final = 90 €.</p></details>
<h2 id="entre-deux">Trouver le pourcentage entre deux valeurs (ratio en %)</h2>
<p>La question type est : « combien représente A par rapport à B ? ». Formule : <strong>(A / B) × 100</strong>.</p>
<p>Exemple : 52 ventes conclues sur 80 devis = 65%. En logistique : 470 colis livrés sur 500 = 94% de réussite.</p>
<p>Quand la base est 0, le ratio n’est pas interprétable en pourcentage. C’est une limite mathématique normale : on ne peut pas diviser par zéro.</p>
<h2 id="evolution">Évolution : hausse / baisse en %</h2>
<p>Pour appliquer une variation à une valeur initiale : <strong>nouvelle valeur = base × (1 ± taux/100)</strong>.</p>
<p>Hausse de 12% sur 650 € : 728 €. Baisse de 18% sur 650 € : 533 €. Vous pouvez ainsi simuler une inflation, une remise, une augmentation salariale ou une dépréciation.</p>
<details><summary><strong>Piège fréquent</strong> – hausse et baisse successives</summary><p>Une baisse de 20% puis une hausse de 20% ne ramènent pas au point de départ : 100 → 80 → 96. Il manque encore 4% pour revenir à 100.</p></details>
<h2 id="variation">Taux de variation entre deux valeurs (différence vs variation)</h2>
<p>Le <strong>taux de variation</strong> mesure une évolution relative : <strong>((finale - initiale) / initiale) × 100</strong>.</p>
<p>Ne confondez pas :</p>
<ul>
<li><strong>Différence absolue</strong> : 150 - 100 = 50 unités.</li>
<li><strong>Variation relative</strong> : +50%.</li>
</ul>
<p>En finance, marketing ou RH, la variation relative est souvent la mesure pertinente car elle compare des grandeurs de tailles différentes.</p>
<h2 id="retrouver">Retrouver la valeur à partir d’un pourcentage</h2>
<p>Si vous connaissez la partie et le taux : <strong>total = partie / (taux/100)</strong>.</p>
<p>Exemple demandé souvent : « 20% de quoi = 20,6 ? » Réponse : 20,6 / 0,20 = 103.</p>
<details><summary><strong>Exemple rapide</strong> – budget marketing</summary><p>Si 1 500 € représentent 12% d’un budget total, alors budget = 1 500 / 0,12 = 12 500 €.</p></details>
<h2 id="tva-france">TVA en France : HT ↔ TTC, taux 20 / 10 / 5,5 / 2,1</h2>
<p>Formules de base :</p>
<ul>
<li><strong>TTC = HT × (1 + taux TVA)</strong></li>
<li><strong>HT = TTC / (1 + taux TVA)</strong></li>
<li><strong>Montant TVA = TTC - HT</strong></li>
</ul>
<p>Le taux de 20% est le plus courant. Le 10% concerne notamment certaines prestations de restauration et certains travaux. Le 5,5% s’applique à des biens comme les livres et certains produits de première nécessité. Le 2,1% concerne des cas spécifiques comme certains médicaments remboursables ou publications de presse.</p>
<table><thead><tr><th>Cas concret</th><th>Exemple</th><th>Résultat</th></tr></thead><tbody>
<tr><td>HT vers TTC (20%)</td><td>100 € HT</td><td>120 € TTC</td></tr>
<tr><td>TTC vers HT (20%)</td><td>120 € TTC</td><td>100 € HT</td></tr>
<tr><td>Restauration (10%)</td><td>42 € HT</td><td>46,20 € TTC</td></tr>
<tr><td>Livre (5,5%)</td><td>19 € HT</td><td>20,05 € TTC</td></tr>
</tbody></table>
<h2 id="erreurs">Erreurs fréquentes à éviter</h2>
<ul>
<li><strong>Points de pourcentage vs % :</strong> de 8% à 10% = +2 points, mais +25% en relatif.</li>
<li><strong>Mauvaise base :</strong> la base doit rester explicite (prix initial, CA N-1, effectif total, etc.).</li>
<li><strong>Arrondis prématurés :</strong> arrondir trop tôt peut créer un écart sur la facture finale.</li>
<li><strong>Cumul de variations :</strong> deux variations successives ne s’additionnent pas simplement.</li>
<li><strong>Confusion TTC/HT :</strong> retirer 20% d’un TTC n’est pas toujours le bon moyen de retrouver le HT.</li>
</ul>
<h2 id="faq">FAQ</h2>
${FAQ_ITEMS.map(([q, a]) => `<details><summary><strong>${q}</strong></summary><p>${a}</p></details>`).join('')}
<h2 id="glossaire">Mini glossaire</h2>
<ul>
<li><strong>Base :</strong> valeur de référence utilisée pour calculer un pourcentage.</li>
<li><strong>Taux :</strong> coefficient exprimé en pourcentage.</li>
<li><strong>Ratio :</strong> rapport entre deux grandeurs.</li>
<li><strong>HT :</strong> hors taxes.</li>
<li><strong>TTC :</strong> toutes taxes comprises.</li>
<li><strong>Point de pourcentage :</strong> différence absolue entre deux taux.</li>
</ul>
<h2>Liens utiles</h2>
<p><a href="/a-propos">À propos</a> · <a href="/mentions-legales">Mentions légales</a> · <a href="/politique-de-confidentialite">Politique de confidentialité</a> · <a href="/contact">Contact</a></p>

<h2>Cas d’usage détaillés : vie quotidienne et professionnelle</h2>
<h3>Promotions et soldes</h3>
<p>Quand une boutique affiche « -40% puis -10% supplémentaires », le calcul exact n’est pas -50%. Il faut appliquer la deuxième réduction sur le prix déjà remisé. Exemple : produit à 200 €. Première réduction : 200 × 40% = 80 €, nouveau prix 120 €. Deuxième réduction : 120 × 10% = 12 €, prix final 108 €. La remise totale est donc de 92 €, soit 46% et non 50%.</p>
<p>Cette logique est la même pour les coupons e-commerce, les remises fidélité, les promotions « lot + réduction », et les ventes privées. En pratique, comprendre le pourcentage appliqué sur la bonne base évite les mauvaises surprises à la caisse.</p>
<h3>Commissions commerciales</h3>
<p>Les commissions peuvent être calculées sur le chiffre d’affaires HT, TTC, sur la marge, ou sur un palier de performance. Une commission de 6% sur 30 000 € représente 1 800 €. Mais si le contrat prévoit une commission sur la marge nette et non sur le CA, le résultat peut changer fortement. Toujours vérifier la base de calcul contractuelle.</p>
<h3>Budget personnel</h3>
<p>Le pourcentage permet de piloter un budget : loyer, alimentation, transport, loisirs, épargne. Si votre revenu net est 2 100 € et votre loyer 735 €, le poids du loyer est (735/2100)×100 = 35%. Ce ratio vous aide à comparer vos postes de dépenses d’un mois à l’autre.</p>
<h3>Performance marketing</h3>
<p>En acquisition digitale, on suit souvent des taux : taux de clic, taux de conversion, taux de rebond, taux d’ouverture email. Exemple : 3 400 visiteurs, 102 ventes. Taux de conversion = (102/3400)×100 = 3%. Cette mesure est utile pour comparer des campagnes de volumes différents.</p>
<h3>RH et indicateurs sociaux</h3>
<p>Taux d’absentéisme, turnover, taux de formation, part de télétravail : tous ces indicateurs sont exprimés en pourcentage. Ils doivent être comparés à période et périmètre constants pour éviter les conclusions hâtives.</p>
<h2>Méthodologie de vérification rapide</h2>
<ol>
<li>Identifier la base de calcul (prix initial, effectif total, CA de référence).</li>
<li>Identifier l’opération (part d’une valeur, ratio, évolution, inversion).</li>
<li>Appliquer la formule avec des parenthèses explicites.</li>
<li>Contrôler l’ordre de grandeur (si 10% de 100 vaut 10, alors 20% vaut ~20).</li>
<li>Arrondir en dernier, selon le contexte.</li>
</ol>
<p>Cette méthode réduit fortement les erreurs dans les environnements professionnels où plusieurs personnes manipulent les mêmes chiffres.</p>
<h2>Exemples complémentaires chiffrés</h2>
<p><strong>Exemple 1 :</strong> Vous vendez un produit 49,90 € TTC à 20% de TVA. HT = 49,90 / 1,20 = 41,58 € (arrondi), TVA = 8,32 €.</p>
<p><strong>Exemple 2 :</strong> Votre panier moyen passe de 58 € à 63 €. Variation = ((63-58)/58)×100 = +8,62%.</p>
<p><strong>Exemple 3 :</strong> 18 retours sur 640 commandes. Taux de retour = 2,81%.</p>
<p><strong>Exemple 4 :</strong> Une prime de 7,5% sur 2 850 € représente 213,75 €.</p>
<p><strong>Exemple 5 :</strong> Si 1 260 € correspondent à 35% d’un montant, le total vaut 3 600 €.</p>
<h2>Conseils pratiques pour les tableaux et rapports</h2>
<ul>
<li>Présenter la valeur absolue ET le pourcentage.</li>
<li>Toujours préciser la période de comparaison.</li>
<li>Documenter la base utilisée (HT, TTC, effectif, volume).</li>
<li>Conserver une convention d’arrondi stable.</li>
<li>Éviter de comparer des taux calculés sur des bases différentes.</li>
</ul>
<p>Ces règles simples améliorent la lisibilité des reportings et évitent les interprétations ambiguës.</p>

<h2>Démarche produit et éditoriale</h2>
<p>Notre démarche est orientée utilité. Chaque bloc de calcul correspond à une intention de recherche réelle : « calculer X % d’une somme », « trouver un ratio », « appliquer une hausse », « retrouver une base », « convertir HT/TTC ». Nous avons volontairement évité les fonctionnalités décoratives qui complexifient l’interface sans valeur pratique.</p>
<p>Le contenu éditorial complète l’outil pour permettre aux utilisateurs d’apprendre une méthode réutilisable. Notre objectif est de réduire la dépendance au copier-coller de formules non vérifiées.</p>
<h2>Exemples d’utilisateurs</h2>
<p><strong>Particulier :</strong> vérifier une remise affichée en magasin et estimer son budget mensuel en pourcentage du revenu.</p>
<p><strong>Étudiant :</strong> contrôler des exercices de proportionnalité et de statistiques descriptives.</p>
<p><strong>Auto-entrepreneur :</strong> estimer rapidement un passage HT/TTC, une commission partenaire, ou une variation de coût de matière première.</p>
<p><strong>E-commerçant :</strong> comparer les performances hebdomadaires avec un taux de variation cohérent.</p>
<h2>Précision numérique et interprétation</h2>
<p>Le calcul en JavaScript utilise des nombres flottants. Dans certains cas, une valeur peut afficher une très légère différence (ex : 0,1 + 0,2). Pour l’utilisateur, le niveau d’arrondi rend le résultat exploitable. En comptabilité stricte, il faut appliquer les règles d’arrondi propres au cadre concerné.</p>
<p>Un résultat numérique n’a de sens que dans son contexte. Exemple : +12% de trafic peut coexister avec -5% de conversion. L’indicateur final pertinent dépend alors du volume de ventes, pas uniquement du taux isolé.</p>
<h2>Limites connues</h2>
<ul>
<li>Le site ne remplace pas un logiciel de facturation certifié.</li>
<li>Les taux de TVA affichés sont des repères d’usage courant ; les cas particuliers existent.</li>
<li>Le site ne traite pas les régimes fiscaux complexes ni les exceptions sectorielles détaillées.</li>
<li>Les calculs n’intègrent pas automatiquement des règles métier propres à chaque entreprise.</li>
</ul>
<h2>Pourquoi la pédagogie est importante</h2>
<p>Beaucoup d’erreurs viennent d’une bonne formule appliquée au mauvais objectif. Un exemple classique : confondre « calculer une part » et « calculer une variation ». Ces deux opérations répondent à des questions différentes. Nous détaillons donc les cas d’usage pour aider à choisir le bon outil avant de saisir les chiffres.</p>
<h2>Engagements</h2>
<ul>
<li>Simplicité de navigation.</li>
<li>Formules explicites et cohérentes.</li>
<li>Contenu rédigé en français clair.</li>
<li>Transparence sur la confidentialité et la publicité.</li>
<li>Amélioration continue selon les retours utilisateurs.</li>
</ul>
<p>Si vous constatez une ambiguïté dans une explication, écrivez-nous. Les retours concrets (cas réel, valeurs, résultat attendu) nous aident à améliorer rapidement la qualité du service.</p>

<h2>13. Conditions d’utilisation</h2>
<p>L’accès au site est libre, sous réserve de respecter les lois applicables, les droits de propriété intellectuelle et les présentes mentions. L’utilisateur s’engage à ne pas perturber le fonctionnement du service, ni tenter un usage détourné des fonctionnalités.</p>
<h2>14. Signalement de contenu</h2>
<p>Si vous identifiez un contenu inexact, obsolète ou potentiellement illicite, vous pouvez le signaler par email. Merci de préciser l’URL concernée et la correction proposée pour faciliter le traitement.</p>
<h2>15. Publicité et indépendance éditoriale</h2>
<p>La présence éventuelle de contenus sponsorisés ou publicitaires ne modifie pas les principes de rédaction des pages informatives. Les explications mathématiques et les formules restent indépendantes des annonces affichées.</p>
<h2>16. Force majeure</h2>
<p>La responsabilité de l’éditeur ne peut être engagée en cas d’événement de force majeure ou de circonstances extérieures empêchant l’accès normal au service (panne réseau globale, incident fournisseur, indisponibilité majeure d’infrastructure).</p>
<h2>17. Interprétation</h2>
<p>Si une clause des présentes mentions était jugée invalide, les autres clauses resteraient applicables. Le fait de ne pas se prévaloir d’une clause à un instant donné ne vaut pas renonciation définitive à cette clause.</p>

<h2>12. Gestion des préférences cookies</h2>
<p>Selon l’évolution du site, un bandeau de gestion du consentement peut être déployé pour permettre à l’utilisateur d’accepter ou refuser certains cookies non essentiels. En l’absence de ce bandeau, l’utilisateur peut gérer ses préférences directement dans les réglages de son navigateur.</p>
<h2>13. Données des mineurs</h2>
<p>Le site n’est pas conçu pour collecter intentionnellement des données personnelles de mineurs. En cas de doute sur un traitement involontaire, contactez-nous afin que nous puissions examiner la situation et prendre les mesures nécessaires.</p>
<h2>14. Transferts hors UE</h2>
<p>Certains services tiers (notamment publicitaires) peuvent impliquer des transferts de données vers des pays hors Union européenne, encadrés par les mécanismes juridiques prévus par la réglementation applicable et les engagements des prestataires.</p>
<h2>15. Réclamations</h2>
<p>Si vous estimez que vos droits ne sont pas respectés, vous pouvez nous contacter en priorité pour une résolution amiable. Vous disposez également de la possibilité de saisir l’autorité de contrôle compétente.</p>
<p><em>Dernière mise à jour : ${LAST_UPDATED}</em></p>
`;

const aboutContent = `
<h1 class="text-3xl font-black text-slate-900 mb-4">À propos de calculerunpoucentage.fr</h1>
<p>calculerunpoucentage.fr a été créé pour répondre à une frustration simple : la plupart des outils de pourcentage donnent un résultat mais expliquent mal la logique. Ici, nous voulons combiner rapidité de calcul et compréhension. Un résultat utile est un résultat que l’on peut vérifier, expliquer et réutiliser dans un autre contexte.</p>
<h2>Pourquoi ce site ?</h2>
<p>Dans la vie courante, les pourcentages sont partout : promotions, rendement, TVA, salaires, notes, marges, statistiques de santé, conversion e-commerce, taux de réussite, etc. Pourtant, de nombreuses personnes doutent dès qu’il faut choisir la bonne formule. Nous avons donc conçu une interface directe avec six opérations fréquentes, chacune associée à une formule explicite.</p>
<p>Notre philosophie est claire : pas de blabla, pas de parcours complexe, pas de collecte intrusive des valeurs saisies. Vous ouvrez la page, vous calculez, vous comparez, vous comprenez.</p>
<h2>À qui ce site sert-il ?</h2>
<h3>Particuliers</h3>
<p>Comparer deux promotions, calculer une augmentation de loyer, estimer une remise, comprendre un taux d’intérêt simple ou vérifier un prix TTC : ces situations reviennent souvent. Le site est pensé pour des calculs rapides et fiables sans connaissances avancées.</p>
<h3>Étudiants</h3>
<p>Les pourcentages apparaissent en mathématiques, économie, sciences sociales, statistiques, gestion et sciences expérimentales. Les exemples fournis sur la page d’accueil peuvent servir de base de vérification pour les exercices.</p>
<h3>Professionnels et indépendants</h3>
<p>Commerçants, artisans, freelances, services financiers, support client ou e-commerce : le calcul de marge, de variation de prix et de TVA est une tâche récurrente. L’outil permet de réduire les erreurs de saisie et de gagner du temps dans les estimations.</p>
<h2>Comment sont faits les calculs ?</h2>
<p>Les formules utilisées sont standards et transparentes. Nous les affichons dans les textes explicatifs pour que chaque utilisateur puisse vérifier les résultats.</p>
<ul>
<li>Part d’une valeur : <code>partie = valeur × (taux/100)</code></li>
<li>Ratio en % : <code>pourcentage = (partie/total) × 100</code></li>
<li>Évolution : <code>nouvelle valeur = base × (1 ± taux/100)</code></li>
<li>Taux de variation : <code>((finale - initiale)/initiale) × 100</code></li>
<li>Retrouver le total : <code>total = partie / (taux/100)</code></li>
<li>TVA : <code>TTC = HT × (1 + taux)</code> et <code>HT = TTC / (1 + taux)</code></li>
</ul>
<h2>Limites et bonnes pratiques</h2>
<p>Un calculateur est un outil d’aide, pas un audit comptable ni un conseil juridique. Les limites les plus importantes sont : la qualité des données saisies, le choix de la base, et la manière d’arrondir les résultats. Une erreur de base entraîne un résultat mathématiquement correct mais décisionnellement faux.</p>
<p>Exemple : annoncer « +30% » sans préciser la période, la base ou le périmètre (hors taxes / toutes taxes comprises) peut induire en erreur. Nous recommandons d’indiquer systématiquement : la base, la période, le taux et l’unité.</p>
<h3>Arrondis</h3>
<p>Le site permet de choisir le niveau d’arrondi. Pour des prix publics, l’arrondi à deux décimales est généralement adapté. Pour une analyse interne, conserver davantage de décimales peut être pertinent afin d’éviter les écarts de cumul.</p>
<h2>Transparence</h2>
<p>Les calculs sont traités localement dans votre navigateur. Concrètement, quand vous saisissez une valeur, elle n’est pas envoyée à un serveur applicatif pour le calcul lui-même. Une préférence d’affichage (arrondi) peut être enregistrée localement pour votre confort.</p>
<p>Le site peut afficher de la publicité (Google AdSense) pour financer l’hébergement et la maintenance. Dans ce cas, des cookies ou technologies similaires peuvent être utilisés par ces services tiers, selon leurs propres politiques.</p>
<h2>Qualité éditoriale</h2>
<p>Nous privilégions des exemples réalistes : remise, commission, TVA, variation de chiffre d’affaires, conversion commerciale, et ratios simples. Chaque section est conçue pour répondre à une intention de recherche concrète, sans remplissage artificiel de mots-clés.</p>
<h2>Mini FAQ</h2>
<details><summary><strong>Puis-je utiliser le site sur mobile ?</strong></summary><p>Oui, l’interface est responsive et fonctionne sur smartphone, tablette et desktop.</p></details>
<details><summary><strong>Le site remplace-t-il un expert-comptable ?</strong></summary><p>Non. Pour les décisions engageantes, faites valider vos calculs par un professionnel qualifié.</p></details>
<details><summary><strong>Puis-je proposer une amélioration ?</strong></summary><p>Oui, écrivez à l’adresse de contact. Les retours d’usage sont utiles pour prioriser les améliorations.</p></details>
<h2>Approche pédagogique détaillée</h2>
<p>Nous utilisons une pédagogie par scénarios : chaque formule est introduite par une question concrète, puis illustrée avec un exemple chiffré et une contre-erreur. Cette méthode aide à distinguer les calculs qui se ressemblent visuellement mais répondent à des problèmes différents.</p>
<p>Par exemple, « Quelle part représente 25 sur 80 ? » (ratio) n’est pas la même question que « Quelle est la nouvelle valeur après +25% ? » (évolution). Les deux manipulent un taux, mais l’interprétation métier diffère.</p>
<h2>Cas réels supplémentaires</h2>
<p><strong>Immobilier :</strong> si des charges passent de 140 € à 168 €, la variation est +20%. Cette information peut être plus parlante qu’une simple différence de 28 €.</p>
<p><strong>E-commerce :</strong> un taux de conversion de 2,4% avec 50 000 visites représente 1 200 commandes ; une hausse à 2,8% donne 1 400 commandes. L’écart de +0,4 point correspond à +16,7% de commandes.</p>
<p><strong>Éducation :</strong> passer de 12/20 à 15/20 est une hausse de 25% de la note brute, pas de 3%.</p>
<h2>Maintenance et amélioration continue</h2>
<p>Le site est mis à jour régulièrement pour corriger des imprécisions, améliorer la lisibilité mobile, clarifier des cas ambigus et renforcer les contenus explicatifs. Les retours utilisateurs sont une source prioritaire d’amélioration.</p>
<p>Si vous utilisez le site dans un cadre professionnel, nous vous recommandons de documenter vos conventions de calcul (base, arrondi, taux) afin de garantir la cohérence interne des décisions.</p>
<p>Besoin d’aide ou de signaler un problème ? Rendez-vous sur la page <a href="/contact">Contact</a>.</p>
<p><em>Dernière mise à jour : ${LAST_UPDATED}</em></p>
`;

const legalContent = `
<h1 class="text-3xl font-black text-slate-900 mb-4">Mentions légales</h1>
<h2>1. Présentation du site</h2>
<p>Le site <strong>calculerunpoucentage.fr</strong> propose des outils de calcul de pourcentage, de taux de variation et de TVA à titre strictement informatif et indicatif. L’accès au site implique l’acceptation pleine et entière des présentes mentions légales.</p>
<h2>2. Éditeur</h2>
<p>Éditeur : <strong>calculerunpoucentage.fr – Calculer un pourcentage</strong><br/>Contact : <a href="mailto:laloumaxime951@gmail.com">laloumaxime951@gmail.com</a></p>
<h2>3. Hébergement</h2>
<p>Hébergeur : <strong>OVHcloud SAS</strong><br/>Adresse : 2 rue Kellermann, 59100 Roubaix, France.<br/>Site : https://www.ovhcloud.com/</p>
<h2>4. Disclaimer (important)</h2>
<p><strong>Outil indicatif :</strong> les résultats affichés sur calculerunpoucentage.fr sont fournis sans garantie d’adéquation à un usage particulier. Ils n’ont aucune valeur légale, fiscale, comptable, contractuelle ou administrative.</p>
<p>Avant toute décision engageante (facturation, comptabilité, déclaration, contrat, litige), l’utilisateur doit vérifier les calculs et, si nécessaire, consulter un professionnel compétent.</p>
<h2>5. Nature des services</h2>
<p>Le site met à disposition des calculateurs automatiques (pourcentage d’une valeur, ratio, évolution, variation, inversion de pourcentage, TVA HT/TTC). Les méthodes sont basées sur des formules mathématiques standard.</p>
<p>L’éditeur ne garantit pas que ces outils répondent à l’ensemble des situations particulières (règles sectorielles, conditions contractuelles spécifiques, cas fiscaux complexes, réglementation locale).</p>
<h2>6. Responsabilité</h2>
<p>L’utilisateur est seul responsable de l’utilisation des informations obtenues via le site. L’éditeur ne pourra être tenu responsable d’un dommage direct ou indirect lié à l’usage, à l’interprétation ou à la mauvaise compréhension des résultats affichés.</p>
<p>L’éditeur ne garantit pas l’absence d’erreurs matérielles, de bugs ou d’interruptions de service. Le site peut être modifié, suspendu ou interrompu à tout moment, sans préavis.</p>
<h2>7. Exactitude et disponibilité</h2>
<p>Malgré une attention portée à la fiabilité des formules et contenus, des erreurs ou omissions peuvent exister. Les contenus peuvent être mis à jour sans notification préalable.</p>
<p>La disponibilité du site dépend de facteurs techniques (maintenance, hébergement, réseau, navigateur, appareil utilisateur). Aucune disponibilité continue n’est contractuellement garantie.</p>
<h2>8. Propriété intellectuelle</h2>
<p>La structure du site, les textes, éléments graphiques, logos, scripts et contenus originaux sont protégés par le droit de la propriété intellectuelle, sauf mentions contraires. Toute reproduction, extraction, adaptation ou diffusion, totale ou partielle, non autorisée préalablement, est interdite.</p>
<p>Les marques et noms de services tiers mentionnés sur le site restent la propriété de leurs titulaires respectifs.</p>
<h2>9. Liens hypertextes</h2>
<p>Le site peut contenir des liens vers des ressources externes. L’éditeur n’exerce pas de contrôle sur ces sites tiers et décline toute responsabilité quant à leur contenu, disponibilité, sécurité ou politique de confidentialité.</p>
<h2>10. Données personnelles et cookies</h2>
<p>Pour les informations relatives à la confidentialité, au traitement local des saisies et aux cookies, consultez la page dédiée : <a href="/politique-de-confidentialite">Politique de confidentialité</a>.</p>
<h2>11. Contact</h2>
<p>Pour toute demande, signalement de bug, correction ou question juridique liée au site, contactez : <a href="mailto:laloumaxime951@gmail.com">laloumaxime951@gmail.com</a>. Vous pouvez également utiliser la page <a href="/contact">Contact</a>.</p>
<h2>12. Droit applicable</h2>
<p>Les présentes mentions légales sont soumises au droit français. En cas de litige, et à défaut de résolution amiable, les juridictions compétentes seront celles déterminées par les règles en vigueur.</p>
<h2>18. Versions et mises à jour</h2>
<p>L’éditeur peut mettre à jour les présentes mentions légales à tout moment pour refléter l’évolution du site, des obligations réglementaires ou des services tiers utilisés. La date de dernière mise à jour est indiquée en bas de page.</p>
<h2>19. Usage raisonnable</h2>
<p>L’utilisation automatisée excessive pouvant dégrader les performances du service peut être limitée. L’éditeur se réserve la possibilité de mettre en place des protections techniques proportionnées pour préserver la disponibilité.</p>
<p><em>Dernière mise à jour : ${LAST_UPDATED}</em></p>
`;

const privacyContent = `
<h1 class="text-3xl font-black text-slate-900 mb-4">Politique de confidentialité</h1>
<h2>1. Principes généraux</h2>
<p>La confidentialité des utilisateurs est un principe important sur calculerunpoucentage.fr. Cette politique explique quelles données peuvent être traitées, dans quel but, et quels sont vos droits.</p>
<h2>2. Données saisies dans les calculateurs</h2>
<p>Les valeurs numériques que vous entrez dans les calculateurs de pourcentage et de TVA sont traitées localement dans votre navigateur pour produire le résultat. Elles ne sont pas, par défaut, stockées sur un serveur applicatif dédié au calcul.</p>
<p>Une préférence locale (par exemple le niveau d’arrondi) peut être enregistrée sur votre appareil via le stockage local du navigateur (localStorage) afin d’améliorer l’expérience utilisateur.</p>
<h2>3. Cookies et technologies similaires</h2>
<p>Le site peut utiliser des cookies techniques nécessaires au fonctionnement et, selon la configuration, des cookies liés à des services tiers (notamment publicitaires). Les cookies servent par exemple à mémoriser certaines préférences, mesurer l’audience de manière agrégée si un service est activé, ou diffuser des annonces adaptées.</p>
<h2>4. Publicité et services tiers</h2>
<p>Le site peut intégrer Google AdSense. Dans ce cadre, Google et ses partenaires peuvent utiliser des cookies pour personnaliser les annonces et limiter leur répétition.</p>
<p>Pour en savoir plus sur le fonctionnement des annonces Google : https://policies.google.com/technologies/ads</p>
<p>En l’absence d’activation d’un service de mesure spécifique, le site n’affirme pas collecter d’analytics avancés. Nous n’inventons pas de traitements inexistants.</p>
<h2>5. Finalités du traitement</h2>
<ul>
<li>Fournir le service de calcul demandé par l’utilisateur.</li>
<li>Améliorer l’ergonomie et la fiabilité du site.</li>
<li>Assurer la sécurité et la maintenance technique.</li>
<li>Financer l’exploitation via la publicité lorsque présente.</li>
</ul>
<h2>6. Base légale (RGPD)</h2>
<p>Selon les cas, les traitements reposent sur : l’intérêt légitime (fonctionnement, sécurité), l’exécution d’un service demandé par l’utilisateur (calcul local), et/ou le consentement lorsque des cookies non essentiels sont utilisés.</p>
<h2>7. Durée de conservation</h2>
<p>Les données calculées localement ne sont pas destinées à être conservées côté serveur. Les éléments stockés dans votre navigateur (préférences) restent jusqu’à suppression manuelle, effacement des données navigateur ou expiration technique.</p>
<h2>8. Vos droits</h2>
<p>Conformément à la réglementation applicable, vous disposez notamment d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et, dans certains cas, de portabilité. Vous pouvez aussi retirer votre consentement pour les cookies non essentiels.</p>
<p>Pour exercer vos droits ou poser une question sur la protection des données : <a href="mailto:laloumaxime951@gmail.com">laloumaxime951@gmail.com</a>.</p>
<h2>9. Sécurité</h2>
<p>Des mesures techniques raisonnables sont mises en œuvre pour limiter les risques d’accès non autorisé, d’altération ou de perte de données. Aucun système n’étant infaillible, le risque zéro n’existe pas sur internet.</p>
<h2>10. Liens externes</h2>
<p>Le site peut contenir des liens vers des ressources tierces. La présente politique ne s’applique pas aux sites externes, qui disposent de leurs propres règles de confidentialité.</p>
<h2>11. Évolution de la politique</h2>
<p>Cette politique peut être mise à jour pour refléter les changements techniques, éditoriaux ou réglementaires. La date de mise à jour indiquée en bas de page fait foi.</p>
<h2>16. Responsable de contact</h2>
<p>Pour toute question sur la protection des données, vous pouvez contacter l’éditeur via l’adresse dédiée : <a href="mailto:laloumaxime951@gmail.com">laloumaxime951@gmail.com</a>. Merci de décrire précisément votre demande et le contexte afin d’accélérer le traitement.</p>
<h2>17. Bonnes pratiques utilisateur</h2>
<ul><li>Effacez régulièrement les données de navigation si vous utilisez un appareil partagé.</li><li>Vérifiez les paramètres cookies de votre navigateur.</li><li>Évitez de transmettre par email des informations sensibles inutiles.</li></ul>
<p><em>Dernière mise à jour : ${LAST_UPDATED}</em></p>
`;

const contactContent = `
<h1 class="text-3xl font-black text-slate-900 mb-4">Contact</h1>
<p>Une question, une suggestion ou un bug à signaler ? Écrivez-nous :</p>
<p><strong>Email :</strong> <a href="mailto:laloumaxime951@gmail.com">laloumaxime951@gmail.com</a></p>
<p>Pour un signalement de bug, indiquez idéalement :</p>
<ul>
<li>le type de calcul utilisé (TVA, évolution, ratio, etc.),</li>
<li>la valeur saisie,</li>
<li>le résultat obtenu,</li>
<li>le résultat attendu.</li>
</ul>
<p>Vous pouvez aussi utiliser ce lien direct : <a href="mailto:laloumaxime951@gmail.com?subject=Contact%20calculerunpoucentage.fr">Envoyer un email</a>.</p>
<p><em>Dernière mise à jour : ${LAST_UPDATED}</em></p>
`;

const RichTextPage = ({ html }) => h('article', { className: 'prose-lite mx-auto bg-white border border-slate-200 rounded-2xl p-6 md:p-10', dangerouslySetInnerHTML: { __html: html } });

const App = () => {
  const [path, setPath] = useState(window.location.pathname || '/');
  const [precision, setPrecision] = useState(2);

  const navigate = (to) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    const seo = seoByPath[path] || seoByPath['/'];
    document.title = seo.title;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `${BASE_URL}${path === '/' ? '/' : path}`);
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', seo.description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogUrl = document.querySelector('meta[property="og:url"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogTitle) ogTitle.setAttribute('content', seo.title);
    if (ogDesc) ogDesc.setAttribute('content', seo.description);
    if (ogUrl) ogUrl.setAttribute('content', `${BASE_URL}${path === '/' ? '/' : path}`);
    if (ogType) ogType.setAttribute('content', seo.ogType);

    const data = path === '/' ? {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'Calculer un pourcentage',
          url: BASE_URL,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@type': 'FAQPage',
          mainEntity: FAQ_ITEMS.slice(0, 9).map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
        }
      ]
    } : {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: seo.title,
      url: `${BASE_URL}${path}`
    };

    let script = document.getElementById('jsonld-dynamic');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'jsonld-dynamic';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, [path]);

  useEffect(() => {
    const saved = localStorage.getItem('calculerunpourcentage_precision');
    if (saved !== null) {
      const val = parseInt(saved, 10);
      if ([0, 1, 2, 3].includes(val)) setPrecision(val);
    }
  }, []);

  useEffect(() => localStorage.setItem('calculerunpourcentage_precision', String(precision)), [precision]);

  const formatNum = useCallback((n) => new Intl.NumberFormat('fr-FR', { maximumFractionDigits: precision, minimumFractionDigits: 0 }).format(n), [precision]);
  const handleCopy = (text) => navigator.clipboard.writeText(text.replace(/\s/g, '').replace(',', '.'));

  const [c1, setC1] = useState({ p: '', t: '', res: null, ph: null, err: null });
  const [c2, setC2] = useState({ v: '', t: '', res: null, ph: null, err: null });
  const [c3, setC3] = useState({ v: '', p: '', mode: 'inc', res: null, ph: null, err: null });
  const [c4, setC4] = useState({ s: '', e: '', res: null, ph: null, err: null });
  const [c5, setC5] = useState({ part: '', p: '', res: null, ph: null, err: null });
  const [c6, setC6] = useState({ mode: 'HT_TO_TTC', amt: '', rate: '20', res: null, ph: null, err: null });

  const runC1 = () => { const p = parseFloat((c1.p || '0').replace(',', '.')); const t = parseFloat((c1.t || '0').replace(',', '.')); if (isNaN(p) || isNaN(t)) return setC1({ ...c1, err: 'Nombres invalides' }); const r = (p / 100) * t; setC1({ ...c1, res: formatNum(r), ph: `${p}% de ${t} = ${formatNum(r)}`, err: null }); };
  const runC2 = () => { const v = parseFloat((c2.v || '0').replace(',', '.')); const t = parseFloat((c2.t || '0').replace(',', '.')); if (isNaN(v) || isNaN(t) || t === 0) return setC2({ ...c2, err: 'Valeur nulle impossible' }); const r = (v / t) * 100; setC2({ ...c2, res: `${formatNum(r)}%`, ph: `${v} sur ${t} = ${formatNum(r)}%`, err: null }); };
  const runC3 = () => { const v = parseFloat((c3.v || '0').replace(',', '.')); const p = parseFloat((c3.p || '0').replace(',', '.')); if (isNaN(v) || isNaN(p)) return setC3({ ...c3, err: 'Invalide' }); const r = c3.mode === 'inc' ? v * (1 + p / 100) : v * (1 - p / 100); setC3({ ...c3, res: formatNum(r), ph: `${v} ${c3.mode === 'inc' ? '+' : '-'} ${p}% = ${formatNum(r)}`, err: null }); };
  const runC4 = () => { const s = parseFloat((c4.s || '0').replace(',', '.')); const e = parseFloat((c4.e || '0').replace(',', '.')); if (isNaN(s) || isNaN(e) || s === 0) return setC4({ ...c4, err: 'Base nulle' }); const r = ((e - s) / s) * 100; const sign = r > 0 ? '+' : ''; setC4({ ...c4, res: `${sign}${formatNum(r)}%`, ph: `Variation: ${sign}${formatNum(r)}%`, err: null }); };
  const runC5 = () => { const part = parseFloat((c5.part || '0').replace(',', '.')); const p = parseFloat((c5.p || '0').replace(',', '.')); if (isNaN(part) || isNaN(p) || p === 0) return setC5({ ...c5, err: 'Pourcentage invalide' }); const r = part / (p / 100); setC5({ ...c5, res: formatNum(r), ph: `Si ${part} = ${p}%, alors la valeur est ${formatNum(r)}`, err: null }); };
  const runC6 = () => { const amt = parseFloat((c6.amt || '0').replace(',', '.')); const r = parseFloat((c6.rate || '0').replace(',', '.')); if (isNaN(amt) || isNaN(r)) return setC6({ ...c6, err: 'Nombres invalides' }); let ht, tva, ttc, mainRes; const rf = r / 100; if (c6.mode === 'HT_TO_TTC') { ht = amt; tva = ht * rf; ttc = ht + tva; mainRes = `${formatNum(ttc)} € (TTC)`; } else if (c6.mode === 'TTC_TO_HT') { ttc = amt; ht = ttc / (1 + rf); tva = ttc - ht; mainRes = `${formatNum(ht)} € (HT)`; } else { tva = amt; ht = tva / rf; ttc = ht + tva; mainRes = `${formatNum(ht)} € (HT) / ${formatNum(ttc)} € (TTC)`; } setC6({ ...c6, res: mainRes, ph: `HT: ${formatNum(ht)}€ | TVA: ${formatNum(tva)}€ | TTC: ${formatNum(ttc)}€`, err: null }); };

  const renderHome = () => h('main', { className: 'flex-grow max-w-7xl mx-auto px-4 w-full py-8 space-y-8' }, [
    h('section', { className: 'bg-white border border-slate-200 rounded-2xl p-6 md:p-8' }, [
      h('h1', { className: 'text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3' }, 'Calculer un pourcentage (%, TVA, évolution, ratio)'),
      h('p', { className: 'text-slate-600 max-w-3xl' }, 'Utilisez les calculateurs ci-dessous pour obtenir un résultat immédiat, puis consultez le guide complet pour comprendre les formules, éviter les erreurs fréquentes et appliquer les bons calculs en situation réelle.'),
      h('p', { className: 'text-xs text-slate-500 mt-3' }, `Dernière mise à jour : ${LAST_UPDATED}`)
    ]),
    h('div', { className: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' }, [
      h(CalculatorCard, { title: "Part d'une valeur", description: "Calculer X% d'une valeur.", icon: h('span', { role: 'img', 'aria-label': 'icône calcul partiel' }, '🧮'), result: c1.res, resultPhrase: c1.ph, error: c1.err, onCalculate: runC1, onReset: () => setC1({ ...c1, p: '', t: '', res: null }), onExample: () => setC1({ ...c1, p: '20', t: '103' }), onCopy: handleCopy }, [h(InputGroup, { label: 'Pourcentage', value: c1.p, onChange: (v) => setC1({ ...c1, p: v }), placeholder: '20', suffix: '%' }), h(InputGroup, { label: 'Valeur', value: c1.t, onChange: (v) => setC1({ ...c1, t: v }), placeholder: '103' })]),
      h(CalculatorCard, { title: 'Ratio en %', description: 'Portion sur total.', icon: h('span', { role: 'img', 'aria-label': 'icône ratio' }, '📊'), result: c2.res, resultPhrase: c2.ph, error: c2.err, onCalculate: runC2, onReset: () => setC2({ ...c2, v: '', t: '', res: null }), onExample: () => setC2({ ...c2, v: '50', t: '200' }), onCopy: handleCopy }, [h(InputGroup, { label: 'Portion', value: c2.v, onChange: (v) => setC2({ ...c2, v }), placeholder: '50' }), h(InputGroup, { label: 'Total', value: c2.t, onChange: (v) => setC2({ ...c2, t: v }), placeholder: '200' })]),
      h(CalculatorCard, { title: 'Évolution', description: 'Hausse ou baisse en %.', icon: h('span', { role: 'img', 'aria-label': 'icône évolution' }, '📈'), result: c3.res, resultPhrase: c3.ph, error: c3.err, onCalculate: runC3, onReset: () => setC3({ ...c3, v: '', p: '', res: null }), onExample: () => setC3({ ...c3, v: '120', p: '15' }), onCopy: handleCopy }, [h('div', { className: 'flex p-1 bg-slate-100 rounded-lg sm:col-span-2' }, [h('button', { onClick: () => setC3({ ...c3, mode: 'inc' }), className: `flex-1 py-1 text-xs font-bold rounded ${c3.mode === 'inc' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, 'Hausse'), h('button', { onClick: () => setC3({ ...c3, mode: 'dec' }), className: `flex-1 py-1 text-xs font-bold rounded ${c3.mode === 'dec' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, 'Baisse')]), h(InputGroup, { label: 'Base', value: c3.v, onChange: (v) => setC3({ ...c3, v }), placeholder: '120' }), h(InputGroup, { label: 'Taux', value: c3.p, onChange: (v) => setC3({ ...c3, p: v }), placeholder: '15', suffix: '%' })]),
      h(CalculatorCard, { title: 'Taux de variation', description: 'Variation entre deux valeurs.', icon: h('span', { role: 'img', 'aria-label': 'icône variation' }, '🔁'), result: c4.res, resultPhrase: c4.ph, error: c4.err, onCalculate: runC4, onReset: () => setC4({ ...c4, s: '', e: '', res: null }), onExample: () => setC4({ ...c4, s: '100', e: '150' }), onCopy: handleCopy }, [h(InputGroup, { label: 'Départ', value: c4.s, onChange: (v) => setC4({ ...c4, s: v }), placeholder: '100' }), h(InputGroup, { label: 'Arrivée', value: c4.e, onChange: (v) => setC4({ ...c4, e: v }), placeholder: '150' })]),
      h(CalculatorCard, { title: 'Retrouver la valeur', description: 'Inverser un pourcentage.', icon: h('span', { role: 'img', 'aria-label': 'icône recherche de base' }, '🎯'), result: c5.res, resultPhrase: c5.ph, error: c5.err, onCalculate: runC5, onReset: () => setC5({ ...c5, part: '', p: '', res: null }), onExample: () => setC5({ ...c5, part: '20,6', p: '20' }), onCopy: handleCopy }, [h(InputGroup, { label: 'Portion connue', value: c5.part, onChange: (v) => setC5({ ...c5, part: v }), placeholder: '20,6' }), h(InputGroup, { label: 'Pourcentage', value: c5.p, onChange: (v) => setC5({ ...c5, p: v }), placeholder: '20', suffix: '%' })]),
      h(CalculatorCard, { title: 'TVA (France)', description: 'HT, TTC et Montant TVA.', icon: h('span', { role: 'img', 'aria-label': 'icône TVA' }, '💶'), result: c6.res, resultPhrase: c6.ph, error: c6.err, onCalculate: runC6, onReset: () => setC6({ ...c6, amt: '', res: null }), onExample: () => setC6({ ...c6, amt: '100', rate: '20' }), onCopy: handleCopy }, [h('div', { className: 'flex p-0.5 bg-slate-100 rounded-lg no-scrollbar overflow-x-auto sm:col-span-2' }, [h('button', { onClick: () => setC6({ ...c6, mode: 'HT_TO_TTC' }), className: `flex-1 py-1.5 px-2 text-[10px] font-bold rounded whitespace-nowrap ${c6.mode === 'HT_TO_TTC' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, 'HT → TTC'), h('button', { onClick: () => setC6({ ...c6, mode: 'TTC_TO_HT' }), className: `flex-1 py-1.5 px-2 text-[10px] font-bold rounded whitespace-nowrap ${c6.mode === 'TTC_TO_HT' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, 'TTC → HT'), h('button', { onClick: () => setC6({ ...c6, mode: 'TVA_ONLY' }), className: `flex-1 py-1.5 px-2 text-[10px] font-bold rounded whitespace-nowrap ${c6.mode === 'TVA_ONLY' ? 'bg-white shadow text-indigo-600' : 'text-slate-500'}` }, 'TVA → Tout')]), h(InputGroup, { label: 'Montant (€)', value: c6.amt, onChange: (v) => setC6({ ...c6, amt: v }), placeholder: '100' }), h('div', { className: 'grid grid-cols-2 gap-1' }, ['20', '10', '5.5', '2.1'].map((r) => h('button', { key: r, onClick: () => setC6({ ...c6, rate: r }), className: `py-1 text-[10px] font-bold border rounded ${c6.rate === r ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white text-slate-600 hover:border-indigo-300'}` }, `${r}%`)))])
    ]),
    h(RichTextPage, { html: editorialHome })
  ]);

  const pageMap = {
    '/': renderHome(),
    '/a-propos': h('main', { className: 'flex-grow max-w-7xl mx-auto px-4 w-full py-8' }, h(RichTextPage, { html: aboutContent })),
    '/mentions-legales': h('main', { className: 'flex-grow max-w-7xl mx-auto px-4 w-full py-8' }, h(RichTextPage, { html: legalContent })),
    '/politique-de-confidentialite': h('main', { className: 'flex-grow max-w-7xl mx-auto px-4 w-full py-8' }, h(RichTextPage, { html: privacyContent })),
    '/contact': h('main', { className: 'flex-grow max-w-7xl mx-auto px-4 w-full py-8' }, h(RichTextPage, { html: contactContent }))
  };

  const currentYear = new Date().getFullYear();

  return h('div', { className: 'min-h-screen flex flex-col' }, [
    h('header', { className: 'bg-white border-b border-slate-200 sticky top-0 z-50' },
      h('div', { className: 'max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4' }, [
        h('button', { onClick: () => navigate('/'), className: 'flex items-center gap-2' }, [h('div', { className: 'w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg', 'aria-label': 'logo pourcentage' }, '%'), h('span', { className: 'text-lg font-black text-slate-800 tracking-tighter sm:text-xl' }, ['CalculerUn', h('span', { className: 'text-indigo-600' }, 'Pourcentage')])]),
        h('nav', { className: 'hidden md:flex items-center gap-4 text-sm font-semibold text-slate-600' }, navItems.map((item) => h('a', { key: item.path, href: item.path, onClick: (e) => { e.preventDefault(); navigate(item.path); }, className: `hover:text-indigo-600 ${path === item.path ? 'text-indigo-600' : ''}` }, item.label))),
        path === '/' && h('div', { className: 'text-xs text-slate-500' }, [`Arrondi: `, h('select', { value: precision, onChange: (e) => setPrecision(Number(e.target.value)), className: 'border rounded px-1 py-0.5 ml-1' }, [0,1,2,3].map((v)=>h('option', { key: v, value: v }, `${v} déc.`)))])
      ])
    ),
    pageMap[path] || h('main', { className: 'flex-grow max-w-4xl mx-auto px-4 w-full py-12' }, h('div', { className: 'bg-white border border-slate-200 rounded-2xl p-8 text-center' }, [h('h1', { className: 'text-3xl font-black mb-3' }, 'Page non trouvée'), h('p', { className: 'text-slate-600 mb-4' }, 'Le contenu demandé n’existe pas ou a été déplacé.'), h('button', { onClick: () => navigate('/'), className: 'px-4 py-2 bg-indigo-600 text-white rounded-lg' }, 'Retour à l’accueil') ])),
    h('footer', { className: 'mt-auto py-10 bg-white border-t border-slate-200' },
      h('div', { className: 'max-w-7xl mx-auto px-4 text-sm text-slate-600 space-y-3 prose-lite' }, [
        h('p', {}, 'Outil indicatif : les résultats affichés sur calculerunpoucentage.fr sont fournis à titre informatif et ne constituent ni un conseil juridique, ni un conseil fiscal, ni une validation comptable.'),
        h('p', {}, 'Mentions légales : le site calculerunpoucentage.fr propose des calculateurs de pourcentage et TVA à titre strictement indicatif. Vérifiez toujours vos résultats avant une décision engageante.'),
        h('p', {}, ['Éditeur : calculerunpoucentage.fr – Calculer un pourcentage. Contact : ', h('a', { href: 'mailto:laloumaxime951@gmail.com', className: 'text-indigo-700' }, 'laloumaxime951@gmail.com')]),
        h('p', {}, 'Hébergement : OVHcloud SAS – 2 rue Kellermann, 59100 Roubaix – France.'),
        h('p', {}, ['Ce site ne collecte ni ne conserve directement de données personnelles liées aux calculs saisis ; les calculs sont traités localement dans votre navigateur. Google AdSense peut utiliser des cookies publicitaires. En savoir plus : ', h('a', { href: 'https://policies.google.com/technologies/ads', className: 'text-indigo-700' }, 'https://policies.google.com/technologies/ads')]),
        h('p', { className: 'text-slate-500' }, navItems.slice(1).map((item, i) => h(React.Fragment, { key: item.path }, [i > 0 ? ' | ' : '', h('a', { href: item.path, onClick: (e) => { e.preventDefault(); navigate(item.path); }, className: 'text-indigo-700' }, item.label)]))),
        h('p', { className: 'text-xs text-slate-400 pt-2' }, `© ${currentYear} calculerunpoucentage.fr`)
      ])
    )
  ]);
};

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
