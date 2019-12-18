const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = process.env.PORT | 3000;

//import routers
const authRouter = require('./routes/authRoutes');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.use('/api/auth',authRouter);

app.listen(PORT,()=>{
  console.log('Server is up & running on port:'+PORT);
});
