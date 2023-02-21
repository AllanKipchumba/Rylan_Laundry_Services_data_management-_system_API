require("dotenv").config();

module.exports = {
  dev_port: process.env.DEVELOPMENT_PORT,
  prod_port: process.env.PORT,
  mongoDB_url_prod: process.env.MONGODB_URL_PROD,
  mongoDB_url_local: process.env.MONGODB_URL_LOCAL,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
};
