const connection = require("../config/db");
const sqlCommands = require("../sql/sqlCommands");
const dbUtils = require("../utils/dbUtils");

const createTables = async () => {
	await dbUtils.executeQuery(sqlCommands.statements.name);
	await dbUtils.executeQuery(sqlCommands.statements.address);
	await dbUtils.executeQuery(sqlCommands.statements.company);

	return "Tables Created";
};

const insertInfo = async (name, address, company) => {
	try {
		const insertNameQuery = sqlCommands.statements.insertName;
		const insertAddressQuery = sqlCommands.statements.insertAddress;
		const insertCompanyQuery = sqlCommands.statements.insertCompany;

		const nameResult = await dbUtils.executeQuery(insertNameQuery, [name]);
		const id = nameResult.insertId;

		await dbUtils.executeQuery(insertAddressQuery, [id, address]);
		await dbUtils.executeQuery(insertCompanyQuery, [id, company]);

		return "Data inserted successfully!";
	} catch (error) {
		console.log(`Error inserting data: ${error}`);
		throw error;
	}
};

const getCustomersDetailInfo = () => {
	const query = sqlCommands.statements.customerDetailInfo;
	return dbUtils.executeQuery(query);
};

const getCustomersInfo = () => {
	const query = sqlCommands.statements.customerInfo;
	return dbUtils.executeQuery(query);
};

const updateName = async (newName, id) => {
	const query = sqlCommands.statements.updateName;
	await dbUtils.executeQuery(query, [newName, id]);
	return "Name updated!";
};

const deleteUser = async (id) => {
	const deleteNameQuery = sqlCommands.statements.removeName;
	const deleteAddressQuery = sqlCommands.statements.removeAddress;
	const deleteCompanyQuery = sqlCommands.statements.removeCompany;
	await dbUtils.executeQuery(deleteCompanyQuery, [id]);
	await dbUtils.executeQuery(deleteAddressQuery, [id]);
	await dbUtils.executeQuery(deleteNameQuery, [id]);
	return "Customer info Deleted!";
};

module.exports = {
	createTables,
	insertInfo,
	getCustomersDetailInfo,
	getCustomersInfo,
	updateName,
	deleteUser,
};
