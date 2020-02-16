const {ipcRenderer, remote} = require('electron')
const Timer = require('timer.js')

function startWork() {
 let workTimer =  new Timer({
    ontick: (ms)=> {
      updateTime(ms)
    },
    onend: ()=> {
      notification()
    }
  })
  workTimer.start(10)
}

function updateTime(ms) {
  let timerContainer = document.getElementById('main')
  let s = (ms / 1000).toFixed(0)
  let ss = (s % 60)
  let mm = (s / 60).toFixed(0)
  timerContainer.innerText = `${mm.toString().padStart(2, 0)}:${ss.toString().padStart(2, 0)}`
} 

async function notification() {
  let res = await ipcRenderer.invoke('work-notification')
  if( res === 'rest' ) {
    setTimeout(() => {
      alert('休息')
    }, 5000);
  } else if( res === 'work' ) {
    startWork()
  }
  
}

// startWork()

// ipcRenderer.send('form-renderer-to-main', 1,2)


//主进程到渲染进程
ipcRenderer.on('form-main-to-renderer', ()=> {
  alert('do some work')
})

//渲染进程到渲染进程
let sharedObject = remote.getGlobal('sharedObject');
let win2WebContentsId = sharedObject.win2WebContentsId
ipcRenderer.sendTo(win2WebContentsId, 'do-some-work', 1)
