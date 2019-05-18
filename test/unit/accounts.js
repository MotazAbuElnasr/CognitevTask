const request = require('supertest');
const app = require('../../helpers/testhelpers/test_config');
let jwtToken = '';

const has_keys = (res) => {
  if (!('first_name' in res.body)) throw new Error("missing first_name key");
  if (!('last_name' in res.body)) throw new Error("missing last_name key");
  if (!('phone_number' in res.body)) throw new Error("missing phone key");
  if (!('id' in res.body)) throw new Error("missing id key");
  if (!('country_code' in res.body)) throw new Error("missing email key");
  if (!('gender' in res.body)) throw new Error("missing email key");
  if (!('birthdate' in res.body)) throw new Error("missing birthdate key");
}
const has_token = (res) => {
  if (!('auth-token' in res.header)) throw new Error("missing auth token");
  else jwtToken = res.header['auth-token']
}
context('Testing the api routes', function () {

  describe('Unit testing the /account/register route', function () {
    it('Should return 201 if the user is created successfully', function () {
      return request(app)
        .post('/accounts/register')
        .field('first_name', "Motaz")
        .field('last_name', "Abu Elnasr")
        .field('phone_number', "+201095747000")
        .field('country_code', "EG")
        .field('email', "test@gmail.com")
        .field('gender', "male")
        .field('birthdate', "1995-01-20")
        .field('password', "1234")
        .attach('avatar', `${__dirname}/test_media/png.png`)
        .expect(201)
        .expect(has_keys)
    });
    it('Should return 200 and errors if no data is given', function () {
      return request(app)
        .post('/accounts/register')
        .send({})
        .expect(200, {
          "first_name": [{ "error": "blank" }],
          "last_name": [{ "error": "blank" }],
          "birthdate": [{ "error": "blank" }],
          "avatar": [{ "error": "blank" }],
          "gender": [{ "error": "inclusion" }],
          "country_code": [{ "error": "inclusion" }],
          "phone_number": [{ "error": "blank" }],
          "password": [{ "error": "blank" }]
        })
    });

  });

  describe('Unit testing the /account/token route', function () {
    it('Should return the token if phone number and password are correct', function () {
      return request(app)
        .post('/accounts/token')
        .send({
          'phone_number': "+201095747000",
          'password': "1234"
        })
        .expect(200)
        .expect(has_token)
    });
    it('Should return unauthorized phone number is incorrect', function () {
      return request(app)
        .post('/accounts/token')
        .send({
          'phone_number': "+2010923147000",
          'password': "1234"
        })
        .expect(401)
    });
    it('Should return unauthorized password is incorrect', function () {
      return request(app)
        .post('/accounts/token')
        .send({
          'phone_number': "+2010923147000",
          'password': "1232134"
        })
        .expect(401)
    });

  });


  describe('Unit testing the /account/validate route', function () {
    it('Should return status 200 if phone number and token are correct', function () {
      return request(app)
        .post('/accounts/validate')
        .set('auth-token', jwtToken)
        .send({
          'phone_number': "+201095747000",
          "status": { "status": "test" }
        })
        .expect(200)
    });
    it('Should return status 401 if phone number is not correct', function () {
      return request(app)
        .post('/accounts/validate')
        .set('auth-token', jwtToken)
        .send({
          'phone_number': "+2010951347000",
          "status": { "status": "test" }
        })
        .expect(401)
    });
    it('Should return status 401 if token is not correct', function () {
      return request(app)
        .post('/accounts/validate')
        .set('auth-token', `${jwtToken}invalid`)
        .send({
          'phone_number': "+201095747000",
          "status": { "status": "test" }
        })
        .expect(401)

    });

    it('Should return status 400 if there is missing data  ie: token', function () {
      return request(app)
        .post('/accounts/validate')
        .send({
          'phone_number': "+201095747000",
          "status": { "status": "test" }
        })
        .expect(400)

    });
    it('Should return status 400 if there is missing data  ie: phone number', function () {
      return request(app)
        .post('/accounts/validate')
        .set('auth-token', jwtToken)
        .send({
          "status": { "status": "test" }
        })
        .expect(400)

    });
    it('Should return status 400 if there is missing data  ie: status', function () {
      return request(app)
        .post('/accounts/validate')
        .set('auth-token', jwtToken)
        .send({
          'phone_number': "+201095747000",
        })
        .expect(400)

    });

  });
})

