var express = require('express');
var app = express();
var http = require('http').Server(app);
var server = require('socket.io')(http);
var bodyParser = require('body-parser');
var db = require('./db/db.js');
var path = require('path');

app.use(bodyParser.json());

// maps socket id to username
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
        return this.getName(id) !== undefined;
        //return this.users.filter(function(user) {return user.id === id}).length > 0;
    },
    hasName: function(username) {
        return this.getId(username) !== undefined;
        //return this.users.filter(function(user) {return user.username === username}).length > 0;
    }
};

app.use('/', express.static(path.join(__dirname, 'client')));

// handling request to create user
app.post('/createUser', function(req, res) {
    if (req.body.username && req.body.password) {
        db.User.find({username: req.body.username}, function(err, user) {
            if (err) {
                res.status(500).send('An error occurred, please try again. Error: ' + err);
            }

            // Only create a user and persist it if it does not already exist.
            if (user.length === 0) {
                var newUser = new db.User({
                    username: req.body.username,
                    password: req.body.password
                });

                newUser.save(function(err) {
                    if (err) {
                        res.status(500).send('Error when saving the user information in the database: ' + err);
                    } else {
                        res.status(200).send('Successfully registered user: ' + req.body.username);

                        // Notify all the connected clients of the user list
                        db.User.find({}, function (err, userList) {
                            if (err) {
                                res.status(500).send('Error obtaining the list of registered users from the database, error: ' + err);
                            } else {
                                server.emit('registeredUsers', userList);
                            }
                        });
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

// handling request to obtain message history between two users
app.get('/history/:sender/:receiver', function(req, res) {
    db.Message.find({sender: req.params['sender'], receiver: req.params['receiver']}, function (err, history) {
        if (err) {
            res.status(500).send('Unable to retrieve the message history from the database, error: ' + err);
        } else {
            res.status(200).send(history);
        }
    });
});

app.get('/userList', function(req, res) {
    db.User.find({}, function (err, userList) {
        if (err) {
            res.status(500).send('Error obtaining the list of registered users from the database, error: ' + err);
        } else {
            res.status(200).send(userList);
        }
    });
});

function getUnpushedMessages(receiver, cb) {
    db.Message.find({receiver: receiver, pushed: false}, function(err, unpushed) {
        if (err) {
            console.log('Error retrieving unpushed message history for the given receiver from the database: ' + err);
        } else {
            cb(unpushed);
        }
    });
};

server.on('connection', function(socket){
    socket.on('login', function(credentials) {
        db.User.find({username: credentials.username}, function(err, user) {
            if (err) {
                socket.emit('error', 'Error in searching for the provided user in the database: ' + err);
            } else {
                if (user.length === 0) {
                    socket.emit('login', {status: false, message: 'The username provided does not exist.'});
                } else {
                    if (!activeUsers.hasId(socket.id)) {
                        if (user[0].password === credentials.password) {
                            // Response to client socket about login status
                            socket.emit('login', {status: true, message: 'Login succeeded.'});

                            // Notify all the connected clients of the newly logged in client
                            server.emit('activeUsers', {onlineUsers: activeUsers.users});

                            activeUsers.push({id: socket.id, username: credentials.username});
                            // push all the unpushed messages
                            getUnpushedMessages(credentials.username, function(unpushed) {
                                for (var index in unpushed) {
                                    var msg = unpushed[index];
                                    server.to(activeUsers.getId(credentials.username)).emit('receive', {sender: msg.sender, message: msg.message});
                                    // update message pushed status
                                    db.Message.update(msg, {pushed: true}, {new: true, upsert: true}, function(err, response) {
                                        if (err) {
                                            console.log('Unable to update the pushed status in the database: ' + err);
                                        } else {
                                            console.log('Successfully updated the state of a newly pushed message: ' + response);
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

    socket.on('send', function(packet){
        var sender = activeUsers.getName(socket.id);

        db.User.find({username: packet.receiver}, function(err, receivers) {
            if (err) {
                socket.emit('error', 'Error in searching for the receiver in the database: ' + err);
            } else {
                if (receivers.length === 0) {
                    socket.emit('error', {status: false, message: 'Attempting to send messages to a non-existent user.'});
                } else {
                    // A valid receiver
                    // * Might extend this functionality to send a message to a group of users

                    var newMsg = {
                        sender: activeUsers.getName(socket.id),
                        receiver: receivers[0].username,
                        message: packet.message,
                        pushed: false
                    };

                    console.log(activeUsers.hasName(newMsg.receiver));

                    if (activeUsers.hasName(newMsg.receiver)) {
                        // persist to database -> message history
                        // set pushed status to true
                        server.to(activeUsers.getId(newMsg.receiver)).emit('receive', {sender: sender, message: packet.message});
                        newMsg.pushed = true;
                    }

                    var msg = new db.Message(newMsg);

                    msg.save(function(err) {
                        if (err) {
                            console.log('Unable to persist the message in the db, please try again: ' + err);
                        } else {
                            console.log('Successfully persisted the message from ' + sender + ' to ' + newMsg.receiver
                                + ' to the db.');
                        }
                    });
                }
            }
        });
    });

    socket.on('disconnect', function() {
        activeUsers.removeId(socket.id);

        // Notify all the connected clients of the newly logged out client
        server.emit('activeUsers', {onlineUsers: activeUsers.users});
    });
});

http.listen(3000, function(){
    console.log('Listening on port 3000');
});
