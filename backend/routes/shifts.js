const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth'); // O nosso middleware de autenticação

const Shift = require('../models/Shift');
const User = require('../models/User'); // Vamos precisar de validar se o utilizador existe

// @route   POST api/shifts
// @desc    Criar um novo turno
// @access  Private (mais tarde, podemos restringir a 'manager')
router.post(
  '/',
  [
    authMiddleware,
    [
      check('user', 'É necessário especificar um funcionário').not().isEmpty(),
      check('startTime', 'A data de início é obrigatória').not().isEmpty(),
      check('endTime', 'A data de fim é obrigatória').not().isEmpty(),
      check('position', 'A posição é obrigatória').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user, startTime, endTime, position, notes } = req.body;

    try {
      const newShift = new Shift({
        user,
        startTime,
        endTime,
        position,
        notes,
      });

      const shift = await newShift.save();
      res.json(shift);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no Servidor');
    }
  }
);

// @route   GET api/shifts
// @desc    Obter todos os turnos
// @access  Private
// ...
router.get('/', authMiddleware, async (req, res) => {
  console.log('[Backend] Rota GET /api/shifts foi chamada.'); // Log 1
  try {
    console.log('[Backend] A tentar fazer Shift.find() na base de dados...'); // Log 2
    
    const shifts = await Shift.find().populate('user', ['name', 'email']).sort({ startTime: 1 });
    
    console.log(`[Backend] Shift.find() encontrou ${shifts.length} turnos.`); // Log 3
    
    res.json(shifts);
    
    console.log('[Backend] Resposta enviada com sucesso para o frontend.'); // Log 4

  } catch (err) {
    console.error('[Backend] ERRO na rota GET /api/shifts:', err.message); // Log de Erro
    res.status(500).send('Erro no Servidor');
  }
});

// @route   PUT api/shifts/:id
// @desc    Atualizar um turno existente
// @access  Private
router.put('/:id', authMiddleware, async (req, res) => {
  const { user, startTime, endTime, position, notes } = req.body;

  // Construir o objeto do turno com os campos recebidos
  const shiftFields = {};
  if (user) shiftFields.user = user;
  if (startTime) shiftFields.startTime = startTime;
  if (endTime) shiftFields.endTime = endTime;
  if (position) shiftFields.position = position;
  if (notes !== undefined) shiftFields.notes = notes; // Permitir notas vazias

  try {
    let shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({ msg: 'Turno não encontrado' });
    }

    // Mais tarde, podemos adicionar uma verificação para garantir
    // que apenas o gestor daquele utilizador pode editar o turno.

    shift = await Shift.findByIdAndUpdate(
      req.params.id,
      { $set: shiftFields },
      { new: true } // {new: true} faz com que devolva o documento atualizado
    ).populate('user', ['name', 'email']); // Devolve o turno atualizado e populado

    res.json(shift);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});


// @route   DELETE api/shifts/:id
// @desc    Apagar um turno
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    let shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({ msg: 'Turno não encontrado' });
    }

    await Shift.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Turno removido com sucesso' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no Servidor');
  }
});

module.exports = router;