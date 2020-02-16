const {app, BrowserWindow, Notification, ipcMain} = require('electron')

let win //挂在全局上， 防止被垃圾回收机制回收
let win2 //用来渲染进程页面通信
app.on('ready', ()=> {
  win = new BrowserWindow({
    width: 300,
    height:300,
    webPreferences: {  //设置了node的环境开启 ，在electron新版中默认是关闭的
      nodeIntegration: true
    }
  })
  win.loadFile('./index.html')

  win2 = new BrowserWindow({
    width: 300,
    height:300,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win2.loadFile('./index2.html')
  global.sharedObject = {
    win2WebContentsId: win2.webContents.id
  }

  // handleCallback()
  // setTimeout(() => {
  //   handleWebContents()
  // }, 500);
 
  // handleIPC()
})  

function handleIPC() {
  ipcMain.handle('work-notification', async function () {
    let res = await new Promise((resolve, reject)=> {
      let notification = new Notification({
        title: '任务结束',
        body: '是否开始休息',
        actions: [{text: '开始休息', type: 'button'}],
        closeButtonText: '继续工作' 
      })
      notification.show()
      notification.on('action', ()=> {
        resolve('rest')
      })
      notification.on('close', ()=> {
        resolve('work')
      })
    })
    return res
  })
  
}

function handleCallback () {
  ipcMain.on('form-renderer-to-main',function(e,a,b){
    console.log(a,b)
  })
}

//主进程到渲染进程
function handleWebContents () {
  win.webContents.send('form-main-to-renderer')
}