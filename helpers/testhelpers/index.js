const express = require('express');
const usersRouter = require('../../routes/accounts');
const app = express();
const helmet = require('helmet')
const PORT = process.env.PORT || 4000 ;
const fs = require('fs');
const dir = '../../media';

app.use(helmet())

app.use(express.json(({limit: '10mb', extended: true})));
app.use('/accounts',usersRouter);

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
const server = app.listen(PORT,()=>{
  console.log(`Server Started at port ${PORT}`);
});
module.exports = server