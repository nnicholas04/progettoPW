const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json()); 
app.use(express.static('public'));

let prenotazioni = [];

app.get('/api/menu', (req, res) => {
    try {
        const menuData = fs.readFileSync(path.join(__dirname, 'menu.json'), 'utf-8');
        res.status(200).json(JSON.parse(menuData));
    } catch (error) {
        res.status(500).json({ error: "Errore durante il caricamento del menu" });
    }
});

app.get('/api/prenotazioni', (req, res) => {
    res.status(200).json(prenotazioni);
});

app.get('/api/prenotazioni/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const prenotazione = prenotazioni.find(p => p.id === id);

    if (!prenotazione) {
        return res.status(404).json({ error: "Prenotazione non trovata" });
    }
    res.status(200).json(prenotazione);
});

app.post('/api/prenotazioni', (req, res) => {
    const { nome, telefono, data, ora, persone, note } = req.body;

    if (!nome || !telefono || !data || !ora || !persone) {
        return res.status(400).json({ error: "Dati mancanti: compila tutti i campi obbligatori." });
    }

    const nuovaPrenotazione = {
        id: prenotazioni.length + 1,
        nome,
        telefono,
        data,
        ora,
        persone,
        note: note || "",
        status: "confermata"
    };

    prenotazioni.push(nuovaPrenotazione);
    res.status(201).json(nuovaPrenotazione);
});

app.listen(PORT, () => {
    console.log(`Server attivo! Visita http://localhost:${PORT}`);
});