require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const twoFactor = require("node-2fa");
const uniqid = require("uniqid");

const users = [];

//? Route to:  /user

router.post("/register", (req, res) => {
  if (
    req.body.name &&
    req.body.password &&
    req.body.authenticate !== undefined &&
    typeof req.body.authenticate === "boolean"
  ) {
    const user = users.find((user) => {
      return user.username === req.body.name;
    });
    if (!user) {
      let id;
      bcrypt.genSalt(parseInt(process.env.ROUNDS), function (_err, salt) {
        bcrypt.hash(req.body.password.toString(), salt, function (_err, hash) {
          // Generate new secret
          const newSecret = twoFactor.generateSecret({
            name: "daniel's app",
            account: req.body.name,
          });
          console.log(newSecret);
          // Generate Id
          id = uniqid();

          // Add to users
          users.push({
            id: id,
            username: req.body.name,
            hash: hash,
            salt: salt,
            authenticate: req.body.authenticate,
            secret: newSecret,
          });
        });
        res.json({ register: true, userId: id });
      });
    } else {
      res.status(400).send("Choose different name");
    }
  } else {
    res.status(400).send("Missing name / password / authenticate field");
  }
});

router.post("/login", (req, res) => {
  if (req.body.name && req.body.password) {
    const user = users.find((user) => {
      return user.username === req.body.name;
    });
    console.log(user);
    // Name exists
    if (user) {
      bcrypt.compare(
        req.body.password.toString(),
        user.hash,
        function (err, result) {
          // Valid password
          if (result) {
            if (user.authenticate) {
              res.json({
                login: false,
                authenticate: true,
                qrLink: user.secret.qr,
              });
            } else {
              res.json({ login: true, authenticate: false, id: user.id });
            }
          } else {
            // Wrong password to user
            res.status(400).send("Wrong name or password");
          }
        }
      );
    } else {
      res.status(400).send("Wrong name or password");
    }
  } else {
    res.status(400).send("Missing name / password field");
  }
});

router.post("/code", (req, res) => {
  if (req.body.code && req.body.id) {
    twofactor.verifyToken("XDQXYCP5AC6FA32FQXDGJSPBIDYNKK5W", "630618");
  } else {
    res.status(400).send("Missing code field");
  }
});

module.exports = router;
