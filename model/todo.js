var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = Schema({
  "todo-value"		: String,
  "completed"	: Boolean
});

module.exports = mongoose.model('todos', todoSchema);