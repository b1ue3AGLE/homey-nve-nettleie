NVE Nettleie-henter for Homey Pro 🇳🇴
Dette skriptet henter offisielle nettleiepriser (energiledd og kapasitetsledd) direkte fra NVEs API (Grid Tariffs API). Det er spesialtilpasset for å fungere sømløst med Strømregning-appen i Homey for presis kostnadskontroll.

✨ Funksjoner
Automatisk konvertering: Regner om fra øre til kroner (kr/kWh) for å unngå "0-feil" i Strømregning-appen (viktig for Homey Pro 2023).

Intelligent database: Skriptet gjenkjenner automatisk om ditt nettselskap har identiske priser i flere fylker og serverer den enkleste konfigurasjonen (støtter 72 unike prismodeller, inkludert Glitre og Tensio).

Look-back algoritme: Fyller automatisk ut "hull" i kapasitetsledd-data ved å arve pris fra nærmeste definerte trinn.

Smart dato-håndtering: Henter automatisk priser for en representativ hverdag (neste mandag) hvis skriptet kjøres i en helg.

Universal: Støtter både Husholdning og Hytter og fritidshus.

⚡️ Flow-oppsett
For å automatisere oppdateringen, bør du sette opp en Flow som kjører skriptet og kobler verdiene (Tags) til Strømregning-appen.

Slik gjør du det:

Trigger: Sett en tid (f.eks. hver natt kl. 00:05 eller ukentlig).

Action 1 (HomeyScript): Kjør skriptet hent_nve_nettleie og bruk nettselskapets ID som argument (f.eks. elvia).

Action 2 (Strømregning-app): Bruk kortet "Oppdatér innstillinger for nettleie kapasitetsledd" og koble til de numeriske taggene nve_nett_cap_0_2 osv.

Action 3 (Strømregning-app): Bruk kortet "Oppdatér innstillinger for nettleie energiledd" og koble til nve_nett_pris_dag og nve_nett_pris_natt_helg.

🛠 Innhold i prosjektet
hent_nve_nettleie.js: Hovedskriptet som utfører selve oppdateringen.

hent_nve_nettselskaper.js: Startpunktet! Brukes for å finne den nøyaktige ID-en til ditt nettselskap (f.eks. glitre_agder).

test_nve_kapasitetledd.js: Verifiserer kun fastledd og kapasitetstrinn.

test_nve_energiledd.js: Verifiserer rådata for dag- og nattpriser.

Utviklet av Glenn Pedersen i samarbeid med Homey-miljøet. Takk til Tom Andreas H. Abrahamsen og Kai Engvik for bidrag til feilretting og testing.
