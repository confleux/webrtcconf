roleList.addEventListener('change', () => {
  if (roleList.value === 'doctor') {
    usernameInput.disabled = true;
  } else {
    usernameInput.disabled = false;
  };
});


submitRoleButton.addEventListener('click', () => {
  if (roleList.value === 'patient' && usernameInput.value === '') {
    console.error("Patient's name wasn't entered");
    return;
  };

  if (roleList.value === 'doctor') {
    socket.emit('sendUsername', {
      username: 'doctor'
    });
    receiverUsernameInput.style.visibility = 'visible';
  } else {
    document.username = usernameInput.value;
    socket.emit('sendUsername', {
      username: usernameInput.value
    });
  };

  document.role = roleList.value;

  roleChooseBlock.style.visibility = 'hidden';
  localVideoBlock.style.visibility = 'visible';
  callButton.style.visibility = 'visible';
});


getLocalStreamButton.addEventListener('click', getLocalStream);

callButton.addEventListener('click', () => {  
  if (document.role === 'doctor') {
    offer('doctor', receiverUsernameInput.value);
  } else {
    offer(document.username, 'doctor');
  }
});
