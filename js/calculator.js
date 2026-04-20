// ─── BACKUP DATA ─────────────────────────────────────────────────────────────
const backupData = {
    water_indicators:  { basal_flow_lh: 193, peak_flow_lh: 540, monthly_consumption_m3: 150, ods: 6 },
    circular_economy:  { marker_refills: 170, marker_price_eur: 0.71, paper_reams: 100, paper_price_eur: 5.47, pilot_markers: 115, pilot_price_eur: 0.89, ods: 12 },
    energy_efficiency: { ac_compressor_w: 400, repair_cost_eur: 348.48, circuit_upgrade_eur: 2548.02, ods: 7 },
    social_health:     { bulk_soap_liters: 15, soap_price_eur: 8.50, paper_towel_fardos: 10, paper_towel_price_eur: 18.25, cleaning_cost_eur: 750.26, ods: 3 }
};

// ─── CARREGAR INDICADORS CLAU ─────────────────────────────────────────────────
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
            <div class="card-header"><span class="icon">💧</span><h4>Aigua · ODS 6</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Consum Mensual</strong>
                    <span class="val">${consumMensualM3}</span><span class="unit">m³/mes</span>
                </div>
                <div class="data-item">
                    <strong>Consum Anual</strong>
                    <span class="val">${consumAnualM3}</span><span class="unit">m³/any</span>
                </div>
                <div class="data-item">
                    <strong>Cost Estimat</strong>
                    <span class="val">${costAiguaAny}</span><span class="unit">€/any</span>
                </div>
                <div class="data-item">
                    <strong>Fuga Nocturna (8h)</strong>
                    <span class="val">${fugaEstimadaM3}</span><span class="unit">m³/any · ${fugaCostAny} €</span>
                </div>
            </div>
        </div>

        <div class="res-card yellow">
            <div class="card-header"><span class="icon">⚡</span><h4>Energia · ODS 7</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Compressor AC</strong>
                    <span class="val">${data.energy_efficiency.ac_compressor_w}</span><span class="unit">W</span>
                </div>
                <div class="data-item">
                    <strong>Consum Curs</strong>
                    <span class="val">${kwhCurs}</span><span class="unit">kWh</span>
                </div>
                <div class="data-item">
                    <strong>Cost Elèctric Curs</strong>
                    <span class="val">${costElecCurs}</span><span class="unit">€</span>
                </div>
                <div class="data-item">
                    <strong>Inversió Circuits (F046)</strong>
                    <span class="val">${data.energy_efficiency.circuit_upgrade_eur.toFixed(2)}</span><span class="unit">€</span>
                </div>
            </div>
        </div>

        <div class="res-card purple">
            <div class="card-header"><span class="icon">♻️</span><h4>Consumibles · ODS 12</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Recanvis Marcadors</strong>
                    <span class="val">${costMarc}</span><span class="unit">€/any</span>
                </div>
                <div class="data-item">
                    <strong>Paper A4</strong>
                    <span class="val">${costPaper}</span><span class="unit">€/any</span>
                </div>
                <div class="data-item">
                    <strong>Marcadors Pilot</strong>
                    <span class="val">${costPilot}</span><span class="unit">€/any</span>
                </div>
                <div class="data-item">
                    <strong>Total Consumibles</strong>
                    <span class="val">${costConsuTotal}</span><span class="unit">€/any</span>
                </div>
            </div>
        </div>

        <div class="res-card green">
            <div class="card-header"><span class="icon">🧼</span><h4>Neteja · ODS 3</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Cost Mensual (F055)</strong>
                    <span class="val">${costNetejaMes}</span><span class="unit">€/mes</span>
                </div>
                <div class="data-item">
                    <strong>Cost Curs (10 mesos)</strong>
                    <span class="val">${costNetejaAny}</span><span class="unit">€</span>
                </div>
                <div class="data-item">
                    <strong>Sabó Granel</strong>
                    <span class="val">${data.social_health.bulk_soap_liters}</span><span class="unit">L · ${data.social_health.soap_price_eur.toFixed(2)} €/garrafa</span>
                </div>
            </div>
        </div>
    `;
}

// ─── VALIDACIÓ ────────────────────────────────────────────────────────────────
function validarInputs() {
    const camps = [
        { id: 'input-hores',      nom: 'Hores Lectives' },
        { id: 'input-preu-elect', nom: 'Preu Energia' },
        { id: 'input-aigua-m3',   nom: 'Consum Mensual Aigua' },
        { id: 'input-preu-aigua', nom: 'Preu Aigua' },
    ];
    const errorDiv = document.getElementById('input-error');
    let errors = [];
    camps.forEach(c => document.getElementById(c.id)?.classList.remove('input-invalid'));
    camps.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const val = parseFloat(el.value);
        if (isNaN(val) || val <= 0) { errors.push(c.nom); el.classList.add('input-invalid'); }
    });
    if (errors.length > 0) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `⚠️ Els camps següents han de ser majors que 0: ${errors.join(', ')}`;
        return false;
    }
    errorDiv.style.display = 'none';
    return true;
}

// ─── CALCULADORA F3 ───────────────────────────────────────────────────────────
let chartInstance = null;

// Guardem els costos base per reutilitzar-los a la calculadora de reducció
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

    const FACTOR_ELEC = [1.0, 0.85, 0.90, 1.40, 1.40, 1.35, 0.80, 0.80, 1.0, 1.30];
    const FACTOR_AIGUA = [0.90, 0.85, 0.90, 0.95, 0.95, 0.90, 1.00, 1.05, 1.10, 1.30];
    const MESOS_NOM = ['Set','Oct','Nov','Des','Gen','Feb','Mar','Abr','Mai','Jun'];

    const elecKwhArr = [], aiguaM3Arr = [], costTotalArr = [];
    let totElecKwh = 0, totElecEur = 0;
    let totAiguaM3 = 0, totAiguaEur = 0;
    let totConsuEur = 0, totNetejaEur = 0;

    for (let i = 0; i < MESOS; i++) {
        const varI = 1 + (Math.random() * 0.06 - 0.03);

        const kwhMes = (0.4 * (horesCurs / MESOS)) * FACTOR_ELEC[i] * varI;
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

    const totEurCurs   = totElecEur + totAiguaEur + totConsuEur + totNetejaEur;
    const estalviTotal = totEurCurs * 0.30;
    const estalviElec  = totElecEur * 0.15;
    const estalviAigua = totAiguaEur * 0.30;
    const estalviConsu = totConsuEur * 0.30;
    const estalviNet   = totNetejaEur * 0.10;
    const totEurAny    = totEurCurs * 1.2;

    // Guardem costos base per a la calculadora de reducció
    window._baseCosts = {
        elec: totElecEur, aigua: totAiguaEur,
        consu: totConsuEur, neteja: totNetejaEur,
        total: totEurCurs, preuAigua, elecKwhArr, aiguaM3Arr,
        MESOS_NOM, totElecKwh, totAiguaM3
    };

    const resDiv = document.getElementById('results-f3');
    if (!resDiv) return;

    resDiv.innerHTML = `
        <div class="res-card accent" style="animation-delay:0.0s">
            <div class="card-header"><span class="icon">⚡</span><h4>Electricitat</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Consum Curs</strong><span class="val">${totElecKwh.toFixed(0)}</span><span class="unit">kWh</span></div>
                <div class="data-item"><strong>Est. Anual</strong><span class="val">${(totElecKwh*1.2).toFixed(0)}</span><span class="unit">kWh/any</span></div>
                <div class="data-item"><strong>Cost Curs</strong><span class="val">${totElecEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card accent" style="animation-delay:0.1s">
            <div class="card-header"><span class="icon">💧</span><h4>Aigua</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Consum Curs</strong><span class="val">${totAiguaM3.toFixed(1)}</span><span class="unit">m³</span></div>
                <div class="data-item"><strong>Est. Anual</strong><span class="val">${(totAiguaM3*1.2).toFixed(1)}</span><span class="unit">m³/any</span></div>
                <div class="data-item"><strong>Cost Curs</strong><span class="val">${totAiguaEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card purple" style="animation-delay:0.2s">
            <div class="card-header"><span class="icon">♻️</span><h4>Consumibles</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Recanvis Marc.</strong><span class="val">${(RECANVIS*PREU_RECANVI).toFixed(2)}</span><span class="unit">€/any</span></div>
                <div class="data-item"><strong>Paper A4</strong><span class="val">${(PAPER*PREU_PAPER).toFixed(2)}</span><span class="unit">€/any</span></div>
                <div class="data-item"><strong>Marc. Pilot</strong><span class="val">${(PILOT*PREU_PILOT).toFixed(2)}</span><span class="unit">€/any</span></div>
                <div class="data-item"><strong>Cost Total Curs</strong><span class="val">${totConsuEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card accent" style="animation-delay:0.3s">
            <div class="card-header"><span class="icon">🧼</span><h4>Neteja (F055)</h4></div>
            <div class="data-row">
                <div class="data-item"><strong>Cost Mensual</strong><span class="val">750,26</span><span class="unit">€/mes</span></div>
                <div class="data-item"><strong>Cost Curs (10 m.)</strong><span class="val">${totNetejaEur.toFixed(2)}</span><span class="unit">€</span></div>
            </div>
        </div>

        <div class="res-card green" style="grid-column: 1 / -1; animation-delay:0.4s">
            <div class="card-header"><span class="icon">✅</span><h4>Resum · Si apliquem el Pla de Reducció −30%</h4></div>
            <div class="saving-hero">
                <div class="label">Estalvi potencial total del curs</div>
                <div class="big-number">−${estalviTotal.toFixed(2)}<span> €</span></div>
            </div>
            <div class="saving-breakdown">
                <div class="saving-breakdown-item">
                    <span class="sb-label">Cost actual curs</span>
                    <span class="sb-val neutral">${totEurCurs.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Estalvi energia</span>
                    <span class="sb-val">−${estalviElec.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Estalvi aigua</span>
                    <span class="sb-val">−${estalviAigua.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Estalvi consumibles</span>
                    <span class="sb-val">−${estalviConsu.toFixed(2)} €</span>
                </div>
                <div class="saving-breakdown-item">
                    <span class="sb-label">Estimació cost anual</span>
                    <span class="sb-val neutral">${totEurAny.toFixed(2)} €</span>
                </div>
            </div>
        </div>
    `;

    // Actualitzar Pla de Reducció (barres estàtiques)
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
    if (ta) ta.innerHTML = `<strong>${aiguaFugaM3} m³/any · ${aiguaFugaEur} €/any</strong>`;
    if (te) te.innerHTML = `<strong>${(totElecKwh*0.15).toFixed(0)} kWh/curs · ${estalviElec.toFixed(2)} €/curs</strong>`;
    if (tc) tc.innerHTML = `<strong>${estalviConsu.toFixed(2)} €/any</strong>`;

    renderChart(MESOS_NOM, elecKwhArr, aiguaM3Arr, costTotalArr);

    // Recalcular la calculadora de reducció si ja existeix
    if (document.getElementById('reduction-results')) {
        calcularReduccio();
    }
}

// ─── GRÀFICA PRINCIPAL ────────────────────────────────────────────────────────
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
                    label: 'Electricitat (kWh)',
                    data: kwh,
                    backgroundColor: 'rgba(56,189,248,0.6)',
                    borderColor: 'rgba(56,189,248,1)',
                    borderWidth: 1, borderRadius: 4, yAxisID: 'y'
                },
                {
                    label: 'Aigua (m³)',
                    data: m3,
                    type: 'line',
                    borderColor: 'rgba(16,185,129,1)',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderWidth: 2, pointRadius: 4,
                    pointBackgroundColor: 'rgba(16,185,129,1)',
                    tension: 0.4, fill: true, yAxisID: 'y2'
                },
                {
                    label: 'Cost Total (€)',
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

// ─── CALCULADORA DE REDUCCIÓ INTERACTIVA ──────────────────────────────────────
// Definició de totes les accions amb el seu impacte
const ACCIONS_REDUCCIO = [
    {
        id: 'acc-aigua-nocturna',
        icon: '💧',
        nom: 'Tall automàtic d\'aigua nocturna',
        desc: 'Elimina la fuga de 193 L/h durant 8h nocturnes. Estalvi directe sobre consum d\'aigua.',
        any: 'Any 1',
        color: 'accent',
        ods: 6,
        categoria: 'aigua',
        // Reducció aplicada sobre cost_aigua: 30% (fuga = ~30% del consum total)
        impacte: { aigua: 0.30, elec: 0, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-led',
        icon: '💡',
        nom: 'Substitució il·luminació per LED',
        desc: 'Canvi de fluorescents a LEDs en aules i passadissos. Reducció del 40% en il·luminació.',
        any: 'Any 1',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.18, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-circuits',
        icon: '⚡',
        nom: 'Substitució circuits elèctrics (F046)',
        desc: 'Optimització del 15% del consum elèctric total. Inversió ja realitzada: 2.548,02 €.',
        any: 'Any 1–2',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.15, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-termostats',
        icon: '🌡️',
        nom: 'Control intel·ligent de termostats',
        desc: 'Programació horària de calefacció/AC. Apagat automàtic fora d\'hores lectives.',
        any: 'Any 1',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.12, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-consumibles',
        icon: '♻️',
        nom: 'Economia Circular consumibles (F036)',
        desc: 'Ús de recanvis de marcadors i paper reciclat. Reducció del 30% en consumibles.',
        any: 'Any 1–3',
        color: 'purple',
        ods: 12,
        categoria: 'consu',
        impacte: { aigua: 0, elec: 0, consu: 0.30, neteja: 0 }
    },
    {
        id: 'acc-digital',
        icon: '📱',
        nom: 'Digitalització de documents',
        desc: 'Reducció del 50% d\'impressions mitjançant plataformes digitals i aules virtuals.',
        any: 'Any 1–2',
        color: 'purple',
        ods: 12,
        categoria: 'consu',
        impacte: { aigua: 0, elec: 0, consu: 0.20, neteja: 0 }
    },
    {
        id: 'acc-neteja-granel',
        icon: '🧼',
        nom: 'Neteja a granel i reducció d\'envasos (F055)',
        desc: 'Compra a granel de productes de neteja. Reducció del 30% del cost i envasos plàstic.',
        any: 'Any 2',
        color: 'green',
        ods: 3,
        categoria: 'neteja',
        impacte: { aigua: 0, elec: 0, consu: 0, neteja: 0.30 }
    },
    {
        id: 'acc-xarxes-aigua',
        icon: '🔧',
        nom: 'Revisió i manteniment de xarxes d\'aigua',
        desc: 'Inspecció de canonades, aixetes i cisternes. Reducció addicional del 10% de fuites.',
        any: 'Any 2',
        color: 'accent',
        ods: 6,
        categoria: 'aigua',
        impacte: { aigua: 0.10, elec: 0, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-solar',
        icon: '☀️',
        nom: 'Instal·lació de plaques solars fotovoltaiques',
        desc: 'Autoconsum energètic del 20% de la demanda elèctrica anual del centre.',
        any: 'Any 2–3',
        color: 'yellow',
        ods: 7,
        categoria: 'elec',
        impacte: { aigua: 0, elec: 0.20, consu: 0, neteja: 0 }
    },
    {
        id: 'acc-sensorsaigua',
        icon: '📡',
        nom: 'Sensors de presència als lavabos',
        desc: 'Tancar automàticament l\'aigua si no hi ha moviment. Estalvi addicional del 8%.',
        any: 'Any 2–3',
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
            // Cap al màxim per categoria, no s'acumulen linealment indefinidament
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
    const pctReduccio   = base.total > 0 ? (estalvi / base.total * 100) : 0;

    // Actualitzar targetes resum
    const resDiv = document.getElementById('reduction-results');
    if (resDiv) {
        const colorPct = pctReduccio >= 30 ? 'green' : pctReduccio >= 15 ? 'yellow' : 'accent';
        resDiv.innerHTML = `
            <div class="res-card ${colorPct}" style="animation-delay:0s">
                <div class="card-header"><span class="icon">📊</span><h4>Reducció Total</h4></div>
                <p style="font-size:2.4rem;font-weight:800;color:var(--${colorPct === 'accent' ? 'accent' : colorPct === 'yellow' ? 'yellow' : 'green'})">
                    −${pctReduccio.toFixed(1)}%
                </p>
                <span class="unit">${accionsActives} acció${accionsActives !== 1 ? 'ns' : ''} activada${accionsActives !== 1 ? 'es' : ''}</span>
                ${pctReduccio >= 30 ? '<p style="color:var(--green);font-size:0.8rem;margin-top:0.5rem">✅ Objectiu −30% assolit!</p>' : `<p style="color:var(--text-muted);font-size:0.8rem;margin-top:0.5rem">Falta ${(30 - pctReduccio).toFixed(1)}% per assolir l'objectiu</p>`}
            </div>
            <div class="res-card green" style="animation-delay:0.1s">
                <div class="card-header"><span class="icon">💶</span><h4>Estalvi Estimat</h4></div>
                <p style="font-size:2rem;font-weight:800;color:var(--green)">−${estalvi.toFixed(2)} €</p>
                <span class="unit">per curs</span>
                <div style="margin-top:0.8rem;font-size:0.8rem;color:var(--text-muted)">
                    Cost actual: <strong style="color:var(--text)">${base.total.toFixed(2)} €</strong><br>
                    Cost nou estimat: <strong style="color:var(--text)">${nouTotal.toFixed(2)} €</strong>
                </div>
            </div>
            <div class="res-card purple" style="animation-delay:0.2s">
                <div class="card-header"><span class="icon">📉</span><h4>Desglossat per Àrea</h4></div>
                <div class="data-row" style="flex-direction:column;gap:0.4rem">
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem">
                        <span style="color:var(--text-muted)">⚡ Energia</span>
                        <span style="color:var(--yellow);font-weight:700">−${(redElec*100).toFixed(0)}% · −${(base.elec*redElec).toFixed(2)} €</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem">
                        <span style="color:var(--text-muted)">💧 Aigua</span>
                        <span style="color:var(--accent);font-weight:700">−${(redAigua*100).toFixed(0)}% · −${(base.aigua*redAigua).toFixed(2)} €</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem">
                        <span style="color:var(--text-muted)">♻️ Consumibles</span>
                        <span style="color:var(--purple);font-weight:700">−${(redConsu*100).toFixed(0)}% · −${(base.consu*redConsu).toFixed(2)} €</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:0.85rem">
                        <span style="color:var(--text-muted)">🧼 Neteja</span>
                        <span style="color:var(--green);font-weight:700">−${(redNeteja*100).toFixed(0)}% · −${(base.neteja*redNeteja).toFixed(2)} €</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Actualitzar barra de progrés global
    const bar = document.getElementById('reduction-bar-fill');
    const pctLabel = document.getElementById('reduction-bar-pct');
    if (bar) {
        bar.style.width = Math.min(100, pctReduccio) + '%';
        bar.style.background = pctReduccio >= 30 ? 'var(--green)' : pctReduccio >= 15 ? 'var(--yellow)' : 'var(--accent)';
    }
    if (pctLabel) pctLabel.textContent = pctReduccio.toFixed(1) + '%';

    // Gràfica comparativa any 0, 1, 2, 3
    renderReductionChart(base, redAigua, redElec, redConsu, redNeteja, estalvi, pctReduccio);
}

// ─── GRÀFICA DE REDUCCIÓ ──────────────────────────────────────────────────────
function renderReductionChart(base, redAigua, redElec, redConsu, redNeteja, estalviTotal, pctTotal) {
    const ctx = document.getElementById('chartReduccio');
    if (!ctx) return;
    if (reductionChartInstance) reductionChartInstance.destroy();

    // Simulem 3 anys d'aplicació progressiva (implementació gradual)
    // Any 0 = actual, Any 1/2/3 = aplicació progressiva de les accions seleccionades
    const anys = ['Actual', 'Any 1', 'Any 2', 'Any 3'];
    const progressFactor = [0, 0.45, 0.75, 1.0]; // velocitat d'implementació

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
                    label: 'Energia (€)',
                    data: costosElec,
                    backgroundColor: 'rgba(251,191,36,0.75)',
                    borderColor: 'rgba(251,191,36,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos'
                },
                {
                    label: 'Aigua (€)',
                    data: costosAigua,
                    backgroundColor: 'rgba(56,189,248,0.75)',
                    borderColor: 'rgba(56,189,248,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos'
                },
                {
                    label: 'Consumibles (€)',
                    data: costosConsu,
                    backgroundColor: 'rgba(129,140,248,0.75)',
                    borderColor: 'rgba(129,140,248,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos'
                },
                {
                    label: 'Neteja (€)',
                    data: costosNeteja,
                    backgroundColor: 'rgba(16,185,129,0.75)',
                    borderColor: 'rgba(16,185,129,1)',
                    borderWidth: 1, borderRadius: 4, stack: 'costos'
                },
                {
                    label: 'Cost Total (€)',
                    data: costosTotals,
                    type: 'line',
                    borderColor: 'rgba(248,113,113,1)',
                    backgroundColor: 'transparent',
                    borderWidth: 2, pointRadius: 5,
                    pointBackgroundColor: 'rgba(248,113,113,1)',
                    borderDash: [5, 3], tension: 0.3
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
                        footer: (items) => {
                            const total = items.filter(i => i.dataset.stack).reduce((s,i) => s + i.raw, 0);
                            return `Total: ${total.toFixed(2)} €`;
                        }
                    }
                },
                annotation: {}
            },
            scales: {
                x: {
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid:  { color: 'rgba(255,255,255,0.04)' }
                },
                y: {
                    stacked: true,
                    title: { display: true, text: '€ / curs', color: '#94a3b8', font: { family: 'Inter' } },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid:  { color: 'rgba(255,255,255,0.04)' }
                }
            }
        }
    });
}

// ─── BARRES DE PROGRÉS ────────────────────────────────────────────────────────
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

// ─── RENDERITZAR CALCULADORA DE REDUCCIÓ ─────────────────────────────────────
function renderReductionCalculator() {
    const container = document.getElementById('reduction-calc-container');
    if (!container) return;

    const categories = [
        { key: 'elec',   label: 'Energia', icon: '⚡', color: 'yellow' },
        { key: 'aigua',  label: 'Aigua',   icon: '💧', color: 'accent' },
        { key: 'consu',  label: 'Consumibles', icon: '♻️', color: 'purple' },
        { key: 'neteja', label: 'Neteja',  icon: '🧼', color: 'green'  }
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
                    <p class="acc-desc">${acc.desc} <span style="color:var(--accent);font-size:0.72rem">ODS ${acc.ods}</span></p>
                </div>
            </label>`;
        });
        accionesHTML += `</div>`;
    });

    container.innerHTML = `
        <div class="card-input" style="margin-bottom:2rem">
            <div class="card-header" style="margin-bottom:1rem">
                <span class="icon">🎛️</span>
                <h3 style="font-size:1.1rem">Simulador d'Accions de Reducció</h3>
            </div>
            <p class="calc-desc">Activa o desactiva accions per veure com canvia la reducció de consum i cost. Els resultats s'actualitzen en temps real.</p>

            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.2rem;flex-wrap:wrap;gap:0.8rem">
                <div style="display:flex;gap:0.6rem;flex-wrap:wrap">
                    <button onclick="toggleTodasAccions(true)"  class="btn-toggle-all btn-toggle-all-on">✅ Activar totes</button>
                    <button onclick="toggleTodasAccions(false)" class="btn-toggle-all btn-toggle-all-off">❌ Desactivar totes</button>
                </div>
                <div style="display:flex;align-items:center;gap:0.8rem;flex:1;min-width:200px;justify-content:flex-end">
                    <span style="font-size:0.8rem;color:var(--text-muted);white-space:nowrap">Progrés objectiu −30%</span>
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
            <h4>PROJECCIÓ DE COSTOS — IMPLEMENTACIÓ PROGRESSIVA 3 ANYS (€/curs)</h4>
            <canvas id="chartReduccio" height="110"></canvas>
        </div>
    `;

    // Calcular immediatament
    calcularReduccio();
}

function toggleTodasAccions(activar) {
    ACCIONS_REDUCCIO.forEach(acc => {
        const cb = document.getElementById(acc.id);
        if (cb) cb.checked = activar;
    });
    calcularReduccio();
}

// ─── INICIALITZACIÓ ───────────────────────────────────────────────────────────
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

    // Renderitzar calculadora de reducció un cop els costos base estiguin calculats
    setTimeout(() => renderReductionCalculator(), 100);
};