const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const filePath = path.join(__dirname, '../data/doctors.json');
const saltRounds = 10;

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all doctors (without passwords)
router.get('/', (req, res) => {
  const doctors = readJSON(filePath);
  res.json(doctors.map(d => {
    const { password, ...rest } = d;
    return rest;
  }));
});

// Register new doctor
router.post('/', async (req, res) => {
  const { name, email, password, licenseNumber, specialization, location } = req.body;

  if (!name || !email || !password || !licenseNumber || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const doctors = readJSON(filePath);
  const existing = doctors.find(d => d.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newDoctor = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
    licenseNumber,
    specialization,
    location,
    role: 'doctor'
  };

  doctors.push(newDoctor);
  writeJSON(filePath, doctors);

  const { password: _, ...responseData } = newDoctor;
  res.status(201).json(responseData);
});


module.exports = router;