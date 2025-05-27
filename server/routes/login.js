const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

// Map user types to corresponding data files
const fileMap = {
  patient: 'patients.json',
  doctor: 'doctors.json',
  pharmacy: 'pharmacies.json',
  hospital: 'hospitals.json',
  admin: 'admins.json'
};

// Load users from the file
function loadUsersFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// POST /api/login  <-- This is the actual path after mounting in index.js
router.post('/', async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).json({ error: 'Email, password, and user type are required.' });
  }

  const filename = fileMap[userType.toLowerCase()];
  if (!filename) {
    return res.status(400).json({ error: 'Invalid user type.' });
  }

  const filePath = path.join(__dirname, `../data/${filename}`);
  const users = loadUsersFromFile(filePath);
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Success
  res.status(200).json({
    message: 'Login successful',
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

module.exports = router;
