const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  access_token_secret,
  refresh_token_secret,
} = require("../../config/env/config");

const handleLogin = async (req, res) => {
  try {
    const cookies = req.cookie;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const foundUser = await User.findOne({ email }).exec();

    if (!foundUser) return res.sendStatus(401); //Unauthorized

    // evaluate password
    const pwdMatch = await bcrypt.compare(password, foundUser.password);

    if (pwdMatch) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      // create accesss token
      const accessToken = jwt.sign(
        {
          UserInfo: {
            _id: foundUser._id.toString(),
            roles: roles,
          },
        },
        access_token_secret,
        { expiresIn: "15s" }
      );

      //create refresh token
      const newRefreshToken = jwt.sign(
        { _id: foundUser._id },
        refresh_token_secret,
        { expiresIn: "1d" }
      );

      //refresh token rotation
      let newRefreshTokenArray = !cookies?.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies?.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
          console.log("Attempted refresh token reuse at login!");
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          // sameSite: "None",
          // secure: true,
        });
      }

      // Save refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];

      await foundUser.save();

      // Create Secure Cookie with refresh token
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        // secure: true,
        // sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send authorization roles and access token to user
      res.json({ roles, accessToken });
    }
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { handleLogin };
