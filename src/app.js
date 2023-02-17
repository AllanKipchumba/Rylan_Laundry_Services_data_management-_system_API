const express = require("express");
const cors = require("cors");
const { prod_port, dev_port } = require("./config/config");
require("./db/mongoose");

const port = prod_port || dev_port;
const app = express();

app.use(express.json());
app.use(cors());

app.listen(port, () => console.log(`App listening on port ${port}`));
