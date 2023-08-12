const connection = require("../config/db");

const executeQuery = (query, params) => {
	return new Promise((resolve, reject) => {
		connection.query(query, params, (err, results, fields) => {
			if (err) {
				reject(err);
			} else {
				resolve(results);
			}
		});
	});
};

module.exports = {
	executeQuery,
};
