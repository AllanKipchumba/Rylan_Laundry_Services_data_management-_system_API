const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const {
  refresh_token_secret,
  access_token_secret,
} = require("../../config/env/config");

const getAccessToken = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //unauthorised
    const refreshToken = cookies.jwt;

    await User.findOne({ refreshToken })
      .exec()
      .then((foundUser) => {
        if (!foundUser)
          return res.status(403).send(`No user with such refresh token found`); //Forbidden

        //remove the used refresh token
        const newRefreshTokenArray = foundUser.refreshToken.filter(
          (rt) => rt !== refreshToken
        );

        //verify refresh token
        jwt.verify(refreshToken, refresh_token_secret, async (err, decoded) => {
          if (err) return console.log(err);

          try {
            if (decoded._id !== foundUser._id.toString()) {
              return res.sendStatus(403);
            }

            const roles = Object.values(foundUser.roles).filter(Boolean);

            //create a new access token
            const accessToken = jwt.sign(
              {
                UserInfo: {
                  _id: decoded._id,
                  roles,
                },
              },
              access_token_secret,
              { expiresIn: "600s" } //use 10mins -600s in prod
            );

            //create new refresh token
            const newRefreshToken = jwt.sign(
              { _id: foundUser._id.toString() },
              refresh_token_secret,
              { expiresIn: "1d" }
            );

            //save refresh token with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            // Create secure Cookie with refresh token
            res.cookie("jwt", newRefreshToken, {
              httpOnly: true,
              // secure: true,
              // sameSite: "None",
              maxAge: 24 * 60 * 60 * 1000,
            });

            res.json({ roles, accessToken });
          } catch (error) {
            res.status(500).send(`Error: ${error}`);
            console.log(error);
          }
        });
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { getAccessToken };
