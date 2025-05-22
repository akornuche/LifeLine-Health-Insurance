// server/routes/hospitals.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/hospitals.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  const hospitals = readJSON(filePath);
  res.json(hospitals);
});

router.post('/', (req, res) => {
  const { name, email, license, location } = req.body;

  if (!name || !email || !license || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const hospitals = readJSON(filePath);
  const newHospital = {
    id: Date.now(),
    name,
    email,
    license,
    location
  };

  hospitals.push(newHospital);
  writeJSON(filePath, hospitals);

  res.status(201).json(newHospital);
});

module.exports = router;
