const {ipcRenderer} = require('electron')
ipcRenderer.on('do-some-work', (e, a)=> {
  console.log(123)
  alert('renderer2 handle work' + a)
})