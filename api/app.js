const express = require("express");
const cors = require("cors");
require("dotenv").config();
const customerRoutes = require("./v1/customers/routes/customerRoutes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/", customerRoutes);

app.listen(process.env.PORT, () =>
	console.log(`Listening and running on http://localhost:${process.env.PORT}`)
);
