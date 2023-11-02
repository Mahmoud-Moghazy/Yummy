$(document).ready(function () {
    // Cache the  content elements selector in a variable
    const $navbarContent = $("#navbar-content");
    const $navbarButton = $("#navbar-button");
    const $openClose = $("#open");
    const $mainSection = $(".main-section");
    const $instructions = $(".instructions");
    const $loading = $("#load");
    
    // Get the width of the navbar content element, including margins
    const navWidth = $navbarContent.outerWidth(true);

    // Add a click event listener to the element with the ID "open"
    $($openClose).on("click", function () {
        $openClose.toggleClass("fa-close fa-bars");
        // Check if the navbar content element is currently positioned at left: 0
        if ($navbarContent.position().left === 0) {
            // If it is, animate it to the left by its width
            $navbarContent.animate({ left: -navWidth }, 500);
            $navbarButton.animate({ left: 0 }, 500);
            $("#animet li").animate({top: 300}, 1000)
        } else {
            // If it isn't, animate it back to the left by 0 (close the navigation menu)
            $navbarContent.animate({ left: 0 }, 500);
            $navbarButton.animate({ left: navWidth }, 500);
            
            for (let i = 0; i < 5; i++) {
                $("#animet li").eq(i).animate({top: 0}, (i + 5) * 100)
            }
        }
    });

    // Make an AJAX request to the MealDB API to retrieve meal data based on the search term
    function mainApi(main = "") {
        // Show a loading indicator while the API request is being processed
        $($loading).fadeIn(200);
        // Make an AJAX request to the MealDB API
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${main}`,
            success: function (res) {
                // Get the meal data from the API response
                let home = res.meals ;
                // Hide the loading indicator once the API request is complete
                $($loading).fadeOut(200);
                // Call the display function to display the meal data
                display(home);
            },
        });
    }

    // Create HTML elements to display the meal data in the UI
    function display(array) {
        let box = "";
        // Loop through the array of meal data
        for (let i = 0; i < array.length; i++) {
            // Create a div element for each meal and add it to the box string
            box += `
            <div class="col" id="${array[i].idMeal}">
            <div class="box rounded-3 position-relative overflow-hidden" role="button" >
                <img class="w-100 rounded-3" src="${array[i].strMealThumb}" alt="Main-section-Image"/>
                    <div class="caption text-white">
                        <p class="text-black">${array[i].strMeal}</p>
                    </div>
                </div>
            </div>`;
        }
        // Update the HTML of the #show element with the box string
        $("#show").html(box);        
    }

    // Fetches instructions for a specific meal by ID from the API
    function instructionsAPI(mealId = "") {
        // Display the loading animation while waiting for the API response
        $($loading).fadeIn(200);
        // Send an AJAX request to the API to fetch instructions for the specified meal
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
            success: function (mId) {
                // Extract the instructions data from the API response
                let ins = mId.meals[0] ;
                // Handle the API response data here
                $($loading).fadeOut(200);
                displayDetails(ins);
            },
        });
    }

    // When an element with the ID "show" is clicked and has a child element with the class "col"
    $("#show").on("click", ".col", function () {
        // Select the $mainSection element and fade it out
        $($mainSection).fadeOut();
        // Get the ID of the clicked element and store it in the mealId variable
        mealId = $(this).attr("id");
        // Call the instructionsAPI() function with the mealId variable as an argument
        instructionsAPI(mealId);
        // Select the $instructions element and fade it in
        $($instructions).fadeIn();
    });

    // function to display an API
    function displayDetails(meal) {
        // Create an array of 20 length and fill it with the HTML of each ingredient and its measure
        let ingredients = Array.from({ length: 20 }, (_, i) => {
             // Get the ingredient and measure values for the current index
            const ingredient = meal[`strIngredient${i + 1}`];
            const measure = meal[`strMeasure${i + 1}`];
            // If the ingredient value is not empty
            if (ingredient) {
                // Return an HTML element for the ingredient with its measure
                return `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`;
            }
        }).join("");

        // Split the tags string by commas and create an array of tag HTML elements, or an empty array if there are no tags
        let tags = meal.strTags?.split(",") || [];
        let tagsStr = tags.map((tag) => `<li class="alert alert-danger m-2 p-1">${tag}</li>`).join("");
        // Build the HTML for the meal details section
        let details = `
            <div class="col-md-4">
            <img class="w-100 rounded-3" src="${meal.strMealThumb}"alt="">
            <h2 class=" my-3">${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
            <h2>Instructions</h2>
            <p class=" text-white-50">${meal.strInstructions}</p>
            <h3>Area : <span class="fw-bolder text-info">${meal.strArea}</span></h3>
            <h3>Category : <span class="fw-bolder text-info">${meal.strCategory}</span></h3>
            <h3>Recipes :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${ingredients}</ul>
            <h3>Tags :</h3>
            <ul class="list-unstyled d-flex g-3 flex-wrap">${tagsStr}</ul>
            <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
            <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;
        // Replace the HTML of the #mealDetails element with the built details HTML
        $("#mealDetails").html(details);
    }

    // This code adds an event listener to all the list items (li)
    $(".nav-links li").on("click", function (e) {
        // Get the HTML content of the clicked li element
        let className = $(this).html();
        // Select all section elements inside the main element
        let sections = $("main").children("section");
        // Filter out the section elements that have the same class as the clicked li element
        let filteredSections = sections.not(`.${className}`);
        // Fade out the remaining section elements
        filteredSections.fadeOut();
        // Fade in the section element with the same class as the clicked li element
        sections.filter(`.${className}`).fadeIn();
        $openClose.toggleClass("fa-close fa-bars");
        $navbarContent.animate({ left: -navWidth }, 500);
        $navbarButton.animate({ left: 0 }, 500);
    });

    // Add event listener to the element with the ID "close"
    $("#close").on("click", function () {
        // Fade out the instructions section referenced by the variable "$instructions"
        $($instructions).fadeOut();
        // Fade in the main section referenced by the variable "$mainSection"
        $($mainSection).fadeIn();
    });

    // Define a function called "getApi"
    function getApi(){
        // Fade in the loading spinner referenced by the variable "$loading"
        $($loading).fadeIn(200);
        // Make an AJAX request to the MealDB API to get a list of meal categories
        $.ajax({
            url: "https://www.themealdb.com/api/json/v1/1/categories.php",
            // If the request is successful, run the following code
            success: function (res) {
                // Extract the list of categories from the API response and store it in a variable called "finalRes"
                const finalRes = res.categories;
                 // Fade out the loading spinner referenced by the variable "$loading"
                $($loading).fadeOut(200);
                // Call the "displayCategory" function and pass it the list of categories as an argument
                displayCategory(finalRes);
            },
            
        });
    }
    
    // This function takes an array of category objects and displays them on the webpage
    function displayCategory(array) {
        let category = '';// initialize an empty string to store HTML code for the categories
        // Loop through the array of category objects
        for (let i = 0; i < array.length; i++) {
            // Append HTML code for each category to the category string
            category += `
                <div class="col" id="${array[i].strCategory}">
                <div class="box rounded-3 position-relative overflow-hidden" role="button">
                <img class="w-100 rounded-3" src="${array[i].strCategoryThumb}" alt="Main-section-Image"/>
                <div class="caption">
                <h3>${array[i].strCategory}</h3>
                <p>${array[i].strCategoryDescription.split(' ').slice(0, 15).join(' ')}</p>
                </div>
                </div>
                </div>`
        }
        // Set the HTML content of the #categories element to the category string
        $("#categories").html(category);
    }

    // When the "Categories" button is clicked...
    $("#cat").on("click", function () {
        // Call the getApi function to retrieve category data from the MealDB API
        getApi()
    });

    // Function to get the meal details by category
    function categoriesDetails(arr) {
        // Show loading spinner
        $($loading).fadeIn(200);
        // Make AJAX request to the meal API with the selected category
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${arr}`,
            success: function (res) {
                // Handle the API response data here
                const finalRes = res.meals;
                // Hide loading spinner
                $($loading).fadeOut(200);
                // Call the display function with the meal data
                display(finalRes);
            },
        });
    }

    // Attach a click event handler to elements with the class ".col" that are
    // contained within an element with the ID "categories"
    $('#categories').on('click', '.col', function() {
        // Retrieve the ID of the clicked element and store it in the variable "strCategory"
        const strCategory = $(this).attr('id');
        // Call the function "categoriesDetails()" with the selected category as an argument
        categoriesDetails(strCategory);
        // Fade out elements with the class ".categories" 
        $('.categories').fadeOut(400);
        // Fade in elements with the class ".main-section"
        $('.main-section').fadeIn(400);
    });

    // Define a function to retrieve data from the API
    function getAreaApi() { 
        // Fade in a loading spinner or message
        $($loading).fadeIn(200);
        // Send an AJAX request to the API endpoint
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/list.php?a=list`,
            success: function (res) {
                // Extract the relevant data from the response
                const finalRes = res.meals;
                // Fade out the loading spinner or message
                $($loading).fadeOut(200);
                // Call a function to display the retrieved data
                areaDisplay(finalRes);
            },
        });
    }

    //This function takes an array as its input parameter and generates HTML code to display
    function areaDisplay(array) {
        // Create an empty string to hold the HTML for the display boxes
        let box = "";
        // Loop through each element of the array and build the HTML for the display box
        for (let i = 0; i < array.length; i++) {
            box+=`
            <div class="col">
            <div class="icon-container text-white text-center my-3" role="button">
            <i class="fa-solid fa-house fa-4x m-3"></i>
            <h3 class="text-info">${array[i].strArea}</h3>
            </div>
            </div>`
        }
        // Set the HTML of the element with the ID "areashow" to the generated box HTML
        $("#areashow").html(box);
    }

    // Add an event listener to the element with ID "area"
    $('#area').on('click', function () {
        // When the "area" element is clicked, call the getAreaApi function
        getAreaApi()
    });

    // Add an event listener to the element with ID "areashow"
    $('#areashow').on('click', '.col', function() {
        // When a child element of "areashow" with the class "col" is clicked, execute the following code:
        // Find the h3 element within the clicked element, and extract its text content
        const areaName = $(this).find("h3").html();
        // Call a function called getAreaFoods, passing the areaName as a parameter
        getAreaFoods(areaName);
        // Hide the element with the class "area" with a fadeOut animation
        $('.area').fadeOut(400);
        // Show the element with the class "main-section" with a fadeIn animation
        $('.main-section').fadeIn(400);
    });

    // Define a function called "getAreaFoods", which takes an array as a parameter
    function getAreaFoods(arr) {
        // Show a loading spinner using jQuery's fadeIn function
        $($loading).fadeIn(200);
        // Make an AJAX request to the specified URL, passing the value of "arr" as a parameter
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/filter.php?a=${arr}`,
            success: function (res) {
            // When the request is successful, execute the following code:
                // Extract the "meals" array from the response data
                const finalRes = res.meals;
                // Hide the loading spinner using jQuery's fadeOut function
                $($loading).fadeOut(200);
                // Call a function called "display", passing the "finalRes" array as a parameter
                display(finalRes);
            },
        });
    }

    // Attach a click event listener to the element with an ID of "ingred" using jQuery's "on" function
    // When the element is clicked, execute the "getIngredientsFoods" function
    $('#ingred').on('click', function () {
        getIngredientsFoods()
    });

    // Define a function called "getIngredientsFoods"
    function getIngredientsFoods() {
        // Show a loading spinner using jQuery's fadeIn function
        $($loading).fadeIn(200);
        // Make an AJAX request to the specified URL
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/list.php?i=list`,
            success: function (res) {
            // When the request is successful, execute the following code:
                // Extract the "meals" array from the response data and slice it to include only the first 20 items
                const finalRes = res.meals.slice(0, 20);
                // Hide the loading spinner using jQuery's fadeOut function
                $($loading).fadeOut(200);
                // Call a function called "displayIngredients", passing the "finalRes" array as a parameter
                displayIngredients(finalRes)
            },
        });
    }

    // function for display Ingredients
    function displayIngredients(arr) {
        let box = '';
        // Loop through each item in the array
        for (let i = 0; i < arr.length; i++) {
            const strDescription = arr[i].strDescription;
            // Slice the description into an array of words, take the first 15 words, and join them back into a string
            const slicedDescription = strDescription ? strDescription.split(' ').slice(0, 15).join(' ') : '';
            // If the description is longer than 20 characters, add an ellipsis to the end
            const shortDescription = strDescription && strDescription.length > 20 ? slicedDescription + '...' : strDescription;
            // Build the HTML string for each item and add it to the box variable
            box += `
            <div class="col">
            <div class="icon-container text-white text-center my-3" role="button">
                <i class="fa-solid fa-drumstick-bite fa-4x m-2"></i>
                <h3 class="fs-6 fw-bold">${arr[i].strIngredient}</h3>
                <p class="text-white-50 fs-6">${shortDescription}</p>
            </div>
            </div>
        `;
        }
        // Set the HTML of the #showIngredients element to the built string
        $("#showIngredients").html(box);
    }

    // Listen for click events on the .col element inside the #showIngredients element
    $('#showIngredients').on('click', '.col', function() {
        // Get the text content of the h3 element inside the clicked .col element
        const areaName = $(this).find("h3").html();
        // Call the mainApi function with the areaName as its argument
        mainApi(areaName)
        // Hide the ingredients element
        $('.ingredients').fadeOut(400);
        // Show the main-section element
        $('.main-section').fadeIn(400);
    });

    // Listen for keyup events on the searchBN input field
    $("#searchBN").keyup(function () { 
        // Get the value of the input field and assign it to the variable sbn
        const sbn = $(this).val();
        // Call the mainApi function with the value of sbn as its argument
        mainApi(sbn);
        // Hide the instructions element
        $($instructions).fadeOut();
        // Show the main-section element
        $(".main-section").fadeIn();
    });

    // This function makes an API call to retrieve meal data based on the first letter of the search term
    function searchByLitter(SearchByl){
    // Show a loading indicator while the API request is being processed
        $($loading).fadeIn(200);
    // Make an AJAX request to the MealDB API
        $.ajax({
            url: `https://www.themealdb.com/api/json/v1/1/search.php?f=${SearchByl}`,
            success: function (res) {
                // Handle the API response data here
                const finalRes = res.meals;
                display(finalRes);
                // Hide the loading indicator once the API request is complete
                $($loading).fadeOut(200);
            },
        });
        }

        // Listen for keyup events on the searchBFL input field
    $('#searchBFL').keyup(function () { 
        // Get the value of the input field and assign it to the variable sbl
        let sbl = $(this).val();
        // Call the searchByLitter function with the value of sbl as its argument
        searchByLitter(sbl);
        // Fade in the main-section element
        $(".main-section").fadeIn();
        // Fade out the instructions element
        $($instructions).fadeOut();
    });

        // regex patterns for validation
        const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        const emailRegex = /^\S+@\S+\.\S+$/;
        const phoneRegex = /^\d{11}$/;
        const ageRegex = /^\d+$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        // form input elements
        const nameInput = $('#nameInput');
        const emailInput = $('#emailInput');
        const phoneInput = $('#phoneInput');
        const ageInput = $('#ageInput');
        const passwordInput = $('#passwordInput');
        const repasswordInput = $('#rePasswordInput');
        
        // alert messages
        const nameAlert = $('#nameAlert');
        const emailAlert = $('#emailAlert');
        const phoneAlert = $('#phoneAlert');
        const ageAlert = $('#ageAlert');
        const passwordAlert = $('#passwordAlert');
        const repasswordAlert = $('#rePasswordAlert');

        // submit button
        const submitBtn = $('#submitBtn');
        
        // validate input on keyup
        nameInput.keyup(function () { 
            if (!nameRegex.test(nameInput.val())) {
            nameAlert.removeClass('d-none');
            } else {
            nameAlert.addClass('d-none');
            }
            checkValidity();
        });
        
        emailInput.keyup(function () { 
            if (!emailRegex.test(emailInput.val())) {
            emailAlert.removeClass('d-none');
            } else if (emailInput.val() === ""){
            emailAlert.removeClass('d-none');
            }
            else {
            emailAlert.addClass('d-none');
            }
            checkValidity();
        });
        
        phoneInput.keyup(function () { 
            if (!phoneRegex.test(phoneInput.val())) {
            phoneAlert.removeClass('d-none');
            } else {
            phoneAlert.addClass('d-none');
            }
            checkValidity();
        });
        
        ageInput.keyup(function () { 
            if (!ageRegex.test(ageInput.val())) {
            ageAlert.removeClass('d-none');
            } else {
            ageAlert.addClass('d-none');
            }
            checkValidity();
        });
        
        passwordInput.keyup(function () { 
            if (!passwordRegex.test(passwordInput.val())) {
            passwordAlert.removeClass('d-none');
            } else {
            passwordAlert.addClass('d-none');
            }
            checkValidity();
        });
        
        repasswordInput.keyup(function () { 
            if (repasswordInput.val() !== passwordInput.val()) {
            repasswordAlert.removeClass('d-none');
            } else {
            repasswordAlert.addClass('d-none');
            }
            checkValidity();
        });
        
        // check if all inputs are valid and enable/disable submit button 
        function checkValidity() {
            if (nameRegex.test(nameInput.val()) &&
                emailRegex.test(emailInput.val()) &&
                phoneRegex.test(phoneInput.val()) &&
                ageRegex.test(ageInput.val()) &&
                passwordRegex.test(passwordInput.val()) &&
                (repasswordInput.val() === passwordInput.val())) {
            submitBtn.prop('disabled', false).toggleClass("btn-outline-danger  btn-success");
            } else {
            submitBtn.prop('disabled', true);
            }
        }
    
    mainApi();
});
