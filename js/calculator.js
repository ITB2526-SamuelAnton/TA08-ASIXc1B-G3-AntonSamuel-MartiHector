// ─── DADES DE BACKUP (si no hi ha data.json) ───────────────────────────────
const backupData = {
    water_indicators:  { basal_flow_lh: 193,   ods: 6  },
    circular_economy:  { marker_refills: 170,  ods: 12 },
    energy_efficiency: { ac_compressor_w: 400, ods: 7  },
    social_health:     { bulk_soap_liters: 15, ods: 3  }
};

// ─── INDICADORS CLAU (Fase 1.2) ────────────────────────────────────────────
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

    // Càlculs de cost per a cada indicador
    const PREU_AIGUA  = 2.50;   // €/m³
    const PREU_ELECT  = 0.18;   // €/kWh
    const HORES_CURS  = 1800;   // hores lectives

    const fugaAnualM3     = (data.water_indicators.basal_flow_lh * 24 * 365 / 1000).toFixed(0);
    const fugaCostAny     = (fugaAnualM3 * PREU_AIGUA).toFixed(0);
    const compressorKwh   = (data.energy_efficiency.ac_compressor_w / 1000 * HORES_CURS).toFixed(0);
    const compressorCost  = (compressorKwh * PREU_ELECT).toFixed(0);
    const recanvisCost    = (data.circular_economy.marker_refills * 0.71).toFixed(2);

    grid.innerHTML = `
        <div class="res-card accent">
            <div class="card-header"><span class="icon">💧</span><h4>Aigua · ODS 6</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Fuga Basal</strong>
                    <span class="val">${data.water_indicators.basal_flow_lh}</span>
                    <span class="unit">L/h</span>
                </div>
                <div class="data-item">
                    <strong>Pèrdua Anual</strong>
                    <span class="val">${fugaAnualM3}</span>
                    <span class="unit">m³/any</span>
                </div>
                <div class="data-item">
                    <strong>Cost Estimat</strong>
                    <span class="val">${fugaCostAny}</span>
                    <span class="unit">€/any</span>
                </div>
            </div>
        </div>

        <div class="res-card accent">
            <div class="card-header"><span class="icon">⚡</span><h4>Energia · ODS 7</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Compressor AC</strong>
                    <span class="val">${data.energy_efficiency.ac_compressor_w}</span>
                    <span class="unit">W</span>
                </div>
                <div class="data-item">
                    <strong>Consum Curs</strong>
                    <span class="val">${compressorKwh}</span>
                    <span class="unit">kWh</span>
                </div>
                <div class="data-item">
                    <strong>Cost Estimat</strong>
                    <span class="val">${compressorCost}</span>
                    <span class="unit">€/curs</span>
                </div>
            </div>
        </div>

        <div class="res-card purple">
            <div class="card-header"><span class="icon">♻️</span><h4>Circularitat · ODS 12</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Recanvis/Any</strong>
                    <span class="val">${data.circular_economy.marker_refills}</span>
                    <span class="unit">unitats</span>
                </div>
                <div class="data-item">
                    <strong>Cost Total</strong>
                    <span class="val">${recanvisCost}</span>
                    <span class="unit">€/any</span>
                </div>
            </div>
        </div>

        <div class="res-card green">
            <div class="card-header"><span class="icon">🧼</span><h4>Social · ODS 3</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Sabó Granel</strong>
                    <span class="val">${data.social_health.bulk_soap_liters}</span>
                    <span class="unit">L/comanda</span>
                </div>
            </div>
        </div>
    `;
}

// ─── CALCULADORA F3 ─────────────────────────────────────────────────────────
let chartInstance = null;

function calcularF3() {
    // Llegir paràmetres
    const aiguaBasal  = parseFloat(document.getElementById('input-aigua').value)       || 193;
    const recanvis    = parseFloat(document.getElementById('input-recanvis').value)     || 170;
    const horesCurs   = parseFloat(document.getElementById('input-hores').value)        || 1800;
    const preuElect   = parseFloat(document.getElementById('input-preu-elect').value)   || 0.18;
    const preuAigua   = parseFloat(document.getElementById('input-preu-aigua').value)   || 2.50;
    const costRecanvi = parseFloat(document.getElementById('input-cost-recanvi').value) || 0.71;

    const MESOS = 10;
    const COST_NETEJA_MES = 750.26; // €/mes fix (Factura F055)

    const electricitatKwh = [];
    const aiguaM3         = [];

    let totalElecKwh   = 0;
    let totalElecEur   = 0;
    let totalAiguaM3   = 0;
    let totalAiguaEur  = 0;
    let totalConsuEur  = 0;
    let totalNetejaEur = 0;

    const MESOS_NOM = ['Set', 'Oct', 'Nov', 'Des', 'Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun'];

    for (let i = 0; i < MESOS; i++) {
        // Variabilitat ±5% (simula incertesa real de factures)
        const varI = 1 + (Math.random() * 0.10 - 0.05);

        // ELECTRICITAT: pic hivern (Des/Gen/Feb = mesos 3-5) i final de curs (Juny = mes 9)
        const factorElec = (i >= 3 && i <= 5) ? 1.35 : (i === 9 ? 1.20 : 1.0);
        const kwhMes = (0.4 * (horesCurs / MESOS)) * factorElec * varI;
        electricitatKwh.push(parseFloat(kwhMes.toFixed(1)));
        totalElecKwh += kwhMes;
        totalElecEur += kwhMes * preuElect;

        // AIGUA: pic final de curs (Juny = mes 9)
        const factorAigua = (i === 9) ? 1.30 : 1.0;
        const m3Mes = (aiguaBasal * 24 * 30 / 1000) * factorAigua * varI;
        aiguaM3.push(parseFloat(m3Mes.toFixed(2)));
        totalAiguaM3  += m3Mes;
        totalAiguaEur += m3Mes * preuAigua;

        // CONSUMIBLES: pic inici de curs (mesos 0-1)
        const factorCons = (i < 2) ? 1.50 : 0.85;
        totalConsuEur += (recanvis / MESOS) * costRecanvi * factorCons * varI;

        // NETEJA: fix mensual amb variabilitat
        totalNetejaEur += COST_NETEJA_MES * varI;
    }

    // Totals
    const totalEurCurs = totalElecEur + totalAiguaEur + totalConsuEur + totalNetejaEur;
    const estalviEur   = totalEurCurs * 0.30;
    const totalEurAny  = totalEurCurs * 1.2; // estimació any complet

    // ─── RENDERITZAR TARJETES ───────────────────────────────────────────────
    const resDiv = document.getElementById('results-f3');
    if (!resDiv) return;

    resDiv.innerHTML = `
        <div class="res-card accent">
            <div class="card-header"><span class="icon">⚡</span><h4>Electricitat</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Consum Curs</strong>
                    <span class="val">${totalElecKwh.toFixed(0)}</span>
                    <span class="unit">kWh</span>
                </div>
                <div class="data-item">
                    <strong>Estimació Anual</strong>
                    <span class="val">${(totalElecKwh * 1.2).toFixed(0)}</span>
                    <span class="unit">kWh/any</span>
                </div>
                <div class="data-item">
                    <strong>Cost Curs</strong>
                    <span class="val">${totalElecEur.toFixed(2)}</span>
                    <span class="unit">€</span>
                </div>
            </div>
        </div>

        <div class="res-card accent">
            <div class="card-header"><span class="icon">💧</span><h4>Aigua</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Consum Curs</strong>
                    <span class="val">${totalAiguaM3.toFixed(1)}</span>
                    <span class="unit">m³</span>
                </div>
                <div class="data-item">
                    <strong>Estimació Anual</strong>
                    <span class="val">${(totalAiguaM3 * 1.2).toFixed(1)}</span>
                    <span class="unit">m³/any</span>
                </div>
                <div class="data-item">
                    <strong>Cost Curs</strong>
                    <span class="val">${totalAiguaEur.toFixed(2)}</span>
                    <span class="unit">€</span>
                </div>
            </div>
        </div>

        <div class="res-card purple">
            <div class="card-header"><span class="icon">♻️</span><h4>Consumibles (Rotuladors)</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Recanvis Totals</strong>
                    <span class="val">${recanvis}</span>
                    <span class="unit">unitats</span>
                </div>
                <div class="data-item">
                    <strong>Cost Total</strong>
                    <span class="val">${totalConsuEur.toFixed(2)}</span>
                    <span class="unit">€/curs</span>
                </div>
                <div class="data-item">
                    <strong>Cost/Unitat</strong>
                    <span class="val">${costRecanvi.toFixed(2)}</span>
                    <span class="unit">€/u.</span>
                </div>
            </div>
        </div>

        <div class="res-card accent">
            <div class="card-header"><span class="icon">🧼</span><h4>Neteja (F055)</h4></div>
            <div class="data-row">
                <div class="data-item">
                    <strong>Cost Mensual</strong>
                    <span class="val">750,26</span>
                    <span class="unit">€/mes</span>
                </div>
                <div class="data-item">
                    <strong>Cost Curs (10 m.)</strong>
                    <span class="val">${totalNetejaEur.toFixed(2)}</span>
                    <span class="unit">€</span>
                </div>
            </div>
        </div>

        <div class="res-card green" style="grid-column: 1 / -1;">
            <div class="card-header"><span class="icon">✅</span><h4>Resum · Objectiu Reducció 30%</h4></div>
            <div class="saving-row">
                <div class="saving-item">
                    <strong>Cost Total Curs</strong>
                    <div class="big-val euros">${totalEurCurs.toFixed(2)} €</div>
                </div>
                <div class="saving-item">
                    <strong>Estalvi Potencial (−30%)</strong>
                    <div class="big-val euros">−${estalviEur.toFixed(2)} €</div>
                </div>
                <div class="saving-item">
                    <strong>Estalvi Energia</strong>
                    <div class="big-val">−${(totalElecKwh * 0.30).toFixed(0)} kWh</div>
                </div>
                <div class="saving-item">
                    <strong>Estalvi Aigua</strong>
                    <div class="big-val">−${(totalAiguaM3 * 0.30).toFixed(1)} m³</div>
                </div>
                <div class="saving-item">
                    <strong>Estimació Cost Anual</strong>
                    <div class="big-val euros">${totalEurAny.toFixed(2)} €/any</div>
                </div>
            </div>
        </div>
    `;

    // ─── GRÀFICA ────────────────────────────────────────────────────────────
    const container = document.getElementById('chart-container');
    const ctx = document.getElementById('chartElec');
    if (!container || !ctx) return;
    container.style.display = 'block';

    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: MESOS_NOM,
            datasets: [
                {
                    label: 'Electricitat (kWh)',
                    data: electricitatKwh,
                    backgroundColor: 'rgba(56, 189, 248, 0.6)',
                    borderColor: 'rgba(56, 189, 248, 1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    yAxisID: 'y'
                },
                {
                    label: 'Aigua (m³)',
                    data: aiguaM3,
                    type: 'line',
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(16, 185, 129, 1)',
                    tension: 0.4,
                    fill: true,
                    yAxisID: 'y2'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    labels: { color: '#94a3b8', font: { family: 'Inter' } }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    titleColor: '#f1f5f9',
                    bodyColor: '#94a3b8',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
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
                }
            }
        }
    });
}

// ─── INICIALITZACIÓ ─────────────────────────────────────────────────────────
window.onload = () => {
    cargarDatosJSON();
    calcularF3();
};