// var mongodb = require('mongodb');
// var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();

app.use(cors());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

todo = require('./routes/todo.js');

// Connection URL
// var url = 'mongodb://localhost:27017/myproject';

// var JSONAPISerializer = require('jsonapi-serializer').Serializer;
// var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

// var TodoSerializer = new JSONAPISerializer('todo', {
//     id: '_id',
//     pluralizeType: false,
//     attributes: ['todo-value', 'completed']
// });

app.get('/todos', todo.listTodo);

app.post('/todos', todo.insertTodo);

app.delete('/todos/:todoId', todo.deleteTodo);

app.patch('/todos/:todoId', todo.updateTodo);

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
