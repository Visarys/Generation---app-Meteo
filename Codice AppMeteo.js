/**
 * App Meteo – Versione aggiornata
 * 
 * Funzionalità:
 * - Recupera dati meteo correnti per più città usando l'API Open-Meteo
 * - Gestione degli errori per città non valide, problemi di rete e API
 * - Memorizzazione nella cache dei dati per migliorare prestazioni e ridurre chiamate API
 * - Sicurezza: chiavi API in variabili di ambiente
 * - Documentazione chiara e leggibile
 */

require('dotenv').config();
const API_KEY = process.env.WEATHER_API_KEY;

// Cache in memoria per ridurre chiamate API
const weatherCache = {};

/**
 * Salva dati nella cache con timestamp
 * @param {string} key - Chiave della cache (es. "weather_london")
 * @param {Object} data - Dati da memorizzare
 */
function saveToCache(key, data) {
    weatherCache[key] = { data, timestamp: Date.now() };
}

/**
 * Recupera dati dalla cache se non scaduti
 * @param {string} key - Chiave della cache
 * @returns {Object|null} - Dati dalla cache o null se non disponibili
 */
function getFromCache(key) {
    const record = weatherCache[key];
    if (!record) return null;
    // Cache valida per 1 ora
    if (Date.now() - record.timestamp < 3600000) return record.data;
    return null;
}

/**
 * Recupera dati meteo per un elenco di città
 * @param {Array<string>} cities - Lista di nomi città
 * @returns {Array<Object>} - Array di oggetti con nome città, temperatura e descrizione
 */
async function getWeather(cities) {
    const results = [];
    for (const city of cities) {
        const cacheKey = `weather_${city.toLowerCase()}`;
        const cachedData = getFromCache(cacheKey);
        if (cachedData) {
            results.push({ city, ...cachedData, source: 'cache' });
            continue;
        }

        try {
            // Chiamata API di geocoding
            const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`);
            const geoData = await geoRes.json();

            if (!geoData.results?.length) {
                results.push({ city, error: "Città non trovata" });
                continue;
            }

            const { latitude, longitude, name } = geoData.results[0];

            // Chiamata API Open-Meteo
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
            const weatherData = await weatherRes.json();

            if (!weatherData.current_weather) {
                results.push({ city: name, error: "Dati meteo non disponibili" });
                continue;
            }

            const temp = weatherData.current_weather.temperature;
            const weatherCode = weatherData.current_weather.weathercode;
            const description = {
                0: "Sereno",
                1: "Parzialmente nuvoloso",
                2: "Nuvoloso",
                3: "Coperto"
            }[weatherCode] || "Dati non disponibili";

            const result = { temperature: temp, description };
            saveToCache(cacheKey, result);

            results.push({ city: name, ...result, source: 'API' });

        } catch (error) {
            results.push({ city, error: "Errore di rete o API" });
        }
    }
    return results;
}

// Esempio d'uso
getWeather(["Tokyo", "New York", "London"]).then(console.log);