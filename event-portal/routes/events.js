const express = require('express');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const router = express.Router();

// Middleware для проверки токена
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Создание мероприятия
router.post('/create', authenticateToken, async (req, res) => {
  const event = new Event({ ...req.body, createdBy: req.user.id });
  await event.save();
  res.status(201).send(event);
});

// Обновление мероприятия
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(event);
  } catch (error) {
    res.status(400).send('Ошибка редактирования мероприятия: ' + error.message);
  }
});

// Удаление мероприятия
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.send('Мероприятие удалено');
  } catch (error) {
    res.status(400).send('Ошибка удаления мероприятия: ' + error.message);
  }
});

// Получение всех мероприятий
router.get('/', async (req, res) => {
  const events = await Event.find();
  res.send(events);
});

module.exports = router;