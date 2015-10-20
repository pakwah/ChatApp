var mongoose = require('mongoose');
var mockgoose = require('mockgoose');

// mock database
mockgoose(mongoose);

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

mongoose.connect('mongodb://localhost:27017/testDB');

module.exports = {
    User: User,
    Message: Message,
    mockgoose: mockgoose,
    mongoose: mongoose
}