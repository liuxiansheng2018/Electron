const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8010 });
const code2ws = new Map(); //控制码和ws的一个映射关系存在内存里
//客户端进行连接
wss.on('connection', function connection(ws, request) {
    ws.sendData = (event, data) => {
        console.log(JSON.stringify({event, data}))
        ws.send(JSON.stringify({event, data}));
    };
    ws.sendError = msg => {
        ws.sendData('error', {msg})
    };

    let code =  Math.floor(Math.random()*(999999-100000)) + 100000;
    code2ws.set(code, ws)
    ws.on('message', function incoming(message) {
        let parsedMessage = {}
        try {
            parsedMessage = JSON.parse(message);
        } catch (e) {
            console.log('parse error', e)
            ws.sendError('message not valid')
            return
        }
        // console.log(parsedMessage)
        let {event, data} =parsedMessage
        console.log(event)
        if (event === 'login') {
            ws.sendData( "logined", {code})
        } else if(event === 'control'){
            let remote = +data.remote
        
            console.log(code2ws.has(remote))
            if (code2ws.has(remote)) {
             /*
                ws.sendData('controlled', {remote}) //如果有这个用户那么提示已经控制住了
                ws.sendRemote = code2ws.get(remote).sendData //随后建立映射
                code2ws.get(remote).sendData = ws.sendData  //傀儡端推送消息给控制端
                ws.sendRemote('be-controlled', {remote: code}) //告诉傀儡端你已经被控制了
                */
                ws.sendData('controlled', {remote})
                let remoteWS = code2ws.get(remote)
                ws.sendRemote = remoteWS.sendData
                remoteWS.sendRemote = ws.sendData
                ws.sendRemote('be-controlled', {remote: code})
            }
        } else if (event === 'forward'){
            ws.sendRemote(data.event, data.data)
        } else {
            ws.sendError('message not handle', message)
        }
    });

    //  进行终止
    ws.on('close', () => {
        code2ws.delete(code)
        delete ws.sendRemote
        clearTimeout(ws._closeTimeout);
    })

    ws._closeTimeout = setTimeout(() => {  
        ws.terminate();
    }, 600000);
});