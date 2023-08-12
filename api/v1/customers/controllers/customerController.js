const customerService = require("../services/customerService");

const createTables = async (req, res) => {
	try {
		const tablesCreated = await customerService.createTables();
		res.send({ status: "OK", data: tablesCreated });
	} catch (error) {
		res
			.status(error?.status || 500)
			.send({ status: "FAILED", data: { error: error?.message || error } });
	}
};

const insertCustomerInfo = async (req, res) => {
	try {
		const { name, address, company } = req.body;
		const insertedData = await customerService.insertInfo(
			name,
			address,
			company
		);
		console.log(insertedData);
		res.send({ status: "OK", data: insertedData });
	} catch (error) {
		res
			.status(error?.status || 500)
			.send({ status: "FAILED", data: { error: error?.message || error } });
	}
};

const getCustomersDetailInfo = async (req, res) => {
	try {
		const customersDetailInfo = await customerService.getCustomersDetailInfo();
		res.send({ status: "OK", data: customersDetailInfo });
	} catch (error) {
		res
			.status(error?.status || 500)
			.send({ status: "FAILED", data: { error: error?.message || error } });
	}
};

const getCustomersInfo = async (req, res) => {
	try {
		const customersInfo = await customerService.getCustomersInfo();
		res.send({ status: "OK", data: customersInfo });
	} catch (error) {
		res
			.status(error?.status || 500)
			.send({ status: "FAILED", data: { error: error?.message || error } });
	}
};

const updateName = async (req, res) => {
	try {
		const { newName, id } = req.body;
		const updatedName = await customerService.updateName(newName, id);
		res.send({ status: "OK", data: updatedName });
	} catch (error) {
		res
			.status(error?.status || 500)
			.send({ status: "FAILED", data: { error: error?.message || error } });
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.body;
		const deletedUser = await customerService.deleteUser(id);
		res.send({ status: "OK", data: deletedUser });
	} catch (error) {
		res
			.status(error?.status || 500)
			.send({ status: "FAILED", data: { error: error?.message || error } });
	}
};

module.exports = {
	createTables,
	insertCustomerInfo,
	getCustomersDetailInfo,
	getCustomersInfo,
	updateName,
	deleteUser,
};
