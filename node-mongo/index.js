const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    
    assert.equal(err, null);

    console.log('Connect correctly to the Server');

    const db = client.db(dbname);
    const collection = db.collection('dishes');

    collection.insertOne({"name": "Uthapizza2", "description": "Test2"}, (err, result) => {
        assert.equal(err, null);

        console.log('After Insert: \n', result.ops);

        collection.find({}).toArray( (err, docs) => {
            assert.equal(err, null);

            console.log('Found: \n', docs);

            db.dropCollection('dishes', (err, result) => {
                assert.equal(err, null);

                client.close();
            });
        });
    });

});