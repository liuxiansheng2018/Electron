//客户端使用webscoket
//在这个项目中 我们会在主进程维护我们的websocket, 在一进来就在主窗口用到我们的邀请码， 在控制窗口也会用到我们转发的offer
const WebSocket = require('ws');
const EventEmitter = require('events');
const signal = new EventEmitter();

const ws = new WebSocket('ws://127.0.0.1:8010');

//建立连接
ws.on('open', function open() {
    console.log('connect success')
})

ws.on('message', function(message){
    let data = JSON.parse(message)
    console.log('data', data, message);
    //通过signal 去抛出这个事件, 参数是约定的格式
    signal.emit(data.event, data.data) 
})

function send(event,data) {
    ws.send(JSON.stringify({event, data}))    
}

//因为主进程的ipc里面会处理一个登录,所以我们的ipcMain可以调用我们的invoke方法,去发送一个事件
function invoke(event, data, answerEvent) {
    return new Promise( (resolve, reject)=> {
        send(event, data)
        //监听指定的answerEvent方法
        signal.once(answerEvent, resolve)
        //要做请求超时
        setTimeout(() => {
            reject('timeout')
        }, 5000);
    })
}

signal.send = send
signal.invoke = invoke
module.exports = signal
