const {app, BrowserWindow}=require('electron')
const isDEV = require("electron-is-dev")
const path = require('path')
const ipcHandleIpc = require('./ipc.js')
const {create: createMainWindow} = require('./windows/main')
const {create: createControlWindow} = require('./windows/control')
app.on('ready', ()=> {
    createMainWindow()
    // createControlWindow()
    ipcHandleIpc()
    require('./robot.js')() //只能在主进程中运行
})
