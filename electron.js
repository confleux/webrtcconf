const { app, BrowserWindow } = require('electron');

app.commandLine.appendSwitch('ignore-certificate-errors', 'true');

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('index.html');
});
