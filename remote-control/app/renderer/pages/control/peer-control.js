const EventEmitter = require('events') 
const peer = new EventEmitter()
const {ipcRenderer} = require('electron')
const pc = new window.RTCPeerConnection({})

/*
一下对应peer-control代码
  const {desktopCapturer,ipcRenderer} = require('electron')
  async function getScreenStream() {
    const sources = await desktopCapturer.getSources({types: ['screen']}) //types是一个数组可用类型为 screen 和 window. 用来提取chromeMediaSourceId
    navigator.webkitGetUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'desktop',
          chromeMediaSourceId: sources[0].id,
          maxWidth: window.screen.width,
          maxHeight: window.screen.height
        }
      }
    }, (stream)=> {
      console.log(stream)
      peer.emit('add-stream', stream)
    }, (err)=> {
      console.error(err)
    })
  }
  getScreenStream()

  peer.on('robot', (type, data) => {
      if(type === 'mouse') {
          data.screen = {
              width: window.screen.width, 
              height: window.screen.height
          }
      }
      setTimeout(() => {
        ipcRenderer.send('robot', type, data)
      }, 2000);
    
  })
*/
async function createOffer() {
  const offer = await pc.createOffer({
    offerToReceiveAudio: false,
    offerToReceiveVideo: true
  })
  await pc.setLocalDescription(offer)
  console.log('pc offer', JSON.stringify(offer))
  return pc.localDescription
}

//需要直接转发到我们的傀儡端
createOffer().then(offer=> {
  ipcRenderer.send('forward', 'offer',{type: offer.type, sdp: offer.sdp})
})

//这样就不需要手动调用setRemote方法
ipcRenderer.on('answer', (e, answer) => {
  setRemote(answer)
})

async function setRemote(answer) {
  await pc.setRemoteDescription(answer)
}

//onicecandidate iceEvent 去拿到对应的iceEvent
//addIceCandidate 
//处理candidate
// 傀儡端拿到candidate 和 傀儡端把candidate发个控制端
pc.onicecandidate = function(e) {
  console.log('candidate', JSON.stringify(e.candidate))
  ipcRenderer.send('forward', 'control-candidate', e.candidate)
}
//再去监听
ipcRenderer.on('candidate', (e, candidate) => {
  addIceCandidate(candidate)
})
let candidates = []
async function addIceCandidate(candidate) {
  if( candidate ) {
    candidates.push(candidate)
  }

  if( pc.remoteDescription && pc.remoteDescription.type ) {
    for( let i =0; i< candidates.length; i++) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate[i]))
    }
    candidates = []
  }
}

// window.addIceCandidate = addIceCandidate






// window.setRemote = setRemote
pc.onaddstream = function(e) {
  console.log('add stream', e)
  peer.emit('add-stream', e.stream)
}

module.exports = peer