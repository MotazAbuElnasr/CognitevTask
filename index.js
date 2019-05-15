const express = require('express');
const usersRouter = require('./routes/accounts');
const app = express();
const helmet = require('helmet')
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 3001 ;
require('./helpers/mongoConfig.js');


// setup a secure end-point
app.use(helmet())

app.use(express.json());
app.use(fileUpload)
app.get('/', function (req, res) {
  res.send('hello, world!')
})
app.use('/accounts', usersRouter);


app.listen(PORT,()=>{
  console.log(`Server Started at port ${PORT}`);
});