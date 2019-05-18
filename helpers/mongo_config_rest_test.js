const mongoose = require("mongoose");

const MONGO_URL =
  process.env.MONG_URL || "mongodb+srv://motazabuelnasr:CEnGKjQBV9X5lVM3@motaz-dobv2.mongodb.net/test?retryWrites=true";
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
          console.log("DB connected");
          resolve();
        } else {
          console.log(err);
          reject(err);
        }
      }
    );
  });
};

before(async () => {
  await connectDB();
});

after(done => {
  mongoose.connection.collections.users.drop(() => {
    mongoose.connection.close();
  });
  done();
});
