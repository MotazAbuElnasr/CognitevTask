const { getCodes } = require("country-list");
const twilio = require("twilio");
const isAfter = require("validator/lib/isAfter");
const isISO8601 = require("validator/lib/isISO8601");
const isAlpha = require("validator/lib/isAlpha");
const isEmail = require("validator/lib/isEmail");
// this is trial twilio credentials that should be in the process.ENV
// const client = twilio("AC6e7561f1812333eac01de88986634b5b", "bf747f4b54a3fd919ec27d1a67bb178b").lookups.v1;

const create_error = error_type => [{ error: error_type }];

const check_name_errors = name => {
    if (!name) {
      return create_error("blank");
    }
    // checking the validation of the names were not in the errors listed, However it's crucial to be done
    if (!isAlpha(name)) {
      return create_error("invalid");
    }
};
const check_birthdate_errors = birthdate => {
  if (!birthdate) {
    return create_error("blank");
  }
  if (!isISO8601(birthdate)) {
    return create_error("invalid");
  }
  if (isAfter(birthdate)) {
    //the function default is now
    return create_error("in_the_future");
  }
};
const check_email_errors = email => {
  if(!isEmail(email)){
    return create_error("invalid")
  }
}

const check_phone_errors = async phone_number => {
  // using twilio API has a proven efficiency in validating phone numbers for countries
  const verify = phoneNumber => {
    return client
      .phoneNumbers(phoneNumber)
      .fetch()
      .then(numberData => true, err => false);
  };
  if (!phone_number) {
    return create_error("blank");
  }
  if (isNaN(phone_number)) {
    return create_error("not_a_number");
  }
  if (phone_number.length < 10) {
    return { ...create_error("too_short")[0], count: "10" };
  }
  if (phone_number.length > 15) {
    return { ...create_error("too_long")[0], count: "15" };
  }

  // const valid_phone = await verify(phone_number);
  // if (!valid_phone) {
  //   errors.phone_number = create_error("invalid");
  //   return errors;
  // }

  // check if it's taken
  // not_exist error needs an api to check the fake numbers
};

/*
 "avatar": [ { "error": "blank" }, { "error": "invalid_content_type" } ], "email": [
{ "error": "taken" }, { "error": "invalid" } ] } }
*/

//TODO: taken email, 

const check_errors = async body => {
  const errors = {};
  errors.first_name = check_name_errors(body.first_name);
  errors.last_name = check_name_errors(body.last_name);
  errors.birthdate = check_birthdate_errors(body.birthdate);
  if (body.email){ 
    // email is not required
    errors.email = check_email_errors(body.email);
  }

  // check existence of country code in the country code list
  if (!getCodes().includes(body.country_code)) {
    errors.country_code = create_error("inclusion");
  } else {
    errors.phone_number = [await check_phone_errors(body.phone_number)];
  }
  if (!["male", "female"].includes(body.gender)) {
    errors.gender = create_error("inclusion");
  }
  return { errors };
};

module.exports = check_errors;
