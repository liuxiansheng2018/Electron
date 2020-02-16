const peer = require('./peer-control');
peer.on('add-stream', (stream) => {
  console.log('play stream')
  play(stream)
})
let video = document.getElementById('screen-video')
function play(stream) {
    video.srcObject = stream //媒体源
    video.onloadedmetadata = function() {
        video.play()
    }
}