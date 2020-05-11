const socket = io();

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

const senderUsernameInput = document.getElementById('senderUsernameInput');
const receiverUsernameInput = document.getElementById('receiverUsernameInput');

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

const getLocalStreamButton = document.getElementById('getLocalStream');
const callButton = document.getElementById('call');
const sendUsernameButton = document.getElementById('sendUsernameButton');

getLocalStreamButton.addEventListener('click', getLocalStream);
sendUsernameButton.addEventListener('click', sendUsername);
