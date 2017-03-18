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
        console.log('save todos request');
        console.log(req.body);
        new JSONAPIDeserializer().deserialize(req.body, function(err, todo) {
            console.log(todo);
            db.collection('todos').insert(todo, function(err, records) {
                console.log(records);
                res.send(TodoSerializer.serialize(records.ops));
                db.close();
            });
        });
    });
});

// app.delete('/todos', function(req, res)) {
// 	MongoClient.connect(url, function(err, db) {

// 	});
// });


var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
})
