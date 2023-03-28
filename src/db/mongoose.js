const config = require("../config/env/config");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB_url_prod = config.mongoDB_url_prod;

// mongoose.connect(`mongodb://127.0.0.1/Rylan_laundry_services`, {
//   useNewUrlParser: true,
// });
mongoose.connect(`${mongoDB_url_prod}`, {
  useNewUrlParser: true,
});
