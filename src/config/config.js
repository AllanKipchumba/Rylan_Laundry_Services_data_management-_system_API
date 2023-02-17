require("dotenv").config();

module.exports = {
  dev_port: process.env.DEVELOPMENT_PORT,
  prod_port: process.env.PORT,
  mongoDB_url_prod: process.env.MONGODB_URL_PROD,
  mongoDB_url_local: process.env.MONGODB_URL_LOCAL,
};
