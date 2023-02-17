const express = require("express");
const { prod_port, dev_port } = require("./config/config");

const app = express();
const port = prod_port || dev_port;

app.listen(port, () => console.log(`App listening on port ${port}`));
