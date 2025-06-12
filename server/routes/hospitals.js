const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const filePath = path.join(__dirname, '../data/hospitals.json');
const saltRounds = 10;

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all hospitals (without passwords)
router.get('/', (req, res) => {
  const hospitals = readJSON(filePath);
  res.json(hospitals.map(d => {
    const { password, ...rest } = d;
    return rest;
  }));
});

// Register new hospital
router.post('/', async (req, res) => {
  const { name, email, password, licenseNumber, phone, location } = req.body;

  if (!name || !email || !password || !licenseNumber || phone || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const hospitals = readJSON(filePath);
  const existing = hospitals.find(h => h.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const maxId = hospitals.length > 0 ? Math.max(...hospitals.map(h => h.id)) : 0;

  const newHospital = {
    id: maxId + 1,
    name,
    email,
    phone,    
    licenseNumber,
    password: hashedPassword,
    location,
    role: 'hospital'
  };

  hospitals.push(newHospital);
  writeJSON(filePath, hospitals);

  const { password: _, ...responseData } = newHospital;
  res.status(201).json(responseData);
});


module.exports = router;