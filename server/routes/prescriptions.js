const express = require('express');
const fs = require('fs');
const router = express.Router();
const filePath = 'data/prescriptions.json';

// GET all prescriptions
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
});

// PATCH: update prescription status
router.patch('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  let prescriptions = JSON.parse(fs.readFileSync(filePath));
  const index = prescriptions.findIndex(p => p.id === parseInt(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Prescription not found' });
  }

  prescriptions[index].status = status;
  fs.writeFileSync(filePath, JSON.stringify(prescriptions, null, 2));

  res.json({ message: 'Prescription updated', prescription: prescriptions[index] });
});

module.exports = router;
