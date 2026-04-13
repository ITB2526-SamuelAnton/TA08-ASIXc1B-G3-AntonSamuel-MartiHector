function calcularF3() {
    // Dades extretes del Data Cleaning
    const aiguaBasal = parseFloat(document.getElementById('input-aigua').value); // 193 L/h
    const recanvis = parseFloat(document.getElementById('input-recanvis').value);
    const horesCurs = parseFloat(document.getElementById('input-hores').value);

    // Càlculs d'Aigua (Punts 3 i 4 de l'exercici)
    const aiguaAny = aiguaBasal * 24 * 365; 
    const aiguaCurs = aiguaBasal * horesCurs;

    // Càlculs d'Electricitat (Punts 1 i 2 - Basat en factura F041 Compressor 400W)
    const consumoAC = 0.4; // 400W = 0.4kWh
    const elecAny = consumoAC * horesCurs * 1.5; // Estimació amb pics estivals
    const elecCurs = consumoAC * horesCurs;

    // Consumibles (Punts 5 a 8 - Basat en Lyreco i Neteges F055)
    const preuRecanvi = 0.71; // Preu unitari factura F036
    const consumiblesAny = recanvis * preuRecanvi * 1.2;
    const netejaAny = 750.26 * 12; // Import total factura F055 mensualitzat

    const res = document.getElementById('results-f3');
    res.innerHTML = `
        <div class="res-card"><h4>Elec. Pròxim Any</h4><p>${elecAny.toFixed(0)} kWh</p></div>
        <div class="res-card"><h4>Elec. Curs (Set-Jun)</h4><p>${elecCurs.toFixed(0)} kWh</p></div>
        <div class="res-card"><h4>Aigua Pròxim Any</h4><p>${(aiguaAny/1000).toFixed(1)} m³</p></div>
        <div class="res-card"><h4>Aigua Curs</h4><p>${(aiguaCurs/1000).toFixed(1)} m³</p></div>
        <div class="res-card"><h4>Consumibles Any</h4><p>${consumiblesAny.toFixed(2)} €</p></div>
        <div class="res-card"><h4>Consumibles Curs</h4><p>${(consumiblesAny * 0.8).toFixed(2)} €</p></div>
        <div class="res-card"><h4>Neteja Any</h4><p>${netejaAny.toFixed(2)} €</p></div>
        <div class="res-card"><h4>Reducció 30% (Objectiu)</h4><p>- ${(elecAny * 0.3).toFixed(0)} kWh</p></div>
    `;
}