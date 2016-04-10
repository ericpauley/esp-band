
// var redis = require('redis')
// var client = redis.createClient()


// function setDosage(String patient) {

// }

// function getDosage(String patient) {
	
// }

function addMed() {
	var med = document.getElementById("newMed").value;
	var amount = document.getElementById("newAmount").value;
	var time = document.getElementById("newTime").value;
	var freq = document.getElementById("newFreq").value;
	// Find a <table> element with id="myTable":
	var table = document.getElementById("medTable");

	// Create an empty <tr> element and add it to the 1st position of the table:
	var row = table.insertRow(1);

	// Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);
	var cell5 = row.insertCell(4);
	var btn = document.createElement("BUTTON");        // Create a <button> element
	var t = document.createTextNode("Delete");       // Create a text node
	btn.appendChild(t);                                // Append the text to <button>
	btn.setAttribute("class", "btn btn-default");
	btn.setAttribute("type", "button");
	btn.setAttribute("onclick","deleteMed(this)")
	// Add some text to the new cells:
	cell1.innerHTML = med;
	cell2.innerHTML = amount;
	cell3.innerHTML = time;
	cell4.innerHTML = freq;
	cell5.appendChild(btn);
}

function deleteMed(r) {
    var i = r.parentNode.parentNode.rowIndex;
    document.getElementById("medTable").deleteRow(i);
}
