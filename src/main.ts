import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Create application menu with Survey item
  const menuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Survey',
          click: () => {
            if (!mainWindow) return;

            const surveyWindow = new BrowserWindow({
              width: 700,
              height: 900,
              parent: mainWindow,
              modal: true,
              resizable: false,
              webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
              },
            });

            // Load your Microsoft Forms survey URL here
            surveyWindow.loadURL('https://docs.google.com/forms/d/e/1FAIpQLSePsV4irBPbRKbMHdhhtRkUs9zmk1lA79C9JQMWVdRM5HJLrA/viewform?usp=header');

            // Optional: uncomment to open DevTools for the survey window
            // surveyWindow.webContents.openDevTools();

            surveyWindow.on('closed', () => {
              // Optional cleanup here
            });
          },
        },
        { role: 'quit' },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
