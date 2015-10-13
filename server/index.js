var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var db = require('./db/db.js');

app.use(bodyParser.json());

// maps socket id to name
var activeUsers = {
    users: [],
    push: function(user) {
        this.users.push(user)
    },
    getId: function(username) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].username === username) {
                return this.users[i].id;
            }
        }
        return undefined;
    },
    getName: function(id) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === id) {
                return this.users[i].username;
            }
        }
        return undefined;
    },
    removeId: function(id) {
        this.users = this.users.filter(function(user) {
            return user.id !== id;
        });
    },
    hasId: function(id) {
        return this.users.filter(function(user) {return user.id === id}).length > 0;
    },
    hasName: function(username) {
        return this.users.filter(function(user) {return user.username === username}).length > 0;
    }
};

var messages = [];  // contains objects with fields (sender, receiver, body)

app.post('/createUser', function(req, res) {
    if (req.body.username && req.body.password) {
        console.log(req.body.username);
        console.log(req.body.password);

        db.User.find({username: req.body.username}, function(err, user) {
            if (err) {
                console.log('Error searching for user in the database.');
                res.status(500).send('An error occurred, please try again');
            }

            // Only create a user and persist it if it does not already exist.
            if (user.length === 0) {
                var newUser = new db.User({
                    username: req.body.username,
                    password: req.body.password
                });

                newUser.save(function(err) {
                    if (err) {
                        res.status(500).send('Unable to save the user information, please try again.');
                    } else {
                        res.status(201).send('Successfully registered user: ' + req.body.name);
                    }
                });
            } else {
                res.status(400).send('Username already exists.');
            }
        });
    } else {
        res.status(400).send('Invalid username or password.');
    }
});

app.get('/history/:username1/:username2', function(req, res) {
    var username1 = req.params['username1'];
    var username2 = req.params['username2'];
    var hist = messages.filter(function(message) {
        return (message.sender === username1 && message.receiver === username2) ||
                (message.sender === username2 && message.receiver === username1);
    });
    res.send(hist);
});

function getMessageHistory(receiver, cb) {
    db.Message.find({receiver: receiver, pushed: true}, function(err, pushed) {
        if (err) {
            console.log('Error retrieving pushed message history for the given receiver.');
        } else {
            db.Message.find({receiver: receiver, pushed: false}, function(err, unpushed) {
                if (err) {
                    console.log('Error retrieving unpushed message history for the given receiver.');
                } else {
                    console.log('Pushed for ' + receiver + ': ' + pushed);
                    console.log('Unpushed for ' + receiver + ': ' + unpushed);
                    cb(pushed, unpushed);
                }
            });
        }
    });
};

io.on('connection', function(socket){
    socket.on('login', function(credentials) {
        console.log(activeUsers.users);

        db.User.find({username: credentials.username}, function(err, user) {
            if (err) {
                socket.emit('error', err);
            } else {
                if (user.length === 0) {
                    socket.emit('login', {status: false, message: 'The username provided does not exist.'});
                } else {
                    if (!activeUsers.hasId(socket.id)) {
                        if (user[0].password === credentials.password) {
                            socket.emit('login', {status: true, message: 'Login succeeded.'});
                            activeUsers.push({id: socket.id, username: credentials.username});
                            // push all the unpushed messages
                            getMessageHistory(credentials.username, function(pushed, unpushed) {
                                for (var index in unpushed) {
                                    console.log(unpushed[index]);
                                    var msg = unpushed[index];
                                    io.to(activeUsers.getId(credentials.username)).emit('receive', {sender: msg.sender, message: msg.message});
                                    //var update = msg;
                                    //update.pushed = true;

                                    db.Message.update(msg, {pushed: true}, {new: true, upsert: true}, function(err, msg) {
                                        if (err) {
                                            console.log('Unable to update the pushed status. ' + err);
                                        } else {
                                            console.log('Updated ' + msg);
                                        }
                                    });
                                }
                            });
                        } else {
                            socket.emit('login', {status: false, message: 'Incorrect password'});
                        }
                    } else {
                        socket.emit('login', {status: false, message: 'You\'ve already logged in.'});
                    }
                }
            }
        });
    });

    socket.on('message', function(data){
        console.log("To " + data.receiver + " " + data.message);
        var sender = activeUsers.getName(socket.id);
        console.log('sent by: ' + sender);

        db.User.find({username: data.receiver}, function(err, receivers) {
            if (err) {
                socket.emit('error', 'Error in searching for the receiver');
            } else {
                if (receivers.length === 0) {
                    socket.emit('message', {status: false, message: 'Attempting to send messages to a non-existent user.'});
                } else {
                    // A valid receiver
                    var newMsg = {
                        sender: activeUsers.getName(socket.id),
                        receiver: receivers[0].username,
                        message: data.message,
                        pushed: false
                    };

                    console.log('Ready to send: ' + newMsg.message + ' to ' + newMsg.receiver);

                    if (activeUsers.hasName(receivers[0].username)) {
                        // persist to database -> message history
                        // set pushed status to true
                        io.to(activeUsers.getId(receivers[0].username)).emit('receive', {sender: sender, message: data.message});
                        newMsg.pushed = true;
                        console.log('Message sent.');
                    }

                    var newMsg = new db.Message(newMsg);

                    newMsg.save(function(err) {
                        if (err) {
                            console.log('Unable to save the message, please try again.');
                        } else {
                            console.log('Successfully saved the message from ' + sender + ' to ' + receivers[0].username
                                + ' to messages');
                        }
                    });
                }
            }
        });
    });

    socket.on('disconnect', function() {
        activeUsers.removeId(socket.id);
    });
});

http.listen(3000, function(){
    console.log('Listening on port 3000');
});