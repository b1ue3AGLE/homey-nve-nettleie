/**
 * ============================================================================
 * PROSJEKT: UNIVERSAL NETTLEIE-OPPDATERER (NVE-DATA)
 * UTVIKLET AV: [Ditt Navn] / I samarbeid med Homey-miljøet
 * VERSJON: 12.0 (Basert på v11.7 Master)
 * ============================================================================
 * * HENSIKT:
 * Henter offisielle nettleiepriser fra NVEs dataplattform. Skriptet er 
 * "Zero-Config" og krever ingen API-nøkler, kun nettselskapets navn.
 * * * TEKNISKE TILPASNINGER:
 * 1. DATO-ROBUSTHET: Skriptet finner automatisk neste mandag dersom det kjøres
 * i en helg. Dette sikrer at man henter "hverdags-tariffen" (den mest 
 * relevante for planlegging) i stedet for helge-tariffen.
 * 2. AUTOMATISK MAPPING: Oversetter NVEs 'effekttrinnFraKw' til de faste 
 * variablene som brukes i Bjørnar Almlis "Strømregning"-app.
 * 3. PREFIX-LOGIKK: Bruker 'nve_nett_' for å separere data fra andre kilder.
 * ============================================================================
 */

async function oppdaterNettleieNVE() {
    // Tar imot navn fra Flow-argument, ellers brukes Elvia som standard
    const argumentInput = args[0] || "mellom";
    const sokNavn = argumentInput.toLowerCase(); 

    // Database over organisasjonsnumre og fylkeskoder for NVE-oppslag
const db = {
   "alut": { "org": "925336637", "fylke": "56" },
   "area": { "org": "923993355", "fylke": "56" },
   "arva": { "org": "979151950", "fylke": "55" },
   "asker": { "org": "917743193", "fylke": "32" },
   "barents": { "org": "971058854", "fylke": "56" },
   "bindal_kraftlag": { "org": "953181606", "fylke": "18" },
   "bkk": { "org": "976944801", "fylke": "46" },
   "breheim": { "org": "924527994", "fylke": "46" },
   "bømlo_kraftnett": { "org": "923934138", "fylke": "46" },
   "de_nett": { "org": "924862602", "fylke": "40" },
   "elinett": { "org": "979379455", "fylke": "15" },
   "elmea": { "org": "986347801", "fylke": "18" },
   "elvenett": { "org": "979497482", "fylke": "33" },
   "elvia": { "org": "980489698", "fylke": "03" },
   "enida": { "org": "918312730", "fylke": "11" },
   "etna": { "org": "882783022", "fylke": "34" },
   "everket": { "org": "966731508", "fylke": "40" },
   "fagne": { "org": "915635857", "fylke": "46" },
   "fjellnett": { "org": "923354204", "fylke": "34" },
   "føie": { "org": "971589752", "fylke": "32" },
   "føre": { "org": "925549738", "fylke": "40" },
   "glitre": { "org": "982974011", "fylke": "31" },
   "griug": { "org": "953681781", "fylke": "34" },
   "haringnett": { "org": "923789324", "fylke": "46" },
   "havnett": { "org": "924004150", "fylke": "46" },
   "høland_og_setskog": { "org": "923488960", "fylke": "32" },
   "indre_hordaland_kraftnett": { "org": "919415096", "fylke": "46" },
   "jæren_everk": { "org": "824914982", "fylke": "11" },
   "ke_nett": { "org": "977285712", "fylke": "11" },
   "klive": { "org": "923436596", "fylke": "34" },
   "kystnett": { "org": "923152601", "fylke": "18" },
   "lede": { "org": "979422679", "fylke": "39" },
   "linea": { "org": "917424799", "fylke": "18" },
   "linja": { "org": "912631532", "fylke": "15" },
   "lnett": { "org": "980038408", "fylke": "11" },
   "lucerna": { "org": "982897327", "fylke": "56" },
   "lysna": { "org": "923833706", "fylke": "46" },
   "mellom": { "org": "925668389", "fylke": "15" },
   "meløy": { "org": "919173122", "fylke": "18" },
   "midtnett": { "org": "917856222", "fylke": "33" },
   "mostraum": { "org": "933584801", "fylke": "46" },
   "netera": { "org": "924330678", "fylke": "15" },
   "nettselskapet": { "org": "921688679", "fylke": "50" },
   "noranett": { "org": "985411131", "fylke": "55" },
   "noranett_andøy": { "org": "921680554", "fylke": "18" },
   "noranett_hadsel": { "org": "917983550", "fylke": "18" },
   "nordvest": { "org": "980824586", "fylke": "15" },
   "norefjell": { "org": "824701482", "fylke": "33" },
   "r_nett": { "org": "925067911", "fylke": "33" },
   "rk_nett": { "org": "925017809", "fylke": "40" },
   "romsdalsnett": { "org": "926377841", "fylke": "15" },
   "s_nett": { "org": "923819177", "fylke": "15" },
   "stannum": { "org": "924940379", "fylke": "40" },
   "stram": { "org": "914385261", "fylke": "18" },
   "straumen": { "org": "925354813", "fylke": "15" },
   "sygnir": { "org": "924619260", "fylke": "46" },
   "sør_aurdal": { "org": "997712099", "fylke": "34" },
   "telemark": { "org": "925803375", "fylke": "40" },
   "tendranett": { "org": "918999361", "fylke": "46" },
   "tensio_tn": { "org": "988807648", "fylke": "50" },
   "tensio_ts": { "org": "978631029", "fylke": "34" },
   "uvdal_kraftforsyning": { "org": "967670170", "fylke": "33" },
   "vang_energiverk": { "org": "824368082", "fylke": "46" },
   "vestall": { "org": "968168134", "fylke": "55" },
   "vestmar": { "org": "979399901", "fylke": "40" },
   "vevig": { "org": "916319908", "fylke": "34" },
   "viermie": { "org": "919884452", "fylke": "34" },
   "vissi": { "org": "921683057", "fylke": "55" }
};

    const info = db[sokNavn];
    if (!info) {
        log(`❌ Selskapet '${argumentInput}' finnes ikke i databasen.`);
        return false;
    }

    try {
        // --- ROBUST DATO-HÅNDTERING ---
        // Vi sikrer at vi henter en ukedag (mandag) for å få representativ hverdagspris
        const idag = new Date();
        const dagNr = idag.getDay();
        const diffTilMandag = dagNr === 0 ? 1 : (dagNr === 1 ? 0 : 1 - dagNr);
        const testDato = new Date(idag);
        testDato.setDate(idag.getDate() + diffTilMandag);
        const datoStreng = testDato.toISOString().split('T')[0];

        // API-URL til NVEs dataplattform (Husholdning/Fritid Effekttariffer)
        const url = `https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrTimeHusholdningFritidEffekttariffer?ValgtDato=${datoStreng}&Tariffgruppe=Husholdning&FylkeNr=${info.fylke}&OrganisasjonsNr=${info.org}`;
        
        log(`------------------------------------------------------------`);
        log(`🚀 Oppdaterer nettleie for: ${argumentInput.toUpperCase()}`);
        log(`📅 Henter priser for dato: ${datoStreng}`);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`NVE API utilgjengelig (Status: ${response.status})`);
        
        const data = await response.json();
        if (!data || data.length === 0) throw new Error("Ingen data mottatt fra NVE.");

        // --- ENERGILEDD-LOGIKK ---
        // Time 12 representerer Dag (Expensive), Time 0 representerer Natt (Cheap)
        const dagpris = data.find(obj => obj.time === 12)?.energileddInk || 0;
        const nattPris = data.find(obj => obj.time === 0)?.energileddInk || 0;
        
        // --- KAPASITETSLEDD-LOGIKK ---
        // FinnPris-funksjonen sikrer at vi finner riktig fastledd selv om trinnene varierer litt
        const finnPris = (kw) => {
            const direkte = data.filter(o => o.time === 12).find(o => o.effekttrinnFraKw === kw);
            if (direkte) return direkte.fastleddInk;
            const backup = data.filter(o => o.time === 12).sort((a, b) => b.effekttrinnFraKw - a.effekttrinnFraKw).find(o => o.effekttrinnFraKw <= kw);
            return backup ? backup.fastleddInk : 0;
        };

        const cap = { 
            '0-2': finnPris(0), '2-5': finnPris(2), '5-10': finnPris(5), 
            '10-15': finnPris(10), '15-20': finnPris(15), '20-25': finnPris(20) 
        };

        log(`------------------------------------------------------------`);
        log(`📝 SKRIVER TIL HOMEY TAGS:`);
        
        // Lagre Energiledd som rene tall i kroner (0.47 istedenfor 47.38)
        // Vi deler på 100 hvis verdien din allerede er i øre
        const dagprisKr = Number(dagpris) > 5 ? Number(dagpris) / 100 : Number(dagpris);
        const nattprisKr = Number(nattPris) > 5 ? Number(nattPris) / 100 : Number(nattPris);

        await tag('nve_nett_pris_dag', dagprisKr);
        log(`🏷️  [nve_nett_pris_dag]`.padEnd(30) + `-> ${dagprisKr} (Tall/Kr)`);
        
        await tag('nve_nett_pris_natt_helg', nattprisKr);
        log(`🏷️  [nve_nett_pris_natt_helg]`.padEnd(30) + `-> ${nattprisKr} (Tall/Kr)`);

        // Lagre Kapasitetsledd
        for (let k in cap) {
            const tagName = `nve_nett_cap_${k.replace('-', '_')}`;
            await tag(tagName, Number(cap[k]));
            log(`🏷️  [${tagName}]`.padEnd(30) + `-> ${cap[k].toFixed(0)} kr`);
        }

        log(`------------------------------------------------------------`);
        log(`✅ Oppdatering fullført!`);
        return true;

    } catch (e) {
        log(`🛑 ALVORLIG FEIL: ${e.message}`);
        // Ved feil beholder Homey eksisterende tags for å unngå krasj i Flows
        return false;
    }
}

await oppdaterNettleieNVE();
