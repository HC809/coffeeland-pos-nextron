import { app, screen } from 'electron';
import serve from 'electron-serve';
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS
} = require("electron-devtools-installer");
import { createWindow } from './helpers';

const isProd: boolean = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow('main', {
    width: screen.getPrimaryDisplay().workArea.width,
    height: screen.getPrimaryDisplay().workArea.height,
  });

  if (isProd) {
    await mainWindow.loadURL('app://./home.html');
  } else {
    console.log('development mode');
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/home`);

    await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));

    mainWindow.webContents.openDevTools();
  }
})();



app.on('window-all-closed', () => {
  app.quit();
});
