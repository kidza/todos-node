var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var mongoose = require('mongoose');
var configParams = require('../config.js');

mongoose.Promise = global.Promise;
mongoose.connect(configParams.dbUrl);
// var db = mongoose.connection;

TodoModel = require('../model/todo.js');

var JSONAPISerializer = require('jsonapi-serializer').Serializer;
var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

var TodoSerializer = new JSONAPISerializer('todo', {
    id: '_id',
    pluralizeType: false,
    attributes: ['todo-value', 'completed']
});

exports.listTodo = function(req, res) {
    TodoModel.find({}).exec(function(err, items) {
        res.send(TodoSerializer.serialize(items));
    });
};

exports.insertTodo = function(req, res) {
    new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
        new TodoModel(todo).save(function(err, todoSaved) {
            res.send(TodoSerializer.serialize(todoSaved));
        });
    });
};

exports.deleteTodo = function(req, res) {
    TodoModel.findByIdAndRemove(req.params.todoId, function(err, todo) {
        res.send(JSON.stringify(null));
    });
};

exports.updateTodo = function(req, res) {
    new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
	    TodoModel.findByIdAndUpdate(req.params.todoId, todo, function(err, items) {
	        res.send(JSON.stringify(null));
	    });
    });
};
