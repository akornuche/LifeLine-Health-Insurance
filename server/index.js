const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const payment = require('./routes/payment');

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Or your frontend port
  credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Body:', req.body);
  next();
});
app.use('/api/payment', payment);

// Routes
const login = require('./routes/login');
const patients = require('./routes/patients');
const doctors = require('./routes/doctors');
const pharmacies = require('./routes/pharmacies');
const hospitals = require('./routes/hospitals');
const records = require('./routes/records');
const admin = require('./routes/admin');
const dependents = require('./routes/dependents');

app.use('/api/login', login);
app.use('/api/patients', patients);
app.use('/api/doctors', doctors);
app.use('/api/pharmacies', pharmacies);
app.use('/api/hospitals', hospitals);
app.use('/api/records', records);
app.use('/api/admin', admin);
app.use('/api/dependents', dependents);

app.get('/ping', (req, res) => {
  res.send('Server is alive');
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
