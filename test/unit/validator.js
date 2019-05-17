const chai = require("chai");
const should = chai.should;
const expect = chai.expect;
const rewire = require("rewire");

const validator = rewire("../../helpers/validator.js");
const create_error = validator.__get__("create_error");
const check_name_errors = validator.__get__("check_name_errors");
const check_birthdate_errors = validator.__get__("check_birthdate_errors");
const check_email_errors = validator.__get__("check_email_errors");
const check_country_code_errors = validator.__get__("check_country_code_errors");
const check_avatar_errors = validator.__get__("check_avatar_errors");

describe("Validator module", function() {
  context("Creating errors", function() {
    it("Should return error name desired format [{'error':'error_type'}]",function () {
        const type = "error_type" 
        expect(create_error('error_type')).to.deep.equal([{'error':'error_type'}])
    });
  });

  context("check for name errors", function() {
    it("Should return blank error when the name is undefined ",function () {
        expect(check_name_errors(undefined)).to.deep.equal([{'error':'blank'}])
    });
    it("Should return invalid error when the name is alphanumerical ",function () {
        expect(check_name_errors("12dnk2")).to.deep.equal([{'error':'invalid'}])
    });
    it("Should return undefined if no error exist ",function () {
        expect(check_name_errors("Motaz")).to.equal(undefined)
    });
  });

  context("check for birthdate errors", function() {
    it("Should return blank error when the birthdate is undefined ",function () {
        expect(check_birthdate_errors(undefined)).to.deep.equal([{'error':'blank'}])
    });
    it("Should return invalid error when the date is not in YYYY-MM-DD format ",function () {
        expect(check_birthdate_errors("10/12/2015")).to.deep.equal([{'error':'invalid'}])
    });
    it("Should return in the future error if the birthdate is not in the past ",function () {
        expect(check_birthdate_errors("2020-01-20")).to.deep.equal([{'error':'in_the_future'}])
    });
    it("Should return undefined if no error exist ",function () {
        expect(check_birthdate_errors("1995-01-20")).to.equal(undefined)
    });
  });

  context("check for email errors",  function() {
    it("Should return invalid error when the email is invalid ",async function () {
        const error = await check_email_errors("test.not_email")
        expect(error).to.deep.equal([{'error':'invalid'}])

    });
    // TODO : the db connection

    // it("Should return undefined if no error exist ",async function () {
    //     const error = await check_email_errors("motaz.abuelnasr@gmail.com")
    //     expect(error).to.equal(undefined)
    // }).timeout(10000);
  });

  context("check for country code errors", function() {
    it("Should return inclusion error if it's not valid country code",function () {
        expect(check_country_code_errors("not_a_country_code")).to.deep.equal([{'error':'inclusion'}])
    });

    it("Should return undefined if no error exist ",function () {
        expect(check_country_code_errors("EG")).to.equal(undefined)
    });
  });

  context("check for avatar errors", function() {
    it("Should return blank error if the avatar was not uploaded",function () {
        expect(check_avatar_errors(undefined)).to.deep.equal([{'error':'blank'}])
    });

    // it("Should return undefined if no error exist ",function () {
    //     expect(check_avatar_errors("EG")).to.equal(undefined)
    // });
  });


















});




