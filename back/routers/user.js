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
    bcrypt.genSalt(process.env.ROUNDS, function (_err, salt) {
      bcrypt.hash(req.body.password, salt, function (_err, hash) {
        const newSecret = twoFactor.generateSecret({
          name: req.body.name,
          hash: hash,
        });
        users.push({
          id: uniqid(),
          username: req.body.name,
          hash: hash,
          salt: salt,
          authenticate: req.body.authenticate,
          secret: newSecret,
        });
      });
      res.send("Success");
    });
  } else {
    res.status(400).send("Missing name / password field");
  }
});

router.post("/login", (req, res) => {
  if (req.body.name && req.body.password) {
    const user = users.find((user) => {
      return user.name === req.body.name;
    });
    bcrypt.compare(req.body.password, user.hash, function (err, result) {
      if (result) {
        if (user.authenticate) {
        } else {
          res.json({ login: true, authenticate: false });
        }
      } else {
        // access denied
      }
    });
  } else {
    res.status(400).send("Missing name / password field");
  }
});

module.exports = router;
