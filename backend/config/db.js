const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Garante que o .env é carregado

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    // Sair do processo com falha
    process.exit(1);
  }
};

module.exports = connectDB;