const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");

// Middle ware to extract info from the html
app.use(
	express.urlencoded({
		extended: true,
	})
);

// Middle ware to have access to the frontend
app.use(cors());
app.use(express.json());

// User account info
const connection = mysql.createConnection({
	host: "localhost",
	user: "crudDB",
	password: "crudDB",
	database: "crudDB",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock", //path to mysql sock in MAMP
});

// Connect to MySQL
connection.connect((err) => {
	if (err) console.log(err);
	console.log("Connected to MySQL");
});

// Route: / => Homepage route
app.get("/", (req, res) => res.send("Up and running..."));

// Route: /create-table => To create the tables
app.get("/create-table", (req, res) => {
	// Putting Query on a variable
	let name = `CREATE TABLE if not exists customers(customer_id int auto_increment, name VARCHAR(255) not null, PRIMARY KEY (customer_id))`;

	let address = `CREATE TABLE if not exists address(address_id int auto_increment, customer_id int(11) not null, address VARCHAR(255) not null, PRIMARY KEY (address_id), FOREIGN KEY (customer_id) REFERENCES customers (customer_id))`;

	let company = `CREATE TABLE if not exists company(company_id int auto_increment, customer_id int(11) not null, company VARCHAR(255) not null, PRIMARY KEY (company_id), FOREIGN KEY (customer_id) REFERENCES customers (customer_id))`;

	// Executing the query's we wrote above
	connection.query(name, (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	connection.query(address, (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	connection.query(company, (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	res.end("Tables Created");
	console.log("Tables Created");
});

// Route: /insert-customers-info => To insert data to the tables
app.post("/insert-customers-info", (req, res) => {
	const { name, address, company } = req.body; // Extracting the values sent from the frontend

	let insertName = `INSERT INTO customers (name) VALUES (?)`;
	let insertAddress = `INSERT INTO address (customer_id, address) VALUES (?, ?)`;
	let insertCompany = `INSERT INTO company (customer_id, company) VALUES (?, ?)`;

	// Executing the query we wrote above
	connection.query(insertName, [name], (err, results, fields) => {
		if (err) console.log(`Error Found: ${err}`);
		// console.log(results);

		const id = results.insertId;
		// console.log("id from customers table to be used as a foreign key on the other tables>>> ", id)

		connection.query(insertAddress, [id, address], (err, results, fields) => {
			if (err) console.log(`Error Found: ${err}`);
		});

		connection.query(insertCompany, [id, company], (err, results, fields) => {
			if (err) console.log(`Error Found: ${err}`);
		});
	});

	res.end("Data inserted successfully!");
	console.log("Data inserted successfully!");
});

// Route: /customers-detail-info => To retrieve data from the tables
app.get("/customers-detail-info", (req, res) => {
	connection.query(
		"SELECT * FROM customers JOIN address JOIN company ON customers.customer_id = address.customer_id AND customers.customer_id = company.customer_id",
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);
			res.send(results);
		}
	);
});

// // Tilahun's Question => how to have data from one table in an array form
app.get("/customers-name", (req, res) => {
	connection.query("SELECT name FROM customers", (err, results, fields) => {
		if (err) console.log("Error During selection", err);
		let x = [];

		for (let i = 0; i < results.length; i++) {
			const data = results[i].name;
			x.push(data);
		}
		res.send(x);
	});
});

// Route: /customers => To retrieve customized data from the tables
app.get("/customers", (req, res) => {
	connection.query(
		"SELECT customers.customer_id AS id, customers.name, address.address, company.company FROM customers JOIN address JOIN company ON customers.customer_id = address.customer_id AND customers.customer_id = company.customer_id",
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);
			res.send(results);
		}
	);
});

// Route: /customers/:id => To retrieve single data from the tables using id
app.get("/customers/:id", (req, res) => {
	const customerId = req.params.id;

	const query = `SELECT customers.customer_id as id, customers.name, address.address, company.company FROM customers JOIN address ON customers.customer_id = address.customer_id JOIN company ON customers.customer_id = company.customer_id WHERE customers.customer_id = ?`;

	connection.query(query, [customerId], (err, results) => {
		// console.log(results);
		if (err) {
			console.error("Error fetching user data:", err);
			res.status(500).json({ error: "Failed to fetch user data" });
		} else {
			if (results.length === 0) {
				res.status(404).json({ error: "User not found" });
			} else {
				const user = results[0];
				res.json(user);
			}
		}
	});
});

// Route: /update => To adjust or update data from the tables
app.put("/update", (req, res) => {
	const { newName, id } = req.body;
	let updateName = `UPDATE customers SET name = ? WHERE customer_id = ?`;
	connection.query(updateName, [newName, id], (err, results, fields) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) updated");
		res.send(results);
	});
});

// Route: /remove-user => To delete all data from the tables
app.delete("/remove-user", (req, res) => {
	const { id } = req.body;
	let removeName = `DELETE FROM customers WHERE customer_id = ?`;
	let removeAddress = `DELETE FROM address WHERE customer_id = ?`;
	let removeCompany = `DELETE FROM company WHERE customer_id = ?`;

	connection.query(removeAddress, [id], (err, results) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});

	connection.query(removeCompany, [id], (err, results) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});

	connection.query(removeName, [id], (err, results) => {
		if (err) throw err;
		console.log(results.affectedRows + " record(s) Deleted");
	});
});

const port = 1234;
app.listen(port, () =>
	console.log(`listening and running on http://localhost:${port}`)
);
