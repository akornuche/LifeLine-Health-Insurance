const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/patients', require('./routes/patients'));
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/pharmacies', require('./routes/pharmacies'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/records', require('./routes/records'));
const admin = require('./routes/admin');

const patients = require('./routes/patients');
app.use('/api/patients', patients);
app.use('/api/doctors', doctors);
app.use('/api/pharmacies', pharmacies);
app.use('/api/hospitals', hospitals);
app.use('/api/records', records);
app.use('/api/admin', admin);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));