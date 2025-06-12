const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// File paths
const patientsFile = path.join(__dirname, '../data/patients.json');
const paymentsFile = path.join(__dirname, '../data/payments.json');

// Helpers
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// POST /api/payment - Record payment and update patient
router.post('/', (req, res) => {
  const { email, amount, method } = req.body;

  if (!email || !amount || !method) {
    return res.status(400).json({ error: 'Email, amount, and method are required.' });
  }

  // Load users and validate patient exists
  const users = readJSON(patientsFile);
  const userIndex = users.findIndex(u => u.email === email);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  // Set expiry date for 1 year
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

  users[userIndex].paymentStatus = 'paid';
  users[userIndex].paymentExpires = oneYearFromNow.toISOString();
  writeJSON(patientsFile, users);

  // Load existing payments
  const payments = readJSON(paymentsFile);
  const newPayment = {
    id: payments.length + 1,
    patientId: email,
    amount,
    date: new Date().toISOString(),
    status: 'paid',
    method
  };
  payments.push(newPayment);
  writeJSON(paymentsFile, payments);

  res.json({
    message: 'Payment successful',
    paymentExpires: users[userIndex].paymentExpires,
    paymentId: newPayment.id
  });
});

module.exports = router;
