const mongoose = require("mongoose");
const dateFormat = require('dateformat');
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
    type: "String", unique: true ,required:true,
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
  avatar: {
    type: "String", unique: true ,required:true,
  },
  password:  { //for task2
    type: "String",required:true,
  }, 
  status: { type: mongoose.Schema.Types.Mixed, default: {} }
},
{
  toObject: { virtuals: true },
  minimize: false ,
}
);






user_schema.virtual('formated_birthdate').get(function() {
  const birthdate = new Date(this.birthdate);
  return dateFormat(birthdate,'yyyy-mm-dd') 
});



const User = new mongoose.model('User',user_schema);

module.exports = User;