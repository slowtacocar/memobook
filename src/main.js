/* global MAIN_WINDOW_WEBPACK_ENTRY */

'use strict'

const { app, BrowserWindow } = require('electron')

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

function createWindow() {
  const mainWindow = new BrowserWindow()
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
