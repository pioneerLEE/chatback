const SocketIo =require('socket.io');

module.exports = (server,app) =>{
    const io = SocketIo(server, {path:'/socket.io'});
    app.set('io',io);
    const room = io.of('/room');

    const chat = io.of('/chat');

    room.on('connection',(socket)=>{
        console.log('room 네임스페이스 접속');

        socket.on('disconnect',()=>{
            console.log('room 네임스페이스 접속 해체');
        });
        socket.on('channel1', (data) => {
            console.log('Greetings from RN app', data);
        })
    })

    chat.on('connection',(socket)=>{
        console.log('chat 네임스페이스 접속');
    })

    io.on('connection',(socket)=>{
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        socket.on('disconnect',()=>{
            console.log('클라이언트 접속 해제', ip,socket.id);
        });
        socket.on('channel1', (data) => {
            console.log('Greetings from RN app', data);
        })
        socket.on('error',(error)=>{
            console.log(error);
        });
    })
}
