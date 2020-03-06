// createAnswer
//addstream
import {desktopCapturer, ipcRenderer} from 'electron'
// import EventEmitter from 'events'
// let peer = new EventEmitter()

const pc = new window.RTCPeerConnection({})
async function getScreenStream() {
  const sources = await desktopCapturer.getSources({types: ['screen']}) //types是一个数组可用类型为 screen 和 window. 用来提取chromeMediaSourceId
  return new Promise((resolve, reject)=> {
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
      resolve(stream)
     
    }, (err)=> {
      console.error(err)
    })
  }) 
}

pc.onicecandidate = function(e) {
  console.log('candidate', JSON.stringify(e.candidate))
  ipcRenderer.send('forward', 'puppet-candidate', e.candidate)
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
      await pc.addIceCandidate(new RTCIceCandidate(candidates[i]))
    }
    candidates = []
  }
}

window.addIceCandidate = addIceCandidate

ipcRenderer.on('offer', async (e, offer)=> {
  let answer = await createAnswer (offer)
  ipcRenderer.send('forward', 'answer', {type: answer.type, sdp: answer.sdp})
})  
async function createAnswer(offer) {
  let screenStream = await getScreenStream()
  pc.addStream(screenStream)
  await pc.setRemoteDescription(offer)
  await pc.setLocalDescription(await pc.createAnswer())
  console.log('answer', JSON.stringify(pc.localDescription))
  return pc.localDescription
}
window.createAnswer = createAnswer