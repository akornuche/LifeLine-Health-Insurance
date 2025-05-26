const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Paths to JSON files
const files = {
  patients: path.join(__dirname, '../data/patients.json'),
  doctors: path.join(__dirname, '../data/doctors.json'),
  pharmacies: path.join(__dirname, '../data/pharmacies.json'),
  hospitals: path.join(__dirname, '../data/hospitals.json'),
  records: path.join(__dirname, '../data/records.json'),
};

// Utility
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

// 🧑‍⚕️ Patient Dashboard
router.get('/patient/:id', (req, res) => {
  const patients = readJSON(files.patients);
  const records = readJSON(files.records);
  const patient = patients.find(p => p.id == req.params.id);
  const patientRecords = records.filter(r => r.patientId == req.params.id);

  if (!patient) return res.status(404).json({ error: 'Patient not found' });

  res.json({
    profile: patient,
    records: patientRecords
  });
});

// 🩺 Doctor Dashboard
router.get('/doctor/:id', (req, res) => {
  const doctors = readJSON(files.doctors);
  const patients = readJSON(files.patients);
  const doctor = doctors.find(d => d.id == req.params.id);
  const assignedPatients = patients.filter(p => p.assignedDoctorId == req.params.id);

  if (!doctor) return res.status(404).json({ error: 'Doctor not found' });

  res.json({
    profile: doctor,
    assignedPatients
  });
});

// 🏥 Hospital Dashboard
router.get('/hospital/:id', (req, res) => {
  const hospitals = readJSON(files.hospitals);
  const patients = readJSON(files.patients);
  const hospital = hospitals.find(h => h.id == req.params.id);
  const assignedPatients = patients.filter(p => p.assignedHospitalId == req.params.id);

  if (!hospital) return res.status(404).json({ error: 'Hospital not found' });

  res.json({
    profile: hospital,
    assignedPatients
  });
});

// 💊 Pharmacy Dashboard
router.get('/pharmacy/:id', (req, res) => {
  const pharmacies = readJSON(files.pharmacies);
  const patients = readJSON(files.patients);
  const pharmacy = pharmacies.find(ph => ph.id == req.params.id);
  const assignedPatients = patients.filter(p => p.assignedPharmacyId == req.params.id);

  if (!pharmacy) return res.status(404).json({ error: 'Pharmacy not found' });

  res.json({
    profile: pharmacy,
    assignedPatients
  });
});

// 👨‍💼 Admin Dashboard
router.get('/admin', (req, res) => {
  res.json({
    patients: readJSON(files.patients),
    doctors: readJSON(files.doctors),
    hospitals: readJSON(files.hospitals),
    pharmacies: readJSON(files.pharmacies),
    records: readJSON(files.records)
  });
});

module.exports = router;
