const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 3000;

app.get('/sender', (req, res) => {
  res.sendFile(`${__dirname}/users/sender.html`);
});

app.get('/receiver', (req, res) => {
  res.sendFile(`${__dirname}/users/receiver.html`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('offerDescToServer', (data) => {
    io.emit('offerDescToReceiver', data);
  });

  socket.on('answerDescToServer', (data) => {
    io.emit('answerDescToSender', data);
  });
});

http.listen(port, () => {
  console.log(`Listening on *:${port}`);
});
