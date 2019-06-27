const express = require('express');
let users = require('./data');

const server = express();
server.use(express.json());

const jarvis = (req, res, next) => {
  const { method, originalUrl } = req;
  console.time('responseTime');
  next();

  const { statusCode } = res;
  console.log('Jarvis at your service, sir.');
  console.log(`[${method}] ${statusCode} @ ${originalUrl}`);
  console.timeEnd('responseTime');
};

server.use(jarvis);

server.get('/users', (req, res) => {
  const { petType, petName } = req.query; // query params
  if (petType) {
    const listed = users.filter(u => u.pet.type.toLowerCase() === petType.toLowerCase());
    return res.status(200).json(listed);
  }

  if (petName) {
    const listed = users.filter(u => u.pet.name.toLowerCase() === petName.toLowerCase());
    return res.status(200).json(listed);
  }
  return res.status(200).json(users);
});

const checkUserInArray = (req, res, next) => {
  const { id } = req.params;
  const user = users.find(u => u.id === parseInt(id, 0));

  if (!user) {
    return res.status(404).json({ error: 'este usuário não existe.' });
  }

  req.user = user;

  return next();
};

server.post('/users', (req, res) => {
  const user = req.body; // payload

  user.id = users.length + 1;

  users = [...users, user];

  return res.status(201).json({ success: 'usuário adicionado com sucesso.' });
});

server.get('/users/:id', checkUserInArray, (req, res) => res.status(200).json(req.user));

server.put('/users/:id', checkUserInArray, (req, res) => {
  const user = req.body;
  const { id } = req.params;

  users = users.map(u => (u.id === parseInt(id, 0) ? { ...u, ...user } : u));

  return res.status(200).json({ success: 'usuário atualizado com sucesso.' });
});

server.delete('/users/:id', checkUserInArray, (req, res) => {
  const { id } = req.params;

  users = users.filter(u => u.id !== parseInt(id, 0));

  return res.status(200).json({ success: 'usuário deletado com sucesso.' });
});

server.listen(3333);
