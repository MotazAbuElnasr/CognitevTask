const express = require('express');
const usersRouter = require('./routes/accounts');
const app = express();
const helmet = require('helmet')
const PORT = process.env.PORT || 4005 ;
const fs = require('fs');
const dir = './media';

require('./helpers/mongo_config.js');


app.use(helmet())


app.use(express.json());
app.get('/', function (req, res) {
  res.send('hello, world!')
})
app.use('/accounts',usersRouter);

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
app.listen(PORT,()=>{
  console.log(`Server Started at port ${PORT}`);
});