// server/routes/pharmacies.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/pharmacies.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const pharmacies = readJSON(filePath);
  res.json(pharmacies);
});

router.post('/', (req, res) => {
  const { name, email, license, location } = req.body;

  if (!name || !email || !license || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const pharmacies = readJSON(filePath);
  const newPharmacy = {
    id: Date.now(),
    name,
    email,
    license,
    location
  };

  pharmacies.push(newPharmacy);
  writeJSON(filePath, pharmacies);

  res.status(201).json(newPharmacy);
});

module.exports = router;
