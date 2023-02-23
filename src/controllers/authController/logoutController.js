const User = require("../../models/user");

const handleLogout = async (req, res) => {
  try {
    // On client, also delete the accessToken

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        //  sameSite: "None",
        //   secure: true
      });
      return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );

    await foundUser.save();

    console.log(result);
    res.clearCookie("jwt", {
      httpOnly: true,
      // sameSite: "None",
      // secure: true
    });
    res.sendStatus(204);
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { handleLogout };
