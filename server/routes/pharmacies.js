const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const filePath = path.join(__dirname, '../data/pharmacies.json');
const saltRounds = 10;

function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Get all pharmacies (without passwords)
router.get('/', (req, res) => {
  const pharmacies = readJSON(filePath);
  res.json(pharmacies.map(d => {
    const { password, ...rest } = d;
    return rest;
  }));
});

// Register new pharmacy
router.post('/', async (req, res) => {
  const { name, email, phone, password, licenseNumber, location } = req.body;

  if (!name || !email || !phone || !password || !licenseNumber || !location) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const pharmacies = readJSON(filePath);
  const existing = pharmacies.find(p => p.email === email);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const maxId = pharmacies.length > 0 ? Math.max(...pharmacies.map(h => h.id)) : 0;


  const newPharmacy = {
    id: maxId + 1,
    name,
    email,
    phone,    
    licenseNumber,
    password: hashedPassword,
    location,
    role: 'pharmacy'
  };

  pharmacies.push(newPharmacy);
  writeJSON(filePath, pharmacies);

  const { password: _, ...responseData } = newPharmacy;
  res.status(201).json(responseData);
});

module.exports = router;
