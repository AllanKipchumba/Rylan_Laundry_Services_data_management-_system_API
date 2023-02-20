const express = require("express");
const cors = require("cors");
const { prod_port, dev_port } = require("./config/env/config");
require("./db/mongoose");

const port = prod_port || dev_port;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/transactions", require("./routes/transactions"));
app.use("/analytics", require("./routes/analytics"));

app.listen(port, () => console.log(`App listening on port ${port}`));
