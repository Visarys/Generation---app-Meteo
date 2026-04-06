# Generation---app-Meteo
Panoramica del progetto

Questa app Meteo consente di ottenere i dati meteo correnti per una o più città. Recupera temperatura e descrizione del tempo tramite l’API Open-Meteo.

- Funzionalità chiave:
Chiamata API funzionante per recuperare dati meteo
Gestione degli errori per città non valide e problemi di rete
Supporto per più città contemporaneamente
Caching dei dati per 1 ora
Sicurezza: chiavi API in variabili di ambiente
Documentazione chiara e commenti nel codice

- Istruzioni di installazione:
1. Clonare il progetto

2. Creare un file .env con la chiave API:
	WEATHER_API_KEY=la_tua_chiave_api

3. Installare le dipendenze (se necessario, ad esempio Node.js)

4. Eseguire lo script:
   node meteo.js


- Guida all’utilizzo:
Inserire i nomi delle città in un array
Chiamare la funzione getWeather(cities)
Ricevere un array di oggetti con city, temperature, description e source (API o cache)

- Miglioramenti futuri
Supporto per previsioni meteo per più giorni
Implementazione offline più avanzata

- Considerazioni di sicurezza
Chiavi API memorizzate in variabili di ambiente
Dati utente gestiti solo se necessario, senza esposizione
Controllo licenze librerie di terze parti
