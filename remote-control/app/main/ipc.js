const {ipcMain} = require('electron')
const {send: sendMainWindow} = require('./windows/main')
const {create: createControlWindow, send: sendControlWindow} = require('./windows/control')
const signal = require('./signal')

module.exports = function () {
  ipcMain.handle('login', async()=> {
    //先mock, 返回一个code
    // let code = Math.floor( Math.random() * (99999 - 10000) ) + 100000
    
    //服务端真逻辑
    let {code} = await signal.invoke('login', null, 'logined')
    return code
  })
  ipcMain.on('control', async(e, remote)=> {
    signal.send('control', {remote})
    //这里跟服务端进行交互， 但是mock返回
    
  })
  //说明控制端 控制成功， 使code变成傀儡端的
  signal.on('controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 1)
    createControlWindow()
  })
  // 代表傀儡端已经被控制, 使code变成控制端的
  signal.on('be-controlled', (data) => {
    sendMainWindow('control-state-change', data.remote, 2)
  })

  //信令部分代码 puppet、control共享的信道，就是转发
  ipcMain.on('forward', (e, event, data) => {
    signal.send('forward', {event, data})
  })
  //响应off事件, 假设我们转发之后会给我们一个offer， offer里面会把data给我们， 我们就会奖offer给我们主窗口
  // 收到offer，puppet响应
  signal.on('offer', (data) => {
    sendMainWindow('offer', data)
  })

  // 收到puppet证书，answer响应
  signal.on('answer', (data) => {
      sendControlWindow('answer', data)
  })

  // 收到control证书，puppet响应
  signal.on('puppet-candidate', (data) => {
      sendControlWindow('candidate', data)
  })

  // 收到puppet证书，control响应
  signal.on('control-candidate', (data) => {
      sendMainWindow('candidate', data)
  })
}