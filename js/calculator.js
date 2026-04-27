// ─── BACKUP DATA ─────────────────────────────────────────────────────────────
const backupData = {
    water_indicators:  { basal_flow_lh: 193, peak_flow_lh: 540, monthly_consumption_m3: 150, ods: 6 },
    circular_economy:  { marker_refills: 170, marker_price_eur: 0.71, paper_reams: 100, paper_price_eur: 5.47, pilot_markers: 115, pilot_price_eur: 0.89, ods: 12 },
    energy_efficiency: { ac_compressor_w: 400, repair_cost_eur: 348.48, circuit_upgrade_eur: 2548.02, ods: 7 },
    social_health:     { bulk_soap_liters: 15, soap_price_eur: 8.50, paper_towel_fardos: 10, paper_towel_price_eur: 18.25, cleaning_cost_eur: 750.26, ods: 3 }
};

// ─── LOAD KEY INDICATORS ──────────────────────────────────────────────────────
async function cargarDatosJSON() {
    try {
        const response = await fetch('data.json');
        const data = response.ok ? await response.json() : backupData;
        renderizarIndicadores(data);
    } catch {
        renderizarIndicadores(backupData);
    }
}

function renderizarIndicadores(data) {
    const grid = document.getElementById('grid-asg');
    if (!grid) return;

    const PREU_ELECT = 0.18;
    const PREU_AIGUA = 2.50;
    const HORES_CURS = 1800;

    const consumMensualM3  = data.water_indicators.monthly_consumption_m3;
    const consumAnualM3    = (consumMensualM3 * 12).toFixed(0);
    const costAiguaAny     = (consumAnualM3 * PREU_AIGUA).toFixed(0);
    const fugaEstimadaM3   = (data.water_indicators.basal_flow_lh * 8 * 365 / 1000).toFixed(0);
    const fugaCostAny      = (fugaEstimadaM3 * PREU_AIGUA).toFixed(0);

    const kwhCurs      = (data.energy_efficiency.ac_compressor_w / 1000 * HORES_CURS).toFixed(0);
    const costElecCurs = (kwhCurs * PREU_ELECT).toFixed(0);

    const costMarc       = (data.circular_economy.marker_refills  * data.circular_economy.marker_price_eur).toFixed(2);
    const costPaper      = (data.circular_economy.paper_reams     * data.circular_economy.paper_price_eur).toFixed(2);
    const costPilot      = (data.circular_economy.pilot_markers   * data.circular_economy.pilot_price_eur).toFixed(2);
    const costConsuTotal = (parseFloat(costMarc) + parseFloat(costPaper) + parseFloat(costPilot)).toFixed(2);

    const costNetejaMes = data.social_health.cleaning_cost_eur.toFixed(2);
    const costNetejaAny = (data.social_health.cleaning_cost_eur * 10).toFixed(2);

    grid.innerHTML = `
        <div class="res-card accent">
            <div class="card-header"><span class="icon">💧</span><h4>Water · SDG 6</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Monthly Consumption</strong>
                    <span class="val">${consumMensualM3}</span><span class="unit">m³/month</span>
                </div>
                <div class="data-item">
                    <strong>Annual Consumption</strong>
                    <span class="val">${consumAnualM3}</span><span class="unit">m³/year</span>
                </div>
                <div class="data-item">
                    <strong>Estimated Cost</strong>
                    <span class="val">${costAiguaAny}</span><span class="unit">€/year</span>
                </div>
                <div class="data-item">
                    <strong>Overnight Leak (8h)</strong>
                    <span class="val">${fugaEstimadaM3}</span><span class="unit">m³/year · ${fugaCostAny} €</span>
                </div>
            </div>
        </div>

        <div class="res-card yellow">
            <div class="card-header"><span class="icon">⚡</span><h4>Energy · SDG 7</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>AC Compressor</strong>
                    <span class="val">${data.energy_efficiency.ac_compressor_w}</span><span class="unit">W</span>
                </div>
                <div class="data-item">
                    <strong>Term Consumption</strong>
                    <span class="val">${kwhCurs}</span><span class="unit">kWh</span>
                </div>
                <div class="data-item">
                    <strong>Electrical Cost / Term</strong>
                    <span class="val">${costElecCurs}</span><span class="unit">€</span>
                </div>
                <div class="data-item">
                    <strong>Circuit Investment (F046)</strong>
                    <span class="val">${data.energy_efficiency.circuit_upgrade_eur.toFixed(2)}</span><span class="unit">€</span>
                </div>
            </div>
        </div>

        <div class="res-card purple">
            <div class="card-header"><span class="icon">♻️</span><h4>Consumables · SDG 12</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Marker Refills</strong>
                    <span class="val">${costMarc}</span><span class="unit">€/year</span>
                </div>
                <div class="data-item">
                    <strong>A4 Paper</strong>
                    <span class="val">${costPaper}</span><span class="unit">€/year</span>
                </div>
                <div class="data-item">
                    <strong>Pilot Markers</strong>
                    <span class="val">${costPilot}</span><span class="unit">€/year</span>
                </div>
                <div class="data-item">
                    <strong>Total Consumables</strong>
                    <span class="val">${costConsuTotal}</span><span class="unit">€/year</span>
                </div>
            </div>
        </div>

        <div class="res-card green">
            <div class="card-header"><span class="icon">🧼</span><h4>Cleaning · SDG 3</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Monthly Cost (F055)</strong>
                    <span class="val">${costNetejaMes}</span><span class="unit">€/month</span>
                </div>
                <div class="data-item">
                    <strong>Term Cost (10 months)</strong>
                    <span class="val">${costNetejaAny}</span><span class="unit">€</span>
                </div>
                <div class="data-item">
                    <strong>Bulk Soap</strong>
                    <span class="val">${data.social_health.bulk_soap_liters}</span><span class="unit">L · ${data.social_health.soap_price_eur.toFixed(2)} €/container</span>
                </div>
            </div>
        </div>
    `;
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
function validarInputs() {
    const fields = [
        { id: 'input-hores',      nom: 'Teaching Hours' },
        { id: 'input-preu-elect', nom: 'Energy Price' },
        { id: 'input-aigua-m3',   nom: 'Monthly Water Consumption' },
        { id: 'input-preu-aigua', nom: 'Water Price' },
    ];
    const errorDiv = document.getElementById('input-error');
    let errors = [];
    fields.forEach(c => document.getElementById(c.id)?.classList.remove('input-invalid'));
    fields.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const val = parseFloat(el.value);
        if (isNaN(val) || val <= 0) { errors.push(c.nom); el.classList.add('input-invalid'); }
    });
    if (errors.length > 0) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `⚠️ The following fields must be greater than 0: ${errors.join(', ')}`;
        return false;
    }
    errorDiv.style.display = 'none';
    return true;
}

// ─── EFFICIENCY CALCULATOR ────────────────────────────────────────────────────
let chartInstance = null;

// Store base costs to reuse in the reduction calculator
window._baseCosts = null;

function calcularF3() {
    if (!validarInputs()) return;

    const horesCurs   = parseFloat(document.getElementById('input-hores').value);
    const preuElect   = parseFloat(document.getElementById('input-preu-elect').value);
    const aiguaM3mes  = parseFloat(document.getElementById('input-aigua-m3').value);
    const preuAigua   = parseFloat(document.getElementById('input-preu-aigua').value);

    const RECANVIS     = 170;  const PREU_RECANVI = 0.71;
    const PAPER        = 100;  const PREU_PAPER   = 5.47;
    const PILOT        = 115;  const PREU_PILOT   = 0.89;
    const COST_NETEJA  = 750.26;
    const MESOS        = 10;

    const FACTOR_ELEC  = [1.0, 0.85, 0.90, 1.40, 1.40, 1.35, 0.80, 0.80, 1.0, 1.30];
    const FACTOR_AIGUA = [0.90, 0.85, 0.90, 0.95, 0.95, 0.90, 1.00, 1.05, 1.10, 1.30];
    const MESOS_NOM    = ['Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun'];

    const elecKwhArr = [], aiguaM3Arr = [], costTotalArr = [];
    let totElecKwh = 0, totElecEur = 0;
    let totAiguaM3 = 0, totAiguaEur = 0;
    let totConsuEur = 0, totNetejaEur = 0;

    for (let i = 0; i < MESOS; i++) {
        const varI = 1 + (Math.random() * 0.06 - 0.03);

    // Electricity: full school consumption proportional to teaching hours
    // Base reference: 1800h/year → ~720 kWh/month (realistic school total load ~6kW average)
    // This scales linearly so 20h gives near-zero, 1800h gives realistic ~7200 kWh/term
    const KW_TOTAL_ESCOLA = 6.0; // kW average total load for the school
    const kwhBaseMes = KW_TOTAL_ESCOLA * (horesCurs / MESOS);

        const kwhMes = kwhBaseMes * FACTOR_ELEC[i] * varI;
        elecKwhArr.push(parseFloat(kwhMes.toFixed(1)));
        totElecKwh += kwhMes;
        totElecEur += kwhMes * preuElect;

        const m3Mes = aiguaM3mes * FACTOR_AIGUA[i] * varI;
        aiguaM3Arr.push(parseFloat(m3Mes.toFixed(1)));
        totAiguaM3  += m3Mes;
        totAiguaEur += m3Mes * preuAigua;

        const factCons = (i < 2) ? 1.50 : 0.85;
        const consMes  = ((RECANVIS / MESOS) * PREU_RECANVI +
                          (PAPER    / MESOS) * PREU_PAPER   +
                          (PILOT    / MESOS) * PREU_PILOT) * factCons * varI;
        totConsuEur += consMes;

        const netejaMes = COST_NETEJA * varI;
        totNetejaEur += netejaMes;

        costTotalArr.push(parseFloat(((kwhMes * preuElect) + (m3Mes * preuAigua) + consMes + netejaMes).toFixed(2)));
    }

    const totEurCurs = totElecEur + totAiguaEur + totConsuEur + totNetejaEur;

    // Store base costs for the reduction calculator
    window._baseCosts = {
        elec: totElecEur, aigua: totAiguaEur,
        consu: totConsuEur, neteja: totNetejaEur,
        total: totEurCurs, preuAigua, elecKwhArr, aiguaM3Arr,
        MESOS_NOM, totElecKwh, totAiguaM3
    };

    const resDiv = document.getElementById('results-f3');
    if (!resDiv) return;

    // Summary card will be updated by calcularReduccio() to stay in sync
    // Initial values use 30% reduction as placeholder
    const estalviTotal = totEurCurs * 0.30;
    const estalviElec  = totElecEur * 0.15;
    const estalviAigua = totAiguaEur * 0.30;
    const estalviConsu = totConsuEur * 0.30;

    resDiv.innerHTML = `
        <div class="res-card accent" style="animation-delay:0.0s">
            <div class="card-header"><span class="icon">⚡</span><h4>Electricity</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Term Consumption</strong><span class="val">${totElecKwh.toFixed(0)}</span><span class="unit">kWh</span></div>
                <div class="data-item"><strong>Annual Est.</strong><span class="val">${(totElecKwh*1.2).toFixed(0)}</span><span class="unit">kWh/year</span></div>
                <div class="data-item"><strong>Term Cost</strong><span class="val">${totElecEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card accent" style="animation-delay:0.1s">
            <div class="card-header"><span class="icon">💧</span><h4>Water</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Term Consumption</strong><span class="val">${totAiguaM3.toFixed(1)}</span><span class="unit">m³</span></div>
                <div class="data-item"><strong>Annual Est.</strong><span class="val">${(totAiguaM3*1.2).toFixed(1)}</span><span class="unit">m³/year</span></div>
                <div class="data-item"><strong>Term Cost</strong><span class="val">${totAiguaEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card purple" style="animation-delay:0.2s">
            <div class="card-header"><span class="icon">♻️</span><h4>Consumables</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Marker Refills</strong><span class="val">${(RECANVIS*PREU_RECANVI).toFixed(2)}</span><span class="unit">€/year</span></div>
                <div class="data-item"><strong>A4 Paper</strong><span class="val">${(PAPER*PREU_PAPER).toFixed(2)}</span><span class="unit">€/year</span></div>
                <div class="data-item"><strong>Pilot Markers</strong><span class="val">${(PILOT*PREU_PILOT).toFixed(2)}</span><span class="unit">€/year</span></div>
                <div class="data-item"><strong>Total Term Cost</strong><span class="val">${totConsuEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card accent" style="animation-delay:0.3s">
            <div class="card-header"><span class="icon">🧼</span><h4>Cleaning (F055)</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Monthly Cost</strong><span class="val">750.26</span><span class="unit">€/month</span></div>
                <div class="data-item"><strong>Term Cost (10 m.)</strong><span class="val">${totNetejaEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card green" id="resum-pla-card" style="grid-column: 1 / -1; animation-delay:0.4s">
            <div class="card-header"><span class="icon">✅</span><h4>Summary · Applying the Reduction Plan</h4></div>
            <div class="saving-hero">
                <div class="label">Total potential savings for the term (based on selected actions below)</div>
                <div class="big-number" id="resum-estalvi-big">−${estalviTotal.toFixed(2)}<span> €</span></div>
            </div>
            <div class="saving-breakdown">
                <div class="saving-breakdown-item">
                    <span class="sb-label">Current term cost</span>
                    <span class="sb-val neutral" id="resum-cost-actual">${totEurCurs.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Energy savings</span>
                    <span class="sb-val" id="resum-estalvi-elec">−${estalviElec.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Water savings</span>
                    <span class="sb-val" id="resum-estalvi-aigua">−${estalviAigua.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Consumables savings</span>
                    <span class="sb-val" id="resum-estalvi-consu">−${estalviConsu.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">New estimated cost</span>
                    <span class="sb-val neutral" id="resum-cost-nou">${(totEurCurs - estalviTotal).toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Total reduction</span>
                    <span class="sb-val" id="resum-pct-reduccio">−${(estalviTotal/totEurCurs*100).toFixed(1)}%</span>
                </div>
            </div>
        </div>
    `;

    // Update Reduction Plan (static bars)
    const aiguaFugaM3  = (193 * 8 * 365 / 1000).toFixed(0);
    const aiguaFugaEur = (aiguaFugaM3 * preuAigua).toFixed(0);
    const eAt = document.getElementById('estalvi-aigua-text');
    const eAe = document.getElementById('estalvi-aigua-eur');
    const eEe = document.getElementById('estalvi-elec-eur');
    const eCe = document.getElementById('estalvi-consu-eur');
    if (eAt) eAt.textContent = aiguaFugaM3;
    if (eAe) eAe.textContent = aiguaFugaEur;
    if (eEe) eEe.textContent = estalviElec.toFixed(2);
    if (eCe) eCe.textContent = estalviConsu.toFixed(2);

    const ta = document.getElementById('taula-estalvi-aigua');
    const te = document.getElementById('taula-estalvi-elec');
    const tc = document.getElementById('taula-estalvi-consu');
    if (ta) ta.innerHTML = `<strong>${aiguaFugaM3} m³/year · ${aiguaFugaEur} €/year</strong>`;
    if (te) te.innerHTML = `<strong>${(totElecKwh*0.10).toFixed(0)} kWh/term · ${estalviElec.toFixed(2)} €/term</strong>`;
    if (tc) tc.innerHTML = `<strong>${estalviConsu.toFixed(2)} €/year</strong>`;

    renderChart(MESOS_NOM, elecKwhArr, aiguaM3Arr, costTotalArr);

    // Recalculate reduction calculator if already rendered
    if (document.getElementById('reduction-results')) {
        calcularReduccio();
    }
}

// ─── MAIN CHART ───────────────────────────────────────────────────────────────
function renderChart(labels, kwh, m3, costTotal) {
    const container = document.getElementById('chart-container');
    const ctx = document.getElementById('chartElec');
    if (!container || !ctx) return;
    container.style.display = 'block';
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Electricity (kWh)',
                    data: kwh,
                    backgroundColor: 'rgba(56,189,248,0.6)',
                    borderColor: 'rgba(56,189,248,1)',
                    borderWidth: 1, borderRadius: 4, yAxisID: 'y'
                },
                {
                    label: 'Water (m³)',
                    data: m3,
                    type: 'line',
                    borderColor: 'rgba(16,185,129,1)',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderWidth: 2, pointRadius: 4,
                    pointBackgroundColor: 'rgba(16,185,129,1)',
                    tension: 0.4, fill: true, yAxisID: 'y2'
                },
                {
                    label: 'Total Cost (€)',
                    data: costTotal,
                    type: 'line',
                    borderColor: 'rgba(251,191,36,1)',
                    backgroundColor: 'rgba(251,191,36,0.0)',
                    borderWidth: 2, pointRadius: 4,
                    pointBackgroundColor: 'rgba(251,191,36,1)',
                    borderDash: [5, 3], tension: 0.4, fill: false, yAxisID: 'y3'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { family: 'Inter' } } },
                tooltip: {
                    backgroundColor: '#1e293b', titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid:  { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    position: 'left',
                    title: { display: true, text: 'kWh', color: '#38bdf8', font: { family: 'Inter' } },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid:  { color: 'rgba(255,255,255,0.04)' }
                },
                y2: {
                    position: 'right',
                    title: { display: true, text: 'm³', color: '#10b981', font: { family: 'Inter' } },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid:  { drawOnChartArea: false }
                },
                y3: {
                    position: 'right',
                    title: { display: true, text: '€', color: '#fbbf24', font: { family: 'Inter' } },
                    ticks: { color: '#fbbf24', font: { family: 'Inter' } },
                    grid:  { drawOnChartArea: false }
                }
            }
        }
    });
}

// ─── INTERACTIVE REDUCTION CALCULATOR ────────────────────────────────────────
const ACCIONS_REDUCCIO = [
    {
        id: 'acc-aigua-nocturna',
        icon: '💧',
        nom: 'Automatic overnight water shut-off',
        desc: 'Eliminates the 193 L/h leak during 8 overnight hours. Direct savings on water consumption.',
        any: 'Year 1',
        color: 'accent',
        ods: 6,
        categoria: 'aigua',
        impacte: { aigua: 0.22, elec: 0, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-led',
        icon: '💡',
        nom: 'LED lighting replacement',
        desc: 'Switch from fluorescents to LEDs in classrooms and corridors. 40% reduction in lighting.',
        any: 'Year 1',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.14, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-circuits',
        icon: '⚡',
        nom: 'Electrical circuit replacement (F046)',
        desc: '15% optimisation of total electricity consumption. Investment already made: 2,548.02 €.',
        any: 'Year 1–2',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.10, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-termostats',
        icon: '🌡️',
        nom: 'Smart thermostat control',
        desc: 'Scheduled heating/AC programming. Automatic shut-off outside teaching hours.',
        any: 'Year 1',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.09, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-consumibles',
        icon: '♻️',
        nom: 'Circular Economy consumables (F036)',
        desc: 'Use of marker refills and recycled paper. 30% reduction in consumables.',
        any: 'Year 1–3',
        color: 'purple',
        ods: 12,
        categoria: 'consu',
        impacte: { aigua: 0, elec: 0, consu: 0.22, neteja: 0 }
    },
    {
        id: 'acc-digital',
        icon: '📱',
        nom: 'Document digitalisation',
        desc: '50% reduction in printing through digital platforms and virtual classrooms.',
        any: 'Year 1–2',
        color: 'purple',
        ods: 12,
        categoria: 'consu',
        impacte: { aigua: 0, elec: 0, consu: 0.15, neteja: 0 }
    },
    {
        id: 'acc-neteja-granel',
        icon: '🧼',
        nom: 'Bulk cleaning and packaging reduction (F055)',
        desc: 'Bulk purchasing of cleaning products. 30% cost reduction and fewer plastic containers.',
        any: 'Year 2',
        color: 'green',
        ods: 3,
        categoria: 'neteja',
        impacte: { aigua: 0, elec: 0, consu: 0, neteja: 0.15 }
    },
    {
        id: 'acc-xarxes-aigua',
        icon: '🔧',
        nom: 'Water network inspection and maintenance',
        desc: 'Inspection of pipes, taps and cisterns. Additional 10% reduction in leaks.',
        any: 'Year 2',
        color: 'accent',
        ods: 6,
        categoria: 'aigua',
        impacte: { aigua: 0.08, elec: 0, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-solar',
        icon: '☀️',
        nom: 'Photovoltaic solar panel installation',
        desc: '20% self-consumption of the centre\'s annual electricity demand.',
        any: 'Year 2–3',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.20, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-sensorsaigua',
        icon: '📡',
        nom: 'Presence sensors in bathrooms',
        desc: 'Automatically shut off water when no movement detected. Additional 8% savings.',
        any: 'Year 2–3',
        color: 'accent',
        ods: 6,
        categoria: 'aigua',
        impacte: { aigua: 0.08, elec: 0, consu: 0, neteja: 0 }
    }
];

let reductionChartInstance = null;

function calcularReduccio() {
    const base = window._baseCosts;
    if (!base) return;

    let redAigua = 0, redElec = 0, redConsu = 0, redNeteja = 0;
    let accionsActives = 0;

    ACCIONS_REDUCCIO.forEach(acc => {
        const cb = document.getElementById(acc.id);
        if (cb && cb.checked) {
            redAigua  = Math.min(0.90, redAigua  + acc.impacte.aigua);
            redElec   = Math.min(0.90, redElec   + acc.impacte.elec);
            redConsu  = Math.min(0.90, redConsu  + acc.impacte.consu);
            redNeteja = Math.min(0.90, redNeteja + acc.impacte.neteja);
            accionsActives++;
        }
    });

    const nouCostAigua  = base.aigua  * (1 - redAigua);
    const nouCostElec   = base.elec   * (1 - redElec);
    const nouCostConsu  = base.consu  * (1 - redConsu);
    const nouCostNeteja = base.neteja * (1 - redNeteja);
    const nouTotal      = nouCostAigua + nouCostElec + nouCostConsu + nouCostNeteja;
    const estalvi       = base.total - nouTotal;

    // Weighted reduction per category (25% each) — prevents cleaning (62% of cost) from dominating %
    const pctReduccio = (redAigua + redElec + redConsu + redNeteja) / 4 * 100;

    // ── Estimated savings = total cost × reduction percentage ──
    const estalviFromPct = base.total * (pctReduccio / 100);

    // Update summary cards
    const resDiv = document.getElementById('reduction-results');
    if (resDiv) {
        const colorPct = pctReduccio >= 30 ? 'green' : pctReduccio >= 15 ? 'yellow' : 'accent';
        resDiv.innerHTML = `
            <div class="res-card ${colorPct}" style="animation-delay:0s">
                <div class="card-header"><span class="icon">📊</span><h4>Total Reduction</h4></div>
                <p style="font-size:2.4rem;font-weight:800;color:var(--${colorPct === 'accent' ? 'accent' : colorPct === 'yellow' ? 'yellow' : 'green'})">
                    −${pctReduccio.toFixed(1)}%
                </p>
                <span class="unit">${accionsActives} action${accionsActives !== 1 ? 's' : ''} active</span>
                ${pctReduccio >= 30 ? '<p style="color:var(--green);font-size:0.8rem;margin-top:0.5rem">✅ Target −30% achieved!</p>' : `<p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.5rem">${(30 - pctReduccio).toFixed(1)}% remaining to reach the target</p>`}
            </div>
            <div class="res-card green" style="animation-delay:0.1s">
                <div class="card-header"><span class="icon">💶</span><h4>Estimated Savings</h4></div>
                <p style="font-size:2rem;font-weight:800;color:var(--green)">−${estalviFromPct.toFixed(2)} €</p>
                <span class="unit">per term</span>
                <div style="margin-top:0.8rem;font-size:0.8rem;color:var(--text-muted)">
                    Based on <strong style="color:var(--accent)">${pctReduccio.toFixed(1)}%</strong> total reduction applied to current cost<br>
                    Current cost: <strong style="color:var(--text)">${base.total.toFixed(2)} €</strong><br>
                    New estimated cost: <strong style="color:var(--text)">${(base.total - estalviFromPct).toFixed(2)} €</strong>
                </div>
            </div>
            <div class="res-card purple" style="grid-column: 1 / -1; animation-delay:0.2s">
                <div class="card-header"><span class="icon">📉</span><h4>Breakdown by Area</h4></div>
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-top:0.5rem">
                    <div style="background:rgba(251,191,36,0.07);border:1px solid rgba(251,191,36,0.2);border-radius:10px;padding:0.9rem">
                        <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">⚡ Energy</div>
                        <div style="font-size:1.3rem;font-weight:800;color:var(--yellow)">−${(redElec*100).toFixed(0)}%</div>
                        <div style="font-size:0.8rem;color:var(--yellow);margin-top:0.2rem">−${(base.elec*redElec).toFixed(2)} €</div>
                    </div>
                    <div style="background:rgba(56,189,248,0.07);border:1px solid rgba(56,189,248,0.2);border-radius:10px;padding:0.9rem">
                        <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">💧 Water</div>
                        <div style="font-size:1.3rem;font-weight:800;color:var(--accent)">−${(redAigua*100).toFixed(0)}%</div>
                        <div style="font-size:0.8rem;color:var(--accent);margin-top:0.2rem">−${(base.aigua*redAigua).toFixed(2)} €</div>
                    </div>
                    <div style="background:rgba(129,140,248,0.07);border:1px solid rgba(129,140,248,0.2);border-radius:10px;padding:0.9rem">
                        <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">♻️ Consumables</div>
                        <div style="font-size:1.3rem;font-weight:800;color:var(--purple)">−${(redConsu*100).toFixed(0)}%</div>
                        <div style="font-size:0.8rem;color:var(--purple);margin-top:0.2rem">−${(base.consu*redConsu).toFixed(2)} €</div>
                    </div>
                    <div style="background:rgba(16,185,129,0.07);border:1px solid rgba(16,185,129,0.2);border-radius:10px;padding:0.9rem">
                        <div style="font-size:0.72rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.4rem">🧼 Cleaning</div>
                        <div style="font-size:1.3rem;font-weight:800;color:var(--green)">−${(redNeteja*100).toFixed(0)}%</div>
                        <div style="font-size:0.8rem;color:var(--green);margin-top:0.2rem">−${(base.neteja*redNeteja).toFixed(2)} €</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update global progress bar
    const bar = document.getElementById('reduction-bar-fill');
    const pctLabel = document.getElementById('reduction-bar-pct');
    if (bar) {
        bar.style.width = Math.min(100, pctReduccio) + '%';
        bar.style.background = pctReduccio >= 30 ? 'var(--green)' : pctReduccio >= 15 ? 'var(--yellow)' : 'var(--accent)';
    }
    if (pctLabel) pctLabel.textContent = pctReduccio.toFixed(1) + '%';

    // ── Sync F3 calculator summary card — savings derived from reduction % ──
    const rBig  = document.getElementById('resum-estalvi-big');
    const rElec = document.getElementById('resum-estalvi-elec');
    const rAig  = document.getElementById('resum-estalvi-aigua');
    const rCon  = document.getElementById('resum-estalvi-consu');
    const rNou  = document.getElementById('resum-cost-nou');
    const rPct  = document.getElementById('resum-pct-reduccio');
    if (rBig)  rBig.innerHTML  = `−${estalviFromPct.toFixed(2)}<span> €</span>`;
    if (rElec) rElec.textContent = `−${(base.elec * redElec).toFixed(2)} €`;
    if (rAig)  rAig.textContent  = `−${(base.aigua * redAigua).toFixed(2)} €`;
    if (rCon)  rCon.textContent  = `−${(base.consu * redConsu).toFixed(2)} €`;
    if (rNou)  rNou.textContent  = `${(base.total - estalviFromPct).toFixed(2)} €`;
    if (rPct)  rPct.textContent  = `−${pctReduccio.toFixed(1)}%`;

    // Store current reduction state for PDF export
    window._reductionState = { pctReduccio, estalviFromPct, redElec, redAigua, redConsu, redNeteja, nouTotal, accionsActives };

    // Reduction projection chart
    renderReductionChart(base, redAigua, redElec, redConsu, redNeteja, estalvi, pctReduccio);
}

// ─── REDUCTION CHART ──────────────────────────────────────────────────────────
function renderReductionChart(base, redAigua, redElec, redConsu, redNeteja, estalviTotal, pctTotal) {
    const ctx = document.getElementById('chartReduccio');
    if (!ctx) return;
    if (reductionChartInstance) reductionChartInstance.destroy();

    const anys = ['Current', 'Year 1', 'Year 2', 'Year 3'];
    const progressFactor = [0, 0.45, 0.75, 1.0];

    const costosTotals = progressFactor.map(f => {
        const a = base.aigua  * (1 - redAigua  * f);
        const e = base.elec   * (1 - redElec   * f);
        const c = base.consu  * (1 - redConsu  * f);
        const n = base.neteja * (1 - redNeteja * f);
        return parseFloat((a + e + c + n).toFixed(2));
    });

    const costosAigua  = progressFactor.map(f => parseFloat((base.aigua  * (1 - redAigua  * f)).toFixed(2)));
    const costosElec   = progressFactor.map(f => parseFloat((base.elec   * (1 - redElec   * f)).toFixed(2)));
    const costosConsu  = progressFactor.map(f => parseFloat((base.consu  * (1 - redConsu  * f)).toFixed(2)));
    const costosNeteja = progressFactor.map(f => parseFloat((base.neteja * (1 - redNeteja * f)).toFixed(2)));

    reductionChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: anys,
            datasets: [
                {
                    label: 'Energy (€)',
                    data: costosElec,
                    backgroundColor: 'rgba(251,191,36,0.80)',
                    borderColor: 'rgba(251,191,36,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos', yAxisID: 'y'
                },
                {
                    label: 'Water (€)',
                    data: costosAigua,
                    backgroundColor: 'rgba(56,189,248,0.80)',
                    borderColor: 'rgba(56,189,248,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos', yAxisID: 'y'
                },
                {
                    label: 'Consumables (€)',
                    data: costosConsu,
                    backgroundColor: 'rgba(129,140,248,0.80)',
                    borderColor: 'rgba(129,140,248,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos', yAxisID: 'y'
                },
                {
                    label: 'Cleaning (€)',
                    data: costosNeteja,
                    backgroundColor: 'rgba(16,185,129,0.80)',
                    borderColor: 'rgba(16,185,129,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos', yAxisID: 'y'
                },
                {
                    label: 'Total Cost (€)',
                    data: costosTotals,
                    type: 'line',
                    borderColor: 'rgba(248,113,113,1)',
                    backgroundColor: 'transparent',
                    borderWidth: 2.5, pointRadius: 6,
                    pointBackgroundColor: 'rgba(248,113,113,1)',
                    borderDash: [5, 3], tension: 0.3,
                    yAxisID: 'y'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { family: 'Inter' }, boxWidth: 14 } },
                tooltip: {
                    backgroundColor: '#1e293b', titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1,
                    callbacks: {
                        label: (item) => ` ${item.dataset.label}: ${item.raw.toFixed(2)} €`,
                        footer: (items) => {
                            const total = items.filter(i => i.dataset.stack).reduce((s,i) => s + i.raw, 0);
                            return `Total: ${total.toFixed(2)} €`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid:  { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    stacked: true,
                    title: { display: true, text: '€ / term', color: '#94a3b8', font: { family: 'Inter', size: 11 } },
                    ticks: { color: '#64748b', font: { family: 'Inter' },
                        callback: v => v.toLocaleString('en-GB', { maximumFractionDigits: 0 }) + ' €'
                    },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                }
            }
        }
    });
}

// ─── PROGRESS BARS ────────────────────────────────────────────────────────────
function animarBarres() {
    for (let i = 1; i <= 4; i++) {
        const fill = document.getElementById(`fill${i}`);
        const pct  = document.getElementById(`pct${i}`);
        if (!fill || !pct) continue;
        const target = parseInt(fill.dataset.target);
        setTimeout(() => {
            fill.style.width = target + '%';
            pct.textContent  = target + '%';
        }, 200 * i);
    }
}

// ─── RENDER REDUCTION CALCULATOR ─────────────────────────────────────────────
function renderReductionCalculator() {
    const container = document.getElementById('reduction-calc-container');
    if (!container) return;

    const categories = [
        { key: 'elec',   label: 'Energy',       icon: '⚡', color: 'yellow' },
        { key: 'aigua',  label: 'Water',         icon: '💧', color: 'accent' },
        { key: 'consu',  label: 'Consumables',   icon: '♻️', color: 'purple' },
        { key: 'neteja', label: 'Cleaning',      icon: '🧼', color: 'green'  }
    ];

    let accionesHTML = '';
    categories.forEach(cat => {
        const accions = ACCIONS_REDUCCIO.filter(a => a.categoria === cat.key);
        accionesHTML += `<div class="reduccio-cat">
            <div class="reduccio-cat-header">
                <span class="icon">${cat.icon}</span>
                <span style="font-weight:700;font-size:0.95rem">${cat.label}</span>
            </div>`;
        accions.forEach(acc => {
            const pctImpacte = ((acc.impacte[acc.categoria] || 0) * 100).toFixed(0);
            accionesHTML += `
            <label class="acc-toggle" for="${acc.id}">
                <input type="checkbox" id="${acc.id}" onchange="calcularReduccio()" checked>
                <div class="acc-toggle-content">
                    <div class="acc-toggle-top">
                        <span class="acc-nom">${acc.icon} ${acc.nom}</span>
                        <span class="acc-badge acc-badge-${acc.color}">−${pctImpacte}% · ${acc.any}</span>
                    </div>
                    <p class="acc-desc">${acc.desc} <span style="color:var(--accent);font-size:0.72rem">SDG ${acc.ods}</span></p>
                </div>
            </label>`;
        });
        accionesHTML += `</div>`;
    });

    container.innerHTML = `
        <div class="card-input" style="margin-bottom:2rem">
            <div class="card-header" style="margin-bottom:1rem">
                <span class="icon">🎛️</span>
                <h3 style="font-size:1.1rem">Reduction Actions Simulator</h3>
            </div>
            <p class="calc-desc">Enable or disable actions to see how consumption and cost reduction changes. Results update in real time.</p>

            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;flex-wrap:wrap;gap:0.8rem">
                <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
                    <button onclick="toggleTodasAccions(true)"  class="btn-toggle-all btn-toggle-all-on">✅ Enable all</button>
                    <button onclick="toggleTodasAccions(false)" class="btn-toggle-all btn-toggle-all-off">❌ Disable all</button>
                </div>
                <div style="display:flex;align-items:center;gap:0.8rem;flex:1;min-width:200px;justify-content:flex-end">
                    <span style="font-size:0.8rem;color:var(--text-muted);white-space:nowrap">Target progress −30%</span>
                    <div class="progress-track" style="flex:1;max-width:200px;margin-bottom:0">
                        <div class="progress-fill pfill-accent" id="reduction-bar-fill" style="width:0%"></div>
                    </div>
                    <span id="reduction-bar-pct" style="font-weight:800;color:var(--accent);min-width:40px;text-align:right;font-size:0.9rem">0%</span>
                </div>
            </div>

            <div class="accions-grid">
                ${accionesHTML}
            </div>
        </div>

        <div id="reduction-results" class="results-grid" style="margin-bottom:2rem"></div>

        <div class="chart-card">
            <h4>COST PROJECTION — PROGRESSIVE 3-YEAR IMPLEMENTATION (€/term)</h4>
            <canvas id="chartReduccio" height="110"></canvas>
        </div>
    `;

    calcularReduccio();
}

function toggleTodasAccions(activar) {
    ACCIONS_REDUCCIO.forEach(acc => {
        const cb = document.getElementById(acc.id);
        if (cb) cb.checked = activar;
    });
    calcularReduccio();
}

// ─── PDF EXPORT ───────────────────────────────────────────────────────────────
function exportarPDF() {
    const btn = document.getElementById('btn-export-pdf');
    if (btn) { btn.textContent = 'Generating PDF...'; btn.disabled = true; }

    setTimeout(() => {
        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            // ── Colour palette ──
            const C = {
                bg:      [15,  23,  42],   // #0f172a
                card:    [22,  34,  58],   // slightly lighter navy
                card2:   [28,  42,  70],   // alternating row
                accent:  [56,  189, 248],  // cyan
                green:   [16,  185, 129],
                yellow:  [251, 191, 36],
                purple:  [129, 140, 248],
                white:   [241, 245, 249],
                muted:   [148, 163, 184],
                border:  [51,  65,  85],
                dark:    [10,  16,  30],
            };

            const W = 210, H = 297, M = 14;
            const INNER = W - M * 2;
            let y = 0;
            let pageNum = 1;

            // ── Fill entire page background ──
            function fillBackground() {
                doc.setFillColor(...C.bg);
                doc.rect(0, 0, W, H, 'F');
            }
            fillBackground();

            // ── Add new page with background ──
            function newPage() {
                doc.addPage();
                pageNum++;
                fillBackground();
                y = 20;
            }

            // ── Check if we need a new page ──
            function checkPage(needed = 20) {
                if (y + needed > H - 18) newPage();
            }

            // ── Draw header band ──
            function drawHeader() {
                // Top accent bar
                doc.setFillColor(...C.accent);
                doc.rect(0, 0, W, 3, 'F');

                // Header background
                doc.setFillColor(...C.dark);
                doc.rect(0, 3, W, 30, 'F');

                // Logo text
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(22);
                doc.setTextColor(...C.accent);
                doc.text('EnergyCalc', M, 18);

                // Subtitle
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9);
                doc.setTextColor(...C.muted);
                doc.text('Energy Audit Phase 3  |  Simulation Report', M, 25);

                // Date right-aligned
                doc.setFontSize(8);
                doc.text('Generated: ' + new Date().toLocaleString('en-GB'), W - M, 25, { align: 'right' });

                // Separator line
                doc.setDrawColor(...C.accent);
                doc.setLineWidth(0.4);
                doc.line(M, 32, W - M, 32);

                y = 40;
            }

            // ── Section title bar ──
            function sectionTitle(title, color = C.accent) {
                checkPage(14);
                doc.setFillColor(...color);
                doc.roundedRect(M, y, INNER, 8, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(8.5);
                doc.setTextColor(...C.dark);
                doc.text(title.toUpperCase(), M + 4, y + 5.5);
                y += 11;
            }

            // ── Table row (alternating) ──
            let rowIdx = 0;
            function resetRows() { rowIdx = 0; }

            function tableRow(label, value, valueColor = C.white, highlight = false) {
                checkPage(9);
                const bg = highlight ? [30, 50, 80] : (rowIdx % 2 === 0 ? C.card : C.card2);
                doc.setFillColor(...bg);
                doc.rect(M, y, INNER, 8, 'F');

                // Left border accent if highlight
                if (highlight) {
                    doc.setFillColor(...C.accent);
                    doc.rect(M, y, 2, 8, 'F');
                }

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(8.5);
                doc.setTextColor(...C.muted);
                doc.text(label, M + 5, y + 5.5);

                doc.setFont('helvetica', 'bold');
                doc.setTextColor(...valueColor);
                doc.text(String(value), W - M - 3, y + 5.5, { align: 'right' });

                rowIdx++;
                y += 8;
            }

            // ── Total / summary row ──
            function totalRow(label, value, color = C.yellow) {
                checkPage(11);
                doc.setFillColor(...C.dark);
                doc.rect(M, y, INNER, 10, 'F');
                doc.setDrawColor(...color);
                doc.setLineWidth(0.3);
                doc.rect(M, y, INNER, 10, 'S');

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(...color);
                doc.text(label, M + 5, y + 6.8);
                doc.text(String(value), W - M - 3, y + 6.8, { align: 'right' });
                y += 13;
            }

            // ── Spacer ──
            function gap(mm = 5) { y += mm; }

            // ── Status badge row ──
            function statusRow(label, ok) {
                checkPage(10);
                const color = ok ? C.green : C.yellow;
                doc.setFillColor(...C.card);
                doc.rect(M, y, INNER, 9, 'F');
                doc.setFillColor(...color);
                doc.roundedRect(M + 3, y + 2, 5, 5, 1, 1, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9);
                doc.setTextColor(...color);
                doc.text(label, M + 11, y + 6);
                y += 11;
            }

            // ══════════════════════════════════════
            // PAGE 1
            // ══════════════════════════════════════
            drawHeader();

            // ── Authors ──
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...C.muted);
            doc.text('Authors:  Samuel Anton  &  Hector Marti   ·   Energy Audit Phase 3   ·   Technological Institute of Barcelona', M, y);
            y += 10;

            // ── Section 1: Parameters ──
            sectionTitle('Simulation Parameters', C.accent);
            resetRows();
            const hores     = document.getElementById('input-hores')?.value || '1800';
            const preuElect = document.getElementById('input-preu-elect')?.value || '0.18';
            const aiguaM3   = document.getElementById('input-aigua-m3')?.value || '150';
            const preuAigua = document.getElementById('input-preu-aigua')?.value || '2.50';

            tableRow('Teaching Hours / Year',            hores + ' h');
            tableRow('Energy Price',                     preuElect + ' EUR/kWh');
            tableRow('Monthly Water Consumption',        aiguaM3 + ' m3/month');
            tableRow('Water Price',                      preuAigua + ' EUR/m3');
            gap(6);

            // ── Section 2: Consumption Results ──
            const base = window._baseCosts;
            if (base) {
                sectionTitle('Simulated Consumption Results', C.accent);
                resetRows();
                tableRow('Electricity  -  Term Consumption',  (base.totElecKwh ? base.totElecKwh.toFixed(0) : '-') + ' kWh',  C.accent);
                tableRow('Electricity  -  Term Cost',         base.elec.toFixed(2) + ' EUR',                                    C.white);
                tableRow('Water  -  Term Consumption',        (base.totAiguaM3 ? base.totAiguaM3.toFixed(1) : '-') + ' m3',    C.accent);
                tableRow('Water  -  Term Cost',               base.aigua.toFixed(2) + ' EUR',                                   C.white);
                tableRow('Consumables  -  Term Cost',         base.consu.toFixed(2) + ' EUR',                                   C.purple);
                tableRow('Cleaning  -  Term Cost',            base.neteja.toFixed(2) + ' EUR',                                  C.green);
                gap(2);
                totalRow('TOTAL TERM COST', base.total.toFixed(2) + ' EUR', C.yellow);
                gap(4);
            }

            // ── Section 3: Reduction Plan ──
            const red = window._reductionState;
            if (red) {
                sectionTitle('Reduction Plan Results', C.green);
                resetRows();
                tableRow('Actions Active',          red.accionsActives + ' actions selected');
                tableRow('Energy Reduction',         '-' + (red.redElec * 100).toFixed(0) + '%',    C.yellow);
                tableRow('Water Reduction',          '-' + (red.redAigua * 100).toFixed(0) + '%',   C.accent);
                tableRow('Consumables Reduction',    '-' + (red.redConsu * 100).toFixed(0) + '%',   C.purple);
                tableRow('Cleaning Reduction',       '-' + (red.redNeteja * 100).toFixed(0) + '%',  C.green);
                gap(2);
                totalRow('TOTAL REDUCTION',            '-' + red.pctReduccio.toFixed(1) + '%',         C.green);
                totalRow('ESTIMATED SAVINGS (term)',   '-' + red.estalviFromPct.toFixed(2) + ' EUR',   C.green);
                if (base) totalRow('NEW ESTIMATED TERM COST', (base.total - red.estalviFromPct).toFixed(2) + ' EUR', C.accent);
                gap(3);
                statusRow(
                    red.pctReduccio >= 30
                        ? 'Target -30% ACHIEVED'
                        : 'Target -30% in progress  (' + red.pctReduccio.toFixed(1) + '% of 30% reached)',
                    red.pctReduccio >= 30
                );
                gap(6);
            }

            // ── Section 4: Active Actions ──
            const activeActions = ACCIONS_REDUCCIO.filter(acc => {
                const cb = document.getElementById(acc.id);
                return cb && cb.checked;
            });
            if (activeActions.length > 0) {
                checkPage(14 + activeActions.length * 9);
                sectionTitle('Active Reduction Actions  (' + activeActions.length + ' selected)', C.purple);

                // Table header
                doc.setFillColor(...C.dark);
                doc.rect(M, y, INNER, 7, 'F');
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(7.5);
                doc.setTextColor(...C.muted);
                doc.text('ACTION', M + 5, y + 5);
                doc.text('SDG', M + 115, y + 5);
                doc.text('YEAR', M + 133, y + 5);
                doc.text('IMPACT', M + 155, y + 5);
                y += 7;
                resetRows();

                activeActions.forEach(acc => {
                    checkPage(9);
                    const bg = rowIdx % 2 === 0 ? C.card : C.card2;
                    doc.setFillColor(...bg);
                    doc.rect(M, y, INNER, 8, 'F');

                    // Category colour dot
                    const dotCol = acc.color === 'accent' ? C.accent
                                 : acc.color === 'yellow' ? C.yellow
                                 : acc.color === 'purple' ? C.purple : C.green;
                    doc.setFillColor(...dotCol);
                    doc.circle(M + 4, y + 4, 1.5, 'F');

                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(8);
                    doc.setTextColor(...C.white);
                    const shortName = acc.nom.length > 52 ? acc.nom.substring(0, 51) + '...' : acc.nom;
                    doc.text(shortName, M + 8, y + 5.5);

                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(7.5);
                    doc.setTextColor(...dotCol);
                    doc.text('SDG ' + acc.ods, M + 115, y + 5.5);
                    doc.setTextColor(...C.muted);
                    doc.text(acc.any, M + 133, y + 5.5);
                    const pct = ((acc.impacte[acc.categoria] || 0) * 100).toFixed(0);
                    doc.setTextColor(...dotCol);
                    doc.text('-' + pct + '% ' + acc.categoria, M + 155, y + 5.5);

                    rowIdx++;
                    y += 8;
                });
            }

            // ── Footer on every page ──
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Bottom bar
                doc.setFillColor(...C.dark);
                doc.rect(0, H - 14, W, 14, 'F');
                doc.setDrawColor(...C.border);
                doc.setLineWidth(0.3);
                doc.line(M, H - 14, W - M, H - 14);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(7);
                doc.setTextColor(...C.muted);
                doc.text('EnergyCalc  |  Energy Audit Phase 3  |  Authors: Samuel Anton & Hector Marti  |  SDG 3 - 6 - 7 - 12', M, H - 7);
                doc.setTextColor(...C.accent);
                doc.text('Page ' + i + ' of ' + pageCount, W - M, H - 7, { align: 'right' });
            }

            const fecha = new Date().toISOString().slice(0, 10);
            doc.save(`EnergyCalc_Audit_${fecha}.pdf`);

        } catch(e) {
            console.error('PDF export error:', e);
            alert('Error generating PDF. Please ensure jsPDF has loaded correctly.');
        } finally {
            if (btn) { btn.innerHTML = '<span>PDF</span> Export Current Data to PDF'; btn.disabled = false; }
        }
    }, 120);
}

// ─── INITIALISATION ───────────────────────────────────────────────────────────
window.onload = () => {
    cargarDatosJSON();
    calcularF3();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animarBarres(); observer.disconnect(); }
        });
    }, { threshold: 0.2 });

    const sec = document.getElementById('estrategia');
    if (sec) observer.observe(sec);

    setTimeout(() => renderReductionCalculator(), 100);
};