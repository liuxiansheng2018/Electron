const {ipcMain} = require('electron')
const {send: sendMainWindow} = require('./windows/main')
const {create: createMainWIndow} = require('./windows/control')
module.exports = function () {
  ipcMain.handle('login', async()=> {
    //先mock, 返回一个code
    let code = Math.floor( Math.random() * (99999 - 10000) ) + 100000
    
    return code
  })
  ipcMain.on('control', async(e, remoteCode)=> {
    //这里跟服务端进行交互， 但是mock返回
    sendMainWindow('control-state-change', remoteCode, 1  )
    createMainWIndow()
  })
}