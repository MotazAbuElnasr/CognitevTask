// const chai = require('chai');
// const supertest = require('supertest');
// const server = supertest.agent('http://localhost:4005');
// const User = require('../../models/User');

// context('REST requests and responses', () => {
//   beforeEach((done) => { // Before each test we empty the database
//     require('../../helpers/mongo_config_rest_test');
//     User.remove({}, (err) => {
//       done();
//     });
//   });
//   describe('/POST data', () => {
//     it('it should register the user', (done) => {
//       test_user_data = {
//         first_name: 'Motaz',
//         last_name: 'Abu Elnasr',
//         phone_number: '+201095747099',
//         country_code: 'EG',
//         email: 'motaz.abuelnasr@gmail.com',
//         gender: 'male',
//         birthdate: '1995-01-20',
//         password: '1234',
//         avatar: 'avatar_url',
//       };
//       server
//           .post('/accounts/register')
//           .send(test_user_data)
//           .end((err, res) => {
//             res.should.have.status(200);
//             res.body.should.be.a('object');
//             res.body.should.have.property('id');
//             res.body.should.have.property('first_name');
//             res.body.should.have.property('last_name');
//             res.body.should.have.property('phone_number');
//             res.body.should.have.property('birthdate');
//             res.body.should.have.property('email');
//             done();
//           });
//     });
//   });
// });
