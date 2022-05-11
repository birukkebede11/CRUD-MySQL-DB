function formSubmit(e) {
	e.preventDefault();
	return fetch("http://localhost:1234/update", {
		method: "PUT",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#myForm input[name=id]").value,
			newName: document.querySelector("input[name=updatedName]").value,
		}),
	})
		.then((response) => response.json())
		.then((data) => alert("Name Updated!"));
}

document.getElementById("myForm").addEventListener("submit", formSubmit);

function deleteUser(e) {
	e.preventDefault();
	alert("User Deleted!");
	return fetch("http://localhost:1234/remove-user", {
		method: "DELETE",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			id: document.querySelector("#delete-user input[name=id]").value,
		}),
	});
}

document.getElementById("delete-user").addEventListener("submit", deleteUser);
