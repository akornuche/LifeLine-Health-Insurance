const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_FILE = path.join(__dirname, '../data/dependents.json');

// Utility to read/write JSON file
const readDependents = () => {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
};

const writeDependents = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// ✅ Get all dependents (with optional patientId filtering)
router.get('/', (req, res) => {
  const { patientId } = req.query;
  let dependents = readDependents();

  if (patientId) {
    dependents = dependents.filter(d => String(d.patientId) === String(patientId));
  }

  res.json(dependents);
});

// ✅ Add a new dependent (requires valid patientId and fields)
router.post('/', (req, res) => {
  const dependents = readDependents();
  const maxId = dependents.length > 0 ? Math.max(...dependents.map(p => Number(p.id))) : 0;

  const { name, age, relation, patientId } = req.body;

  // Basic validations
  if (!patientId) {
    return res.status(400).json({ message: 'Missing patientId' });
  }
  if (!name || !relation || age === undefined) {
    return res.status(400).json({ message: 'Missing required fields: name, relation, or age' });
  }

  const newDependent = {
    id: maxId + 1,
    name,
    age,
    relation,
    patientId
  };

  dependents.push(newDependent);
  writeDependents(dependents);
  res.status(201).json(newDependent);
});


// ✅ Update a dependent
router.put('/:id', (req, res) => {
  let dependents = readDependents();
  const id = Number(req.params.id);
  const index = dependents.findIndex(dep => dep.id === id);

  if (index === -1) return res.status(404).json({ message: 'Dependent not found' });

  // Don't overwrite ID
  const { id: _, ...updateData } = req.body;

  dependents[index] = { ...dependents[index], ...updateData };

  writeDependents(dependents);
  res.json(dependents[index]);
});

// ✅ Delete a dependent
router.delete('/:id', (req, res) => {
  let dependents = readDependents();
  const id = Number(req.params.id);

  const newDependents = dependents.filter(dep => dep.id !== id);

  if (newDependents.length === dependents.length) {
    return res.status(404).json({ message: 'Dependent not found' });
  }

  writeDependents(newDependents);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
