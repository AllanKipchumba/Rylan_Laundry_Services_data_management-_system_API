require("./db/mongoose");
const { prod_port, dev_port } = require("./config/env/config");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");
const corsOptions = require("./config/cors/corsOptions");

const port = prod_port || dev_port;
const app = express();

app.use(cookieParser()); //middleware for cookies
app.use(express.json());
app.use(cors(corsOptions));

app.use("/auth", require("./routes/auth/auth"));

app.use(verifyJWT); //you must be authorised to access routes below
app.use("/transactions", require("./routes/transactions/transactions"));
app.use("/analytics", require("./routes/analytics/analytics"));

app.listen(port, () => console.log(`App listening on port ${port}`));
