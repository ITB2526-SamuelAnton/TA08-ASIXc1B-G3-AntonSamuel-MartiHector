// ─── BACKUP DATA (dades reals de factures) ──────────────────────────────────
const backupData = {
    water_indicators:  { basal_flow_lh: 193, peak_flow_lh: 540, ods: 6 },
    circular_economy:  { marker_refills: 170, marker_price_eur: 0.71, paper_reams: 100, paper_price_eur: 5.47, pilot_markers: 115, pilot_price_eur: 0.89, ods: 12 },
    energy_efficiency: { ac_compressor_w: 400, repair_cost_eur: 348.48, circuit_upgrade_eur: 2548.02, ods: 7 },
    social_health:     { bulk_soap_liters: 15, soap_price_eur: 8.50, paper_towel_fardos: 10, paper_towel_price_eur: 18.25, cleaning_cost_eur: 750.26, ods: 3 }
};

// ─── CARREGAR INDICADORS CLAU ────────────────────────────────────────────────
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

    const PREU_AIGUA = 2.50;
    const PREU_ELECT = 0.18;
    const HORES_CURS = 1800;

    // Aigua
    const fugaAnualM3   = (data.water_indicators.basal_flow_lh * 24 * 365 / 1000).toFixed(0);
    const fugaCostAny   = (fugaAnualM3 * PREU_AIGUA).toFixed(0);
    const picAnualM3    = (data.water_indicators.peak_flow_lh * 24 * 365 / 1000).toFixed(0);

    // Energia
    const kwhCurs       = (data.energy_efficiency.ac_compressor_w / 1000 * HORES_CURS).toFixed(0);
    const costElecCurs  = (kwhCurs * PREU_ELECT).toFixed(0);

    // Consumibles (dades reals factures)
    const costMarc  = (data.circular_economy.marker_refills * data.circular_economy.marker_price_eur).toFixed(2);
    const costPaper = (data.circular_economy.paper_reams    * data.circular_economy.paper_price_eur).toFixed(2);
    const costPilot = (data.circular_economy.pilot_markers  * data.circular_economy.pilot_price_eur).toFixed(2);
    const costConsuTotal = (parseFloat(costMarc) + parseFloat(costPaper) + parseFloat(costPilot)).toFixed(2);

    // Neteja
    const costNetejaMes = data.social_health.cleaning_cost_eur.toFixed(2);
    const costNetejaAny = (data.social_health.cleaning_cost_eur * 10).toFixed(2);

    grid.innerHTML = `
        <div class="res-card accent">
            <div class="card-header"><span class="icon">💧</span><h4>Aigua · ODS 6</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Flux Basal (Nocturn)</strong>
                    <span class="val">${data.water_indicators.basal_flow_lh}</span><span class="unit">L/h</span>
                </div>
                <div class="data-item">
                    <strong>Flux Pic (Diürn)</strong>
                    <span class="val">${data.water_indicators.peak_flow_lh}</span><span class="unit">L/h</span>
                </div>
                <div class="data-item">
                    <strong>Pèrdua Anual (basal)</strong>
                    <span class="val">${fugaAnualM3}</span><span class="unit">m³/any</span>
                </div>
                <div class="data-item">
                    <strong>Cost Estimat</strong>
                    <span class="val">${fugaCostAny}</span><span class="unit">€/any</span>
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

// ─── VALIDACIÓ D'INPUTS ──────────────────────────────────────────────────────
function validarInputs() {
    const camps = [
        { id: 'input-aigua',        nom: 'Flux Aigua Basal' },
        { id: 'input-hores',        nom: 'Hores Lectives' },
        { id: 'input-preu-elect',   nom: 'Preu Energia' },
        { id: 'input-preu-aigua',   nom: 'Preu Aigua' },
        { id: 'input-cost-recanvi', nom: 'Preu Recanvi' },
        { id: 'input-cost-paper',   nom: 'Preu Resma Paper' },
    ];

    const errorDiv = document.getElementById('input-error');
    let errors = [];

    // Netejar estils previs
    camps.forEach(c => {
        const el = document.getElementById(c.id);
        if (el) el.classList.remove('input-invalid');
    });

    camps.forEach(c => {
        const el = document.getElementById(c.id);
        if (!el) return;
        const val = parseFloat(el.value);
        if (isNaN(val) || val <= 0) {
            errors.push(c.nom);
            el.classList.add('input-invalid');
        }
    });

    if (errors.length > 0) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = `⚠️ Els camps següents han de ser majors que 0: ${errors.join(', ')}`;
        return false;
    }

    errorDiv.style.display = 'none';
    return true;
}

// ─── CALCULADORA F3 ──────────────────────────────────────────────────────────
let chartInstance = null;

function calcularF3() {
    if (!validarInputs()) return;

    const aiguaBasal    = parseFloat(document.getElementById('input-aigua').value);
    const horesCurs     = parseFloat(document.getElementById('input-hores').value);
    const preuElect     = parseFloat(document.getElementById('input-preu-elect').value);
    const preuAigua     = parseFloat(document.getElementById('input-preu-aigua').value);
    const recanvis      = parseFloat(document.getElementById('input-recanvis').value)      || 0;
    const costRecanvi   = parseFloat(document.getElementById('input-cost-recanvi').value);
    const paper         = parseFloat(document.getElementById('input-paper').value)         || 0;
    const costPaper     = parseFloat(document.getElementById('input-cost-paper').value);
    const pilot         = parseFloat(document.getElementById('input-pilot').value)         || 0;
    const COST_PILOT    = 0.89;
    const MESOS         = 10;
    const COST_NETEJA   = 750.26;

    const elecKwhArr = [], aiguaM3Arr = [], costTotalArr = [];
    const MESOS_NOM  = ['Set','Oct','Nov','Des','Gen','Feb','Mar','Abr','Mai','Jun'];

    let totElecKwh = 0, totElecEur = 0;
    let totAiguaM3 = 0, totAiguaEur = 0;
    let totConsuEur = 0, totNetejaEur = 0;

    for (let i = 0; i < MESOS; i++) {
        const varI = 1 + (Math.random() * 0.10 - 0.05);

        // Electricitat: pic hivern (Des/Gen/Feb = mesos 3-5), pic juny (mes 9)
        const factElec  = (i >= 3 && i <= 5) ? 1.35 : (i === 9 ? 1.20 : 1.0);
        const kwhMes    = (0.4 * (horesCurs / MESOS)) * factElec * varI;
        elecKwhArr.push(parseFloat(kwhMes.toFixed(1)));
        totElecKwh += kwhMes;
        totElecEur += kwhMes * preuElect;

        // Aigua: pic final de curs (Juny = mes 9)
        const factAigua = (i === 9) ? 1.30 : 1.0;
        const m3Mes     = (aiguaBasal * 24 * 30 / 1000) * factAigua * varI;
        aiguaM3Arr.push(parseFloat(m3Mes.toFixed(2)));
        totAiguaM3  += m3Mes;
        totAiguaEur += m3Mes * preuAigua;

        // Consumibles: pic inici curs (mesos 0-1)
        const factCons  = (i < 2) ? 1.50 : 0.85;
        const consMes   = ((recanvis / MESOS) * costRecanvi + (paper / MESOS) * costPaper + (pilot / MESOS) * COST_PILOT) * factCons * varI;
        totConsuEur += consMes;

        // Neteja: fix mensual
        const netejaMes = COST_NETEJA * varI;
        totNetejaEur += netejaMes;

        // Cost total mensual en €
        const costMes = kwhMes * preuElect + m3Mes * preuAigua + consMes + netejaMes;
        costTotalArr.push(parseFloat(costMes.toFixed(2)));
    }

    const totEurCurs  = totElecEur + totAiguaEur + totConsuEur + totNetejaEur;
    const estalviEur  = totEurCurs * 0.30;
    const totEurAny   = totEurCurs * 1.2;

    // ── Renderitzar targetes ─────────────────────────────────────────────────
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
                <div class="data-item"><strong>Recanvis Marc.</strong><span class="val">${recanvis}</span><span class="unit">u. · ${(recanvis*costRecanvi).toFixed(2)} €</span></div>
                <div class="data-item"><strong>Paper A4</strong><span class="val">${paper}</span><span class="unit">resmes · ${(paper*costPaper).toFixed(2)} €</span></div>
                <div class="data-item"><strong>Marc. Pilot</strong><span class="val">${pilot}</span><span class="unit">u. · ${(pilot*COST_PILOT).toFixed(2)} €</span></div>
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
            <div class="card-header"><span class="icon">✅</span><h4>Resum · Objectiu Reducció −30%</h4></div>
            <div class="saving-row">
                <div class="saving-item">
                    <strong>Cost Total Curs</strong>
                    <div class="big-val euros">${totEurCurs.toFixed(2)} €</div>
                </div>
                <div class="saving-item">
                    <strong>Estalvi Potencial (−30%)</strong>
                    <div class="big-val euros">−${estalviEur.toFixed(2)} €</div>
                </div>
                <div class="saving-item">
                    <strong>Estalvi Energia</strong>
                    <div class="big-val">−${(totElecKwh*0.30).toFixed(0)} kWh</div>
                </div>
                <div class="saving-item">
                    <strong>Estalvi Aigua</strong>
                    <div class="big-val">−${(totAiguaM3*0.30).toFixed(1)} m³</div>
                </div>
                <div class="saving-item">
                    <strong>Estimació Cost Anual</strong>
                    <div class="big-val euros">${totEurAny.toFixed(2)} €/any</div>
                </div>
            </div>
        </div>
    `;

    // ── Actualitzar Pla de Reducció amb xifres reals ─────────────────────────
    const aiguaAnualM3  = (aiguaBasal * 24 * 365 / 1000).toFixed(0);
    const aiguaAnualEur = (aiguaAnualM3 * preuAigua).toFixed(0);
    const elecEstalvi   = (totElecEur * 0.15).toFixed(2); // 15% optimització elèctrica
    const consuEstalvi  = (totConsuEur * 0.30).toFixed(2);

    // Textos de les barres
    const e = document.getElementById('estalvi-aigua-text');
    const f = document.getElementById('estalvi-aigua-eur');
    const g = document.getElementById('estalvi-elec-eur');
    const h = document.getElementById('estalvi-consu-eur');
    if (e) e.textContent = aiguaAnualM3;
    if (f) f.textContent = aiguaAnualEur;
    if (g) g.textContent = elecEstalvi;
    if (h) h.textContent = consuEstalvi;

    // Textos de la taula
    const ta = document.getElementById('taula-estalvi-aigua');
    const te = document.getElementById('taula-estalvi-elec');
    const tc = document.getElementById('taula-estalvi-consu');
    if (ta) ta.innerHTML = `<strong>${aiguaAnualM3} m³/any · ${aiguaAnualEur} €/any</strong>`;
    if (te) te.innerHTML = `<strong>${(totElecKwh*0.15).toFixed(0)} kWh/curs · ${elecEstalvi} €/curs</strong>`;
    if (tc) tc.innerHTML = `<strong>${consuEstalvi} €/any</strong>`;

    // ── Gràfica ──────────────────────────────────────────────────────────────
    renderChart(MESOS_NOM, elecKwhArr, aiguaM3Arr, costTotalArr);
}

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
                    backgroundColor: 'rgba(16,185,129,0.1)',
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
                x: { ticks: { color: '#64748b', font: { family: 'Inter' } }, grid: { color: 'rgba(255,255,255,0.04)' } },
                y: {
                    position: 'left',
                    title: { display: true, text: 'kWh', color: '#38bdf8', font: { family: 'Inter' } },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid: { color: 'rgba(255,255,255,0.04)' }
                },
                y2: {
                    position: 'right',
                    title: { display: true, text: 'm³', color: '#10b981', font: { family: 'Inter' } },
                    ticks: { color: '#64748b', font: { family: 'Inter' } },
                    grid: { drawOnChartArea: false }
                },
                y3: {
                    position: 'right',
                    title: { display: true, text: '€', color: '#fbbf24', font: { family: 'Inter' } },
                    ticks: { color: '#fbbf24', font: { family: 'Inter' } },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
}

// ─── BARRES DE PROGRÉS (visibles sense hover) ────────────────────────────────
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

// ─── INICIALITZACIÓ ──────────────────────────────────────────────────────────
window.onload = () => {
    cargarDatosJSON();
    calcularF3();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) { animarBarres(); observer.disconnect(); } });
    }, { threshold: 0.2 });

    const sec = document.getElementById('estrategia');
    if (sec) observer.observe(sec);
};