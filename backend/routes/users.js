const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authMiddleware = require('../middleware/auth'); // Precisamos do middleware


// Trazemos o nosso modelo de Utilizador
const User = require('../models/User.js');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ name: 1 });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/register
// @desc    Regista um novo utilizador
// @access  Public
router.post(
  '/register',
  [
    // Validação dos dados recebidos
    check('name', 'O nome é obrigatório').not().isEmpty(),
    check('email', 'Por favor, inclua um email válido').isEmail(),
    check('password', 'A password deve ter 6 ou mais caracteres').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // 1. Verificar se o utilizador já existe
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'Utilizador já existe' });
      }

      // 2. Criar uma nova instância do utilizador
      user = new User({
        name,
        email,
        password,
      });

      // 3. Encriptar (hash) a password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // 4. Guardar o utilizador na base de dados
      await user.save();

      // 5. Criar e devolver o JSON Web Token (JWT)
      const payload = {
        user: {
          id: user.id,
          role: user.role,
        },
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET, // !! IMPORTANTE: Mudar isto e colocar numa variável de ambiente (.env)
        { expiresIn: 360000 }, // Expira em muitas horas
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Erro no servidor');
    }
  }
);

module.exports = router;