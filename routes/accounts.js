const express = require("express");
const router = express.Router();
const check_errors = require("../helpers/validator.js");
const User = require("../models/User");
const fileUpload = require("express-fileupload");
const bcrypt = require("bcryptjs");
const config = require("../helpers/jwtconfig");
const jwt = require("jsonwebtoken");
const limiters = require("../helpers/limiters");



router.post("/register", fileUpload(), async function(req, res) {
  const body = req.body;
  const uploaded_file = req.files ? req.files.avatar : null;
  let validation_errors = {};
  try {
    const {errors} = await check_errors(body, uploaded_file);
    validation_errors = errors;
    errors_arr = Object.values(errors);
    // it's valid if every key is not defined
    is_valid = errors_arr.every(error => error == undefined);
  } catch (error) {
    console.log(error)
    return res.status(500).send("connection_closed");
  }
  if (is_valid) {
    // for the sake of task 2 , I'll add password to the user model to be authenticated upon
    body.password = bcrypt.hashSync(body.password, 8);
    body.avatar = `${__dirname}/../media/${uploaded_file.md5}${uploaded_file.name}`;
    const user = new User(body);
    user.save((err, user_data) => {
      if (!err) {
        uploaded_file.mv(body.avatar, err => {
          if (err) {
            res.status(500).send();
          }
          const {id, first_name, last_name, country_code, phone_number, gender} = user_data;
          const birthdate = user_data.formated_birthdate; //using the virtual attr
          res.status(201).json({id, first_name, last_name, country_code, phone_number, gender, birthdate});
        });
      } else {
        return res.status(500).send();
      }
    });
  } else {
    // status code would be 200 because the request has been handled
    res.json(validation_errors);
  }
});


router.post("/token", (req, res) => {
  const {password, phone_number} = req.body;
  User.findOne({phone_number}, (err, user_data) => {
    if(err) {
      return res.status(500).send()
    }
    if (!user_data){
      return res.status(401).send();
    }
    const is_valid_pass = bcrypt.compareSync(password, user_data.password);
    if (!is_valid_pass) {
      return res.status(401).send();
    }
    const token = jwt.sign({phone_number: user_data.phone_number}, config.secret, {
      expiresIn: 86400
    });
    res.header("auth-token", token).send();
  });
});

router.post("/validate", (req, res) => {
  const token = req.header("auth-token");
  const {status, phone_number} = req.body;
  if (!token || !phone_number || !status) {
    return res.status(400).send({auth: false});
  }
  jwt.verify(token, config.secret, function(err, decrypted_data) {
    if (err||phone_number!=decrypted_data.phone_number) {
      return res.status(400).send({auth: false});
    }
    User.findOne({phone_number}, (err, user) => {
      if(err) return res.status(500).send()
      if (!user) {
        return res.status(401).send(); //unauthorized
      }
      User.updateOne({phone_number},{$set:{status}},(err)=>{
        if(err) return res.status(500).send()
        res.status(200).send();

      })
    });
  });
});
module.exports = router;
