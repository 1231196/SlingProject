require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Conectar à Base de Dados
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Definir as Rotas
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth')); 
app.use('/api/shifts', require('./routes/shifts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));