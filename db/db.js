var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/appDB');

var db = mongoose.connection;

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);

var messageSchema = mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    pushed: Boolean
});

var Message = mongoose.model('Message', messageSchema);

db.once('open', function(cb) {
    console.log('connected to db');
});


module.exports = {
    User: User,
    Message: Message
}