const EventEmitter = require('events') 
const peer = new EventEmitter()

//一下对应peer-control代码
const {desktopCapturer} = require('electron')
async function getScreenStream() {
  const sources = await desktopCapturer.getSources({types: ['screen']}) //types是一个数组可用类型为 screen 和 window.
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
module.exports = peer