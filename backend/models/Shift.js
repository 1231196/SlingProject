const mongoose = require('mongoose');

const ShiftSchema = new mongoose.Schema({
  user: { // O funcionário a quem o turno é atribuído
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // A referência é ao nosso modelo 'user'
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  position: { // Ex: 'Caixa', 'Barista', 'Cozinheiro'
    type: String,
    required: true,
  },
  notes: {
    type: String,
  },
}, { timestamps: true }); // Adiciona os campos createdAt e updatedAt automaticamente

module.exports = mongoose.model('shift', ShiftSchema);