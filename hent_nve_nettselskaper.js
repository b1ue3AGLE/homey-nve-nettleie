/**
 * GENERATOR v6.0: Intelligent navnevask og databasebygger
 * * FIKSET: Stopper for aggressiv fjerning av bokstaver (f.eks. Lede -> L).
 * * FORBEDRET: Bruker "Boundary" \b i regex for å kun fjerne hele ord som AS/SA.
 */
async function generateSmartDB() {
  const url = "https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrManedHusholdningFritidEffekttariffer?FraDato=2026-01-01&Tariffgruppe=Husholdning&Kundegruppe=1";
  const priserUrlBase = "https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrTimeHusholdningFritidEffekttariffer?ValgtDato=2026-02-16&Tariffgruppe=Husholdning";

  const fylkeOppslag = {
    "03": "Oslo", "11": "Rogaland", "15": "Møre_Romsdal", "18": "Nordland",
    "31": "Østfold", "32": "Akershus", "33": "Buskerud", "34": "Innlandet",
    "39": "Vestfold", "40": "Telemark", "42": "Agder", "46": "Vestland",
    "50": "Trøndelag", "55": "Troms", "56": "Finnmark"
  };

  try {
    const res = await fetch(url, { headers: { "accept": "application/json" } });
    const rawData = await res.json();

    let tempDB = {};
    let priceFingerprints = {}; 

    log(`⏳ Analyserer ${rawData.length} områder... Dette tar litt tid.`);

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

        if (!priceFingerprints[org]) priceFingerprints[org] = [];
        if (priceFingerprints[org].includes(fingerprint)) continue;
        priceFingerprints[org].push(fingerprint);

        // --- FORBEDRET NAVNEVASK ---
        let navnOriginal = item.konsesjonar;
        
        // Fjerner kun HELE ord (AS, SA, NETT, KRAFT, ENERGI, ELVERK)
        // Bruker \b for å unngå at "Lede" blir "L" (fordi "de" finnes i listen)
        let navn = navnOriginal
          .replace(/\b(AS|SA|NETT|KRAFT|ENERGI|ELVERK|STRØM|FORSYNING)\b/gi, '')
          .replace(/Vesterål/gi, 'Vestall')
          .trim();

        // Sikkerhetsmekanisme: Hvis navnet ble for kort (< 3 tegn), bruk originalen (uten AS)
        if (navn.length < 3) {
            navn = navnOriginal.replace(/\b(AS|SA)\b/gi, '').trim();
        }
        
        // Formatering til Camel_Case_Underscore
        navn = navn.split(/[\s-]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('_')
               .replace(/^_+|_+$/g, '');

        let finalId = navn.toLowerCase();

        // Håndtering av duplikater med fylkesnavn
        if (tempDB[finalId] && tempDB[finalId].org !== org) {
            const fylkeNavn = fylkeOppslag[fylke] || fylke;
            finalId = `${finalId}_${fylkeNavn.toLowerCase()}`;
        }

        tempDB[finalId] = { org: org, fylke: fylke };
      }
    }

    const sortedKeys = Object.keys(tempDB).sort();

    log(`\n--- KOPIER DENNE BLOKKEN (v6.0) ---`);
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
