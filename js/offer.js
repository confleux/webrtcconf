offer = () => {
  getLocalStream().then(() => {
    const peerConn = new RTCPeerConnection();

    localStream.getTracks().forEach((track) => {
      peerConn.addTrack(track, localStream);
    });

    socket.on('answerICECandidateToSender', (data) => {
      console.log('ICE candidate has been defined');
      peerConn.addIceCandidate(data.candidate);
    });

    peerConn.onicecandidate = (event) => {
       onIceCandidate(event, 'offer', senderUsernameInput.value, receiverUsernameInput.value);
    };

    peerConn.addEventListener('track', (e) => {
      remoteVideo.srcObject = e.streams[0];
    });

    const offer = peerConn.createOffer({
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1
    }).then((offerDesc) => {
      console.log('Offer has been created');

      peerConn.setLocalDescription(new RTCSessionDescription(offerDesc)).then(() => {
        console.log('Local description has been defined');
        socket.emit('offerDescToServer', {sender: senderUsernameInput.value, receiver: receiverUsernameInput.value, offerDesc: peerConn.localDescription});

        socket.on('answerDescToSender', (data) => {
          peerConn.setRemoteDescription(data.answerDesc);
          console.log('Remote description has been defined');
        });
      });
    });
  });
};

callButton.addEventListener('click', offer);
