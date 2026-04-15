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

    // Aigua — consum mensual real, no la fuga com a base
    const consumMensualM3  = data.water_indicators.monthly_consumption_m3;
    const consumAnualM3    = (consumMensualM3 * 12).toFixed(0);
    const costAiguaAny     = (consumAnualM3 * PREU_AIGUA).toFixed(0);
    // La fuga nocturna representa ~30% del consum total (hores sense activitat)
    const fugaEstimadaM3   = (data.water_indicators.basal_flow_lh * 8 * 365 / 1000).toFixed(0);
    const fugaCostAny      = (fugaEstimadaM3 * PREU_AIGUA).toFixed(0);

    // Energia
    const kwhCurs      = (data.energy_efficiency.ac_compressor_w / 1000 * HORES_CURS).toFixed(0);
    const costElecCurs = (kwhCurs * PREU_ELECT).toFixed(0);

    // Consumibles (dades reals de factures)
    const costMarc       = (data.circular_economy.marker_refills  * data.circular_economy.marker_price_eur).toFixed(2);
    const costPaper      = (data.circular_economy.paper_reams     * data.circular_economy.paper_price_eur).toFixed(2);
    const costPilot      = (data.circular_economy.pilot_markers   * data.circular_economy.pilot_price_eur).toFixed(2);
    const costConsuTotal = (parseFloat(costMarc) + parseFloat(costPaper) + parseFloat(costPilot)).toFixed(2);

    // Neteja
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

function calcularF3() {
    if (!validarInputs()) return;

    const horesCurs   = parseFloat(document.getElementById('input-hores').value);
    const preuElect   = parseFloat(document.getElementById('input-preu-elect').value);
    const aiguaM3mes  = parseFloat(document.getElementById('input-aigua-m3').value);
    const preuAigua   = parseFloat(document.getElementById('input-preu-aigua').value);

    // Consumibles fixos del data.json (l'usuari no els toca)
    const RECANVIS     = 170;  const PREU_RECANVI = 0.71;
    const PAPER        = 100;  const PREU_PAPER   = 5.47;
    const PILOT        = 115;  const PREU_PILOT   = 0.89;
    const COST_NETEJA  = 750.26;
    const MESOS        = 10;

    // Estacionalitat elèctrica per mes de curs (Set→Jun)
    // Set=0, Oct=1, Nov=2, Des=3, Gen=4, Feb=5, Mar=6, Abr=7, Mai=8, Jun=9
    const FACTOR_ELEC = [
        1.0,  // Set  — inici curs, normal
        0.85, // Oct  — tardor, baix
        0.90, // Nov  — tardor, lleugerament puja
        1.40, // Des  — hivern, pic calefacció
        1.40, // Gen  — hivern, pic calefacció
        1.35, // Feb  — hivern, calefacció
        0.80, // Mar  — primavera, mínim
        0.80, // Abr  — primavera, mínim
        1.0,  // Mai  — comença calor, normal
        1.30  // Jun  — estiu, pic aire condicionat
    ];

    // Estacionalitat de l'aigua per mes de curs
    const FACTOR_AIGUA = [
        0.90, // Set
        0.85, // Oct — menys neteja exterior
        0.90, // Nov
        0.95, // Des
        0.95, // Gen
        0.90, // Feb
        1.00, // Mar
        1.05, // Abr
        1.10, // Mai — més activitat
        1.30  // Jun — neteges finals de curs
    ];

    const MESOS_NOM = ['Set','Oct','Nov','Des','Gen','Feb','Mar','Abr','Mai','Jun'];
    const elecKwhArr = [], aiguaM3Arr = [], costTotalArr = [];

    let totElecKwh = 0, totElecEur = 0;
    let totAiguaM3 = 0, totAiguaEur = 0;
    let totConsuEur = 0, totNetejaEur = 0;

    for (let i = 0; i < MESOS; i++) {
        const varI = 1 + (Math.random() * 0.06 - 0.03); // ±3% variabilitat

        // Electricitat
        const kwhMes = (0.4 * (horesCurs / MESOS)) * FACTOR_ELEC[i] * varI;
        elecKwhArr.push(parseFloat(kwhMes.toFixed(1)));
        totElecKwh += kwhMes;
        totElecEur += kwhMes * preuElect;

        // Aigua — consum mensual real amb estacionalitat
        const m3Mes = aiguaM3mes * FACTOR_AIGUA[i] * varI;
        aiguaM3Arr.push(parseFloat(m3Mes.toFixed(1)));
        totAiguaM3  += m3Mes;
        totAiguaEur += m3Mes * preuAigua;

        // Consumibles — pic inici de curs (Set/Oct)
        const factCons = (i < 2) ? 1.50 : 0.85;
        const consMes  = ((RECANVIS / MESOS) * PREU_RECANVI +
                          (PAPER    / MESOS) * PREU_PAPER   +
                          (PILOT    / MESOS) * PREU_PILOT) * factCons * varI;
        totConsuEur += consMes;

        // Neteja — fix mensual
        const netejaMes = COST_NETEJA * varI;
        totNetejaEur += netejaMes;

        // Cost total mensual
        costTotalArr.push(parseFloat(((kwhMes * preuElect) + (m3Mes * preuAigua) + consMes + netejaMes).toFixed(2)));
    }

    const totEurCurs   = totElecEur + totAiguaEur + totConsuEur + totNetejaEur;
    const estalviTotal = totEurCurs * 0.30;
    const estalviElec  = totElecEur * 0.15;  // 15% per substitució circuits
    const estalviAigua = totAiguaEur * 0.30;
    const estalviConsu = totConsuEur * 0.30;
    const estalviNet   = totNetejaEur * 0.10;
    const totEurAny    = totEurCurs * 1.2;

    // ── Renderitzar targetes resultats ────────────────────────────────────────
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

    // ── Actualitzar Pla de Reducció ───────────────────────────────────────────
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

    // ── Gràfica ───────────────────────────────────────────────────────────────
    renderChart(MESOS_NOM, elecKwhArr, aiguaM3Arr, costTotalArr);
}

// ─── GRÀFICA ──────────────────────────────────────────────────────────────────
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
                    borderWidth: 1, borderRadius: 4,
                    yAxisID: 'y'
                },
                {
                    label: 'Aigua (m³)',
                    data: m3,
                    type: 'line',
                    borderColor: 'rgba(16,185,129,1)',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderWidth: 2, pointRadius: 4,
                    pointBackgroundColor: 'rgba(16,185,129,1)',
                    tension: 0.4, fill: true,
                    yAxisID: 'y2'
                },
                {
                    label: 'Cost Total (€)',
                    data: costTotal,
                    type: 'line',
                    borderColor: 'rgba(251,191,36,1)',
                    backgroundColor: 'rgba(251,191,36,0.0)',
                    borderWidth: 2, pointRadius: 4,
                    pointBackgroundColor: 'rgba(251,191,36,1)',
                    borderDash: [5, 3],
                    tension: 0.4, fill: false,
                    yAxisID: 'y3'
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
};