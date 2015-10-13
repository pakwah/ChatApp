var readline = require('readline');
var socket = require('socket.io-client');

var rl = readline.createInterface({
    input: process.stdin,
    output:process.stdout
});

var client = socket('http://localhost:3000/');

var connected = false;

client.on('connect', function() {
    console.log('connected');
    rl.prompt();
});

client.on('login', function(res) {
    if (res.status) {
        connected = true;
    }
    console.log(res.message);
    rl.prompt();
});

client.on('receive', function(data) {
    console.log("Received a message from " + data.sender + ": " + data.message);
    rl.prompt();
});

client.on('error', function(err) {
    console.log(err);
    rl.prompt();
})

rl.setPrompt('input: ');

rl.prompt();

rl.on('line', function(command) {
    var tokens = command.split(' ');
    var action = tokens[0];

    switch (action) {
        case 'login':
            client.emit('login', {username: tokens[1], password: tokens[2]});
            rl.prompt();
            break;

        case 'message':
            if (connected) {
                if (tokens.length < 3) {
                    console.log('Must specify a receiver.');
                    rl.prompt();
                    break;
                } else {
                    client.emit('message', {receiver: tokens[1], message: tokens[2]});
                    rl.prompt();
                }
            } else {
                console.log('You cannot send messages before logging in.');
                rl.prompt();
            }
            break;

        default:
            console.log("This is a command.");
            rl.prompt();
    }
});
