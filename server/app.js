/**
 * Created by Jason on 10/7/2015.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var activeUsers = {
    users: [],
    push: function(user) {
        this.users.push(user)
    },
    getId: function(name) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].name === name) {
                return this.users[i].id;
            }
        }
        return undefined;
    },
    getName: function(id) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                return this.users[i].name;
            }
        }
        return undefined;
    },
    removeId: function(id) {
        this.users = this.users.filter(function(u) {
            return u.id !== id;
        });
    },
    hasId: function(id) {
        return this.users.filter(function(u) {return u.id === id}).length > 0;
    }
}; // maps socket id to name
var accounts = [
    {name: "j", password: "1"},
    {name: "c", password: "2"},
    {name: "b", password: "3"}
];
var messages = [];  // contains objects with fields (sender, receiver, body)

app.post('/createUser', function(req, res) {
    if (req.body.name && req.body.password && accounts.filter(function(a) {return a.name === req.body.name}).length == 0) {
        accounts.push({name: req.body.name, password: req.body.password});
        res.sendStatus(204);
    } else {
        res.sendStatus(400);
    }
});

app.get('/history/:name1/:name2', function(req, res) {
    var name1 = req.params['name1'];
    var name2 = req.params['name2'];
    var hist = messages.filter(function(m) {
        return (m.sender === name1 && m.receiver === name2) || (m.sender === name2 && m.receiver === name1);
    });
    res.send(hist);
});

io.on('connection', function(socket){
    socket.on('login', function(data) {
        if (accounts.filter(function(a) {return a.name===data.name && a.password===data.password}).length > 0 && !activeUsers.hasId(socket.id)) {
            // account matches and isn't logged in
            activeUsers.push({id: socket.id, name: data.name});
            socket.emit('login', true);
        } else {
            socket.emit('login', false);
        }
    });
    socket.on('msg', function(data){
        if (activeUsers.hasId(socket.id)) {
            // user logged in
            var sender = activeUsers.getName(socket.id);
            var receiver = data.receiver;
            var body = data.body.trim();
            if (accounts.filter(function(m) {return m.name === receiver}).length > 0) {
                // receiver is valid account
                messages.push({
                    sender: sender,
                    receiver: receiver,
                    body: body
                });
                var id = activeUsers.getId(receiver);
                if (id) {
                    // notify user if user is logged in
                    io.to(id).emit('msg', {sender: sender, body: body});
                }
                console.log(messages.length);  // display number of messages sent so far
            } else {
                console.log('cannot send message, not a valid receiver');
            }
        } else {
            console.log('cannot send message, not logged in');
        }
    });

    socket.on('disconnect', function() {
        activeUsers.removeId(socket.id);
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
