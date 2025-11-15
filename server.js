// express und sqlite3 importieren
// diese Datei ist Teil eines einfachen Backend-Servers, der Express und SQLite3 verwendet.
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Port für den Server
const port = 3000;

// neue Datenbank erstellen/starten
const db = new sqlite3.Database('test.db', (err) => {});

db.serialize(() => {
  // Tabelle für Wohnungen
  db.run(`
    CREATE TABLE IF NOT EXISTS apartments (
      id INTEGER PRIMARY KEY,
      name TEXT,
      room_type TEXT,
      neighbourhood TEXT,
      price REAL,
      bedrooms INTEGER,
      picture_url TEXT,
      rating INTEGER,
      reviews INTEGER
    )
  `);

  // Tabelle für Nutzer
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);

  // Tabelle für Buchungen
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      apartment_id INTEGER,
      date TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(apartment_id) REFERENCES apartments(id)
    )
  `);

  // Tabelle für Bewertungen
  db.run(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      listing_id INTEGER,
      reviewer_name TEXT,
      comments TEXT
    )
  `);

  // Tabelle für Kalenderdaten zur Verfügbarkeit
  db.run(`
    CREATE TABLE IF NOT EXISTS calendar (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      apartment_id INTEGER,
      date TEXT,
      available TEXT CHECK(available IN ('t','f')),
      minimum_nights INTEGER,
      maximum_nights INTEGER,
      FOREIGN KEY(apartment_id) REFERENCES apartments(id)
    )   
  `);
});

// fs = File-System, STEHEN LASSEN, WIRD GGF. NOCH BENÖTIGT UM USERDATEN UND BUCHUNGSDATEN ZU ERSTELLEN!!
const fs = require('fs');


// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Beispiel-API, richtige APIs folgen
app.get('/api/status', (req, res) => {
  res.json({ message: 'Backend läuft!' });
});

// API zum Abrufen der Wohnungsdaten aus der Datenbank statt aus der JSON-Datei
app.get('/api/apartments', (req, res) => {
  db.all(`SELECT * FROM apartments`, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API zum Abrufen der einzelnen Wohnungsdetailseiten
app.get('/api/apartments/:id', (req, res) => {
  const id = req.params.id;
  db.get(`SELECT * FROM apartments WHERE id = ?`, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Wohnung nicht gefunden" });
    res.json(row);
  });
});

// API zum Abrufen der Bewertungen aus der Datenbank
app.get('/api/reviews', (req, res) => {
  db.all(`SELECT * FROM reviews`, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API zum Abrufen der Kalenderdaten
app.get('/api/calendar/:apartment_id', (req, res) => {
  const id = req.params.apartment_id;
  db.all(`SELECT * FROM calendar WHERE apartment_id = ?`, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});


// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf Port ${port}`);
});

