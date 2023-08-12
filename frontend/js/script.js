function displayForm(show, hideOne, hideTwo) {
	document.getElementsByClassName(show)[0].style.display = "block";
	document.getElementsByClassName(hideOne)[0].style.display = "none";
	document.getElementsByClassName(hideTwo)[0].style.display = "none";
}

// Function to handle form submission for adding a new customer
function addNew(e) {
	e.preventDefault();

	const nameInput = document.querySelector("#newForm input[name=name]");
	const addressInput = document.querySelector("#newForm input[name=address]");
	const companyInput = document.querySelector("#newForm input[name=company]");

	const customerData = {
		name: nameInput.value,
		address: addressInput.value,
		company: companyInput.value,
	};

	fetch("http://localhost:1234/insert-customers-info", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(customerData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			alert(data.data);
			displayForm("list", "new", "edit");
			listCustomers();
		});

	document.getElementById("newForm").reset();
}

// Event listener for the "new" form submission
document.getElementById("newForm").addEventListener("submit", addNew);

// Function to handle form submission for editing a customer
function edit(id) {
	displayForm("edit", "new", "list");

	const editNameForm = document.getElementById("myForm");
	const updatedNameInput = editNameForm.querySelector(
		"input[name=updatedName]"
	);

	editNameForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const updatedName = updatedNameInput.value;
		const requestData = { id, newName: updatedName };

		fetch("http://localhost:1234/update", {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(requestData),
		})
			.then((response) => response.json())
			.then((data) => {
				alert(data.data);
				displayForm("list", "new", "edit");
				listCustomers();
			});

		editNameForm.reset();
	});
}

// Function to delete a customer
function deleteUser(id) {
	fetch("http://localhost:1234/remove-user", {
		method: "DELETE",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ id }),
	})
		.then((response) => response.json())
		.then((data) => {
			alert(data.data);
			listCustomers();
		});
}

// Function to fetch and display the customer list
function listCustomers() {
	const usersDiv = document.getElementById("data");
	usersDiv.innerHTML = "";
	fetch("http://localhost:1234/customers")
		.then((res) => res.json())
		.then((data) => {
			data.data.map((customer) => {
				const { id, name, address, company } = customer;

				const rowElement = document.createElement("div");
				rowElement.classList.add("row", "justify-content-around");
				rowElement.innerHTML = `
				<h2 class="col-1">${id}</h2>
				<h2 class="col-3">${name}</h2>
				<h2 class="col-2">${address}</h2>
				<h2 class="col-2">${company}</h2>
				<button type="button" class="btn btn-warning col-1" onclick="edit(${id})">Edit</button>
				<button type="button" class="btn btn-danger col-1" onclick="deleteUser(${id})">Delete</button>
				<hr>
				`;

				usersDiv.appendChild(rowElement);
			});
		});
}

// Event listener for the "list" button
document.getElementById("list").addEventListener("click", listCustomers);
