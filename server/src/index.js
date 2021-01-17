const jwt = require('jsonwebtoken');

const express = require('express');

const app = express();

const port = 3000;

const SECRET = 'WctWC9i^jZue';

const contacts = require('./contacts.json');

function checkPermission(req, res, next) {
  if (req.path !== '/login') {
    const token = req.headers['authorization'];

    if (!token) return res.status(401).send({ message: 'Token is invalid!' });

    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) return res.status(500).send({ message: 'Internal server error!' });

      req.userId = decoded.id;

      next();
    });
  } else {
    next();
  }
}

app.use(express.json());

app.use(checkPermission);

app.listen(port, () => {
  console.log('Server is running! 🚀')
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'lbjdev' && password === '0123') {
    const id = '1';

    const token = jwt.sign({ id }, SECRET, {
      expiresIn: 300
    });

    res.send({ token });
  } else {
    res.status(403).send({ message: 'Access Unauthorized' });
  }
});

app.get('/contacts', (req, res) => {
  res.send(contacts);
});

app.get('/contacts/filter', (req, res) => {
  const queryName = req.query.name;
  const contactsFilter = contacts
  .filter(c => c.nome_completo.toLowerCase().includes(queryName.toLowerCase()));
  res.send(contactsFilter);
});