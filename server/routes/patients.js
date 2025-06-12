const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const filePath = path.join(__dirname, '../data/patients.json');
const saltRounds = 10;

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
  res.json(patients.map(p => {
    const { password, ...rest } = p; // Hide passwords
    return rest;
  }));
});

// Register new patient
router.post('/', async (req, res) => {
  const { name, email, phone, password, payment, location } = req.body;

  if (!name || !email || !phone || !password || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  if (payment < 1500) {
    return res.status(400).json({ error: 'Minimum payment is ₦1500.' });
  }

  const patients = readJSON(filePath);

  // Check if email already exists
  const existing = patients.find(p => p.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Find max ID and assign next one
  const maxId = patients.length > 0 ? Math.max(...patients.map(p => p.id)) : 0;

  const newPatient = {
    id: maxId + 1,
    name,
    email,
    phone,    
    password: hashedPassword,
    payment,
    location, 
    assignedDoctorId: null,
    assignedPharmacyId: null,
    assignedHospitalId: null,
    role: 'patient'
  };

  patients.push(newPatient);
  writeJSON(filePath, patients);

  const { password: _, ...userData } = newPatient;
  res.status(201).json(userData);
});


module.exports = router;
