const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const presets = {
  cabin: [
    ['Refrigerator', 150, 35, 24],
    ['LED lights', 60, 100, 5],
    ['Wi‑Fi/router', 20, 100, 8],
    ['Laptop/phones', 120, 100, 3],
    ['Water pump', 800, 10, 1],
    ['Microwave', 1200, 100, 0.25]
  ],
  rv: [
    ['12V fridge', 70, 45, 24],
    ['LED lights', 40, 100, 4],
    ['Vent fan', 35, 100, 8],
    ['Laptop/phones', 100, 100, 3],
    ['Water pump', 120, 15, 1],
    ['Coffee maker', 900, 100, 0.2]
  ]
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

function setResults(title, items, recommendation, shopping) {
  $('#resultTitle').textContent = title;
  $('#resultGrid').innerHTML = items.map(([value, label]) => `<div><strong>${value}</strong><span>${label}</span></div>`).join('');
  $('#recommendation').innerHTML = recommendation;
  $('#shoppingList').innerHTML = shopping.map(item => `<li>${item}</li>`).join('');
}

function calculateBill() {
  const monthly = +$('#billMonthly').value || 0;
  const rate = +$('#billRate').value || 0.16;
  const sun = +$('#billSun').value || 4.5;
  const offset = +$('#billOffset').value || 1;
  const loss = +$('#billLoss').value || 1.25;
  const monthlyKwh = monthly / rate;
  const dailyKwh = (monthlyKwh * offset) / 30;
  const arrayKw = (dailyKwh / sun) * loss;
  const roundedKw = roundUp(arrayKw, 0.5);
  const panels400 = Math.ceil((roundedKw * 1000) / 400);
  const annualKwh = dailyKwh * 365;
  const roughCost = roundedKw * 2800;
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
  ]);
}

function renderAppliances(rows = presets.cabin) {
  $('#applianceRows').innerHTML = rows.map((row, idx) => applianceRow(row, idx)).join('');
  bindInputs();
}
function applianceRow([name, watts, duty, hours], idx) {
  return `<div class="appliance-row">
    <label>Appliance<input data-field="name" value="${name}" /></label>
    <label>Watts<input data-field="watts" type="number" min="0" value="${watts}" /></label>
    <label>Duty %<input data-field="duty" type="number" min="0" max="100" value="${duty}" /></label>
    <label>Hours/day<input data-field="hours" type="number" min="0" step="0.25" value="${hours}" /></label>
    <button type="button" class="remove" aria-label="Remove appliance">×</button>
  </div>`;
}
function applianceData() {
  return $$('.appliance-row').map(row => ({
    name: $('[data-field="name"]', row).value,
    watts: +$('[data-field="watts"]', row).value || 0,
    duty: (+$('[data-field="duty"]', row).value || 0) / 100,
    hours: +$('[data-field="hours"]', row).value || 0
  }));
}
function calculateLoad() {
  const rows = applianceData();
  const dailyWh = rows.reduce((sum, r) => sum + (r.watts * r.duty * r.hours), 0);
  const dailyKwh = dailyWh / 1000;
  const peakWatts = Math.max(0, ...rows.map(r => r.watts));
  const autonomy = +$('#autonomyDays').value || 2;
  const sun = +$('#loadSun').value || 4.5;
  const dod = +$('#batteryChem').value || 0.8;
  const arrayW = roundUp((dailyWh * 1.25) / sun, 100);
  const batteryKwh = (dailyKwh * autonomy) / dod;
  const inverterW = roundUp(Math.max(peakWatts * 1.25, 1000), 500);
  const voltage = systemVoltage(inverterW, arrayW);
  setResults('Off-grid / appliance estimate', [
    [kwh(dailyKwh), 'daily energy use'],
    [watts(arrayW), 'recommended solar array'],
    [kwh(batteryKwh), 'battery bank capacity'],
    [`${watts(inverterW)} / ${voltage}`, 'inverter and system voltage']
  ], `This looks like a <strong>${voltage}</strong> component build. The biggest single running load is about <strong>${watts(peakWatts)}</strong>, so surge loads should be checked carefully before recommending a specific inverter.`, [
    `${watts(arrayW)} solar panel array`,
    `${kwh(batteryKwh)} usable battery bank target`,
    `${watts(inverterW)} pure sine wave inverter`,
    `${voltage} charge controller / MPPT setup`,
    'Fuses, breakers, disconnects, bus bars, cables, and monitoring',
    'Optional complete kit if available in this size tier'
  ]);
}

function calculateBackup() {
  const checked = $$('#backupLoads input:checked');
  const dailyWhAt24 = checked.reduce((sum, cb) => sum + (+cb.value || 0), 0);
  const surge = checked.reduce((sum, cb) => sum + (+cb.dataset.surge || 0), 0);
  const hours = +$('#backupHours').value || 24;
  const solar = +$('#backupSolar').value;
  const sun = +$('#backupSun').value || 4.5;
  const targetWh = dailyWhAt24 * (hours / 24);
  const batteryKwh = (targetWh / 1000) / 0.85;
  const inverterW = roundUp(Math.max(1200, surge + 1000), 500);
  const arrayW = solar ? roundUp((targetWh * 1.3) / sun, 100) : 0;
  const portable = batteryKwh <= 4 && inverterW <= 3000;
  setResults('Backup power estimate', [
    [kwh(targetWh / 1000), 'energy for outage target'],
    [kwh(batteryKwh), 'battery capacity target'],
    [watts(inverterW), 'inverter/surge class'],
    [solar ? watts(arrayW) : 'None', 'solar recharge array']
  ], portable ? `This is a good candidate for a <strong>large portable power station</strong> or small DIY battery/inverter setup. If pumps or AC are included, verify surge specs before buying.` : `This is likely better as a <strong>DIY or installed home backup system</strong>, not a small portable unit. Larger pumps, AC, and long outage goals push this into 48V battery/inverter territory.`, [
    portable ? 'Large portable power station or expandable battery system' : '48V battery bank / home backup system',
    `${kwh(batteryKwh)} battery capacity target`,
    `${watts(inverterW)} inverter/surge capability`,
    solar ? `${watts(arrayW)} solar recharge array` : 'Wall/generator charging option',
    'Transfer switch or critical-load setup if powering home circuits'
  ]);
}

function activeMode() { return $('.mode.active').dataset.mode; }
function calculate() {
  const mode = activeMode();
  if (mode === 'bill') calculateBill();
  if (mode === 'load') calculateLoad();
  if (mode === 'backup') calculateBackup();
}
function bindInputs() {
  $$('input, select').forEach(el => el.oninput = calculate);
  $$('.remove').forEach(btn => btn.onclick = () => { btn.closest('.appliance-row').remove(); calculateLoad(); });
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
$$('[data-preset]').forEach(btn => btn.addEventListener('click', () => renderAppliances(presets[btn.dataset.preset])));
$('#addAppliance').addEventListener('click', () => {
  $('#applianceRows').insertAdjacentHTML('beforeend', applianceRow(['Custom load', 100, 100, 1], Date.now()));
  bindInputs();
  calculateLoad();
});

renderAppliances(presets.cabin);
bindInputs();
calculateBill();
