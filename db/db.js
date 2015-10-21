var dbURI = /*process.env.MONGOHQ_URL ||*/ 'mongodb://localhost/appDB';

var mongoose = require('mongoose');

var db = mongoose.connection;

db.once('open', function(cb) {
    console.log('connected to db');
});

var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

var User = mongoose.model('User', userSchema);

var messageSchema = mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    pushed: Boolean,
    timestamp: Number
});

var Message = mongoose.model('Message', messageSchema);

mongoose.connect(dbURI, function() {console.log('connecting to: ' + dbURI)});

module.exports = {
    User: User,
    Message: Message,
    mongoose: mongoose
};