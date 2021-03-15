const assert = require('assert');

exports.insertDocument = (db, document, collection, callback) => {
    const collec = db.collection(collection);

    return collec.insert(document);

};

exports.findDocuments = (db, collection, callback) => {
    const collec = db.collection(collection);

    return collec.find({}).toArray();
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const collec = db.collection(collection);

    return collec.updateOne( document, { $set: update }, null);
};

exports.removeDocument = (db, document, collection, callback) => {
    const collec = db.collection(collection);

    return collec.deleteOne( document);
};