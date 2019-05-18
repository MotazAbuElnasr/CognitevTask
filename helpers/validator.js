const {getCodes} = require('country-list');
const twilio = require('twilio');
const isAfter = require('validator/lib/isAfter');
const isISO8601 = require('validator/lib/isISO8601');
const isEmail = require('validator/lib/isEmail');
const User = require('../models/User');
const fileType = require('file-type');
// this is trial twilio credentials that should be in the process.ENV
const client = twilio('AC6e7561f1812333eac01de88986634b5b', 'bf747f4b54a3fd919ec27d1a67bb178b').lookups.v1;

const create_error = (error_type) => [{error: error_type}];

const check_name_errors = (name) => {
  if (!name) {
    return create_error('blank');
  }
};

const check_birthdate_errors = (birthdate) => {
  if (!birthdate) {
    return create_error('blank');
  }
  if (!isISO8601(birthdate)) {
    return create_error('invalid');
  }
  if (isAfter(birthdate)) {
    // the function default is now
    return create_error('in_the_future');
  }
};

const check_email_errors = async (email) => {
  if (!isEmail(email)) {
    return create_error('invalid');
  }
  const user = await User.findOne({email});
  if (user) {
    return create_error('taken');
  }
};
// using twilio API has a proven efficiency in validating phone numbers for countries
const verify = (phoneNumber) => {
  return client
      .phoneNumbers(phoneNumber)
      .fetch()
      .then(() => true, () => false);
};

const check_phone_errors = async (phone_number) => {
  if (!phone_number) {
    return create_error('blank');
  }
  if (isNaN(phone_number)) {
    return create_error('not_a_number');
  }
  if (phone_number.length < 10) {
    return [{...create_error('too_short')[0], count: '10'}];
  }
  if (phone_number.length > 15) {
    return [{...create_error('too_long')[0], count: '15'}];
  }
  const valid_phone = await verify(phone_number);
  if (!valid_phone) {
    return create_error('invalid');
  }
  const user = await User.findOne({phone_number});
  if (user) {
    return create_error('taken');
  }
  // not_exist error needs an api to check the fake numbers
};

const check_country_code_errors = (country_code) => {
  if (!getCodes().includes(country_code)) {
    return create_error('inclusion');
  }
};

const check_avatar_errors = (avatar) => {
  if (!avatar) {
    return create_error('blank');
  }
  const allowed_types = ['image/png', 'image/jpg', 'image/jpeg'];
  const file_type = fileType(avatar).mime; 
  if (!allowed_types.includes(file_type)) {
    return create_error('invalid_content_type');
  }
};

const check_gender_errors = (gender) => {
  if (!['male', 'female'].includes(gender)) {
    return create_error('inclusion');
  }
};
const check_password_errors = (password) => {
  if (!password) {
    return create_error('blank');
  }
};

const check_errors = async (body, avatar) => {
  const errors = {};
  errors.first_name = check_name_errors(body.first_name);
  errors.last_name = check_name_errors(body.last_name);
  errors.birthdate = check_birthdate_errors(body.birthdate);
  errors.avatar = check_avatar_errors(avatar);
  errors.gender = check_gender_errors(body.gender);
  errors.country_code = check_country_code_errors(body.country_code);
  errors.phone_number = await check_phone_errors(body.phone_number);
  errors.password = check_password_errors(body.password);
  if (body.email) {
    errors.email = await check_email_errors(body.email);
  }
  return {errors};
};

module.exports = check_errors;
