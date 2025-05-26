const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const filePath = path.join(__dirname, '../data/admin.json');
const saltRounds = 10;

// Utility functions
function readAdminData() {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath));
}

function writeAdminData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Initialize admin (run once or through a secure endpoint)
router.post('/init', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required.' });

  const existing = readAdminData();
  if (existing) return res.status(409).json({ error: 'Admin already initialized.' });

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const admin = { username, password: hashedPassword };

  writeAdminData(admin);
  res.status(201).json({ message: 'Admin initialized successfully.' });
});

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = readAdminData();

  if (!admin || username !== admin.username) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  res.json({ message: 'Login successful', role: 'admin' });
});

module.exports = router;
