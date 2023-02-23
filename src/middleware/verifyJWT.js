const jwt = require("jsonwebtoken");
const { access_token_secret } = require("../config/env/config");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

  const token = authHeader.split(" ")[1];
  console.log(token);

  jwt.verify(token, access_token_secret, (err, decoded) => {
    if (err) return res.status(403).send(`Invalid token`);

    //access user ID and roles
    req.user = decoded.UserInfo._id;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;
