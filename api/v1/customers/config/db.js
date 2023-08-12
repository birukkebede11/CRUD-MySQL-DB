const mysql = require("mysql2");

const connection = mysql.createConnection({
	host: process.env.host,
	user: process.env.user,
	password: process.env.password,
	database: process.env.database,
	socketPath: process.env.socketPath,
});

connection.connect((err) => {
	if (err) console.log(err);
	else console.log("Connected to MySQL");
});

module.exports = connection;
