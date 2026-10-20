# Specifiche del Progetto: Applicazione Web per Pub

## 1. Obiettivo dell'applicazione
L'applicazione web ha lo scopo di digitalizzare la presenza e i servizi essenziali di un pub, fornendo uno strumento rapido per consultare l'offerta gastronomica e automatizzare il flusso delle prenotazioni.

Il sistema risolve due problematiche concrete:
- Consultazione dell'offerta: sostituisce i tradizionali menu cartacei con un catalogo digitale aggiornato in tempo reale, accessibile da qualsiasi dispositivo senza installare applicazioni esterne.
- Gestione delle prenotazioni: elimina la dipendenza esclusiva da contatti telefonici o messaggi sparsi, accentrando le richieste su un server Node.js con riscontro immediato per l'utente.

Il servizio è rivolto a:
- Clienti del locale che desiderano riservare un tavolo in anticipo o visionare listino e prezzi prima di arrivare.
- Nuovi visitatori interessati all'atmosfera, alla posizione geografica e agli orari del pub.

---

## 2. Cosa può fare l'utente
Le interazioni disponibili per l'utente finale comprendono:
- Navigazione del catalogo: visualizzare i prodotti suddivisi per sezioni (Food, Sfiziosità, Birre, Cocktail, Liquori, Soft Drink, Dessert), consultando per ciascuno ingredienti, descrizioni e fasce di prezzo, incluse le varianti di formato per le birre alla spina.
- Compilazione del modulo di prenotazione: inserire nome, recapito telefonico, data, orario desiderato, numero di persone ed eventuali note aggiuntive.
- Fruizione di controlli guidati sull'orario: il sistema blocca la scelta di date già passate e, in caso di prenotazione per la giornata odierna, esclude in automatico gli orari precedenti all'ora attuale del dispositivo.
- Verifica dell'esito: visualizzare lo stato di avanzamento della richiesta tramite feedback sul pulsante (Invio in corso...) e ricevere una conferma visiva contenente l'ID univoco generato dal server una volta registrata la prenotazione.

---

## 3. Struttura del frontend
L'applicazione è strutturata su tre pagine web collegate da una barra di navigazione fissa in alto:

- Home Page (index.html):
Presentazione generale del locale tramite layout visivo con logo e sfondo tematico. Include sezioni informative con cenni sull'offerta, collegamenti rapidi verso il menu e la pagina dei contatti, e un footer con recapiti e orari.

- Menu Digitale (menu.html):
Catalogo dei prodotti organizzato in griglie ordinate per categoria. I dati vengono recuperati dinamicamente tramite API REST: l'utente visualizza prima un indicatore di caricamento e successivamente le schede dei prodotti, animate allo scorrimento della pagina. In caso di indisponibilità del server, viene mostrato un messaggio di errore chiaro all'interno delle categorie.

- Contatti e Prenotazioni (contatti.html):
Contiene le informazioni pratiche sul locale (indirizzo, telefono, orari) e il modulo interattivo per la prenotazione con campi vincolati, gestione automatica degli orari validi e invio asincrono dei dati.

---

## 4. Mockup minimale
L'impostazione visiva e la disposizione dei componenti principali (layout della vetrina menu e modulo di prenotazione) sono schematizzate nel seguente bozzetto:

![Mockup dell'interfaccia](mockup.png)

---

## 5. Scenari di test

- Scenario 1: Caricamento asincrono del menu
Azione: L'utente accede alla pagina menu.html.
Comportamento atteso: Compare inizialmente la dicitura "Caricamento menu in corso..."; non appena arrivano i dati dal backend Node.js (GET /api/menu), la scritta provvisoria scompare e i prodotti vengono inseriti nelle rispettive griglie comparendo con animazione durante lo scorrimento.

- Scenario 2: Invio corretto della prenotazione
Azione: L'utente compila tutti i campi obbligatori su contatti.html e preme "Invia Prenotazione".
Comportamento atteso: Il pulsante si disabilita mostrando la dicitura "Invio in corso...". Al termine dell'elaborazione della richiesta (POST /api/prenotazioni), compare un messaggio a schermo con l'ID assegnato dal server, i campi del modulo vengono svuotati e il pulsante torna cliccabile.

- Scenario 3: Tentativo di selezione di una data passata
Azione: L'utente prova a impostare nel calendario una data antecedente a quella odierna.
Comportamento atteso: Il calendario impedisce la selezione dei giorni passati tramite l'attributo minimo impostato. Se l'utente forza l'inserimento manuale, un avviso segnala l'errore e reimposta automaticamente il campo alla data di oggi.

- Scenario 4: Filtro orari per prenotazione odierna
Azione: L'utente seleziona la data di oggi per prenotare un tavolo.
Comportamento atteso: Il menu a tendina mostra soltanto gli slot orari successivi all'orario attuale dell'orologio di sistema, gestendo correttamente anche le ore notturne oltre la mezzanotte.

- Scenario 5: Gestione assenza di connessione o server spento
Azione: L'utente apre la pagina del menu mentre il server Node.js non è in esecuzione.
Comportamento atteso: Il codice intercetta l'errore di rete e mostra all'interno delle categorie il messaggio "Impossibile caricare i dati. Controlla la connessione al server.", evitando il blocco della pagina.