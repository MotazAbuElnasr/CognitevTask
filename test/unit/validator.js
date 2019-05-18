const chai = require('chai');
const expect = chai.expect;
const rewire = require('rewire');
const fs = require('fs');
const validator = rewire('../../helpers/validator.js');
const create_error = validator.__get__('create_error');
const check_name_errors = validator.__get__('check_name_errors');
const check_birthdate_errors = validator.__get__('check_birthdate_errors');
const check_email_errors = validator.__get__('check_email_errors');
const check_country_code_errors = validator.__get__('check_country_code_errors');
const check_avatar_errors = validator.__get__('check_avatar_errors');
const check_phone_errors = validator.__get__('check_phone_errors');
const check_gender_errors = validator.__get__('check_gender_errors');

describe('Validator module', function() {
  require('../../helpers/testhelpers/test_config');
  context('Creating errors', function() {
    it('Should return error name desired format [{\'error\':\'error_type\'}]', function() {
      expect(create_error('error_type')).to.deep.equal([{error: 'error_type'}]);
    });
  });

  context('check for name errors', function() {
    it('Should return blank error when the name is undefined ', function() {
      expect(check_name_errors(undefined)).to.deep.equal([{error: 'blank'}]);
    });
    it('Should return undefined if no error exist ', function() {
      expect(check_name_errors('Motaz')).to.equal(undefined);
    });
  });

  context('check for birthdate errors', function() {
    it('Should return blank error when the birthdate is undefined ', function() {
      expect(check_birthdate_errors(undefined)).to.deep.equal([{error: 'blank'}]);
    });
    it('Should return invalid error when the date is not in YYYY-MM-DD format ', function() {
      expect(check_birthdate_errors('10/12/2015')).to.deep.equal([{error: 'invalid'}]);
    });
    it('Should return in the future error if the birthdate is not in the past ', function() {
      expect(check_birthdate_errors('2020-01-20')).to.deep.equal([{error: 'in_the_future'}]);
    });
    it('Should return undefined if no error exist ', function() {
      expect(check_birthdate_errors('1995-01-20')).to.equal(undefined);
    });
  });

  context('check for phone errors', function() {
    it('Should return blank error when the phone is undefined ', async function() {
      const result = await check_phone_errors(undefined);
      expect(result).to.deep.equal([{error: 'blank'}]);
    });
    it('Should return not_a_number error if it contains characters ', async function() {
      const result = await check_phone_errors('010d5dsa87');
      expect(result).to.deep.equal([{error: 'not_a_number'}]);
    });
    it('Should return not_a_number error if it contains special characters ', async function() {
      const result = await check_phone_errors('0109548/*-2');
      expect(result).to.deep.equal([{error: 'not_a_number'}]);
    });

    it('Should return too_short error with the minumum length if length is less than 10 digits ', async function() {
      const result = await check_phone_errors('+2015106');
      expect(result).to.deep.equal([{error: 'too_short', count: '10'}]);
    });
    it('Should return too_long error with the max length if length is greater than 10 digits ', async function() {
      const result = await check_phone_errors('+201154512872545106');

      expect(result).to.deep.equal([{error: 'too_long', count: '15'}]);
    });
    it('Should return invalid if the number construction is wrong ', async function() {
      const result = await check_phone_errors('+20109574709');
      expect(result).to.deep.equal([{error: 'invalid'}]);
    });
    it('Should return taken if phone number is taken ', async function() {
      const result = await check_phone_errors('+201095747099');
      expect(result).to.deep.equal([{error: 'taken'}]);
    });
    it('Should return undefined if no error exist ', async function() {
      const result = await check_phone_errors('+201095747088');
      expect(result).to.deep.equal(undefined);
    });
  });
  context('check for email errors', function() {
    it('Should return invalid error when the email is invalid ', async function() {
      const result = await check_email_errors('test.not_email');
      expect(result).to.deep.equal([{error: 'invalid'}]);
    });
    it('Should return taken if email is taken ', async function() {
      const result = await check_email_errors('motaz.abuelnasr@gmail.com');
      expect(result).to.deep.equal([{error: 'taken'}]);
    });
    it('Should return undefined if no error exist ', async function() {
      const result = await check_email_errors('email@isnotexit.indb');
      expect(result).to.deep.equal(undefined);
    });
  });
  context('check for country code errors', function() {
    it('Should return inclusion error if it\'s not valid country code', function() {
      expect(check_country_code_errors('not_a_country_code')).to.deep.equal([{error: 'inclusion'}]);
    });

    it('Should return undefined if no error exist ', function() {
      expect(check_country_code_errors('EG')).to.equal(undefined);
    });
  });

  context('check for gender errors', function() {
    it('Should return inclusion error if it\'s not valid country code', function() {
      expect(check_gender_errors('not_gender')).to.deep.equal([{error: 'inclusion'}]);
    });
    it('Should return undefined if male is passed ', function() {
      expect(check_gender_errors('male')).to.equal(undefined);
    });
    it('Should return undefined if female is passed ', function() {
      expect(check_gender_errors('male')).to.equal(undefined);
    });
  });

  context('check for avatar errors', function() {
    it('Should return blank error if the avatar was not uploaded', function() {
      expect(check_avatar_errors(undefined)).to.deep.equal([{error: 'blank'}]);
    });

    it('should return invalid content type error if the uploaded file is not an img ie: PDF', function() {
      const data = fs.readFileSync(`${__dirname}/test_media/pdf.pdf`)
      const avatar = {data}
      expect(check_avatar_errors(avatar)).to.deep.equal([{error: 'invalid_content_type'}]);
    });

    it('should return invalid content type error if the uploaded file is not an img ie: Docx', function() {
      const data = fs.readFileSync(`${__dirname}/test_media/docx.docx`)
      const avatar = {data}
      expect(check_avatar_errors(avatar)).to.deep.equal([{error: 'invalid_content_type'}]);
    });
    
    it("should return undefined if the uploaded file is of type image/png",function () {
      const data = fs.readFileSync(`${__dirname}/test_media/png.png`)
      const avatar = {data}

      expect(check_avatar_errors(avatar)).to.deep.equal(undefined);
    });

    it("should return undefined if the uploaded file is of type image/jpg",function () {
      const data = fs.readFileSync(`${__dirname}/test_media/jpg.jpg`)
      const avatar = {data}

      expect(check_avatar_errors(avatar)).to.deep.equal(undefined);
    });
    it("should return undefined if the uploaded file is of type image/png",function () {
      const data = fs.readFileSync(`${__dirname}/test_media/png.png`)
      const avatar = {data}
      expect(check_avatar_errors(avatar)).to.deep.equal(undefined);
    });
  });
});
