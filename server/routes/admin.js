const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// File paths
const dataDir = path.join(__dirname, '../data');
const files = {
  patients: path.join(dataDir, 'patients.json'),
  doctors: path.join(dataDir, 'doctors.json'),
  hospitals: path.join(dataDir, 'hospitals.json'),
  pharmacies: path.join(dataDir, 'pharmacies.json'),
  records: path.join(dataDir, 'records.json'),
};

// Utility to read JSON
function readData(filePath) {
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath));
}

// Get summary stats
router.get('/stats', (req, res) => {
  const stats = {
    patients: readData(files.patients).length,
    doctors: readData(files.doctors).length,
    hospitals: readData(files.hospitals).length,
    pharmacies: readData(files.pharmacies).length,
    records: readData(files.records).length,
  };
  res.json(stats);
});

// Get full data
router.get('/all', (req, res) => {
  const data = {
    patients: readData(files.patients),
    doctors: readData(files.doctors),
    hospitals: readData(files.hospitals),
    pharmacies: readData(files.pharmacies),
    records: readData(files.records),
  };
  res.json(data);
});

module.exports = router;
