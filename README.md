# Introduzione a The Rock Cafe Web App 🍻

Progetto realizzato per la digitalizzazione del menu e la gestione delle prenotazioni di un pub. Il singolo utente può esplorare i prodotti divisi per categorie ed effettuare la prenotazione di un tavolo con validazione in tempo reale di date e orari.

## Obiettivo del Progetto

L'applicazione permette agli utenti di visualizzare un catalogo di prodotti aggiornato, leggere le descrizioni, consultare i vari formati/prezzi e inviare una prenotazione al server con un'interfaccia interattiva che previene errori (es. date passate o orari già trascorsi).

## Linguaggi Utilizzati

*   **Frontend:** HTML5 Semantico, CSS3 (Flexbox/Grid), JavaScript (Vanilla).
*   **Backend:** Node.js con Express.
*   **Database:** File system basato su formato JSON (`menu.json`) per il catalogo e memoria volatile (array) per le prenotazioni.

## Funzionalità Principali

*   Visualizzazione del catalogo prodotti caricati in modo asincrono (fetch API).
*   Prodotti divisi per categoria (food, sfiziosità, birre, cocktail, ecc.).
*   Gestione dinamica dei prezzi e delle varianti (es. birra piccola e media).
*   Modulo di prenotazione con validazione intelligente di data e orario.
*   Gestione tramite server degli stati (caricamento, liste vuote, successi ed errori di rete).

## Struttura delle Cartelle

Il progetto è diviso in logica server e file statici:
*   `/server.js` - Il file principale del server backend in ascolto sulla porta 3000.
*   `/menu.json` - Il database locale che funge da sorgente dati per le categorie e i prodotti.
*   `/specifiche/` - Cartella contenente la documentazione d'esame e gli scenari di test.
*   `/public/` - La cartella servita staticamente che contiene il frontend:
    *   `index.html` - Homepage di presentazione del locale.
    *   `menu.html` - Vetrina dinamica del catalogo.
    *   `contatti.html` - Pagina con mappa, orari e modulo di prenotazione.
    *   `style.css` - Foglio di stile CSS puro (variabili :root, responsive).
    *   `script.js` - Gestione degli eventi, observer, chiamate HTTP e validazione form.

## Istruzioni per l'Avvio

Per testare il progetto in locale, segui questi passaggi:
1. Apri il terminale nella cartella principale del progetto.
2. Installa le dipendenze (express) necessarie avviando il comando: 
   `npm install`
3. Avvia il server Node.js tramite questo comando:
   `npm start`

Il server si avvierà in locale su `http://localhost:3000`, dove sia il Frontend che il Backend comunicheranno sullo stesso server.

## Funzionalità Extra

Per quanto riguarda le funzionalità extra, ho deciso di implementare le seguenti logiche avanzate:
*   **Filtro Intelligente Orari Notturni:** Poiché il pub chiude alle 02:00, ho implementato un algoritmo matematico in JS che converte gli orari in minuti totali, aggiungendo 24 ore agli slot tra mezzanotte e chiusura, per permettere al sistema di filtrare correttamente gli orari passati nella giornata odierna senza rompere la logica temporale.
*   **Parsing Dinamico dei Prezzi multipli:** Se un prodotto (es. una birra alla spina) ha più formati, il backend invia una stringa separata da un carattere speciale (`|`). Il frontend è in grado di intercettarlo, splittarlo e generare layout multipli al posto del prezzo singolo standard.
*   **Observer Dinamico:** L'`IntersectionObserver` per le animazioni di base viene riagganciato asincronamente in tempo reale ai nuovi elementi HTML non appena vengono iniettati dalla `fetch` del backend.

## Note sull'uso dell'AI

**Strumenti utilizzati:**
Durante lo sviluppo mi sono fatto aiutare da intelligenze artificiali per ottimizzare la struttura di alcune logiche complesse e per il debug di errori asincroni.

**Parti generate con l'aiuto dell'AI:**
*   La struttura base del file `server.js` per gestire l'API REST e le regole di routing di Express.
*   La logica matematica per gestire e confrontare correttamente gli orari a cavallo della mezzanotte (00:00 - 02:00) nel modulo di prenotazione.
*   La spiegazione teorica e l'impostazione base dell'`IntersectionObserver` per sostituire l'evento di scroll classico e migliorare le prestazioni.

**Prompt di esempio utilizzati:**
*   *"Ho un menu a tendina con degli orari dalle 18:00 alle 02:00. Come faccio in JavaScript a nascondere gli orari già passati se l'utente seleziona la data di oggi, considerando che le 01:00 matematicamente sono prima delle 23:00 ma nel turno del pub vengono dopo?"*
*   *"Come posso leggere un file locale menu.json usando Node.js ed Express e inviarlo al frontend quando faccio una richiesta GET?"*

**Parti modificate e scritte manualmente:**
*   **Struttura HTML semantica:** Tutta l'architettura delle 3 pagine.
*   **Integrazione tra Frontend e Backend:** Costruzione manuale della manipolazione del DOM partendo dai dati del JSON.
*   **Design e CSS:** Organizzazione completa del foglio di stile style.css.
*   **Dataset:** Creazione e popolamento del database dei prodotti `menu.json`.