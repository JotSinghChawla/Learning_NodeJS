const mongoose = require('mongoose');
const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion';
const connect = mongoose.connect(url);

connect.then( (db) => {
    console.log('We are Connected to the Server');

    // var newDish = Dishes({
    //     name: 1,
    //     description: 'This is a Test'
    // });

    Dishes.create({
            name: 'Uthapizza',
            description: 'This is a Test'
        })

    // newDish.save()
        .then( (dish) => {
            console.log(dish);

            return Dishes.findByIdAndUpdate( dish._id, {
                $set: { description : 'Updated Test' }
            },{
                new: true,
                useFindAndModify: false                 // Because findByIdAndUpdate is deprecated
            }).exec();
        })
        .then( (dishes) => {
            console.log('Founded: ',dishes);
            
            dishes.comments.push({
                rating: 4,
                comment: 'I love the Food here',
                author: 'Someone'  
            });

            return dishes.save(); 
        })
        .then( (dish) => {
            console.log(dish);

            return Dishes.deleteMany({});
        })
        .then( () => {
            return mongoose.connection.close();

        })
        .catch( (err) => {
            console.log('Error: ',err);
        });
});