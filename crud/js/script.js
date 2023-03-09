function displayForm(show, hideOne, hideTwo, hideThree) {
	document.getElementsByClassName(show)[0].style.display = "block";
	document.getElementsByClassName(hideOne)[0].style.display = "none";
	document.getElementsByClassName(hideTwo)[0].style.display = "none";
	document.getElementsByClassName(hideThree)[0].style.display = "none";
}

function editName(e) {
	e.preventDefault();
	fetch("http://localhost:1234/update", {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#myForm input[name=id]").value,
			newName: document.querySelector("input[name=updatedName]").value,
		}),
	})
		.then((response) => response.json())
		.then(() => alert("Name Updated!"));

	document.getElementById("myForm").reset();
}

document.getElementById("myForm").addEventListener("submit", editName);

function deleteUser(e) {
	e.preventDefault();
	fetch("http://localhost:1234/remove-user", {
		method: "DELETE",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#delete-user input[name=id]").value,
		}),
	}).then((response) => response.json());
	alert("User Deleted!");
	document.getElementById("delete-user").reset();
}

document.getElementById("delete-user").addEventListener("submit", deleteUser);

function listCustomers() {
	const usersDiv = document.getElementById("data");
	usersDiv.innerHTML = "";
	fetch("http://localhost:1234/customers")
		.then((res) => res.json())
		.then((data) => {
			data.map((customer, i) => {
				usersDiv.innerHTML += `
				<div class="row">
					<h2 class="col-2">${customer.id}</h2>
					<h2 class="col-4">${customer.name}</h2>
					<h2 class="col-3">${customer.address}</h2>
					<h2 class="col-3">${customer.company}</h2>
				</div>
				<hr>`;
			});
		});
}
document.getElementById("list").addEventListener("click", listCustomers);
