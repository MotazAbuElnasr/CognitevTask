const mongoose = require("mongoose");
const MONGO_URL =
  process.env.MONG_URL ||
  "mongodb+srv://motaz:Cognitev_task@!Motaz2019@motaz-dobv2.mongodb.net/test?retryWrites=true";

mongoose.connect(
  MONGO_URL,
  {
    autoReconnect: true,
    useNewUrlParser: true
  },
  err => {
    if (!err) console.log("Mongo DB is connected");
    else console.log(err);
  }
);
