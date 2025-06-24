const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const COSTS_FILE = path.join(__dirname, '../data/costs.json');

// Read costs from file
function readCosts() {
  try {
    const data = fs.readFileSync(COSTS_FILE);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading costs.json:', err);
    return [];
  }
}

// Write costs to file
function writeCosts(data) {
  try {
    fs.writeFileSync(COSTS_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing to costs.json:', err);
  }
}

// Get all costs (e.g., admin view)
router.get('/', (req, res) => {
  const data = readCosts();
  res.json(data);
});

// Get recent costs for provider within current month
router.get('/recent', (req, res) => {
  const { providerId, providerType } = req.query;
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const data = readCosts();
  if (!Array.isArray(data)) return res.status(500).json({ error: 'Data format error' });

  const recent = data.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entry.providerId == providerId &&
      entry.providerType === providerType &&
      entryDate.getMonth() === month &&
      entryDate.getFullYear() === year
    );
  });

  res.json(recent);
});

// Add new cost entry
router.post('/', (req, res) => {
  const newEntry = req.body;
  const data = readCosts();

  newEntry.id = data.length > 0 ? data[data.length - 1].id + 1 : 1;
  newEntry.date = new Date().toISOString();
  newEntry.status = 'unpaid';

  data.push(newEntry);
  writeCosts(data);

  res.status(201).json(newEntry);
});

// Get costs for current calendar month by provider
router.get('/monthly', (req, res) => {
  const { providerId, providerType } = req.query;
  if (!providerId || !providerType) {
    return res.status(400).json({ message: 'providerId and providerType are required' });
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const data = readCosts();
  if (!Array.isArray(data)) return res.status(500).json({ error: 'Data format error' });

  const filtered = data.filter(entry => {
    const entryDate = new Date(entry.date);
    return (
      entry.providerId == providerId &&
      entry.providerType === providerType &&
      entryDate.getMonth() === currentMonth &&
      entryDate.getFullYear() === currentYear
    );
  });

  res.json(filtered);
});


module.exports = router;
