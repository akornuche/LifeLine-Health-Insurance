const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data/prescriptions.json'));
  res.json(data);
});

module.exports = router;
