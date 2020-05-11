socket.on('offerDescToReceiver', (data) => {
  getLocalStream().then(() => {
    const peerConn = new RTCPeerConnection();

    localStream.getTracks().forEach((track) => {
      peerConn.addTrack(track, localStream);
    });

    socket.on('offerICECandidateToReceiver', (data) => {
      console.log('ICE candidate has been defined');
      peerConn.addIceCandidate(data.candidate);
    });

    peerConn.onicecandidate = (event) => {
      onIceCandidate(event, 'answer', senderUsernameInput.value, receiverUsernameInput.value);
    };

    peerConn.addEventListener('track', (e) => {
      remoteVideo.srcObject = e.streams[0];
    });

    peerConn.setRemoteDescription(data.offerDesc);
    console.log('Remote description has been defined');

    const answer = peerConn.createAnswer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    });

    answer.then((answerDesc) => {
      console.log('Answer has been created');

      peerConn.setLocalDescription(new RTCSessionDescription(answerDesc)).then(() => {
        console.log('Local description has been defined');

        socket.emit('answerDescToServer', {sender: senderUsernameInput.value, receiver: data.sender, answerDesc: peerConn.localDescription});
      });
    });
  });
});
