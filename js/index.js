const socket = io();

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
  return navigator.mediaDevices.getUserMedia({audio: false, video: true}).then((stream) => {
    console.log(stream);
    localStream = stream;
    localVideo.srcObject = localStream;
    console.log("Got local stream");
  });
};
