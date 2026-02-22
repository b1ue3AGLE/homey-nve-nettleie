/**
 * ============================================================================
 * PROSJEKT: UNIVERSAL NETTLEIE-OPPDATERER (NVE-DATA)
 * UTVIKLET AV: Glenn Pedersen / I samarbeid med Homey-miljøet
 * VERSJON: 11.8 (Optimalisert for Strømregning-app)
 * KREDITT: Takk til Tom Andreas H. Abrahamsen & Kai Engvik for bug-fix (verdi > 5)
 * ============================================================================
 * * BESKRIVELSE:
 * Dette skriptet automatiserer henting av nettleie-satser fra NVEs API.
 * Dataene lagres som numeriske variabler (Tags) i Homey, som igjen kan brukes
 * av "Strømregning"-appen eller i egne Flows for avansert energistyring.
 */

// --- BRUKERKONFIGURASJON ---
// Merk: Hvis du sender et argument fra en Flow (args[0]), vil det overstyre NETTSELSKAP under.
const NETTSELSKAP = "mellom";      // Standard nettselskap (Bruk ID fra hent_nve_nettselskaper.js)
const TARIFF_TYPE = "Husholdning"; // Velg mellom "Husholdning" eller "Hytter og fritidshus"

async function oppdaterNettleieNVE() {
    
    // 1. INPUT-HÅNDTERING
    // Vi sjekker om skriptet mottar input fra en Flow (args[0]). Hvis ikke, brukes standardverdien.
    const argumentInput = args[0] || NETTSELSKAP;
    const sokNavn = argumentInput.toLowerCase(); 

    // 2. DATABASE (Look-up table)
    // Inneholder Organisasjonsnummer og Fylkesnummer som NVE krever for å gi riktig pris.
    // Denne listen er optimalisert (v6.1) for å dekke alle unike prismodeller i Norge.
    const db = {
       "alut": { "org": "925336637", "fylke": "56" },
       "alut_troms": { "org": "925336637", "fylke": "55" },
       "area": { "org": "923993355", "fylke": "56" },
       "arva": { "org": "979151950", "fylke": "55" },
       "arva_nordland": { "org": "979151950", "fylke": "18" },
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
       "elvia_akershus": { "org": "980489698", "fylke": "32" },
       "elvia_buskerud": { "org": "980489698", "fylke": "33" },
       "elvia_innlandet": { "org": "980489698", "fylke": "34" },
       "elvia_ostfold": { "org": "980489698", "fylke": "31" },
       "enida": { "org": "918312730", "fylke": "11" },
       "enida_agder": { "org": "918312730", "fylke": "42" },
       "etna": { "org": "882783022", "fylke": "34" },
       "everket": { "org": "966731508", "fylke": "40" },
       "fagne": { "org": "915635857", "fylke": "46" },
       "fagne_rogaland": { "org": "915635857", "fylke": "11" },
       "fjellnett": { "org": "923354204", "fylke": "34" },
       "føie": { "org": "971589752", "fylke": "32" },
       "føie_buskerud": { "org": "971589752", "fylke": "33" },
       "føre": { "org": "925549738", "fylke": "40" },
       "glitre": { "org": "982974011", "fylke": "03" },
       "glitre_agder": { "org": "982974011", "fylke": "42" },
       "glitre_akershus": { "org": "982974011", "fylke": "32" },
       "glitre_buskerud": { "org": "982974011", "fylke": "33" },
       "glitre_innlandet": { "org": "982974011", "fylke": "34" },
       "glitre_ostfold": { "org": "982974011", "fylke": "31" },
       "glitre_rogaland": { "org": "982974011", "fylke": "11" },
       "glitre_telemark": { "org": "982974011", "fylke": "40" },
       "glitre_vestland": { "org": "982974011", "fylke": "46" },
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
       "lede_buskerud": { "org": "979422679", "fylke": "33" },
       "lede_telemark": { "org": "979422679", "fylke": "40" },
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
       "noranett_nordland": { "org": "985411131", "fylke": "18" },
       "nordvest": { "org": "980824586", "fylke": "15" },
       "norefjell": { "org": "824701482", "fylke": "33" },
       "r_nett": { "org": "925067911", "fylke": "33" },
       "rk_nett": { "org": "925017809", "fylke": "40" },
       "romsdalsnett": { "org": "926377841", "fylke": "15" },
       "s_nett": { "org": "923819177", "fylke": "15" },
       "s_nett_trondelag": { "org": "923819177", "fylke": "50" },
       "stannum": { "org": "924940379", "fylke": "40" },
       "stram": { "org": "914385261", "fylke": "18" },
       "straumen": { "org": "925354813", "fylke": "15" },
       "sygnir": { "org": "924619260", "fylke": "46" },
       "sør_aurdal": { "org": "997712099", "fylke": "34" },
       "telemark": { "org": "925803375", "fylke": "40" },
       "tendranett": { "org": "918999361", "fylke": "46" },
       "tensio_tn": { "org": "988807648", "fylke": "18" },
       "tensio_tn_trondelag": { "org": "988807648", "fylke": "50" },
       "tensio_ts": { "org": "978631029", "fylke": "34" },
       "tensio_ts_trondelag": { "org": "978631029", "fylke": "50" },
       "uvdal_kraftforsyning": { "org": "967670170", "fylke": "33" },
       "vang_energiverk": { "org": "824368082", "fylke": "46" },
       "vang_energiverk_innlandet": { "org": "824368082", "fylke": "34" },
       "vestall": { "org": "968168134", "fylke": "55" },
       "vestall_nordland": { "org": "968168134", "fylke": "18" },
       "vestmar": { "org": "979399901", "fylke": "40" },
       "vevig": { "org": "916319908", "fylke": "34" },
       "vevig_vestland": { "org": "916319908", "fylke": "46" },
       "viermie": { "org": "919884452", "fylke": "34" },
       "viermie_trondelag": { "org": "919884452", "fylke": "50" },
       "vissi": { "org": "921683057", "fylke": "55" },
       "vissi_finnmark": { "org": "921683057", "fylke": "56" }
    };

    // 3. VALIDERING AV NETTSELSKAP
    // Vi henter ut info fra databasen basert på navnet som er oppgitt.
    const info = db[sokNavn];
    if (!info) {
        log(`❌ Selskapet '${argumentInput}' finnes ikke i databasen.`);
        return false;
    }

    try {
        // 4. DATO-LOGIKK (Look-forward)
        // NVE returnerer ofte tomme data i helger for hverdags-tariffer.
        // Skriptet finner derfor automatisk neste mandag for å hente representative priser.
        const idag = new Date();
        const dagNr = idag.getDay(); // 0 = søndag, 1 = mandag...
        const diffTilMandag = dagNr === 0 ? 1 : (dagNr === 1 ? 0 : 1 - dagNr);
        const testDato = new Date(idag);
        testDato.setDate(idag.getDate() + diffTilMandag);
        const datoStreng = testDato.toISOString().split('T')[0];

        // 5. API-OPPSLAG
        // Vi bygger URL-en med organisasjonsnummer, fylke og valgt tariff-type.
        const url = `https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrTimeHusholdningFritidEffekttariffer?ValgtDato=${datoStreng}&Tariffgruppe=${encodeURIComponent(TARIFF_TYPE)}&FylkeNr=${info.fylke}&OrganisasjonsNr=${info.org}`;
        
        log(`------------------------------------------------------------`);
        log(`🚀 STARTET v11.8 - NETTLEIE FOR: ${argumentInput.toUpperCase()}`);
        log(`🏠 Tariffgruppe: ${TARIFF_TYPE}`);
        log(`📅 Bruker representativ hverdag: ${datoStreng}`);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`NVE API utilgjengelig (Status: ${response.status})`);
        
        const data = await response.json();
        if (!data || data.length === 0) throw new Error("Ingen data mottatt fra NVE.");

        // 6. ENERGILEDD-BEHANDLING (kr/kWh)
        // NVE oppgir priser i øre. Vi deler på 100 for å få kroner. 
        // Dette hindrer feil i Strømregning-appen som forventer verdier under 5 (kr).
        const dagpris = (data.find(obj => obj.time === 12)?.energileddInk || 0) / 100;
        const nattPris = (data.find(obj => obj.time === 0)?.energileddInk || 0) / 100;
        
        // 7. KAPASITETSLEDD-LOGIKK (Look-back algoritme)
        // Noen nettselskaper mangler data for spesifikke trinn (f.eks. 2-5 kW).
        // Denne funksjonen finner nærmeste lavere trinn for å sikre at vi alltid har en pris.
        const finnPris = (kw) => {
            const direkte = data.filter(o => o.time === 12).find(o => o.effekttrinnFraKw === kw);
            if (direkte) return direkte.fastleddInk;
            
            // Finn nærmeste trinn under hvis eksakt match mangler
            const backup = data.filter(o => o.time === 12)
                             .sort((a, b) => b.effekttrinnFraKw - a.effekttrinnFraKw)
                             .find(o => o.effekttrinnFraKw <= kw);
            return backup ? backup.fastleddInk : 0;
        };

        // Mapper opp de faste kapasitetstrinnene som brukes i Norge
        const cap = { 
            '0-2': finnPris(0), 
            '2-5': finnPris(2), 
            '5-10': finnPris(5), 
            '10-15': finnPris(10), 
            '15-20': finnPris(15), 
            '20-25': finnPris(20) 
        };

        log(`------------------------------------------------------------`);
        log(`📝 OPPDATERER HOMEY TAGS (TALLVERDIER):`);
        
        // 8. LAGRING TIL HOMEY TAGS
        // Vi tvinger verdiene til 'Number' for å sikre kompatibilitet med Flows.
        await tag('nve_nett_pris_dag', Number(dagpris));
        log(`🏷️  [nve_nett_pris_dag]`.padEnd(30) + `-> ${dagpris.toFixed(4)} kr/kWh`);
        
        await tag('nve_nett_pris_natt_helg', Number(nattPris));
        log(`🏷️  [nve_nett_pris_natt_helg]`.padEnd(30) + `-> ${nattPris.toFixed(4)} kr/kWh`);

        // Går gjennom kapasitetsleddene, runder av til hele kroner, og lagrer dem
        for (let k in cap) {
            const tagName = `nve_nett_cap_${k.replace('-', '_')}`;
            const rundetPris = Math.round(cap[k]); // Fastledd lagres som hele kroner
            await tag(tagName, Number(rundetPris));
            log(`🏷️  [${tagName}]`.padEnd(30) + `-> ${rundetPris} kr`);
        }

        log(`------------------------------------------------------------`);
        log(`✅ Suksess! Alle verdier er oppdatert.`);
        return true;

    } catch (e) {
        // Feilhåndtering som dumper feilmeldingen til Homey-loggen
        log(`🛑 KRITISK FEIL: ${e.message}`);
        return false;
    }
}

// Start skriptet
await oppdaterNettleieNVE();
