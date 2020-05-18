const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3000;

const db = [];

const findIdByName = (name) => {
  for (let i = 0; i < db.length; i++) {
    if (db[i].username === name) {
      return db[i].id
      break;
    };
  };
};

app.use('/js', express.static('js'));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('sendUsername', (data) => {
    db.push({id: socket.id, username: data.username});
  });

  socket.on('disconnect', () => {
    for (let i = 0; i < db.length; i++) {
      if (db[i].id === socket.id) {
        db.splice(i, 1);
        break;
      };
    };

    console.log('user disconnected');
  });

  socket.on('offerDescToServer', (data) => {
    const id = findIdByName(data.receiver);
    io.to(id).emit('offerDescToReceiver', {sender: data.sender, offerDesc: data.offerDesc});
  });

  socket.on('answerDescToServer', (data) => {
    const id = findIdByName(data.receiver);
    io.to(id).emit('answerDescToSender', {sender: data.sender, answerDesc: data.answerDesc});
  });

  socket.on('offerICECandidateToServer', (data) => {
    const id = findIdByName(data.receiver);
    io.to(id).emit('offerICECandidateToReceiver', {sender: data.sender, candidate: data.candidate});
  });

  socket.on('answerICECandidateToServer', (data) => {
    const id = findIdByName(data.receiver);
    io.to(id).emit('answerICECandidateToSender', {sender: data.sender, candidate: data.candidate});
  });
});

http.listen(port, '0.0.0.0', () => {
  console.log(`Started: ${JSON.stringify(http.address())}`);
  console.log(`Listening on *:${port}`);
});
