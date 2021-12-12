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
                id: user.id,
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
    const user = users.find((user) => {
      return user.id === req.body.id;
    });
    if (user) {
      const delta = twoFactor.verifyToken(user.secret.secret, req.body.code);
      console.log(delta);
      if (delta && delta.delta >= 0 && delta.delta <= 4) {
        res.json({ login: true, authenticate: true, id: user.id });
      } else {
        res.json({ login: false, authenticate: true, id: user.id });
      }
    } else {
      // Wrong ID
      res.status(400).send("Could not find user");
    }
  } else {
    res.status(400).send("Missing code field");
  }
});

router.get("/authenticate/:id", (req, res) => {
  const user = users.find((user) => {
    return user.id === req.params.id;
  });
  if (user) {
    user.authenticate = user.authenticate ? false : true;
    res.json({ authenticate: user.authenticate });
  } else {
    res.status(400).send("Could not find user");
  }
});

module.exports = router;
