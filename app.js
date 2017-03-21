var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')
var app = express();

app.use(cors());
// app.use(bodyParser.urlencoded())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// app.use(bodyParser.urlencoded({ extended: false }))

// Connection URL
var url = 'mongodb://localhost:27017/myproject';

var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

var TodoSerializer = new JSONAPISerializer('todo', {
    id: '_id',
    pluralizeType: false,
    attributes: ['todo-value', 'completed']
});

app.get('/todos', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        console.log('list todos request');

        db.collection('todos').find({}).toArray(function(err, items) {
            res.send(TodoSerializer.serialize(items));
            db.close();
        });
    });
});

app.post('/todos', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
            db.collection('todos').insert(todo, function(err, records) {
                res.send(TodoSerializer.serialize(records.ops[0]));
                db.close();
            });
        });
    });
});

app.delete('/todos/:todoId', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        db.collection('todos').deleteOne({ _id: new mongodb.ObjectID(req.params.todoId) }, function(err, results) {
            res.send(JSON.stringify(null));
            db.close();
        });
    });
});

app.patch('/todos/:todoId', function(req, res) {
    MongoClient.connect(url, function(err, db) {
        new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
            db.collection('todos').update({ _id: new mongodb.ObjectID(req.params.todoId) }, todo, function(err, results) {
                res.send(JSON.stringify(null));
                db.close();
            });
        });
    });
});

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
