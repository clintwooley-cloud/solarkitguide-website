const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const presets = {
  cabin: [
    ['Refrigerator', 150, 35, 24, 1200],
    ['LED lights', 60, 100, 5, 60],
    ['Wi‑Fi/router', 20, 100, 8, 20],
    ['Laptop/phones', 120, 100, 3, 120],
    ['Water pump', 800, 10, 1, 1200],
    ['Microwave', 1200, 100, 0.25, 1200]
  ],
  rv: [
    ['12V fridge', 70, 45, 24, 250],
    ['LED lights', 40, 100, 4, 60],
    ['Vent fan', 35, 100, 8, 35],
    ['Laptop/phones', 100, 100, 3, 120],
    ['Water pump', 120, 15, 1, 1200],
    ['Coffee maker', 900, 100, 0.2, 900]
  ],
  shed: [
    ['LED shop lights', 80, 100, 4, 80],
    ['Battery chargers', 180, 100, 2, 180],
    ['Small air compressor', 900, 20, 0.5, 2200],
    ['Circular saw / tools', 1200, 30, 0.5, 1800],
    ['Fan', 75, 100, 4, 75]
  ],
  home: [
    ['Refrigerator', 150, 35, 24, 1200],
    ['Freezer', 120, 35, 24, 800],
    ['LED lights', 300, 100, 6, 300],
    ['Wi‑Fi/router', 25, 100, 24, 25],
    ['TV / entertainment', 200, 100, 5, 250],
    ['Computer / home office', 250, 100, 4, 350],
    ['Ceiling fans', 180, 100, 8, 180],
    ['Central AC air handler + condenser', 3500, 55, 8, 9000],
    ['Electric water heater', 4500, 35, 3, 4500],
    ['Dishwasher', 1200, 50, 1, 1800],
    ['Electric range / oven', 3500, 45, 1, 3500],
    ['Well pump', 1200, 15, 1, 2400],
    ['Sump pump', 800, 15, 0.5, 1800],
    ['Microwave', 1200, 100, 0.3, 1200],
    ['Washing machine', 500, 50, 1, 1200],
    ['Electric dryer', 5000, 100, 0.75, 6000],
    ['Small kitchen appliances', 1000, 100, 0.4, 1200],
    ['Garage door opener', 500, 5, 0.2, 1200]
  ],
  custom: [
    ['Custom load', 100, 100, 1, 150]
  ]
};

const applianceLibrary = {
  custom: ['Custom load', 100, 100, 1, 150],
  refrigerator: ['Refrigerator', 150, 35, 24, 1200],
  freezer: ['Freezer', 120, 35, 24, 800],
  'mini-fridge': ['Mini fridge', 65, 40, 24, 250],
  microwave: ['Microwave', 1200, 100, 0.25, 1200],
  'coffee-maker': ['Coffee maker', 900, 100, 0.2, 900],
  dishwasher: ['Dishwasher', 1200, 50, 1, 1800],
  'electric-range': ['Electric range / oven', 3500, 45, 1, 3500],
  'electric-water-heater': ['Electric water heater', 4500, 35, 3, 4500],
  'small-kitchen-appliances': ['Small kitchen appliances', 1000, 100, 0.4, 1200],
  'ceiling-fan': ['Ceiling fan', 60, 100, 8, 60],
  'box-fan': ['Box / portable fan', 75, 100, 6, 75],
  'window-ac-small': ['Window AC — small', 600, 60, 6, 1800],
  'window-ac-large': ['Window AC — large', 1200, 60, 6, 3600],
  'mini-split-9k': ['Mini split AC — 9k BTU', 700, 55, 8, 1400],
  'mini-split-12k': ['Mini split AC — 12k BTU', 1100, 55, 8, 2200],
  'central-ac': ['Central AC air handler + condenser', 3500, 55, 8, 9000],
  'space-heater': ['Space heater', 1500, 100, 3, 1500],
  'tv-small': ['TV — small LED', 60, 100, 4, 60],
  'tv-large': ['TV — large LED', 150, 100, 4, 150],
  laptop: ['Laptop', 65, 100, 4, 65],
  'desktop-computer': ['Desktop computer', 250, 100, 4, 350],
  'home-office': ['Computer / home office', 250, 100, 4, 350],
  'wifi-router': ['Wi‑Fi / router', 25, 100, 24, 25],
  'phone-charging': ['Phone / tablet charging', 25, 100, 3, 25],
  'washing-machine': ['Washing machine', 500, 50, 1, 1200],
  'electric-dryer': ['Electric dryer', 5000, 100, 0.75, 6000],
  'gas-dryer': ['Gas dryer motor', 500, 100, 0.75, 800],
  'well-pump': ['Well pump', 1200, 15, 1, 2400],
  'sump-pump': ['Sump pump', 800, 15, 1, 1800],
  'water-pump-small': ['Small water pump', 120, 15, 1, 300],
  'garage-door-opener': ['Garage door opener', 500, 5, 0.2, 1200],
  'battery-chargers': ['Battery chargers', 180, 100, 2, 180],
  'circular-saw': ['Circular saw / power tool', 1200, 30, 0.5, 1800],
  'air-compressor': ['Small air compressor', 900, 20, 0.5, 2200],
  'shop-lights': ['LED shop lights', 80, 100, 4, 80]
};

function roundUp(value, step) { return Math.ceil(value / step) * step; }
function fmt(n, digits = 0) { return Number(n).toLocaleString(undefined, { maximumFractionDigits: digits }); }
function kw(n) { return `${fmt(n, n < 10 ? 1 : 0)} kW`; }
function kwh(n) { return `${fmt(n, n < 10 ? 1 : 0)} kWh`; }
function watts(n) { return `${fmt(n)}W`; }

function systemVoltage(inverterWatts, arrayWatts) {
  const size = Math.max(inverterWatts, arrayWatts);
  if (size < 1500) return '12V';
  if (size < 4000) return '24V';
  return '48V';
}

function ctaDataAttrs(cta = {}, fallbackLocation = 'calculator_result') {
  const track = (cta.track || cta.label || 'cta').replace(/"/g, '&quot;');
  const location = (cta.location || fallbackLocation).replace(/"/g, '&quot;');
  const type = (cta.type || 'click').replace(/"/g, '&quot;');
  return ` data-cta-track="${track}" data-cta-location="${location}" data-cta-type="${type}"`;
}

function setResults(title, items, recommendation, shopping, assumptions = [], ctas = [], products = []) {
  $('#resultTitle').textContent = title;
  $('#resultGrid').innerHTML = items.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
  $('#recommendation').innerHTML = recommendation;
  $('#shoppingList').innerHTML = shopping.map(item => `<li>${item}</li>`).join('');
  const ctaBox = $('#resultCtas');
  if (ctaBox) {
    ctaBox.innerHTML = ctas.map(cta => `<a class="button ${cta.style || 'secondary'}" href="${cta.href}"${ctaDataAttrs(cta, 'calculator_result_button')}>${cta.label}</a>`).join('');
  }
  const productsBox = $('#resultProducts');
  if (productsBox) {
    productsBox.innerHTML = products.length ? products.map(product => `
      <article class="product-card${product.sample ? ' sample-product-card' : ''}">
        ${product.recommended ? `<span class="product-recommendation-flag">Recommended for your result</span>` : ''}
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
        <h4>${product.title}</h4>
        ${product.fit ? `<p class="product-fit">${product.fit}</p>` : ''}
        ${product.bullets?.length ? `<ul>${product.bullets.map(item => `<li>${item}</li>`).join('')}</ul>` : ''}
        ${product.callout ? `<div class="price-callout">${product.callout}</div>` : ''}
        <div class="hero-actions">
          <a class="button ${product.primary?.style || 'primary'}" href="${product.primary.href}"${ctaDataAttrs({ ...product.primary, track: product.primary.track || `${product.title} - ${product.primary.label}` }, 'calculator_result_product')}>${product.primary.label}</a>
          ${product.secondary ? `<a class="button ${product.secondary.style || 'secondary'}" href="${product.secondary.href}"${ctaDataAttrs({ ...product.secondary, track: product.secondary.track || `${product.title} - ${product.secondary.label}` }, 'calculator_result_product')}>${product.secondary.label}</a>` : ''}
        </div>
      </article>
    `).join('') : '';
  }
  const assumptionBox = $('#assumptionsUsed');
  if (assumptionBox) {
    assumptionBox.innerHTML = assumptions.length ? `<h4>Assumptions used</h4><ul>${assumptions.map(item => `<li>${item}</li>`).join('')}</ul>` : '';
  }
}

function diagramStep(icon, title, detail) {
  return `<div class="diagram-step"><div class="diagram-icon">${icon}</div><strong>${title}</strong><span>${detail}</span></div>`;
}
function componentPill(label) { return `<span class="component-pill">${label}</span>`; }
function wiringRow(prefix, count, label) {
  return `<div class="string-row"><span>${prefix}</span>${Array.from({ length: Math.max(1, count) }, (_, i) => `${componentPill(label + (count > 1 ? ' ' + (i + 1) : ''))}${i < count - 1 ? '<span class="plus-link">+</span>' : ''}`).join('')}</div>`;
}
function batteryWiring(voltage, batteryKwh) {
  const series = voltage === '48V' ? 4 : voltage === '24V' ? 2 : 1;
  const batteryUnitKwh = 1.28; // common 12.8V 100Ah LiFePO4 reference size
  const totalNeeded = Math.max(series, Math.ceil((batteryKwh || batteryUnitKwh) / batteryUnitKwh));
  const parallel = Math.max(1, Math.ceil(totalNeeded / series));
  const total = series * parallel;
  const rows = Array.from({ length: parallel }, (_, i) => wiringRow(`String ${i + 1}:`, series, '12V batt')).join('');
  const seriesText = series === 1 ? 'one 12V battery per string' : `${series} batteries in series per string`;
  const parallelText = parallel === 1 ? 'one string' : `${parallel} parallel strings`;
  return `<h5>Battery bank wiring</h5><p>Example: <strong>${voltage}</strong> bank using about <strong>${total}</strong> common 12V LiFePO₄ batteries — ${seriesText}, ${parallelText}.</p><div class="string-visual">${rows}</div><div class="diagram-note">Series raises voltage. Parallel raises capacity. Final battery count depends on the exact battery model and BMS limits.</div>`;
}
function panelWiring(arrayW, voltage, enabled = true) {
  if (!enabled || !arrayW) return `<h5>Solar panel wiring</h5><p>No solar array selected for this estimate.</p><div class="diagram-note">If you add solar recharge later, panel stringing should be matched to the charge controller input voltage and current limits.</div>`;
  const panelW = 400;
  const count = Math.max(1, Math.ceil(arrayW / panelW));
  const series = voltage === '48V' ? Math.min(4, count) : voltage === '24V' ? Math.min(2, count) : 1;
  const parallel = Math.max(1, Math.ceil(count / series));
  const rows = Array.from({ length: parallel }, (_, i) => wiringRow(`String ${i + 1}:`, Math.min(series, count - (i * series)), 'panel')).join('');
  return `<h5>Solar panel wiring</h5><p>Example: about <strong>${count}</strong> × ${panelW}W panels. A common starting point is <strong>${series}S${parallel}P</strong> into an MPPT charge controller.</p><div class="string-visual">${rows}</div><div class="diagram-note">Panel stringing depends on panel Voc/Vmp, cold weather, controller limits, and wire distance. Treat this as a visual concept, not a final wiring plan.</div>`;
}
function setVisualPlan({ mode, arrayW = 0, batteryKwh = 0, inverterW = 0, voltage = '48V', solar = true }) {
  const stepsByMode = {
    bill: [
      ['☀️', 'Solar panels', arrayW ? `${watts(arrayW)} array` : 'Rooftop or ground mount'],
      ['🔁', 'Grid/hybrid inverter', 'Converts solar to home power'],
      ['🏠', 'Home loads', 'Offsets daily usage'],
      ['⚡', 'Utility grid', 'Net metering / backup rules vary']
    ],
    ev: [
      ['☀️', 'Additional solar', arrayW ? `${watts(arrayW)} extra array` : 'Extra production'],
      ['🔁', 'Grid-tie / hybrid inverter', 'Offsets EV charging energy'],
      ['🔌', 'EV charger', 'Level 2 home charging typical'],
      ['🚗', 'Electric vehicle', 'Daily driving energy']
    ],
    load: [
      ['☀️', 'Solar panels', arrayW ? `${watts(arrayW)} array` : 'Solar array'],
      ['📟', 'MPPT controller', `${voltage} charging path`],
      ['🔋', 'Battery bank', batteryKwh ? `${kwh(batteryKwh)} nominal` : 'Stores energy'],
      ['🔌', 'Inverter + loads', `${watts(inverterW)} class`]
    ],
    backup: solar ? [
      ['☀️', 'Solar recharge', arrayW ? `${watts(arrayW)} array` : 'Optional array'],
      ['🔋', 'Battery bank', batteryKwh ? `${kwh(batteryKwh)} nominal` : 'Stores outage power'],
      ['🔌', 'Inverter', `${watts(inverterW)} class`],
      ['🏠', 'Critical loads', 'Fridge, lights, pumps, router']
    ] : [
      ['🔋', 'Battery bank', batteryKwh ? `${kwh(batteryKwh)} nominal` : 'Stores outage power'],
      ['🔌', 'Inverter', `${watts(inverterW)} class`],
      ['🏠', 'Critical loads', 'Fridge, lights, pumps, router'],
      ['🔄', 'Recharge source', 'Wall or generator recharge']
    ]
  };
  const steps = stepsByMode[mode] || stepsByMode.load;
  $('#systemDiagram').innerHTML = steps.map(([icon, title, detail]) => diagramStep(icon, title, detail)).join('');
  $('#batteryDiagram').innerHTML = mode === 'bill'
    ? batteryKwh > 0
      ? `<h5>Battery backup target</h5><p>Planning target: about <strong>${kwh(batteryKwh)}</strong> nominal battery storage for the selected backup goal.</p><div class="diagram-note">Grid-tie home solar may not require batteries. Final storage size depends on critical loads, outage duration, chemistry, inverter limits, and code requirements.</div>`
      : `<h5>Battery option</h5><p>Grid-tie home solar may not require batteries. If backup power is a goal, add a hybrid inverter and battery bank sized around critical loads.</p><div class="diagram-note">Battery wiring depends on the chosen battery system and inverter voltage.</div>`
    : mode === 'ev'
      ? `<h5>EV charging note</h5><p>This estimates extra solar production to offset EV charging. Most home EV charging still uses the home electrical panel and grid unless a larger hybrid/battery system is designed.</p><div class="diagram-note">A dedicated EV charger circuit should be installed and permitted by a qualified electrician.</div>`
      : batteryWiring(voltage, batteryKwh);
  $('#panelDiagram').innerHTML = panelWiring(arrayW, voltage, mode !== 'backup' || solar);
}

const recommendationCatalog = {
  equipmentGuide: {
    badge: 'Best next step',
    title: 'Equipment guide',
    fit: 'Use this to jump from sizing math into the right category before chasing random products.',
    bullets: ['Compare portable power, off-grid kits, home backup, and total-home solar paths', 'Helpful when the result is more about system class than one specific SKU'],
    callout: 'This is the cleanest bridge from calculator result to shopping path.',
    primary: { label: 'Browse equipment page', href: 'equipment/' },
    secondary: { label: 'Read solar basics', href: 'solar-power-system-basics/' }
  },
  homeSizingGuide: {
    badge: 'Sizing guide',
    title: 'Home solar sizing guide',
    fit: 'Useful when you want more context before comparing larger home solar and battery setups.',
    bullets: ['Good for array size, inverter class, and battery expectation sanity checks', 'Better fit than a portable product review when the system is house-scale'],
    callout: 'Best when the result is pushing into installed-system territory.',
    primary: { label: 'Read sizing guide', href: 'solar-kit-size-calculator/' },
    secondary: { label: 'Browse equipment page', href: 'equipment/' }
  },
  inverterGuide: {
    badge: 'Sizing help',
    title: 'Inverter size guide',
    fit: 'Use this when surge loads, pumps, or AC are driving the system size more than daily energy alone.',
    bullets: ['Helps explain why inverter class changes cost and complexity fast', 'Useful before comparing larger backup or hybrid systems'],
    callout: 'A good checkpoint before buying the wrong inverter tier.',
    primary: { label: 'Read inverter guide', href: 'inverter-size-calculator/' },
    secondary: { label: 'Browse equipment page', href: 'equipment/' }
  },
  cabinGuide: {
    badge: 'Starter kit path',
    title: 'Best solar kits for cabins and tiny homes',
    fit: 'Strong next click for cabins, RVs, sheds, and small off-grid builds when you want realistic kit classes.',
    bullets: ['Compares system tiers instead of random starter kits', 'Better for matching the result to a believable buying range'],
    callout: 'Usually the best follow-up for off-grid results.',
    primary: { label: 'See kit comparisons', href: 'best-solar-kits-for-cabins/' },
    secondary: { label: 'Browse equipment page', href: 'equipment/' }
  },
  renogyStarter: {
    badge: 'Beginner kit example',
    title: 'Renogy 200W 12V Starter Kit',
    fit: 'Best for very small loads, battery charging, sheds, light RV use, and readers still in true starter-kit territory.',
    bullets: ['Not a full cabin power system by itself', 'Good when the result is still light-duty and 12V-friendly'],
    callout: 'A useful reality check before overspending or overexpecting.',
    primary: { label: 'Check kit price', href: 'https://renogy.sjv.io/qWyNdj' },
    secondary: { label: 'Read kit review', href: 'renogy-200w-12v-starter-kit-review/' }
  },
  renogyBattery: {
    badge: 'Starter battery',
    title: 'Renogy Core Mini 12V 100Ah Battery',
    fit: 'Fits small 12V starter systems better than heavier off-grid or home-backup builds.',
    bullets: ['Roughly 1.28kWh nominal storage', 'Better for modest loads than serious backup runtime'],
    callout: 'Good add-on when the result still lands in small 12V territory.',
    primary: { label: 'Check battery price', href: 'https://renogy.sjv.io/4aEK1Z' },
    secondary: { label: 'Read battery review', href: 'renogy-core-mini-12v-100ah-lithium-battery-review/' }
  },
  ac180: {
    badge: 'Portable power station',
    title: 'BLUETTI AC180',
    fit: 'Good for lighter backup loads, camping, RV weekends, fridge support, routers, and small appliance use.',
    bullets: ['1,152Wh battery and 1,800W AC output', 'Good when a tiny power bank is too small but a 2kWh unit may be overkill'],
    callout: 'Solid first serious portable backup option if the result stays modest.',
    primary: { label: 'Check AC180 price', href: 'https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2890149&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Fac180' },
    secondary: { label: 'Read AC180 review', href: 'bluetti-ac180-review/' }
  },
  elite100: {
    badge: '1kWh comparison',
    title: 'BLUETTI Elite 100 V2',
    fit: 'A lighter 1kWh-class option when solar input, portability, and quick emergency use matter more than long runtime.',
    bullets: ['1,024Wh battery and 1,800W output', 'Interesting when it prices close to the AC180'],
    callout: 'Best for buyers comparing compact 1kWh backup options.',
    primary: { label: 'Check Elite 100 V2 price', href: 'https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2890149&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Felite-100-v2-portable-power-station' },
    secondary: { label: 'Compare vs AC180', href: 'bluetti-elite-100-v2-vs-ac180/' }
  },
  ankerC1000: {
    badge: '1kWh power station',
    title: 'Anker SOLIX C1000 Gen 2',
    fit: 'Strong for compact outage coverage, portable work power, and readers who want high output without jumping to a heavy 2kWh unit.',
    bullets: ['1,024Wh battery and 2,000W AC output', 'Good for light home backup, RV weekends, and small off-grid use'],
    callout: 'One of the better compact picks when output matters more than maximum runtime.',
    primary: { label: 'Check C1000 Gen 2 price', href: 'https://ankersolix.pxf.io/L0214L' },
    secondary: { label: 'Read C1000 Gen 2 review', href: 'anker-solix-c1000-gen-2-review/' }
  },
  ankerC2000: {
    badge: '2kWh backup',
    title: 'Anker SOLIX C2000 Gen 2',
    fit: 'Better for meaningful backup loads, RV power, storm prep, and readers who outgrew the 1kWh class.',
    bullets: ['2,048Wh battery and 2,400W AC output', 'Expandable and better suited to selected home outage loads'],
    callout: 'A strong middle ground before stepping into fixed installed backup.',
    primary: { label: 'Check C2000 Gen 2 price', href: 'https://ankersolix.pxf.io/QYbX4M' },
    secondary: { label: 'Read C2000 Gen 2 review', href: 'anker-solix-c2000-gen-2-review/' }
  },
  elite200: {
    badge: '2kWh backup',
    title: 'BLUETTI Elite 200 V2',
    fit: 'A solid 2kWh-class alternative for readers who need more runtime for outage essentials and portable backup.',
    bullets: ['2,073.6Wh battery and 2,600W AC output', 'Good when runtime matters more than a compact form factor'],
    callout: 'Useful side-by-side comparison against the Anker C2000 tier.',
    primary: { label: 'Check Elite 200 V2 price', href: 'https://www.awin1.com/cread.php?awinmid=59271&awinaffid=2890149&ued=https%3A%2F%2Fwww.bluettipower.com%2Fproducts%2Felite-200-v2-portable-power-station' },
    secondary: { label: 'Read Elite 200 V2 review', href: 'bluetti-elite-200-v2-review/' }
  }
};

function productCard(id, overrides = {}) {
  const base = recommendationCatalog[id];
  if (!base) return null;
  return {
    ...base,
    ...overrides,
    bullets: overrides.bullets || [...(base.bullets || [])],
    primary: { ...(base.primary || {}), ...(overrides.primary || {}) },
    secondary: overrides.secondary === null
      ? undefined
      : ((base.secondary || overrides.secondary) ? { ...(base.secondary || {}), ...(overrides.secondary || {}) } : undefined)
  };
}

function uniqueProducts(cards = []) {
  const seen = new Set();
  return cards.filter(card => {
    if (!card || !card.title) return false;
    if (seen.has(card.title)) return false;
    seen.add(card.title);
    return true;
  });
}

function homeSolarRecommendations({ roundedKw, batteryKwh, inverterW }) {
  const cards = [productCard('equipmentGuide', { recommended: true })];
  if (batteryKwh >= 5 || roundedKw >= 4.5 || inverterW >= 5000) {
    cards.push(productCard('homeSizingGuide', { recommended: true }));
  } else {
    cards.push(productCard('inverterGuide', {
      badge: 'Planning guide',
      fit: 'Useful if you want to understand inverter and backup implications before comparing larger home-solar gear.'
    }));
  }
  return uniqueProducts(cards);
}

function offGridRecommendations({ arrayW, batteryKwh, inverterW, voltage }) {
  if (voltage === '12V' && arrayW <= 300 && batteryKwh <= 1.35 && inverterW <= 1200) {
    return uniqueProducts([
      productCard('renogyStarter', { recommended: true }),
      productCard('renogyBattery', { recommended: true }),
      productCard('cabinGuide')
    ]);
  }
  if (arrayW <= 700 && batteryKwh <= 1.8 && inverterW <= 2000) {
    return uniqueProducts([
      productCard('ankerC1000', { recommended: true }),
      productCard('cabinGuide'),
      productCard('renogyStarter')
    ]);
  }
  if (batteryKwh <= 3.2 && inverterW <= 2600) {
    return uniqueProducts([
      productCard('ankerC2000', { recommended: true }),
      productCard('elite200', { recommended: true }),
      productCard('cabinGuide')
    ]);
  }
  return uniqueProducts([
    productCard('equipmentGuide', {
      recommended: true,
      badge: 'Larger-system path',
      fit: 'This result is pushing beyond simple starter kits, so category-level comparison is more useful than a small product recommendation.',
      primary: { label: 'Browse equipment page', href: 'equipment/' },
      secondary: { label: 'Read inverter guide', href: 'inverter-size-calculator/' }
    }),
    productCard('cabinGuide')
  ]).slice(0, 3);
}

function backupRecommendations({ portable, batteryKwh, inverterW, hours, solar }) {
  if (!portable) {
    return uniqueProducts([
      productCard('equipmentGuide', {
        recommended: true,
        badge: 'Installed backup path',
        fit: 'This result points toward larger home backup gear instead of a typical portable station.'
      }),
      productCard('inverterGuide')
    ]);
  }
  if (batteryKwh <= 1.2 && inverterW <= 1800 && hours <= 12) {
    return uniqueProducts([
      productCard('ac180', { recommended: true }),
      productCard('ankerC1000', { recommended: true }),
      productCard('elite100')
    ]);
  }
  if (batteryKwh <= 2.6 && inverterW <= 2400 && hours <= 24) {
    return uniqueProducts([
      productCard('ankerC2000', { recommended: true }),
      productCard('elite200', { recommended: true }),
      solar ? productCard('equipmentGuide', { badge: 'Buying path' }) : productCard('inverterGuide', { badge: 'Backup planning' })
    ]);
  }
  return uniqueProducts([
    productCard('equipmentGuide', {
      recommended: true,
      badge: 'Compare backup categories',
      fit: 'This result is close enough to larger backup territory that a category-level comparison is safer than a narrow product push.'
    }),
    productCard('ankerC2000'),
    productCard('elite200')
  ]);
}

function evRecommendations() {
  return uniqueProducts([
    productCard('equipmentGuide', {
      recommended: true,
      fit: 'Most EV-charging solar decisions still start with the house-side solar plan, not a gadget purchase.'
    }),
    productCard('homeSizingGuide', {
      badge: 'Home solar path',
      recommended: true,
      fit: 'Useful if this EV result is making you think about a broader home solar upgrade.'
    })
  ]);
}

function loadStats(rows) {
  const activeRows = rows.filter(r => r.watts > 0 && r.hours > 0 && r.duty > 0);
  const dailyWh = rows.reduce((sum, r) => sum + (r.watts * r.duty * r.hours), 0);
  const dailyKwh = dailyWh / 1000;
  const peakWatts = Math.max(0, ...rows.map(r => r.watts));
  const possibleRunningWatts = activeRows.reduce((sum, r) => sum + r.watts, 0);
  const largestStartupWatts = Math.max(0, ...activeRows.map(r => r.surge));
  const worstStartupScenario = Math.max(0, ...activeRows.map(r => r.surge + Math.max(0, possibleRunningWatts - r.watts) * 0.5));
  return { activeRows, dailyWh, dailyKwh, peakWatts, possibleRunningWatts, largestStartupWatts, worstStartupScenario };
}

function homeBatteryTarget(dailyKwh, goal) {
  const usableFactor = 0.85;
  const essentialDays = goal === 'essential' ? 1 : +(goal || '').replace('essential-', '');
  if (essentialDays >= 1 && essentialDays <= 5) {
    return {
      kwh: (dailyKwh * 0.35 * essentialDays) / usableFactor,
      label: `${essentialDays}-day essential backup target`,
      note: `Estimates roughly 35% of daily home usage for critical loads over ${essentialDays} day${essentialDays === 1 ? '' : 's'}`
    };
  }
  const goals = {
    none: { kwh: 0, label: 'No battery selected', note: 'Grid-tie only; no storage target included' },
    'whole-home-half-day': { kwh: (dailyKwh * 0.5) / usableFactor, label: '12-hour whole-home target', note: 'Estimates half a day of whole-home usage' },
    'whole-home-one-day': { kwh: dailyKwh / usableFactor, label: '1-day whole-home target', note: 'Estimates one full day of whole-home usage' },
    'whole-home-two-day': { kwh: (dailyKwh * 2) / usableFactor, label: '2-day whole-home target', note: 'Estimates two full days of whole-home usage' }
  };
  return goals[goal] || homeBatteryTarget(dailyKwh, 'essential-1');
}

function calculateBill() {
  const method = $('#billMethod')?.value || 'bill';
  const monthly = +$('#billMonthly').value || 0;
  const rate = +$('#billRate').value || 0.16;
  const sun = +$('#billSun').value || 4.5;
  const offset = +$('#billOffset').value || 1;
  const loss = +$('#billLoss').value || 1.25;
  const panelWatts = Math.max(100, +$('#billPanelWatts')?.value || 400);
  const batteryGoal = $('#billBatteryGoal')?.value || 'essential';
  const monthlyKwh = method === 'loads' ? applianceData('#homeApplianceRows').reduce((sum, r) => sum + (r.watts * r.duty * r.hours * 30 / 1000), 0) : monthly / rate;
  const dailyKwh = method === 'loads' ? (monthlyKwh / 30) * offset : (monthlyKwh * offset) / 30;
  const arrayKw = (dailyKwh / sun) * loss;
  const roundedKw = roundUp(arrayKw, 0.5);
  const panelCount = Math.ceil((roundedKw * 1000) / panelWatts);
  const annualKwh = dailyKwh * 365;
  const roughCost = roundedKw * 2800;
  const battery = homeBatteryTarget(dailyKwh, batteryGoal);
  if (method === 'loads') {
    const stats = loadStats(applianceData('#homeApplianceRows'));
    const inverterBase = Math.max(roundedKw * 1000, stats.possibleRunningWatts * 0.65, stats.worstStartupScenario, stats.peakWatts * 1.25, 3000);
    const inverterW = roundUp(inverterBase, 500);
    const voltage = systemVoltage(inverterW, roundedKw * 1000);
    setResults('Full-home appliance load estimate', [
      [kwh(dailyKwh), 'target daily production'],
      [kw(roundedKw), 'recommended solar array'],
      [`${panelCount}`, `approx. ${fmt(panelWatts)}W panels`],
      [`${watts(inverterW)} / ${voltage}`, 'hybrid inverter review class'],
      [battery.kwh > 0 ? kwh(battery.kwh) : 'None', 'battery storage target']
    ], `Based on the household loads entered, a <strong>${kw(roundedKw)}</strong> grid-tie or hybrid solar system is the rough starting point for offsetting about <strong>${fmt(offset * 100)}%</strong> of that usage. Because this is a full-home path, the result stays focused on rooftop/ground-mount solar, utility rules, and optional hybrid backup — not a small cabin kit.`, [
      `${kw(roundedKw)} grid-tie or hybrid solar system`,
      `${panelCount} × ${fmt(panelWatts)}W-class solar panels`,
      `Hybrid/grid-tie inverter capacity reviewed around ${watts(inverterW)}`,
      'Rooftop or ground-mount racking',
      battery.kwh > 0 ? `${kwh(battery.kwh)} nominal battery storage for ${battery.label}` : 'No battery storage selected',
      `Annual target production: about ${fmt(annualKwh)} kWh`
    ], [
      `Calculation method: full-home appliance loads`,
      `Estimated monthly use from entered loads: ${fmt(monthlyKwh)} kWh`,
      `Peak sun hours: ${sun}`,
      `Loss factor: ${fmt((loss - 1) * 100)}%`,
      `Panel wattage: ${fmt(panelWatts)}W`,
      `Battery assumption: ${battery.note}; nominal target assumes roughly 85% usable capacity`,
      `Entered simultaneous running load: about ${watts(stats.possibleRunningWatts)}`,
      `Largest startup load entered: about ${watts(stats.largestStartupWatts)}`,
      'Load-based estimates depend heavily on realistic hours/day and duty cycle settings'
    ], [
      { label: 'Browse home solar gear', href: 'equipment/', style: 'primary' },
      { label: 'Learn home solar basics', href: 'solar-power-system-basics/' }
    ], homeSolarRecommendations({ roundedKw, batteryKwh: battery.kwh, inverterW }));
    setVisualPlan({ mode: 'bill', arrayW: roundedKw * 1000, batteryKwh: battery.kwh, inverterW, voltage });
    return;
  }
  const inverterW = roundUp(Math.max(roundedKw * 1000, 3000), 500);
  const voltage = systemVoltage(inverterW, roundedKw * 1000);
  setResults('Home solar estimate', [
    [kwh(dailyKwh), 'target daily production'],
    [kw(roundedKw), 'recommended solar array'],
    [`${panelCount}`, `approx. ${fmt(panelWatts)}W panels`],
    [`${watts(inverterW)} / ${voltage}`, 'hybrid inverter review class'],
    [battery.kwh > 0 ? kwh(battery.kwh) : 'None', 'battery storage target']
  ], `A <strong>${kw(roundedKw)}</strong> grid-tie or hybrid solar kit is the rough starting point for offsetting about <strong>${fmt(offset * 100)}%</strong> of this bill. For affiliate recommendations, this should map to rooftop/grid-tie kits, hybrid inverters, racking, and optional battery backup.`, [
    `${kw(roundedKw)} grid-tie or hybrid solar kit`,
    `${panelCount} × ${fmt(panelWatts)}W-class solar panels`,
    `Hybrid/grid-tie inverter capacity reviewed around ${watts(inverterW)}`,
    battery.kwh > 0 ? `${kwh(battery.kwh)} nominal battery storage for ${battery.label}` : 'No battery storage selected',
    'Rooftop or ground-mount racking',
    'Grid-tie/hybrid inverter matched to utility rules',
    `Annual target production: about ${fmt(annualKwh)} kWh`,
    `Rough installed solar cost before incentives: about $${fmt(roughCost)}`
  ], [
    `Electric rate: $${rate}/kWh`,
    `Peak sun hours: ${sun}`,
    `Loss factor: ${fmt((loss - 1) * 100)}%`,
    `Panel wattage: ${fmt(panelWatts)}W`,
    `Battery assumption: ${battery.note}; nominal target assumes roughly 85% usable capacity`,
    'Bill method may include fixed fees/taxes, so exact kWh is better when available'
  ], [
    { label: 'Browse home solar gear', href: 'equipment/', style: 'primary' },
    { label: 'Read home solar guide', href: 'solar-kit-size-calculator/' }
  ], homeSolarRecommendations({ roundedKw, batteryKwh: battery.kwh, inverterW }));
  setVisualPlan({ mode: 'bill', arrayW: roundedKw * 1000, batteryKwh: battery.kwh, inverterW, voltage });
}

function calculateEV() {
  const kwhPerMile = +$('#evModel').value || 0.33;
  const milesPerDay = +$('#evMiles').value || 0;
  const drivingDays = Math.min(7, Math.max(1, +$('#evDays').value || 7));
  const sun = +$('#evSun').value || 4.5;
  const chargerLoss = +$('#evChargerLoss').value || 1.15;
  const solarLoss = 1.25;
  const avgDailyMiles = milesPerDay * (drivingDays / 7);
  const evDailyKwh = avgDailyMiles * kwhPerMile;
  const wallDailyKwh = evDailyKwh * chargerLoss;
  const arrayKw = (wallDailyKwh / sun) * solarLoss;
  const roundedKw = roundUp(arrayKw, 0.1);
  const panels400 = Math.ceil((roundedKw * 1000) / 400);
  const annualChargingKwh = wallDailyKwh * 365;
  const weeklyMiles = milesPerDay * drivingDays;
  const level2Amps = wallDailyKwh > 18 ? '40A–48A' : wallDailyKwh > 10 ? '32A–40A' : '16A–32A';
  setResults('EV charging solar add-on', [
    [kwh(wallDailyKwh), 'extra charging energy per day'],
    [kw(roundedKw), 'additional solar array'],
    [`${panels400}`, 'approx. 400W panels'],
    [`${fmt(annualChargingKwh)} kWh`, 'annual EV charging offset']
  ], `For about <strong>${fmt(weeklyMiles)} miles/week</strong>, this EV would need roughly <strong>${kwh(wallDailyKwh)}</strong> per day from the wall after charging losses. In this sun setting, plan on about <strong>${kw(roundedKw)}</strong> of additional solar to offset that charging energy over time.`, [
    `${kw(roundedKw)} additional solar panel capacity`,
    `${panels400} × 400W-class panels`,
    'Grid-tie or hybrid inverter capacity reviewed for the added production',
    `Level 2 EV charger/circuit sizing often lands around ${level2Amps}, depending on vehicle and charging speed goal`,
    'Monitoring app or smart charger to track EV charging energy',
    'Optional battery only if charging during outages or off-grid is a goal'
  ], [
    `Vehicle efficiency: ${kwhPerMile} kWh/mile`,
    `Average driving: ${fmt(avgDailyMiles, 1)} miles/day (${fmt(weeklyMiles)} miles/week)`,
    `Charging loss: ${fmt((chargerLoss - 1) * 100)}%`,
    `Peak sun hours: ${sun}`,
    'Solar array includes a 25% production/loss buffer',
    'This offsets energy over time; charging directly from solar in real time requires matching charger timing, inverter capacity, and utility/net-metering rules'
  ], [
    { label: 'Browse home solar gear', href: 'equipment/', style: 'primary' },
    { label: 'Read the EV solar guide', href: 'how-much-solar-power-do-i-need-to-charge-my-ev/' }
  ], evRecommendations());
  setVisualPlan({ mode: 'ev', arrayW: roundedKw * 1000, inverterW: roundedKw * 1000, voltage: systemVoltage(roundedKw * 1000, roundedKw * 1000), solar: true });
}

function renderAppliances(rows = presets.cabin, target = '#applianceRows') {
  $(target).innerHTML = rows.map((row, idx) => applianceRow(row, idx)).join('');
  bindInputs();
}
function renderHomeAppliances(rows = presets.home) { renderAppliances(rows, '#homeApplianceRows'); }
function applianceRow([name, watts, duty, hours, surge], idx) {
  const startupWatts = Math.max(+surge || +watts || 0, +watts || 0);
  return `<div class="appliance-row">
    <label>Appliance<input data-field="name" value="${name}" /></label>
    <label>Run watts<input data-field="watts" type="number" min="0" value="${watts}" /></label>
    <label>Startup watts<input data-field="surge" type="number" min="0" value="${startupWatts}" /></label>
    <label>Duty %<input data-field="duty" type="number" min="0" max="100" value="${duty}" /></label>
    <label>Hours/day<input data-field="hours" type="number" min="0" step="0.25" value="${hours}" /></label>
    <button type="button" class="remove" aria-label="Remove appliance">×</button>
  </div>`;
}
function applianceData(root = document) {
  return $$('.appliance-row', typeof root === 'string' ? $(root) : root).map(row => {
    const wattsValue = +$('[data-field="watts"]', row).value || 0;
    const surgeValue = +$('[data-field="surge"]', row).value || wattsValue;
    return {
      name: $('[data-field="name"]', row).value,
      watts: wattsValue,
      surge: Math.max(surgeValue, wattsValue),
      duty: (+$('[data-field="duty"]', row).value || 0) / 100,
      hours: +$('[data-field="hours"]', row).value || 0
    };
  });
}
function calculateLoad() {
  const rows = applianceData('#applianceRows');
  const { dailyWh, dailyKwh, peakWatts, possibleRunningWatts, largestStartupWatts, worstStartupScenario } = loadStats(rows);
  const autonomy = +$('#autonomyDays').value || 2;
  const sun = +$('#loadSun').value || 4.5;
  const dod = +$('#batteryChem').value || 0.8;
  const arrayW = roundUp((dailyWh * 1.25) / sun, 100);
  const batteryKwh = (dailyKwh * autonomy) / dod;
  const inverterBase = Math.max(possibleRunningWatts * 0.65, worstStartupScenario, peakWatts * 1.25, 1000);
  const inverterW = roundUp(inverterBase, 500);
  const voltage = systemVoltage(inverterW, arrayW);
  setResults('Off-grid / appliance estimate', [
    [kwh(dailyKwh), 'daily energy use'],
    [watts(arrayW), 'recommended solar array'],
    [kwh(batteryKwh), 'battery bank capacity (nominal)'],
    [`${watts(inverterW)} / ${voltage}`, 'inverter and system voltage']
  ], `This looks like a <strong>${voltage}</strong> component build. The listed loads total about <strong>${watts(possibleRunningWatts)}</strong> if many are used together, and the highest startup load entered is about <strong>${watts(largestStartupWatts)}</strong>. The inverter estimate allows for one larger startup load while other loads may already be running. Battery capacity shown is nominal capacity before the selected depth-of-discharge limit.`, [
    `${watts(arrayW)} solar panel array`,
    `${kwh(batteryKwh)} nominal battery bank target`,
    `${watts(inverterW)} pure sine wave inverter with startup/surge capacity checked against your equipment`,
    `${voltage} charge controller / MPPT setup`,
    'Fuses, breakers, disconnects, bus bars, cables, and monitoring',
    'Optional complete kit if available in this size tier'
  ], [
    `Peak sun hours: ${sun}`,
    `Autonomy target: ${autonomy} day${autonomy === 1 ? '' : 's'}`,
    `Usable battery setting: ${fmt(dod * 100)}%`,
    'Solar array includes a 25% production/loss buffer',
    `Inverter class considers running watts plus a startup scenario of about ${watts(worstStartupScenario)}`,
    'Startup watts are estimates; check appliance nameplates and manufacturer locked-rotor/startup specs before buying'
  ], [
    { label: 'See cabin/off-grid kit ideas', href: 'best-solar-kits-for-cabins/', style: 'primary' },
    { label: 'Browse equipment categories', href: 'equipment/' }
  ], offGridRecommendations({ arrayW, batteryKwh, inverterW, voltage }));
  setVisualPlan({ mode: 'load', arrayW, batteryKwh, inverterW, voltage });
}

function calculateBackup() {
  const checked = $$('#backupLoads input:checked');
  const dailyWhAt24 = checked.reduce((sum, cb) => sum + (+cb.dataset.energyWh || +cb.value || 0), 0);
  const runningWatts = checked.reduce((sum, cb) => sum + (+cb.dataset.runningWatts || 0), 0);
  const surgeWatts = checked.reduce((max, cb) => Math.max(max, +cb.dataset.surgeWatts || +cb.dataset.surge || 0), 0);
  const hours = +$('#backupHours').value || 24;
  const solar = +$('#backupSolar').value;
  const sun = +$('#backupSun').value || 4.5;
  const targetWh = dailyWhAt24 * (hours / 24);
  const batteryKwh = (targetWh / 1000) / 0.85;
  const inverterW = roundUp(Math.max(1200, runningWatts + surgeWatts, runningWatts * 1.25), 500);
  const arrayW = solar ? roundUp((targetWh * 1.3) / sun, 100) : 0;
  const portable = batteryKwh <= 4 && inverterW <= 3000;
  setResults('Backup power estimate', [
    [kwh(targetWh / 1000), 'energy for outage target'],
    [kwh(batteryKwh), 'battery capacity target (nominal)'],
    [watts(inverterW), 'inverter/surge class'],
    [solar ? watts(arrayW) : 'None', 'solar recharge array']
  ], portable ? `This is a good candidate for a <strong>large portable power station</strong> or small DIY battery/inverter setup. If pumps or AC are included, verify surge specs before buying.` : `This is likely better as a <strong>DIY or installed home backup system</strong>, not a small portable unit. Larger pumps, AC, and long outage goals push this into 48V battery/inverter territory.`, [
    portable ? 'Large portable power station or expandable battery system' : '48V battery bank / home backup system',
    `${kwh(batteryKwh)} nominal battery capacity target`,
    `${watts(inverterW)} inverter/surge capability`,
    solar ? `${watts(arrayW)} solar recharge array` : 'Wall/generator charging option',
    'Transfer switch or critical-load setup if powering home circuits'
  ], [
    `Outage target: ${hours} hours`,
    'Battery capacity assumes roughly 85% usable capacity',
    `Estimated simultaneous running load: ${watts(runningWatts)}`,
    `Largest startup surge allowance: ${watts(surgeWatts)}`,
    solar ? `Solar recharge assumes ${sun} peak sun hours and a 30% buffer` : 'Solar recharge disabled'
  ], portable ? [
    { label: 'See portable power station reviews', href: 'equipment/', style: 'primary' },
    { label: 'Compare 2kWh backup options', href: 'bluetti-elite-200-v2-review/' }
  ] : [
    { label: 'Browse home backup gear', href: 'equipment/', style: 'primary' },
    { label: 'Read inverter sizing guide', href: 'inverter-size-calculator/' }
  ], backupRecommendations({ portable, batteryKwh, inverterW, hours, solar: Boolean(solar) }));
  setVisualPlan({ mode: 'backup', arrayW, batteryKwh, inverterW, voltage: portable ? '24V' : '48V', solar: Boolean(solar) });
}

function activeMode() { return $('.mode.active').dataset.mode; }
function calculate() {
  const mode = activeMode();
  if (mode === 'bill') calculateBill();
  if (mode === 'load') calculateLoad();
  if (mode === 'backup') calculateBackup();
  if (mode === 'ev') calculateEV();
}
function bindInputs() {
  $$('input, select').forEach(el => el.oninput = calculate);
  $$('.remove').forEach(btn => btn.onclick = () => { btn.closest('.appliance-row').remove(); calculate(); });
}

function updateBillMethod() {
  const method = $('#billMethod')?.value || 'bill';
  $('#billAmountFields')?.classList.toggle('active', method === 'bill');
  $('#homeLoadFields')?.classList.toggle('active', method === 'loads');
  $$('[data-bill-method]').forEach(btn => btn.classList.toggle('active', btn.dataset.billMethod === method));
}

function setSunValue(field, value) {
  const el = $(field);
  if (!el) return;
  if (el.tagName === 'SELECT' && !Array.from(el.options).some(option => option.value === value)) {
    el.insertAdjacentHTML('beforeend', `<option value="${value}">Location estimate — ${value}</option>`);
  }
  el.value = value;
}

function applySunRegion() {
  const value = $('#sunRegion')?.value;
  if (!value || value === 'manual') return;
  ['#billSun', '#evSun', '#loadSun', '#backupSun'].forEach(field => setSunValue(field, value));
  calculate();
}

function switchMode(mode) {
  $$('.tab').forEach(t => t.classList.toggle('active', t.dataset.mode === mode));
  $$('.path-card').forEach(card => card.classList.toggle('active', card.dataset.mode === mode));
  $$('.mode').forEach(form => form.classList.toggle('active', form.dataset.mode === mode));
  calculate();
}
$$('.tab, .path-card').forEach(control => {
  control.addEventListener('click', () => switchMode(control.dataset.mode));
});
$$('[data-preset]').forEach(btn => btn.addEventListener('click', () => {
  $('#loadType').value = btn.dataset.preset;
  renderAppliances(presets[btn.dataset.preset]);
}));
$('#loadType').addEventListener('change', e => renderAppliances(presets[e.target.value] || presets.custom));
$('#sunRegion')?.addEventListener('change', applySunRegion);
$('#billMethod')?.addEventListener('change', () => { updateBillMethod(); calculateBill(); });
$$('[data-bill-method]').forEach(btn => btn.addEventListener('click', () => {
  $('#billMethod').value = btn.dataset.billMethod;
  updateBillMethod();
  calculateBill();
}));
$$('[data-home-preset]').forEach(btn => btn.addEventListener('click', () => {
  renderHomeAppliances(presets[btn.dataset.homePreset] || presets.custom);
  calculateBill();
}));
$('#addAppliance').addEventListener('click', () => {
  const selected = $('#appliancePicker')?.value || 'custom';
  const row = applianceLibrary[selected] || applianceLibrary.custom;
  $('#applianceRows').insertAdjacentHTML('beforeend', applianceRow(row, Date.now()));
  bindInputs();
  calculateLoad();
});
$('#addHomeAppliance')?.addEventListener('click', () => {
  const selected = $('#homeAppliancePicker')?.value || 'custom';
  const row = applianceLibrary[selected] || applianceLibrary.custom;
  $('#homeApplianceRows').insertAdjacentHTML('beforeend', applianceRow(row, Date.now()));
  bindInputs();
  calculateBill();
});

document.addEventListener('click', event => {
  const link = event.target.closest('[data-cta-track]');
  if (!link) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'sg_cta_click',
    cta_name: link.dataset.ctaTrack || '',
    cta_location: link.dataset.ctaLocation || '',
    cta_type: link.dataset.ctaType || '',
    cta_destination: link.getAttribute('href') || ''
  });
});

renderAppliances(presets.cabin);
renderHomeAppliances(presets.home);
bindInputs();
updateBillMethod();
applySunRegion();
calculateBill();
