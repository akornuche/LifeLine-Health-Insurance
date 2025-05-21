const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const patients = require('./routes/patients');
app.use('/api/patients', patients);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));