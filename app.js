const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();

app.get("/test", (req, res) => {
  res.json({
    msg: "testing api",
  });
});

app.post("/post", verifyToken, (req, res) => {
  jwt.verify(req.token, "secret", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        msg: "post created",
        authData,
      });
    }
  });
});

app.post("/login", (req, res) => {
  // mock user
  const user = { id: 1, username: "eric", email: "eric@mail.com" };

  jwt.sign({ user }, "secret", (err, token) => {
    res.json({
      token: token,
    });
  });
});

//format of token
//authorization:bearer <access token>
// verify token

function verifyToken(req, res, next) {
  // get auth header value
  const bearerHeader = req.headers["authorization"];
  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //split at the space
    const bearer = bearerHeader.split(" ");
    // get token from array
    const bearerToken = bearer[1];
    //set the token
    req.token = bearerToken;
    //next middleware
    next();
  } else {
    // forbidden
    res.sendStatus(403);
  }
}

app.listen(8080, () => {
  console.log("connection success");
});
