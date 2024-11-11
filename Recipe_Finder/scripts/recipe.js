let recipe = localStorage.getItem("itemInfo"); // Array to store ingredient values
console.log(recipe);

// Search for the recipies
async function searchRecipes() {
	try {
		const response = await fetch(recipe);
		if (!response.ok) {
			throw new Error(`Status: ${response.status}`);
		}

		const data = await response.json();
		displayInformation(data);
	} catch (error) {
		console.log("Error:", error);
	}
}

function displayInformation(data) {
	console.lo;
	document.querySelector("#recipeDisplay").innerHTML += `
    <div>
        <div class="h1 text-dark text-center">${data.recipe.label}</div>
        <hr class="border border-dark border-2 opacity-50 rounded" />
        <div class="main">
            
    <div class="d-flex">
        <img class="img-fluid mx-2 rounded" src="${data.recipe.image}" width="300px" height="300px" />

        <div class="d-flex flex-column justify-content-start w-100">
            
        
        <!-- Allergy Notice Section -->
            <div class="mb-2">
                <div id="AllergentsHeading" class="text-primary fs-5">
                </div>
                <div id="ifAllergents" class="d-flex flex-row flex-wrap">
                    <!-- Allergens items go here -->
                </div>
            </div>

        <!-- Cautions Section -->
            <div class="mb-2">
                <div id="CautionsHeading" class="text-primary fs-5">
                </div>
                <div id="ifCautions" class="d-flex flex-row flex-wrap">
                    <!-- Cautions items go here -->
                </div>
            </div>

            <!-- Calories Section -->
            <div class="text-body-secondary align-items-center" style="font-size:20px">
            <span class="text-dark h2">Calories:</span>    
            <span class="text-dark fs-4">${Math.round(data.recipe.calories)} kcal</span>
            </div>
        </div>
    </div>

            
            <div class="container border border-dark border-3 m-auto mt-3 rounded">
                <div id="labelIngredients"></div>
                    <ul id="ingridientsList" class="text-body-secondary"> </ul>
                </div>
            </div>
            
            <div id="labelIngredients"></div>
            <ul id="ingridientsList" class="text-body-secondary"> </ul>
            </div>

            <div class="container border border-dark rounded border-3 m-auto mt-3">

            <h2 class="text-dark">Nutrients:</h2>
            <ul>
				<li class="text-body-secondary"> 
				<span>Proteins ${Math.round(data.recipe.totalNutrients.PROCNT.quantity)} ${data.recipe.totalNutrients.PROCNT.unit} </span>
				</li>
				<li class="text-body-secondary"> 
				<span> Fats ${Math.round(data.recipe.totalNutrients.FAT.quantity)} ${data.recipe.totalNutrients.FAT.unit}</span>
				</li>
				<li class="text-body-secondary">
				<span> Carbs ${Math.round(data.recipe.totalNutrients.CHOCDF.quantity)} ${data.recipe.totalNutrients.CHOCDF.unit} </span>
				</li>
			</ul>
            </div>
            <div><a target="_blank" class="btn btn-lg m-auto mt-3 btn-success see-more-btn float-end" href="${data.recipe.url}">Find recipe here</a></div>
             
        </div>
    </div>
    `;
	if (data.recipe.healthLabels) {
		document.querySelector("#AllergentsHeading").innerHTML += `
        <h2 class="text-dark">Allergy notice: </h2> 
        `;
		data.recipe.healthLabels.forEach((element) => createTag(element, "ifAllergents"));
	}
	if (data.recipe.cautions) {
		document.querySelector("#CautionsHeading").innerHTML += `
        <h2 class="text-dark">Caution: </h2>
        `;
		data.recipe.cautions.forEach((element) => createTag(element, "ifCautions"));
	}

	if (data.recipe.ingredientLines) {
		document.querySelector("#labelIngredients").innerHTML += `<h2 class="text-dark">Ingredients: </h2>`;
		const ingredientList = data.recipe.ingredientLines;
		console.log(ingredientList);
		console.log(document.querySelector("#ingridientsList"));
		ingredientList.forEach((element) => {
			document.querySelector("#ingridientsList").innerHTML += `<li>${element}</li>`;
			console.log(element);
		});
	}
}

function commaSeperatedList(list) {
	return list.join(", ");
}

// Function to create tags
function createTag(ingredient, tagContainerID) {
	const tagsContainer = document.querySelector("#".concat(tagContainerID));

	// Create the tag element
	const tagElement = document.createElement("span");
	tagElement.className = "badge text-bg-warning tag me-2 d-flex align-items-center rounded-pill  text-center"; // Add your existing styles
	tagElement.style = "display: inline-block; padding: 5px 10px; border: 1px solid #ccc";
	tagElement.textContent = ingredient; // Set the tag text

	tagsContainer.appendChild(tagElement); // Append the tag to the tags container
}

searchRecipes();
