/**
 * NVE ENERGI-PRIS TESTER v1.1
 * Tvinger sjekk på en hverdag (Mandag) for å se reell tariff-forskjell.
 */

async function testEnergiPriserHverdag() {
 const db = {
   "alut": { "org": "925336637", "fylke": "56" },
   "area": { "org": "923993355", "fylke": "56" },
   "arva": { "org": "979151950", "fylke": "55" },
   "arva_*": { "org": "979151950", "fylke": "55" },
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
   "glitre": { "org": "982974011", "fylke": "03" },
   "glitre_akershus": { "org": "982974011", "fylke": "32" },
   "glitre_ostfold": { "org": "982974011", "fylke": "31" },
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
   "tensio_tn": { "org": "988807648", "fylke": "18" },
   "tensio_tn_trondelag": { "org": "988807648", "fylke": "50" },
   "tensio_ts": { "org": "978631029", "fylke": "34" },
   "uvdal_kraftforsyning": { "org": "967670170", "fylke": "33" },
   "vang_energiverk": { "org": "824368082", "fylke": "46" },
   "vestall": { "org": "968168134", "fylke": "55" },
   "vestmar": { "org": "979399901", "fylke": "40" },
   "vevig": { "org": "916319908", "fylke": "34" },
   "viermie": { "org": "919884452", "fylke": "34" },
   "vissi": { "org": "921683057", "fylke": "55" }
};
---------------------------
📊 Resultat: 71 unike prismodeller funnet.

———————————————————
✅ Script Success
↩️ Returned: undefined

--- KOPIER DENNE BLOKKEN (v6.1) ---
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
  // Logikk for å finne nærmeste mandag
  const idag = new Date();
  const dagNr = idag.getDay();
  const diff = dagNr === 0 ? -6 : 1 - dagNr; // Finn mandag denne uken
  const mandag = new Date(idag);
  mandag.setDate(idag.getDate() + diff);
  const datoStreng = mandag.toISOString().split('T')[0];

  const selskaper = Object.keys(db);
  
  log(`📊 ANALYSE: HVERDAGSPRISER (Sjekker mandag ${datoStreng})`);
  log(`------------------------------------------------------------`);

  for (const navn of selskaper) {
    const info = db[navn];
    const url = `https://nettleietariffer.dataplattform.nve.no/v1/NettleiePerOmradePrTimeHusholdningFritidEffekttariffer?ValgtDato=${datoStreng}&Tariffgruppe=Husholdning&FylkeNr=${info.fylke}&OrganisasjonsNr=${info.org}`;
    
    try {
      const res = await fetch(url);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const dag = data.find(o => o.time === 12)?.energileddInk || 0;
        const natt = data.find(o => o.time === 0)?.energileddInk || 0;
        const diffPris = (dag - natt).toFixed(2);
        
        let merknad = diffPris > 0 ? `🌙 Billigere natt (-${diffPris})` : `⚖️ Lik pris`;
        log(`${navn.padEnd(25)} | Dag: ${dag.toFixed(2).padStart(6)} | Natt: ${natt.toFixed(2).padStart(6)} | ${merknad}`);
      } else {
        log(`${navn.padEnd(25)} | ❌ INGEN DATA`);
      }
    } catch (e) {
      log(`${navn.padEnd(25)} | 🔥 FEIL`);
    }
  }

  log(`------------------------------------------------------------`);
  log(`🏁 Test ferdig.`);
}

await testEnergiPriserHverdag();
