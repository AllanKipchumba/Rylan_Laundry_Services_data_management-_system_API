const express = require("express");
const cors = require("cors");
const { prod_port, dev_port } = require("./config/env/config");
require("./db/mongoose");

const port = prod_port || dev_port;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/transactions", require("./routes/transactions/transactions"));
app.use("/monthlyAnalytics", require("./routes/analytics/monthlyAnalytics"));

app.listen(port, () => console.log(`App listening on port ${port}`));
