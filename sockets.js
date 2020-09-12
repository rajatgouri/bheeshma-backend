module.exports  = {
    init: (io) => {
        io.on('connection', (socket) => {
            console.log('socket connected!');
          
            socket.on('new-order', function (data) {
                io.emit('on-new-order', data);
            });
        
        })  
    }
}  