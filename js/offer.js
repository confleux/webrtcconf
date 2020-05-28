offer = (sender, receiver) => {

  connectionsAmount++;

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
       onIceCandidate(event, 'offer', sender, receiver);
    };

    const div = document.createElement('div');
    div.id = `remoteVideoBlock${connectionsAmount}`;

    document.body.appendChild(div);

    const video = document.createElement('video');
    video.id = `remoteVideo${connectionsAmount}`;
    video.autoplay = true;

    const hangButton = document.createElement('button');
    hangButton.id = `hangButton${connectionsAmount}`;
    hangButton.addEventListener('click', () => {
      peerConn.close();
      video.src = null;
    });

    div.appendChild(video);
    div.appendChild(hangButton);

    peerConn.onconnectionstatechange = () => {
      if (peerConn.connectionState == "closed") {
        peerConn.close();
        video.src = null;
        document.removeChild(div);
      };
    };

    peerConn.addEventListener('track', (e) => {
      console.log(e);
      video.srcObject = e.streams[0];
    });

    const offer = peerConn.createOffer({
      offerToReceiveAudio: 0,
      offerToReceiveVideo: 1
    }).then((offerDesc) => {
      console.log('Offer has been created');

      peerConn.setLocalDescription(new RTCSessionDescription(offerDesc)).then(() => {
        console.log('Local description has been defined');
        socket.emit('offerDescToServer', {sender: sender, receiver: receiver, offerDesc: peerConn.localDescription});

        socket.on('answerDescToSender', (data) => {
          peerConn.setRemoteDescription(data.answerDesc);
          console.log('Remote description has been defined');
        });
      });
    });
  });
};
