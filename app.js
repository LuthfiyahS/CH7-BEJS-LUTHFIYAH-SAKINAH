require('dotenv').config();

const express = require("express");
const session = require('express-session')
const app = express();
const port = process.env.PORT || 3000;
const path = require('path')
const bodyParser = require("body-parser");
const moment = require("moment");
const fs = require('fs');

//logger (morgan)
const morgan = require("morgan")


//passport
const passport = require("passport")
const flash = require("express-flash")
require("./middleware/passport-config")

//routes
const routerapi = require("./routes/api");
const routerview = require("./routes/view");
const AuthapiRouter = require("./routes/authApiRouter")
const AuthviewRouter = require("./routes/authViewRouter")

//docs
const swaggerJSON = require('./api_docs/swagger.json')
const YAML = require('yamljs')//generate postman
const swaggerDocument = YAML.load('./api_docs/collection.yaml')
const swaggerUI = require('swagger-ui-express')


//documentation
//app.use("/docs",swaggerUI.serve, swaggerUI.setup(swaggerJSON))//dari swagger langsung edit manual
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))//dari postman generate

app.use(bodyParser.urlencoded({ extended: false,limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())

//set view engine
app.use('/static', express.static(path.join(__dirname, '/public')))
app.use('/static/file/video', express.static('/public/file/video'))
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

//custom morgan
const originalSend = app.response.send

let log_name = '/logs/access_log_'+moment().format('YYYY_MM_DD')+'.log';
let accessLogStream = fs.createWriteStream(path.join(__dirname, log_name), { flags: 'a' })

app.response.send = function sendOverWrite(body) {
    originalSend.call(this, body)
    this.resBody = body
}

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]', {
  stream: accessLogStream
}))

morgan.token('res-body', (req, res) => {
  if(res.getHeader('Content-Type') == 'application/json; charset=utf-8'){
      if(typeof res.resBody == 'string'){
          return res.resBody        
      }else{
          return JSON.stringify(res.resBody)      
      }
  }
  return JSON.stringify({
      'message': 'Accessing View'
  })
})

app.use("/", routerview);
app.use("/api/v1", routerapi);
app.use(AuthapiRouter);
app.use(AuthviewRouter);

// handler for path 404 not found page
app.use((req, res, next) => {
    res.status(404).render("errors/404");
});

//app.listen(port, () => console.log(`Server Connent, run on port http://localhost:${port}`));

module.exports = app