const config = require("../config/env/config");
// const { mongoDB_url_local, mongoDB_url_prod } = config.mongoDB_url_local;

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose.connect(`mongodb://127.0.0.1/Rylan_laundry_services`, {
  useNewUrlParser: true,
});
