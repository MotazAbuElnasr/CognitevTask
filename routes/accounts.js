const express = require('express');
const router = express.Router();
const check_errors = require('../helpers/validator.js');
const User = require('../models/User');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcryptjs');
const config = require('../helpers/jwt_config');
const jwt = require('jsonwebtoken');
// snake_case is used to match the nature of the request / response formatting
router.post('/register', fileUpload(), async function(req, res) {
  const body = req.body;
  const uploaded_file = req.files ? req.files.avatar : null;
  try {
    const {errors} = await check_errors(body, uploaded_file);
    validation_errors = errors;
    const errors_arr = Object.values(errors);
    // it's valid if every key is not defined
    is_valid = errors_arr.every((error) => error == undefined);
  } catch (error) {
    console.log(error)
    return res.status(500).send();
  }
  if (!is_valid) {
    // status code would be 200 because the request has been handled
    return res.json(validation_errors);
  }
  // for the sake of task 2 , I'll add password to the user model to be authenticated upon
  body.password = bcrypt.hashSync(body.password, 8);
  body.avatar = `${__dirname}/../media/${uploaded_file.md5}${uploaded_file.name}`;
  const user = new User(body);
  uploaded_file.mv(body.avatar, (err) => {
    if (err) {
    console.log(error)
      return res.status(500).send('error uploading');
    }
  });
  user.save(async (err, user_data) => {
    if (!err) {
      const {id, first_name, last_name, country_code, phone_number, gender, birthdate} = user_data;
      res.status(201).json({id, first_name, last_name, country_code, phone_number, gender, birthdate});
    } else {
      return res.status(500).send(console.log(err));
    }
  });
});

router.post('/token', (req, res) => {
  const {password, phone_number} = req.body;
  User.findOne({phone_number}, (err, user_data) => {
    if (err) {
      return res.status(500).send();
    }
    if (!user_data) {
      return res.status(401).send({error: 'invalid username or password'});
    }
    const is_valid_pass = bcrypt.compareSync(password, user_data.password);
    if (!is_valid_pass) {
      return res.status(401).send({error: 'invalid username or password'});
    }
    const token = jwt.sign({phone_number: user_data.phone_number}, config.secret, {
      expiresIn: 86400,
    });
    res.header('auth-token', token).send();
  });
});

router.post('/validate', (req, res) => {
  const token = req.header('auth-token');
  const {status, phone_number} = req.body;
  if (!token || !phone_number || !status) {
    return res.status(400).send();
  }

  jwt.verify(token, config.secret, function(err, decrypted_data) {
    if (err || phone_number != decrypted_data.phone_number) {
      return res.status(401).send();
    }
    User.updateOne({phone_number}, {$set: {status}}, (err) => {
      if (err) return res.status(500).send();
      res.status(200).send();
    });
  });
});
module.exports = router;
