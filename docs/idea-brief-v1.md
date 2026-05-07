# Free Solar Calculator — Idea Brief v1

## Core idea

Build a free consumer-facing solar sizing calculator that estimates:

- Daily electrical load in watt-hours / kWh
- Recommended solar panel array size
- Battery bank capacity
- Inverter size
- Charge controller / MPPT requirements
- Suggested system voltage: 12V, 24V, or 48V
- Example equipment bundles with affiliate links

## Reference site notes

Reference: https://startoffgrid.com/calculator

Strong parts:

- Appliance-based calculator is intuitive.
- Duty cycle and hours/day are useful.
- Location, season, battery chemistry, autonomy, and system voltage are the right core inputs.
- FAQ content targets good SEO questions.

Improvement opportunities:

- Make the calculator more guided for beginners.
- Add real-world “build types”: RV/van, cabin, shed/workshop, backup power, tiny home, full off-grid home.
- Explain results in plain English, not just numbers.
- Add affiliate product recommendations tied to result ranges.
- Add downloadable/exportable shopping list.
- Add warning flags: AC, well pump, electric heat, EV charging, surge loads.
- Add email capture: “Send me my solar sizing report.”

## Recommended positioning

Not just “calculator.” Better angle:

> Figure out what size solar system you actually need before you waste money on the wrong kit.

Target users:

1. DIY off-grid buyers
2. RV/van/camper owners
3. Cabin/tiny-home owners
4. Backup power shoppers
5. Preppers / homestead audience
6. People comparing solar generators vs component systems

## Monetization

Affiliate categories:

- Solar panels
- LiFePO4 batteries
- Inverters
- Charge controllers
- Portable power stations
- Transfer switches
- Wiring, fuses, breakers, bus bars
- Mounting hardware
- Solar kits
- Monitoring equipment

Potential affiliate programs:

- Amazon Associates
- Signature Solar
- EcoFlow
- Bluetti
- Renogy
- Victron resellers
- Current Connected
- BatteryEVO / LiTime / EG4 depending on terms

## MVP pages

1. `/calculator/` — main appliance/load calculator
2. `/solar-system-size-calculator/` — SEO landing alias or canonical page
3. `/off-grid-solar-calculator/`
4. `/battery-bank-calculator/`
5. `/inverter-size-calculator/`
6. `/solar-generator-vs-diy-solar/`
7. `/best-solar-kits-for-cabins/`

## MVP calculator flow

1. Choose use case
   - RV/camper
   - Cabin
   - Tiny home
   - Backup power
   - Full off-grid home
   - Custom

2. Add loads
   - Presets + custom appliances
   - Watts
   - Hours/day
   - Duty cycle
   - Surge load checkbox

3. Choose location assumptions
   - State/region or zip
   - Season: annual/summer/winter
   - Days of autonomy
   - Battery chemistry

4. Results
   - Daily energy use
   - Recommended solar array
   - Recommended battery capacity
   - Recommended inverter
   - System voltage recommendation
   - Estimated number of panels
   - Suggested product categories

5. Monetization/report
   - “View recommended equipment”
   - “Email me my shopping list”
   - Affiliate cards by size tier

## Main risk

This is a content/SEO game. The calculator is the hook, but traffic will come from long-tail search pages and YouTube/social snippets unless we have paid traffic or a distribution channel.

## Recommendation

Worth exploring. Build a simple but polished MVP calculator first, then wrap it with SEO pages and affiliate recommendation logic. The defensible edge is not the math; it is clarity, beginner guidance, and matching the result to sensible equipment bundles.

## Second reference: SunWatts solar kit calculator

Reference: https://sunwatts.com/solar-calculator/

What it does well:

- Very simple utility-bill / annual kWh entry.
- Location selection tied to solar production assumptions.
- Lets user choose % of electricity bill to offset: 50%, 75%, 100%, 125%, etc.
- Direct monetization path: result points to matching solar kit sizes.
- SEO support pages for “solar cost for $100 electric bill,” “$200 electric bill,” etc.

Weaknesses / improvement opportunities:

- It is more grid-tie/home-solar oriented, less appliance/off-grid oriented.
- It does not deeply explain batteries, inverter sizing, surge loads, or autonomy.
- Result is mostly a kW solar kit recommendation, not a full system design.
- User may not understand why the system size changed or what the next purchase step should be.

Strategic takeaway:

There are really two calculator modes worth combining:

1. **Home electric bill mode** — fastest path for grid-tie / hybrid shoppers.
   - Annual kWh or monthly bill
   - Location
   - Desired offset percentage
   - Result: kW array size + estimated panels + affiliate solar kits

2. **Appliance/load mode** — best for off-grid, RV, cabin, backup-power shoppers.
   - Appliance list
   - Hours/day and duty cycle
   - Autonomy days
   - Battery chemistry
   - Result: daily kWh + solar array + battery bank + inverter + system voltage

Recommendation: make the product feel like one calculator with two starting paths:

> “I know my electric bill”
> “I know what I want to power”

This would be better than either reference site alone.

## Third reference: Google Project Sunroof

Reference: https://sunroof.withgoogle.com/

What it does well:

- Starts with an address, which feels magical and personalized.
- Uses roof size/shape, shade, local weather, local electricity prices, and solar cost assumptions.
- Frames output around financial savings, not just engineering size.
- Estimates roof solar potential and recommended kW system size.
- Helps connect people with providers/installers.

What is hard to replicate directly:

- Roof geometry and shade analysis require aerial imagery/LiDAR/data access.
- Address-level production estimates can become expensive or API-dependent.
- Installer-lead monetization is a different model from equipment affiliate monetization.

How to borrow the best parts without needing Google-level data:

1. Add an optional address/ZIP step.
   - ZIP/state can drive peak sun hours and utility-rate assumptions.
   - Full address could be used later if a roof/solar API is available.

2. Add “roof suitability” questions.
   - Roof type
   - Approximate usable roof area
   - Shade level: none/light/moderate/heavy
   - Roof direction: south/east/west/mixed/unknown
   - Ground mount option

3. Add a savings/payback mode.
   - Monthly electric bill
   - Utility rate ($/kWh)
   - Target bill offset
   - Estimated solar cost/watt
   - Incentive assumptions
   - Result: estimated system cost, savings, payback, 20-year savings

4. Keep off-grid mode separate.
   - Google Sunroof is strongest for grid-tied rooftop solar.
   - Our differentiator can be combining grid-tie savings + off-grid equipment sizing + affiliate shopping lists.

Strategic product direction after reviewing all three references:

The strongest version is a multi-path calculator:

- **Home Bill / Rooftop Solar**: “Lower my power bill”
- **Off-Grid / Cabin / RV**: “Power specific appliances”
- **Backup Power**: “Keep essentials running during outages”
- **DIY Equipment Builder**: “Build a component shopping list”

This gives us broader SEO reach and lets affiliate offers vary by intent.
