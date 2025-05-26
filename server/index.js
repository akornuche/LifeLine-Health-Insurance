const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Or your frontend port
  credentials: true
}));
app.use(express.json());


// Routes
const loginRouter = require('./routes/login');
const patients = require('./routes/patients');
const doctors = require('./routes/doctors');
const pharmacies = require('./routes/pharmacies');
const hospitals = require('./routes/hospitals');
const records = require('./routes/records');
const admin = require('./routes/admin');

app.use('/login', loginRouter);
app.use('/api/patients', patients);
app.use('/api/doctors', doctors);
app.use('/api/pharmacies', pharmacies);
app.use('/api/hospitals', hospitals);
app.use('/api/records', records);
app.use('/api/admin', admin);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
