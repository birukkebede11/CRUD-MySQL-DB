let statements = {
	name: `CREATE TABLE if not exists customers(
                customer_id int auto_increment, 
                name VARCHAR(255) not null,
                PRIMARY KEY (customer_id)
            )`,

	address: `CREATE TABLE if not exists address(
                address_id int auto_increment,
                customer_id int(11) not null,
                address VARCHAR(255) not null,
                PRIMARY KEY (address_id),
                FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
            )`,

	company: `CREATE TABLE if not exists company(
                company_id int auto_increment,
                customer_id int(11) not null,
                company VARCHAR(255) not null,
                PRIMARY KEY (company_id),
                FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
            )`,

	insertName: `INSERT INTO customers (name) VALUES (?)`,
	insertAddress: `INSERT INTO address (customer_id, address) VALUES (?, ?)`,
	insertCompany: `INSERT INTO company (customer_id, company) VALUES (?, ?)`,

	customerDetailInfo:
		"SELECT * FROM customers JOIN address JOIN company ON customers.customer_id = address.customer_id AND customers.customer_id = company.customer_id",

	customerInfo:
		"SELECT customers.customer_id AS id, customers.name, address.address, company.company FROM customers JOIN address JOIN company ON customers.customer_id = address.customer_id AND customers.customer_id = company.customer_id",

	updateName: `UPDATE customers SET name = (?) WHERE customer_id = (?)`,

	removeName: `DELETE FROM customers WHERE customer_id = (?)`,
	removeAddress: `DELETE FROM address WHERE customer_id = (?)`,
	removeCompany: `DELETE FROM company WHERE customer_id = (?)`,
};

module.exports = { statements };
