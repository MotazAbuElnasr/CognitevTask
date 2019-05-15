const mongoose = require("mongoose");

const user_schema = new mongoose.Schema({
  first_name: {
    type: "String", required: true,
  },
  last_name: {
    type: "String", required: true,
  },
  country_code: {
    type: "String" , required :true,
  },
  phone_number: {
    type: "Number", unique: true ,required:true,
  },
  gender: {
    type: "String", enum: ["male", "female"] , required : true,
  },
  birthdate :{
    type :"Date", required:true,
  },
  email: {
    type: "String",unique: true,
  },
  avatar: String,
});





const User = new mongoose.model('User',user_schema);

module.exports = User;