const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const {
  refresh_token_secret,
  access_token_secret,
} = require("../../config/env/config");

const getRefreshToken = async (req, res) => {
  try {
    //extract cookie from user's request
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(401); //unauthorised

    const refreshToken = cookies.jwt;

    //clear refresh tokens on client's browser
    res.clearCookie("jwt", {
      httpOnly: true,
      //  sameSite: "None",
      //  secure: true
    });

    //find user with the refresh token
    await User.findOne({ refreshToken })
      .exec()
      .then((foundUser) => {
        //user was not found
        if (!foundUser) {
          // Detected refresh token reuse!
          jwt.verify(
            refreshToken,
            refresh_token_secret,
            async (err, decoded) => {
              if (err) return res.sendStatus(403); //Forbidden

              const hackedUser = await User.findOne({
                _id: decoded._id,
              }).exec();

              hackedUser.refreshToken = [];
              const result = await hackedUser.save();
              console.log(result);
            }
          );
          return res.sendStatus(403); //Forbidden
        }

        //user was found
        //remove the refresh token used to request a new access token
        const newRefreshTokenArray = foundUser.refreshToken.filter(
          (rt) => rt !== refreshToken
        );

        // evaluate the refresh token
        jwt.verify(refreshToken, refresh_token_secret, async (err, decoded) => {
          //expired refresh token
          if (err) {
            foundUser.refreshToken = [...newRefreshTokenArray];
            await foundUser.save();
          }

          if (err || foundUser._id !== decoded._id) return res.sendStatus(403);

          // Refresh token was still valid
          const roles = Object.values(foundUser.roles);

          //create a new access token
          const accessToken = jwt.sign(
            {
              UserInfo: {
                _id: decoded._id,
                roles: roles,
              },
            },
            access_token_secret,
            { expiresIn: "10s" } //should expire in 10mins - 15 mins in prod
          );

          //create a new refresh token
          const newRefreshToken = jwt.sign(
            { _id: foundUser._id },
            refresh_token_secret,
            { expiresIn: "1d" }
          );

          // Save the refreshToken with current user
          foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
          await foundUser.save();

          // Create a Secure Cookie with refresh token
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            //   secure: true,
            //   sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
          });

          //send user roles along with the access token-(as a cookie)
          res.json({ roles, accessToken });
        });
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { getRefreshToken };
