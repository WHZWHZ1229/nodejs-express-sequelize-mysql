const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var session = require('express-session');
var FileStore = require('session-file-store')(session);
const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
  credentials: true
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// // drop the table if it already exists
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

var identityKey = 'skey';
app.use(session({
  name: identityKey,
  secret: 'wrx',  // 用来对session id相关的cookie进行签名
  // store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
  saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
  resave: false,  // 是否每次都重新保存会话，建议false
  cookie: {
    maxAge: 60 * 60 * 1000  // 有效期，单位是毫秒
  }
}));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/turorial.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
