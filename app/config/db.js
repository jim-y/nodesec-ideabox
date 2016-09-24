// mongod --dbpath ./other/

const mongoose = require('mongoose');

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost:27017/nodesec-ideabox');
const db = module.exports = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});
