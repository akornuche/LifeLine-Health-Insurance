// server/routes/patients.js
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/patients.json');

// Utility to read/write JSON
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all patients
router.get('/', (req, res) => {
  const patients = readJSON(filePath);
  res.json(patients);
});

// Register new patient
router.post('/', (req, res) => {
  const { name, email, payment, dependents = [], location } = req.body;

  if (!name || !email || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (payment < 1500) {
    return res.status(400).json({ error: 'Minimum payment is ₦1500.' });
  }

  if (dependents.length > 4) {
    return res.status(400).json({ error: 'Only up to 4 dependents allowed.' });
  }

  const patients = readJSON(filePath);

  const newPatient = {
    id: Date.now(),
    name,
    email,
    payment,
    location, // { lat, lng }
    dependents,
    assignedDoctorId: null,
    assignedPharmacyId: null,
    assignedHospitalId: null
  };

  patients.push(newPatient);
  writeJSON(filePath, patients);

  res.status(201).json(newPatient);
});

module.exports = router;
