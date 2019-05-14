const express = require("express");
const router = express.Router();
const check_errors = require("../helpers/validator.js")



router.post("/register", async function(req, res) {
  body = req.body;
  const { first_name, last_name, country_code, phone_number, gender, birthdate, email } = body;
  errors = {};
  try {
    errors = await check_errors(body);
  } catch (error) {
    console.log(error);
  }
  res.json(errors);

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
