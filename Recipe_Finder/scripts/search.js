const ingredientInput = document.getElementById("ingredient");
const addButton = document.getElementById("addButton");
const ingredientTags = document.getElementById("ingredientTags");
const searchRecipesButton = document.getElementById("searchRecipesButton");

let ingredients = localStorage.getItem("searchValue"); // Array to store ingredient values

// Search for the recipies
async function searchRecipes(searchInput) {
	const app_id = "5f7321b4";
	const app_key = "d65f955218f0c4028280f8702ed5df57";
	const search = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchInput}&app_id=${app_id}&app_key=${app_key}`;

	try {
		const response = await fetch(search);
		if (!response.ok) {
			throw new Error(`Status: ${response.status}`);
		}

		const data = await response.json();
		return data; // This line returns the json result
	} catch (error) {
		console.log("Error:", error);
	}
}

// Get the recipe and return as data
async function getRecipes() {
	try {
		const data = await searchRecipes(ingredients);
		if (data) {
			console.log(data);
			addListing(data);
		} else {
			console.log("No data returned.");
		}
	} catch (error) {
		console.error("Error fetching recipes:", error);
	}
}

// Add to recipes
function addListing(data) {
	data.hits.forEach((element) => {
		console.log(element);

		document.querySelector("#resultBox").innerHTML += `
    <div class="col">
        <div class="card shadow-sm">
            <img class="bd-placeholder-img card-img-top" src="${element.recipe.image}" width="300px" height="300px" />
            <div class="card-body">
            <p class="card-text" style="font-weight:bold">${element.recipe.label}</p>
            <div class="d-flex justify-content-between align-items-center">
                <small class="text-body-secondary">Estimated time: ${element.recipe.totalTime == 0 ? 10 : element.recipe.totalTime} mins</small>
				<small class="text-body-secondary" style="font-weight: bold; font-size:20px">${element.recipe.yield} ${(element.recipe.yield) > 1 ? 'servings' : 'serving'}</small>
            </div>
			<div class="d-flex justify-content-between align-items-center" style="margin-top:10px">
				<ul>
					<li class="text-body-secondary"> 
						<span>Proteins </span>
						<span> ${Math.round(element.recipe.totalNutrients.PROCNT.quantity)} ${element.recipe.totalNutrients.PROCNT.unit} </span>
					</li>
					<li class="text-body-secondary">
						<span> Fats </span> 
						<span> ${Math.round(element.recipe.totalNutrients.FAT.quantity)} ${element.recipe.totalNutrients.FAT.unit}</span>
					</li>
					<li class="text-body-secondary">
						<span> Carbs </span>
						<span> ${Math.round(element.recipe.totalNutrients.CHOCDF.quantity)} ${element.recipe.totalNutrients.CHOCDF.unit} </span>
					</li>
				</ul>

				<div class="text-body-secondary text-center align-items-center" style="font-size:20px">
				<span style="font-size:24px; font-weight:bold"> ${Math.round(element.recipe.calories)}</span>
				<br>
				<span>kcal</span>
				</div> 

                <button class="btn btn-outline-success see-more-btn" onclick="getInfo('${element._links.self.href}')">See More.</button>
            </div>
        </div>
    </div>
    `;
	});
}

// Function to create tags
function createTag(ingredient) {
	const tagsContainer = document.getElementById("tagsContainer");

	// Create the tag element
	const tagElement = document.createElement("span");
	tagElement.className = "badge text-bg-secondary tag me-2 d-flex align-items-center rounded-pill"; // Add your existing styles
	tagElement.textContent = ingredient; // Set the tag text

	// Create the delete button
	const deleteButton = document.createElement("button");
	deleteButton.textContent = "×"; // Use '×' as the delete button
	deleteButton.className = "btn-close btn-close-light btn-sm ms-1"; // Bootstrap close button
	deleteButton.ariaLabel = "Close";

	deleteButton.addEventListener("click", function () {
		tagElement.remove(); // Remove the tag on button click
	});

	tagElement.appendChild(deleteButton); // Append the delete button to the tag
	tagsContainer.appendChild(tagElement); // Append the tag to the tags container
}

// Add exisiting tags
if (localStorage.getItem("searchValue")) {
	localStorage
		.getItem("searchValue")
		.split(", ")
		.forEach((item) => createTag(item));
}

// Event listener for the search button
if (ingredients) {
	data = getRecipes();
}

// Function to get info about certain recipe
function getInfo(element) {
	localStorage.setItem("itemInfo", element);
	window.location.href = "../pages/recipe.html";
}

// Function to add to tags
function addTag() {
	const inputField = document.querySelector('input[type="search"]');
	const ingredient = inputField.value.trim();

	if (ingredient) {
		createTag(ingredient);
		inputField.value = ""; // Clear the input field
	}
}

// Function to get all tags
function getRequest() {
	const tagsContainer = document.getElementById("tagsContainer");
	const ingredients = [];
	const spans = tagsContainer.querySelectorAll("span");
	spans.forEach((span) => {
		const ingredient = span.textContent.replace("×", "").trim();
		ingredients.push(ingredient);
	});

	const final_string = ingredients.join(", ");
	return final_string;
}

// On click function to add tags via click or enter key pressed
document.getElementById("addButton").onclick = addTag;
document.querySelector('input[type="search"]').addEventListener("keydown", (event) => event.key === "Enter" && addTag(event));

// Onclick Function to search for the recipes
document.getElementById("searchButton").onclick = () => {
	let values = getRequest();
	if (values.length == 0) {
		popoverList[0].show();
		setTimeout(() => popoverList[0].hide(), 2000);
	} else {
		localStorage.setItem("searchValue", values);
		window.location.href = "search.html";
	}
};