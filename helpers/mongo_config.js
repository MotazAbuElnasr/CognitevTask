const mongoose = require("mongoose");
const MONGO_URL =
  process.env.MONG_URL ||
  "mongodb+srv://motazabuelnasr:CEnGKjQBV9X5lVM3@motaz-dobv2.mongodb.net/task?retryWrites=true";

mongoose.connect(
  MONGO_URL,
  {
    autoReconnect: true,
    useNewUrlParser: true,
    useCreateIndex: true
  },
  err => {
    if (!err) console.log("Mongo DB is connected");
    else console.log(err);
  }
);
