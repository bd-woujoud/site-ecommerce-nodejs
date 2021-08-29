// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/bootcamp'; // bootcamp est le nom de la base de données
mongoose.connect(mongoDB,{ useNewUrlParser: true ,useUnifiedTopology: true});
mongoose.Promise = global.Promise;
module.exports = mongoose;


// const app = require("../newserver");
// const mongoose = require("mongoose");
// const supertest = require("supertest");

// beforeEach((done) => {
//   mongoose.connect("mongodb://localhost:27017/boot", 
//     { useNewUrlParser: true, useUnifiedTopology: true },
//     () => done());
// });

// afterEach((done) => {
//   mongoose.connection.db.dropDatabase(() => {
//     mongoose.connection.close(() => done())
//   });
// });
