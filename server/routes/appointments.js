const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data/appointments.json'));
  res.json(data);
});

module.exports = router;
