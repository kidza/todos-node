
var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/myproject';

var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

var TodoSerializer = new JSONAPISerializer('todo', {
    id: '_id',
    pluralizeType: false,
    attributes: ['todo-value', 'completed']
});

exports.listTodo = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        console.log('list todos request');

        db.collection('todos').find({}).toArray(function(err, items) {
            res.send(TodoSerializer.serialize(items));
            db.close();
        });
    });
};

exports.insertTodo = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
            db.collection('todos').insert(todo, function(err, records) {
                res.send(TodoSerializer.serialize(records.ops[0]));
                db.close();
            });
        });
    });
};

exports.deleteTodo = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        db.collection('todos').deleteOne({ _id: new mongodb.ObjectID(req.params.todoId) }, function(err, results) {
            res.send(JSON.stringify(null));
            db.close();
        });
    });
};

exports.updateTodo = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
            db.collection('todos').update({ _id: new mongodb.ObjectID(req.params.todoId) }, todo, function(err, results) {
                res.send(JSON.stringify(null));
                db.close();
            });
        });
    });
};