const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: "localhost",
	user: "test1",
	password: "test1",
	database: "test1",
	socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock", //path to mysql sock in MAMP
});

connection.connect((err) => {
	if (err) console.log(err);
	else console.log("Connected to MySQL");
});

module.exports = connection;
