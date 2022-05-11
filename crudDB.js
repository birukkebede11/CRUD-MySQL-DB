const express = require("express");
const mysql = require("mysql");
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
	// // Putting Query on a variable Manually
	// let insertName = "INSERT INTO customers (name) VALUES ('Abebe')";
	// let insertAddress =
	// 	"INSERT INTO address (customer_id,address) VALUES (1, 'MD, USA')";
	// let insertCompany =
	// 	"INSERT INTO company (customer_id,company) VALUES (1, 'Amazon')";

	// // Executing the query's we wrote above
	// connection.query(insertName, (err, result, fields) => {
	// 	if (err) console.log(`Error Found: ${err}`);
	// 	console.log("Name inserted Manually");
	// });
	// connection.query(insertAddress, (err, result, fields) => {
	// 	if (err) console.log(`Error Found: ${err}`);
	// 	console.log("Address inserted Manually");

	// });
	// connection.query(insertCompany, (err, result, fields) => {
	// 	if (err) console.log(`Error Found: ${err}`);
	// 	console.log("company inserted Manually");
	// });

	// // /////////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////////////////////////

	// console.table(req.body);

	// let name = req.body.name;
	// let address = req.body.address;
	// let company = req.body.company;

	const { name, address, company } = req.body;

	// with out template literals
	// let insertName = "INSERT INTO customers (name) VALUES ('" + name + "')";

	// with Template literals
	let insertName = `INSERT INTO customers (name) VALUES ('${name}')`;

	// Executing the query we wrote above
	connection.query(insertName, (err, result, fields) => {
		if (err) console.log(`Error Found: ${err}`);
	});

	connection.query(
		`SELECT * FROM customers WHERE name = "${name}"`,
		(err, rows, fields) => {
			// Extracting Foreign key
			// console.log("rows ==> ", rows);
			// console.log("rows[0] ==> ", rows[0]);

			let nameAdded_id = rows[0].customer_id;

			// console.log("rows[0].customer_id ==> ", nameAdded_id);

			let insertAddress = `INSERT INTO address (customer_id,address) VALUES ("${nameAdded_id}", "${address}")`;

			let insertCompany = `INSERT INTO company (customer_id,company) VALUES ("${nameAdded_id}", "${company}")`;

			// Executing the query's we wrote above
			connection.query(insertAddress, (err, result, fields) => {
				if (err) console.log(`Error Found: ${err}`);
			});
			connection.query(insertCompany, (err, result, fields) => {
				if (err) console.log(`Error Found: ${err}`);
			});
		}
	);
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	res.end("Data inserted to tables");
	console.log("Data inserted to tables");
});

// Route: /customers-detail-info => To retrieve data from the tables
app.get("/customers-detail-info", (req, res) => {
	connection.query(
		"SELECT * FROM customers JOIN address JOIN company ON customers.customer_id = address.address_id AND customers.customer_id = company.company_id",
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);
			res.send(results);
		}
	);
});

// Route: /customers => To retrieve customized data from the tables
app.get("/customers", (req, res) => {
	connection.query(
		"SELECT customers.customer_id AS ID,customers.name, address.address, company.company FROM customers JOIN address JOIN company ON customers.customer_id = address.address_id AND customers.customer_id = company.company_id",
		(err, results, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);
			res.send(results);
		}
	);
});

// The right way of displaying a single user
// // Route: /customers/:id => To retrieve single data from the tables using id
app.get("/customers/:id", (req, res) => {
	// console.log("ID from params", req.params.id);

	connection.query(
		`SELECT customers.customer_id AS ID,customers.name FROM customers WHERE customers.customer_id = ${req.params.id}`,
		(err, customerResults, fields) => {
			if (err) console.log("Error During selection", err);
			// console.log(results);

			connection.query(
				`SELECT address.address FROM address WHERE address.customer_id = ${req.params.id}`,
				(err, addressResults, fields) => {
					if (err) console.log("Error During selection", err);
					// console.log(results);
					connection.query(
						`SELECT company.company FROM company WHERE company.customer_id = ${req.params.id}`,
						(err, companyResults, fields) => {
							if (err) console.log("Error During selection", err);
							// console.log(results);
							res.send({
								id: customerResults[0]?.ID,
								name: customerResults[0]?.name,
								address: addressResults[0]?.address,
								company: companyResults[0]?.company,
							});
						}
					);
				}
			);
		}
	);
});

// // The Lazy & wrong way of displaying a single user
// // Route: /customers/:id => To retrieve single data from the tables using id
// app.get("/customers/:id", (req, res) => {
// 	console.log("ID from params", req.params.id);
// 	connection.query(
// 		"SELECT customers.customer_id AS ID,customers.name, address.address, company.company FROM customers JOIN address JOIN company ON customers.customer_id = address.address_id AND customers.customer_id = company.company_id",
// 		(err, results, fields) => {
// 			if (err) console.log("Error During selection", err);
// 			// console.log(results);
// 			res.send(
// 				results[req.params.id - 1]
// 					? results[req.params.id - 1]
// 					: "Doesn't exist"
// 			);
// 		}
// 	);
// });

// Route: /update => To adjust or update data from the tables
app.put("/update", (req, res) => {
	const { newName, id } = req.body;
	let updateName = `UPDATE customers SET name = '${newName}' WHERE customer_id = '${id}'`;
	connection.query(updateName, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) updated");
		res.send(result);
	});
});

// // Route: /remove => To delete data from the tables
// // Manually deleting address
// // TODO: make it dynamic
// app.delete("/remove", (req, res) => {
// 	let removeName = "DELETE FROM address WHERE address = 'MD, USA'";
// 	connection.query(removeName, (err, result) => {
// 		if (err) throw err;
// 		console.log(result.affectedRows + " record(s) Deleted");
// 		res.send(result);
// 	});
// });

// // **** The wrong way to remove user or name ****
// // Route: /remove-name => To delete data from the tables
// // Doesn't work (B/c it's used as foreign key on other tables)
// app.delete("/remove-name", (req, res) => {
// 	let removeName = "DELETE FROM customers WHERE customer_id = '1'";
// 	connection.query(removeName, (err, result) => {
// 		if (err) throw err;
// 		console.log(result.affectedRows + " record(s) Deleted");
// 		res.send(result);
// 	});
// });

// **** The right way to remove user or name ****
// Route: /remove-user => To delete all data from the tables
app.delete("/remove-user", (req, res) => {
	// console.table(req.body)
	const { id } = req.body;
	let removeName = `DELETE FROM customers WHERE customer_id = '${id}'`;
	let removeAddress = `DELETE FROM address WHERE customer_id = '${id}'`;
	let removeCompany = `DELETE FROM company WHERE customer_id = '${id}'`;

	connection.query(removeAddress, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) Deleted");
	});

	connection.query(removeCompany, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) Deleted");
	});

	connection.query(removeName, (err, result) => {
		if (err) throw err;
		console.log(result.affectedRows + " record(s) Deleted");
	});
});

const port = 1234;
app.listen(port, () =>
	console.log(`listening and running on http://localhost:${port}`)
);
