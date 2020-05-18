const socket = io('http://localhost:3000');

document.connectionsAmount = 0;

let localStream;

const sendUsername = () => {
  socket.emit('sendUsername', {username: senderUsernameInput.value});
};

const onIceCandidate = (event, path, sender, receiver) => {
  if(event.candidate !== null) {
    socket.emit(`${path}ICECandidateToServer`, {sender: sender, receiver: receiver, candidate: event.candidate});
  };
};

const getLocalStream = () => {
  return navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
    localStream = stream;
    localVideo.srcObject = localStream;

    console.log("Got local stream");
  });
};
