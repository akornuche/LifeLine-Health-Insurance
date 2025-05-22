const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/records.json');

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all records
router.get('/', (req, res) => {
  const records = readJSON(filePath);
  res.json(records);
});

// Get records for a specific patient
router.get('/:patientId', (req, res) => {
  const { patientId } = req.params;
  const records = readJSON(filePath).filter(r => r.patientId == patientId);
  res.json(records);
});

// Create a new record
router.post('/', (req, res) => {
  const { patientId, doctorId, hospitalId, diagnosis, prescription } = req.body;

  if (!patientId || !doctorId || !hospitalId || !diagnosis || !prescription) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const records = readJSON(filePath);
  const newRecord = {
    id: Date.now(),
    patientId,
    doctorId,
    hospitalId,
    diagnosis,
    prescription,
    date: new Date().toISOString(),
    transferredToHospitalId: null
  };

  records.push(newRecord);
  writeJSON(filePath, records);

  res.status(201).json(newRecord);
});

// Transfer record to another hospital
router.put('/transfer/:recordId', (req, res) => {
  const { recordId } = req.params;
  const { transferredToHospitalId } = req.body;

  if (!transferredToHospitalId) {
    return res.status(400).json({ error: 'Transferred hospital ID required.' });
  }

  const records = readJSON(filePath);
  const recordIndex = records.findIndex(r => r.id == recordId);

  if (recordIndex === -1) {
    return res.status(404).json({ error: 'Record not found.' });
  }

  records[recordIndex].transferredToHospitalId = transferredToHospitalId;
  writeJSON(filePath, records);

  res.json({ message: 'Record transferred.', record: records[recordIndex] });
});

module.exports = router;
