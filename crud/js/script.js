function displayForm(show, hideOne, hideTwo) {
	document.getElementsByClassName(show)[0].style.display = "block";
	document.getElementsByClassName(hideOne)[0].style.display = "none";
	document.getElementsByClassName(hideTwo)[0].style.display = "none";
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
	alert("User Deleted!");
	fetch("http://localhost:1234/remove-user", {
		method: "DELETE",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#delete-user input[name=id]").value,
		}),
	})
		.then((response) => response.json())
		.then(() => alert("User Deleted!"));

	document.getElementById("delete-user").reset();
}

document.getElementById("delete-user").addEventListener("submit", deleteUser);
