const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

// ===== File Mapping =====
const fileMap = {
  patient: 'patients.json',
  doctor: 'doctors.json',
  pharmacy: 'pharmacies.json',
  hospital: 'hospitals.json',
  admin: 'admins.json'
};

// ===== Load Users =====
function loadUsersFromFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, 'utf-8');
  if (!data.trim()) return []; // Handle empty file
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error(`Failed to parse ${filePath}:`, err.message);
    return [];
  }
}


// ===== Log Login Attempts =====
const logFilePath = path.join(__dirname, '../logs/login-attempts.log');

function logLoginAttempt(email, userType, success, ip) {
  const timestamp = new Date().toISOString();
  const entry = `${timestamp} | ${ip} | ${userType} | ${email} | ${success ? 'SUCCESS' : 'FAILURE'}\n`;
  fs.appendFileSync(logFilePath, entry);
}

// ===== Rate Limiter (5 tries per 15 min) =====
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { error: 'Too many login attempts. Please try again later.' },
  keyGenerator: (req) => req.ip, // Identify by IP
  standardHeaders: true,
  legacyHeaders: false,
});

// ===== POST /api/login =====
router.post('/', loginLimiter, async (req, res) => {
  const { email, password, userType } = req.body;
  const ip = req.ip;

  if (!email || !password || !userType) {
    logLoginAttempt(email, userType, false, ip);
    return res.status(400).json({ error: 'Email, password, and user type are required.' });
  }

  const filename = fileMap[userType.toLowerCase()];
  if (!filename) {
    logLoginAttempt(email, userType, false, ip);
    return res.status(400).json({ error: 'Invalid user type.' });
  }

  const filePath = path.join(__dirname, `../data/${filename}`);
  const users = loadUsersFromFile(filePath);
  const user = users.find(u => u.email === email);

  if (!user) {
    logLoginAttempt(email, userType, false, ip);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    logLoginAttempt(email, userType, false, ip);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
console.log(`[LOGIN] Role returned: ${user.role}`);
  logLoginAttempt(email, userType, true, ip);

  // ✅ Success
res.status(200).json({
  message: 'Login successful',
  user: {
    id: user.id, // ✅ Include the user's unique ID (used as patientId)
    name: user.name,
    email: user.email,
    role: userType.toLowerCase(),
    gender: user.gender,      
    profileImage: user.photoUrl || '',  // Optional: include if available

    // ✅ Only include these fields if the user is a patient
    ...(user.role === 'patient' ? {
      paymentStatus: user.paymentStatus,
      paymentExpires: user.paymentExpires
    } : {})
  }
});

});


module.exports = router;
