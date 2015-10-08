/**
 * Created by Jason on 10/7/2015.
 */


var name = process.argv[2];
var password = process.argv[3];
if (name === undefined || password === undefined) {
    process.exit();
}
var socket = require('socket.io-client')('http://localhost:3000');

socket.emit('login', {name: name, password: password});
socket.on('login', function(data) {
    if (data) {
        console.log('successfully logged in');
    } else {
        console.log("couldn't log in");
        process.exit()
    }
});
socket.on('msg', function(data){
    console.log(data);
});
socket.on('disconnect', function(){
    console.log('disconnected');
});


process.stdin.on('readable', function() {
    var chunk = process.stdin.read();
    if (chunk !== null) {
        chunk = chunk.toString();
        var data = chunk.split(':');
        socket.emit('msg', {
            receiver: data[0],
            body: data[1]
        });
    }
});

