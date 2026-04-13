/**
 * ECO-CALCULATOR - ITB LEAKS EDITION
 * Lògica per a la Fase 3 i Data Cleaning
 */

// 1. Dades per defecte (per si el fitxer data.json triga a carregar o falla)
const backupData = {
    "water_indicators": { "basal_flow_lh": 193, "peak_flow_lh": 540, "ods": 6 },
    "circular_economy": { "marker_refills": 170, "plastic_saved_kg": 2.5, "ods": 12 },
    "energy_efficiency": { "ac_compressor_w": 400, "new_modules": 16, "ods": 7 },
    "social_health": { "bulk_soap_liters": 15, "paper_towels_fardos": 10, "ods": 3 }
};

// 2. Funció principal per carregar dades del JSON
async function cargarDatosJSON() {
    const gridASG = document.getElementById('grid-asg');
    
    try {
        // Intentem carregar el fitxer local data.json
        const response = await fetch('data.json');
        
        if (!response.ok) {
            throw new Error("No s'ha pogut trobar el fitxer data.json");
        }
        
        const data = await response.json();
        renderizarIndicadores(data);
        console.log("Dades carregades correctament des del JSON.");
        
    } catch (error) {
        console.warn("Error amb el JSON. Usant dades de seguretat (Backup):", error.message);
        renderizarIndicadores(backupData);
    }
}

// 3. Inyectar els indicadors del Data Cleaning a la web
function renderizarIndicadores(data) {
    const grid = document.getElementById('grid-asg');
    if (!grid) return;

    grid.innerHTML = `
        <div class="res-card">
            <h4>Ambiental (Aigua)</h4>
            <p>${data.water_indicators.basal_flow_lh} L/h</p>
            <small>Flux basal nocturn (ODS ${data.water_indicators.ods})</small>
        </div>
        <div class="res-card">
            <h4>Ambiental (Circular)</h4>
            <p>${data.circular_economy.marker_refills} Unitats</p>
            <small>Recanvis vs Plàstic nou (ODS ${data.circular_economy.ods})</small>
        </div>
        <div class="res-card">
            <h4>Governança (Energia)</h4>
            <p>${data.energy_efficiency.ac_compressor_w} W</p>
            <small>Consum Compressor AACC (ODS ${data.energy_efficiency.ods})</small>
        </div>
        <div class="res-card">
            <h4>Social (Higiene)</h4>
            <p>${data.social_health.bulk_soap_liters} L</p>
            <small>Sabó de mans a granel (ODS ${data.social_health.ods})</small>
        </div>
    `;
}

// 4. Funció per realitzar els 8 càlculs de la Fase 3
function calcularF3() {
    // Captura de valors dels inputs (amb valors de les factures per defecte)
    const aiguaBasal = parseFloat(document.getElementById('input-aigua').value) || 193;
    const recanvis = parseFloat(document.getElementById('input-recanvis').value) || 170;
    const horesCurs = parseFloat(document.getElementById('input-hores').value) || 1800;
    
    // Constants extretes del Data Cleaning
    const consumoAC_kW = 0.4; // 400W de la factura F041
    const preuRecanvi = 0.71; // De la factura F036
    const mensualNeteja = 750.26; // De la factura F055

    // Objecte amb els 8 càlculs requerits
    const calculs = {
        // 1. Consum elèctric pròxim any (estimat amb estacionalitat +20%)
        elecAny: consumoAC_kW * horesCurs * 1.2,
        // 2. Consum elèctric període curs (setembre a juny)
        elecCurs: consumoAC_kW * horesCurs,
        // 3. Consum aigua pròxim any (24h/365d a causa del leak basal)
        aiguaAny: (aiguaBasal * 24 * 365) / 1000,
        // 4. Consum aigua període curs
        aiguaCurs: (aiguaBasal * horesCurs) / 1000,
        // 5. Consum consumables oficina pròxim any
        consAny: recanvis * preuRecanvi * 1.2,
        // 6. Consum consumables oficina període curs
        consCurs: recanvis * preuRecanvi,
        // 7. Consum productes neteja pròxim any
        netejaAny: mensualNeteja * 12,
        // 8. Consum productes neteja període curs
        netejaCurs: mensualNeteja * 10
    };

    // Injecció de resultats al DOM
    const resultsDiv = document.getElementById('results-f3');
    if (!resultsDiv) return;

    resultsDiv.innerHTML = `
        <div class="res-card"><h4>Elec. Pròxim Any</h4><p>${calculs.elecAny.toFixed(1)} kWh</p></div>
        <div class="res-card"><h4>Elec. Curs (Set-Jun)</h4><p>${calculs.elecCurs.toFixed(1)} kWh</p></div>
        <div class="res-card"><h4>Aigua Pròxim Any</h4><p>${calculs.aiguaAny.toFixed(1)} m³</p></div>
        <div class="res-card"><h4>Aigua Curs</h4><p>${calculs.aiguaCurs.toFixed(1)} m³</p></div>
        <div class="res-card"><h4>Consumibles Any</h4><p>${calculs.consAny.toFixed(2)} €</p></div>
        <div class="res-card"><h4>Consumibles Curs</h4><p>${calculs.consCurs.toFixed(2)} €</p></div>
        <div class="res-card"><h4>Neteja Any</h4><p>${calculs.netejaAny.toFixed(2)} €</p></div>
        <div class="res-card"><h4>Neteja Curs</h4><p>${calculs.netejaCurs.toFixed(2)} €</p></div>
    `;
}

// 5. Inicialització en carregar la pàgina
window.onload = () => {
    cargarDatosJSON(); // Carrega els 4 indicadors ASG
    calcularF3();      // Realitza els càlculs inicials de la Fase 3
};