/**
 * GENERATOR v6.3: Den Perfekte Databasebyggeren
 * * OPTIMALISERT: Legger KUN på fylkesnavn hvis prisene er unike for det navnet.
 * * RESULTAT: Hvis Glitre har like priser i 4 fylker, får du én "glitre". 
 * * Hvis fylke nr 5 har andre priser, får du "glitre_fylke" i tillegg.
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
    let tempDB = {};
    let nameFingerprints = {}; // Holder styr på hvilke priser hvert navn allerede har lagret

    log(`⏳ Analyserer ${rawData.length} områder...`);

    for (const item of rawData) {
      const org = item.organisasjonsnr.replace(/[^0-9]/g, '');
      const fylke = item.fylkeNr;

      const pRes = await fetch(`${priserUrlBase}&FylkeNr=${fylke}&OrganisasjonsNr=${org}`, { headers: { "accept": "application/json" } });
      const pData = await pRes.json();

      if (pData && pData.length > 0) {
        const getP = (kw) => pData.sort((a,b)=>b.effekttrinnFraKw-a.effekttrinnFraKw).find(o => o.effekttrinnFraKw <= kw && o.time === 12)?.fastleddInk;
        const dag = pData.find(o => o.time === 12)?.energileddInk;
        const natt = pData.find(o => o.time === 0)?.energileddInk;
        const fingerprint = `${getP(0)}|${getP(2)}|${getP(5)}|${getP(10)}|${getP(15)}|${getP(20)}|${dag}|${natt}`;

        let navn = item.konsesjonar
          .replace(/\b(AS|SA|NETT|KRAFT|ENERGI|ELVERK|STRØM|FORSYNING)\b/gi, '')
          .replace(/Vesterål/gi, 'Vestall').trim();
        
        if (navn.length < 3) navn = item.konsesjonar.replace(/\b(AS|SA)\b/gi, '').trim();
        const cleanId = navn.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_').replace(/^_+|_+$/g, '').toLowerCase();

        if (!nameFingerprints[cleanId]) nameFingerprints[cleanId] = [];

        // Sjekk om vi allerede har lagret nøyaktig disse prisene for dette navnet
        if (nameFingerprints[cleanId].includes(fingerprint)) continue;

        let finalId = cleanId;
        // Hvis navnet allerede er brukt til en ANNEN prismodell, må vi bruke fylkesnavn for denne
        if (nameFingerprints[cleanId].length > 0) {
            const fylkeNavn = fylkeOppslag[fylke] || fylke;
            finalId = `${cleanId}_${fylkeNavn.toLowerCase()}`;
        }

        nameFingerprints[cleanId].push(fingerprint);
        tempDB[finalId] = { org: org, fylke: fylke };
      }
    }

    const sortedKeys = Object.keys(tempDB).sort();
    log(`\n--- KOPIER DENNE BLOKKEN (v6.3) ---`);
    log(`const db = {`);
    sortedKeys.forEach((key, index) => {
      const entry = tempDB[key];
      log(`   "${key}": { "org": "${entry.org}", "fylke": "${entry.fylke}" }${index === sortedKeys.length - 1 ? '' : ','}`);
    });
    log(`};`);
    log(`📊 Resultat: ${sortedKeys.length} unike prismodeller funnet.`);

  } catch (err) { log(`🛑 Feil: ${err.message}`); }
}
await generateSmartDB();
