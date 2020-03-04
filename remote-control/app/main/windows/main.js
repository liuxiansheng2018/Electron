const {app, BrowserWindow} = require('electron')
const isDEV = require('electron-is-dev')
const path = require('path')

let win;
function create() {
  win = new BrowserWindow({
    width: 600,
    height: 300,
    webPreferences: {
      nodeIntegration: true
    }
  })
  if( isDEV ) { //区分线上线下环境
    win.loadURL('http://localhost:3000')
  } else {
    win.loadFile(path.resolve(__dirname, "../renderer/pages/main/index.html"))
  }
 
}
function send(channel, ...args) {
  win.webContents.send(channel, ...args)
}

module.exports = {create, send}