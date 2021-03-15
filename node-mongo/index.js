const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOperations = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'conFusion';

MongoClient.connect(url).then( (client) => {
    
    // assert.strictEqual(err, null);                     // No need to check error with assert

    console.log('Connect correctly to the Server');

    const db = client.db(dbname);

    dbOperations.insertDocument(db, { name: "Vadonut", description: "Test Vadonut"}, 'dishes')
        .then( (result) => {
    
            console.log('Insert Document: \n', result.ops);     // ops Tells us the number of insert operations 
        
            return dbOperations.findDocuments(db, 'dishes');
        })

        .then( (docs) => {

            console.log('Found Documents: \n', docs);

            return dbOperations.updateDocument(db, {name: 'Vadonut'}, { description: 'Updated Test'}, 'dishes');
        })
        
        .then( (result) => {

            console.log('Updated Document: ', result.result);

            return dbOperations.findDocuments(db, 'dishes');
        })
      
        .then( (docs) => {
    
            console.log('Found Updated Documents: \n', docs);

            return db.dropCollection('dishes');
        })
        
        .then( (result) => {

            console.log('Dropped Collection: ', result);
            
            client.close();
        })
        
        .catch( (err) => {
            console.log(err)
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

})
.catch( (err) => {
    console.log(err)
});