const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  access_token_secret,
  refresh_token_secret,
} = require("../../config/env/config");

const handleLogin = async (req, res) => {
  try {
    // const cookies = req.cookie;
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    await User.findOne({ username })
      .exec()
      .then(async (foundUser) => {
        if (!foundUser) return res.sendStatus(401); //Unauthorized

        // evaluate password
        const pwdMatch = await bcrypt.compare(password, foundUser.password);

        if (pwdMatch) {
          res.clearCookie("jwt", {
            httpOnly: true,
            // sameSite: "None",
            // secure: true,
          });

          const roles = Object.values(foundUser.roles).filter(Boolean);

          // create accesss token
          const accessToken = jwt.sign(
            {
              UserInfo: {
                _id: foundUser._id.toString(),
                roles,
              },
            },
            access_token_secret,
            { expiresIn: "10800s" } //use 10 mins = 600s in prod,using 3hrs now
          );

          //create refresh token
          const newRefreshToken = jwt.sign(
            { _id: foundUser._id },
            refresh_token_secret,
            { expiresIn: "1d" }
          );

          // Save refreshtokens with current user
          foundUser.refreshToken = [newRefreshToken];

          await foundUser.save();

          // Create Secure Cookie with refresh token
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            // secure: true,
            // sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });

          // Send authorization roles and access token to user
          res.json({ username, roles, accessToken });
        } else {
          res.status(401).json("Invalid credentials!");
        }
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { handleLogin };
