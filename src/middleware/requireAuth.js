const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

// middleware function
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // if no Authorization header sent
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in!" });
  }

  const token = authorization.replace("Bearer ", "");
  // verify token with the secret
  jwt.verify(token, "secret", async (err, payload) => {
    // if the token can't be verified
    if (err) {
      return res.status(401).send({ error: "You must be logged in!" });
    }

    // extract userId from the payload from the token
    const { userId } = payload;
    // find the user in db by userId
    const user = await User.findById(userId);
    // reassign req.user to the found user
    req.user = user;
    next();
  });
};
