const User = require("../../models/user");

const handleLogout = async (req, res) => {
  try {
    // On client, also delete the accessToken

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204); //No content

    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    await User.findOne({ refreshToken })
      .exec()
      .then(async (foundUser) => {
        if (!foundUser) {
          res.clearCookie("jwt", {
            httpOnly: true,
            //  sameSite: "None",
            //   secure: true
          });
          return res.status(204).send(`User not found`);
        }

        //empty all refresh tokens
        foundUser.refreshToken = [];

        await foundUser.save();

        res.clearCookie("jwt", {
          httpOnly: true,
          // sameSite: "None",
          // secure: true
        });

        res.sendStatus(204);
      });
  } catch (error) {
    res.status(500).send(`Error: ${error}`);
    console.log(error);
  }
};

module.exports = { handleLogout };
