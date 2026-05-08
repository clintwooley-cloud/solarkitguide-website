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

function setResults(title, items, recommendation, shopping, assumptions = []) {
  $('#resultTitle').textContent = title;
  $('#resultGrid').innerHTML = items.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
  $('#recommendation').innerHTML = recommendation;
  $('#shoppingList').innerHTML = shopping.map(item => `<li>${item}</li>`).join('');
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
    ? `<h5>Battery option</h5><p>Grid-tie home solar may not require batteries. If backup power is a goal, add a hybrid inverter and battery bank sized around critical loads.</p><div class="diagram-note">Battery wiring depends on the chosen battery system and inverter voltage.</div>`
    : mode === 'ev'
      ? `<h5>EV charging note</h5><p>This estimates extra solar production to offset EV charging. Most home EV charging still uses the home electrical panel and grid unless a larger hybrid/battery system is designed.</p><div class="diagram-note">A dedicated EV charger circuit should be installed and permitted by a qualified electrician.</div>`
      : batteryWiring(voltage, batteryKwh);
  $('#panelDiagram').innerHTML = panelWiring(arrayW, voltage, mode !== 'backup' || solar);
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

function calculateBill() {
  const method = $('#billMethod')?.value || 'bill';
  const monthly = +$('#billMonthly').value || 0;
  const rate = +$('#billRate').value || 0.16;
  const sun = +$('#billSun').value || 4.5;
  const offset = +$('#billOffset').value || 1;
  const loss = +$('#billLoss').value || 1.25;
  const monthlyKwh = method === 'loads' ? applianceData('#homeApplianceRows').reduce((sum, r) => sum + (r.watts * r.duty * r.hours * 30 / 1000), 0) : monthly / rate;
  const dailyKwh = method === 'loads' ? (monthlyKwh / 30) * offset : (monthlyKwh * offset) / 30;
  const arrayKw = (dailyKwh / sun) * loss;
  const roundedKw = roundUp(arrayKw, 0.5);
  const panels400 = Math.ceil((roundedKw * 1000) / 400);
  const annualKwh = dailyKwh * 365;
  const roughCost = roundedKw * 2800;
  if (method === 'loads') {
    const stats = loadStats(applianceData('#homeApplianceRows'));
    const inverterBase = Math.max(roundedKw * 1000, stats.possibleRunningWatts * 0.65, stats.worstStartupScenario, stats.peakWatts * 1.25, 3000);
    const inverterW = roundUp(inverterBase, 500);
    const voltage = systemVoltage(inverterW, roundedKw * 1000);
    setResults('Full-home appliance load estimate', [
      [kwh(dailyKwh), 'target daily production'],
      [kw(roundedKw), 'recommended solar array'],
      [`${panels400}`, 'approx. 400W panels'],
      [`${watts(inverterW)} / ${voltage}`, 'hybrid inverter review class']
    ], `Based on the household loads entered, a <strong>${kw(roundedKw)}</strong> grid-tie or hybrid solar system is the rough starting point for offsetting about <strong>${fmt(offset * 100)}%</strong> of that usage. Because this is a full-home path, the result stays focused on rooftop/ground-mount solar, utility rules, and optional hybrid backup — not a small cabin kit.`, [
      `${kw(roundedKw)} grid-tie or hybrid solar system`,
      `${panels400} × 400W-class solar panels`,
      `Hybrid/grid-tie inverter capacity reviewed around ${watts(inverterW)}`,
      'Rooftop or ground-mount racking',
      'Optional battery backup package sized around critical loads',
      `Annual target production: about ${fmt(annualKwh)} kWh`
    ], [
      `Sizing method: full-home appliance loads`,
      `Estimated monthly use from entered loads: ${fmt(monthlyKwh)} kWh`,
      `Peak sun hours: ${sun}`,
      `Loss factor: ${fmt((loss - 1) * 100)}%`,
      `Entered simultaneous running load: about ${watts(stats.possibleRunningWatts)}`,
      `Largest startup load entered: about ${watts(stats.largestStartupWatts)}`,
      'Load-based estimates depend heavily on realistic hours/day and duty cycle settings'
    ]);
    setVisualPlan({ mode: 'bill', arrayW: roundedKw * 1000, inverterW, voltage });
    return;
  }
  setResults('Home solar estimate', [
    [kwh(dailyKwh), 'target daily production'],
    [kw(roundedKw), 'recommended solar array'],
    [`${panels400}`, 'approx. 400W panels'],
    [`$${fmt(roughCost)}`, 'rough installed cost before incentives']
  ], `A <strong>${kw(roundedKw)}</strong> grid-tie or hybrid solar kit is the rough starting point for offsetting about <strong>${fmt(offset * 100)}%</strong> of this bill. For affiliate recommendations, this should map to rooftop/grid-tie kits, hybrid inverters, racking, and optional battery backup.`, [
    `${kw(roundedKw)} grid-tie or hybrid solar kit`,
    `${panels400} × 400W-class solar panels`,
    'Rooftop or ground-mount racking',
    'Grid-tie/hybrid inverter matched to utility rules',
    'Optional battery backup package',
    `Annual target production: about ${fmt(annualKwh)} kWh`
  ], [
    `Electric rate: $${rate}/kWh`,
    `Peak sun hours: ${sun}`,
    `Loss factor: ${fmt((loss - 1) * 100)}%`,
    'Panel estimate assumes 400W-class panels',
    'Bill method may include fixed fees/taxes, so exact kWh is better when available'
  ]);
  setVisualPlan({ mode: 'bill', arrayW: roundedKw * 1000, inverterW: roundedKw * 1000, voltage: systemVoltage(roundedKw * 1000, roundedKw * 1000) });
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
  ]);
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
  ]);
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
  ]);
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
$('#billMethod')?.addEventListener('change', () => { updateBillMethod(); calculateBill(); });
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

renderAppliances(presets.cabin);
renderHomeAppliances(presets.home);
bindInputs();
updateBillMethod();
calculateBill();
