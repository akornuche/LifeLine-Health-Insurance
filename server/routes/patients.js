const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/patients.json');

router.get('/', (req, res) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        res.json(JSON.parse(data));
    } else {
        res.json([]);
    }
});

router.post('/', (req, res) => {
    const newPatient = req.body;
    let patients = [];
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        patients = JSON.parse(data);
    }
    patients.push(newPatient);
    fs.writeFileSync(filePath, JSON.stringify(patients, null, 2));
    res.status(201).json(newPatient);
});

module.exports = router;