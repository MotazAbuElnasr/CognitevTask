const mongoose = require("mongoose");
const User = require("../../models/User");
const app = require('./index')
const MONGO_URL =
  process.env.MONG_URL || "mongodb+srv://motazabuelnasr:CEnGKjQBV9X5lVM3@motaz-dobv2.mongodb.net/test?retryWrites=true";
let db;
const connectDB = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(
      MONGO_URL,
      {
        autoReconnect: true,
        useNewUrlParser: true,
        useCreateIndex: true
      },
      err => {
        if (!err) {
          mongoose.connection.collections.users.drop(() => {
            const test_user_data = {
              first_name: "Motaz",
              last_name: "Abu Elnasr",
              phone_number: "+201095747099",
              country_code: "EG",
              email: "motaz.abuelnasr@gmail.com",
              gender: "male",
              birthdate: "1995-01-20",
              password: "1234",
              avatar: "avatar_url"
            };
            const user = new User(test_user_data);
            user.save((err, data) => {
              if (!err) {
                console.log("Mongo DB is connected");
                console.log("user inserted");
                resolve();
              } else {
                console.log(err);
              }
            });
          });
        } else {
          console.log(err);
          reject(err);
        }
      }
    );
  });
};

before(async () => {
  db = await connectDB();
});

after(done => {
  mongoose.connection.close();
  app.close(()=>{
    console.log("server closed")
    console.log("db connection closed")
})
  done();
});

module.exports = app