const {app, BrowserWindow}=require('electron')
const isDEV = require("electron-is-dev")
const path = require('path')
const ipcHandleIpc = require('./ipc.js')
const {create: createMainWindow} = require('./windows/main')
app.on('ready', ()=> {
    createMainWindow()
    ipcHandleIpc()
})
