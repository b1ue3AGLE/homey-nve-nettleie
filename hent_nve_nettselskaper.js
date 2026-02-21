/**
 * GENERATOR v6.1: Intelligent navnevask og databasebygger
 * * FIKSET: Håndterer nå selskaper med samme Org-nr i flere fylker (f.eks. Glitre).
 * * FORBEDRET: Sjekker både Org-nr og Fylke før den slår sammen duplikater.
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
    let priceFingerprints = {}; 

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

        // Fingerprint-sjekk per Org-nr og Fylke
        const fPrintKey = `${org}_${fylke}`;
        if (!priceFingerprints[fPrintKey]) priceFingerprints[fPrintKey] = [];
        if (priceFingerprints[fPrintKey].includes(fingerprint)) continue;
        priceFingerprints[fPrintKey].push(fingerprint);

        let navnOriginal = item.konsesjonar;
        let navn = navnOriginal
          .replace(/\b(AS|SA|NETT|KRAFT|ENERGI|ELVERK|STRØM|FORSYNING)\b/gi, '')
          .replace(/Vesterål/gi, 'Vestall')
          .trim();

        if (navn.length < 3) {
            navn = navnOriginal.replace(/\b(AS|SA)\b/gi, '').trim();
        }
        
        navn = navn.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_')
                   .replace(/^_+|_+$/g, '');

        let finalId = navn.toLowerCase();

        // FIKS: Sjekker både Org og Fylke for å fange opp Glitre Buskerud vs Glitre Agder
        if (tempDB[finalId] && (tempDB[finalId].org !== org || tempDB[finalId].fylke !== fylke)) {
            const fylkeNavn = fylkeOppslag[fylke] || fylke;
            finalId = `${finalId}_${fylkeNavn.toLowerCase()}`;
        }

        tempDB[finalId] = { org: org, fylke: fylke };
      }
    }

    const sortedKeys = Object.keys(tempDB).sort();

    log(`\n--- KOPIER DENNE BLOKKEN (v6.1) ---`);
    log(`const db = {`);
    sortedKeys.forEach((key, index) => {
      const entry = tempDB[key];
      const isLast = index === sortedKeys.length - 1;
      log(`   "${key}": { "org": "${entry.org}", "fylke": "${entry.fylke}" }${isLast ? '' : ','}`);
    });
    log(`};`);
    log(`---------------------------`);
    log(`📊 Resultat: ${sortedKeys.length} unike prismodeller funnet.`);

  } catch (err) {
    log(`🛑 Feil: ${err.message}`);
  }
}

await generateSmartDB();
