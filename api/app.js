const express = require("express");
const cors = require("cors");
const customerRoutes = require("./v1/customers/routes/customerRoutes");

const app = express();
const port = 1234;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use("/", customerRoutes);

app.listen(port, () =>
	console.log(`Listening and running on http://localhost:${port}`)
);
