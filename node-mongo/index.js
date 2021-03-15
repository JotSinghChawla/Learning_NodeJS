const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOperations = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url, (err, client) => {
    
    assert.equal(err, null);

    console.log('Connect correctly to the Server');

    const db = client.db(dbname);

    dbOperations.insertDocument(db, { name: "Vadonut", description: "Test Vadonut"}, 'dishes', (result) => {
    
        console.log('Insert Document: \n', result.ops);     // ops Tells us the number of insert operations 

        dbOperations.findDocuments(db, 'dishes', (docs) => {

            console.log('Found Documents: \n', docs);

            dbOperations.updateDocument(db, {name: 'Vadonut'}, { description: 'Updated Test'}, 'dishes', (result) => {

                console.log('Updated Document: ', result.result);

                dbOperations.findDocuments(db, 'dishes', (docs) => {
            
                    console.log('Found Updated Documents: \n', docs);

                    db.dropCollection('dishes', (result) => {
                        console.log('Dropped Collection: ', result);
                    });
                }); 
            });
        });
    });





    // const collection = db.collection('dishes');

    // collection.insertOne({"name": "Uthapizza2", "description": "Test2"}, (err, result) => {
    //     assert.equal(err, null);

    //     console.log('After Insert: \n', result.ops);

    //     collection.find({}).toArray( (err, docs) => {
    //         assert.equal(err, null);

    //         console.log('Found: \n', docs);

    //         db.dropCollection('dishes', (err, result) => {
    //             assert.equal(err, null);

    //             client.close();
    //         });
    //     });
    // });

});