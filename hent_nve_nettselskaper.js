/**
 * GENERATOR v6.2: Den "Smarte" Databasebyggeren
 * * REPARERT: Legger kun på fylkesnavn hvis prisene faktisk er ULIKE.
 * * LOGIKK: Hvis prisene er like, beholdes kun én oppføring uten fylkesnavn.
 */
async function generateSmartDB() {
  const url = "https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrManedHusholdningFritidEffekttariffer?FraDato=2026-01-01&Tariffgruppe=Husholdning&Kundegruppe=1";
  const priserUrlBase = "https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrTimeHusholdningFritidEffekttariffer?ValgtDato=2026-02-16&Tariffgruppe=Husholdning";

  const fylkeOppslag = {
    "03": "Oslo", "11": "Rogaland", "15": "More_Romsdal", "18": "Nordland",
    "31": "Ostfold", "32": "Akershus", "33": "Buskerud", "34": "Innlandet",
    "39": "Vestfold", "40": "Telemark", "42": "Agder", "46": "Vestland",
    "50": "Trondelag", "55": "Troms", "56": "Finnmark"
  };

  try {
    const res = await fetch(url, { headers: { "accept": "application/json" } });
    const rawData = await res.json();

    let tempDB = {}; // Lagrer unike pris-modeller

    log(`⏳ Analyserer ${rawData.length} områder...`);

    for (const item of rawData) {
      const org = item.organisasjonsnr.replace(/[^0-9]/g, '');
      const fylke = item.fylkeNr;

      const pRes = await fetch(`${priserUrlBase}&FylkeNr=${fylke}&OrganisasjonsNr=${org}`, { headers: { "accept": "application/json" } });
      const pData = await pRes.json();

      if (pData && pData.length > 0) {
        // Lag et fingeravtrykk av prisene
        const getP = (kw) => pData.sort((a,b)=>b.effekttrinnFraKw-a.effekttrinnFraKw).find(o => o.effekttrinnFraKw <= kw && o.time === 12)?.fastleddInk;
        const dag = pData.find(o => o.time === 12)?.energileddInk;
        const natt = pData.find(o => o.time === 0)?.energileddInk;
        const fingerprint = `${getP(0)}|${getP(2)}|${getP(5)}|${getP(10)}|${getP(15)}|${getP(20)}|${dag}|${natt}`;

        // Vask navnet
        let navn = item.konsesjonar
          .replace(/\b(AS|SA|NETT|KRAFT|ENERGI|ELVERK|STRØM|FORSYNING)\b/gi, '')
          .replace(/Vesterål/gi, 'Vestall').trim();
        
        if (navn.length < 3) navn = item.konsesjonar.replace(/\b(AS|SA)\b/gi, '').trim();

        const cleanId = navn.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_').replace(/^_+|_+$/g, '').toLowerCase();

        // --- SMART LOGIKK FOR DUPLIKATER ---
        let finalId = cleanId;
        
        // Sjekk om denne ID-en allerede finnes med ANDRE priser
        if (tempDB[finalId] && tempDB[finalId].fingerprint !== fingerprint) {
            // Prisene er ulike! Vi må skille dem med fylkesnavn.
            const eksisterendeFylke = fylkeOppslag[tempDB[finalId].fylke] || tempDB[finalId].fylke;
            const nyttFylke = fylkeOppslag[fylke] || fylke;
            
            // Flytt den gamle til et fylkes-spesifikt navn
            tempDB[`${finalId}_${eksisterendeFylke.toLowerCase()}`] = tempDB[finalId];
            delete tempDB[finalId];
            
            // Sett den nye til sitt fylkes-spesifikke navn
            finalId = `${finalId}_${nyttFylke.toLowerCase()}`;
        } else if (tempDB[finalId] && tempDB[finalId].fingerprint === fingerprint) {
            // Prisene er dønn like, vi trenger ikke gjøre noe mer.
            continue;
        }

        tempDB[finalId] = { org: org, fylke: fylke, fingerprint: fingerprint };
      }
    }

    const sortedKeys = Object.keys(tempDB).sort();
    log(`\n--- KOPIER DENNE BLOKKEN (v6.2) ---`);
    log(`const db = {`);
    sortedKeys.forEach((key, index) => {
      const entry = tempDB[key];
      const isLast = index === sortedKeys.length - 1;
      log(`   "${key}": { "org": "${entry.org}", "fylke": "${entry.fylke}" }${isLast ? '' : ','}`);
    });
    log(`};`);
    log(`📊 Resultat: ${sortedKeys.length} unike modeller.`);

  } catch (err) { log(`🛑 Feil: ${err.message}`); }
}
await generateSmartDB();
