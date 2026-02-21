# homey-nve-nettleie
homey-pro  nve  nettleie  javascript  smart-home
# NVE Nettleie-henter for Homey Pro 🇳🇴

Dette skriptet henter offisielle nettleiepriser (energiledd og kapasitetsledd) direkte fra NVEs API. Det er spesialtilpasset for å fungere sømløst med **Strømregning-appen** i Homey.

## Funksjoner
* **Automatisk konvertering:** Regner om fra øre til kroner (kr/kWh) for å unngå "0-feil" i Strømregning-appen.
* **Universal:** Fungerer for alle norske nettselskaper via NVE-databasen.
* **Støtter Tariffgrupper:** Velg mellom `Husholdning` eller `Hyttter og fritidshus`.
* **Smart dato:** Henter automatisk priser for neste arbeidsdag hvis det kjøres i helgen.

## Oppsett
1. Kopier koden fra `hent_nve_nettleie.js` i dette prosjektet.
2. Opprett et nytt skript i Homey Web App.
3. Tilpass `NETTSELSKAP` øverst i koden til ditt selskap (f.eks. "Elvia").
