const express = require("express");
const router = express.Router();
const {check_errors , create_error} = require("../helpers/validator.js")
const User = require('../models/User')



router.post("/register", async function(req, res) {
  console.log(req.body)
  console.log(req.files)
  const body = req.body;
  let validation_errors = {};
  try {
    const {errors} = await check_errors(body);
    validation_errors = errors
    errors_arr = Object.values(errors)
    // it's valid if every key is not defined
    is_valid = errors_arr.every(value => value == undefined )
  } catch (error) {
    res.status(500).send("connection_closed")
    return
  }

  if (is_valid){
    const user = new User(body)
    user.save((err,data)=>{
      if (!err) {
      res.status(201).json(data)
      }
      else{
        res.status(500).send("server_err")
      }
    })  
  }
  else{
    // status code would be 200 because the request has been handled
    res.json(validation_errors);
  }

  // let img;
  // let uploadFile = req.files.file;
  // const fileName = `${new Date().toISOString()}${Math.random()}${req.files.file.name}`;

  // User.findOne({ email }).then(user => {
  //   if (user) {
  //     return res.status(400).json({ err: "Email already exists " });
  //   } else {
  //     uploadFile.mv(`${__dirname}/../public/${fileName}`, err => {
  //       if (err) {
  //         return res.status(500).send(err);
  //       }

  //       img = `../../../${fileName}`;

  //       const user = new User({
  //         firstName,
  //         lastName,
  //         email,
  //         password,
  //         img
  //       });
  //       user
  //         .save()
  //         .then(() => {
  //           return user.getAuthToken();
  //         })
  //         .then(token => {
  //           console.log(user);
  //           res.header("x-auth", token).send(user);
  //         })
  //         .catch(err => res.status(404).send({ err, err: "save error" }));
  //     });
  //   }
  // });
});

module.exports = router;
