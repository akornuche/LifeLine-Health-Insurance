// server/routes/doctors.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/doctors.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all doctors
router.get('/', (req, res) => {
  const doctors = readJSON(filePath);
  res.json(doctors);
});

// Register doctor
router.post('/', (req, res) => {
  const { name, email, license, location } = req.body;

  if (!name || !email || !license || !location) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const doctors = readJSON(filePath);
  const newDoctor = {
    id: Date.now(),
    name,
    email,
    license,
    location
  };

  doctors.push(newDoctor);
  writeJSON(filePath, doctors);

  res.status(201).json(newDoctor);
});

module.exports = router;
