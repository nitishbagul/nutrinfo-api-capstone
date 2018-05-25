/* Step1: Defining Global variable functions and objects*/
let RESULT = null;
let INSTRUCTIONS_LINK = null;

function displayFailureText() {
    let buildTheHtmlOutput = "Sorry! We did not find any results for your query."
    $(".search-update-text").html(buildTheHtmlOutput);
}

function displaySuccessText(result) {
    let buildTheHtmlOutput = `${result.count} results found`;
    $(".search-update-text").html(buildTheHtmlOutput);
}

function displayRecipeChoices(result) {
    console.log(result);
    //create an empty variable to store one LI for each one the results
    let buildTheHtmlOutput = "";

    $.each(result, function (resultKey, resultValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        buildTheHtmlOutput += `<li id="item-${resultKey}">`;
        buildTheHtmlOutput += resultValue.recipe.label;
        buildTheHtmlOutput += "</li>";
    });

    //use the HTML output to show it in the index.html
    $(".query-results").html(buildTheHtmlOutput);
}

function displayRecipeTitle(clickedBtnID) {
    var buildTheHtmlOutput = "";
    buildTheHtmlOutput += RESULT[clickedBtnID].recipe.label;

    $(".item-title").html(buildTheHtmlOutput);

}

function displayRecipeImage(clickedBtnID) {
    var buildTheHtmlOutput = "";

    //show image
    buildTheHtmlOutput += `<img src="${RESULT[clickedBtnID].recipe.image}" alt="recipe image" class="recipe-image">`;
    buildTheHtmlOutput += `<div class="recipe-button-area">
<p class="full-recipe-text">Read full recipe here:</p>
<a href="${RESULT[clickedBtnID].recipe.url}" target=_blank class="instructions">Instructions</a>
</div>`

    $(".image-area").html(buildTheHtmlOutput);
}

function displayRecipeIngredients(clickedBtnID) {
    let ingredientsList = RESULT[clickedBtnID].recipe.ingredientLines;
    console.log(ingredientsList);
    let buildTheHtmlOutput = "";

    $.each(ingredientsList, function (resultIndex, resultValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        buildTheHtmlOutput += `<li>`;
        buildTheHtmlOutput += resultValue;
        buildTheHtmlOutput += "</li>";
    });

    $(".ingredients-list").html(buildTheHtmlOutput);
}

function displayNutritionValues(clickedBtnID) {
    let nutritionList = RESULT[clickedBtnID].recipe.totalDaily;
    console.log(nutritionList);
    let buildTheHtmlOutput = "";

    $.each(nutritionList, function (resultIndex, resultValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        buildTheHtmlOutput += `<li>`;
        buildTheHtmlOutput += resultValue.label;
        buildTheHtmlOutput += `: `;
        buildTheHtmlOutput += parseInt(resultValue.quantity);
        buildTheHtmlOutput += resultValue.unit;
        buildTheHtmlOutput += "</li>";
    });

    $(".nutrition-list").html(buildTheHtmlOutput);
}

function displayRecipeInstructions(clickedBtnID) {
    let buildTheHtmlOutput = "";
    //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
    buildTheHtmlOutput += `<h3>Preparation</h3>`;
    buildTheHtmlOutput += `<p>Read full recipe here</p>`;
    buildTheHtmlOutput += `<a href="${RESULT[clickedBtnID].recipe.url}" target=_blank>Instructions</a>`;

    //use the HTML output to show it in the index.html
    $(".preparation").html(buildTheHtmlOutput);
}

/* Step2: Using Global variable functions and objects {triggers}*/

//when the page loads...
$(document).ready(function () {
    //do stuff
    $(".show-recipe").hide();
    $(".search-result").hide();
    $(".search-update-text").hide();
    //form trigger
    $('#search-button').on('click', function (event) {
        event.preventDefault();
        let userInput = $("#query").val();
        if (userInput == "") {
            alert("Please enter some keywords to get the results.");
        } else {
            let result = $.ajax({
                    /* update API end point */
                    url: "https://api.edamam.com/search?q=" + userInput + "&app_id=aea62957&app_key=f331324dcd41f79e36bde22b77fdff52&callback=?",
                    dataType: "jsonp",
                    /*set the call type GET / POST*/
                    type: "GET"
                })
                /* if the call is successful (status 200 OK) show results */
                .done(function (result) {
                    /* if the results are meeningful, we can just console.log them */
                    console.log(result);
                    //Show the error message if no results found
                    if (result.count == 0) {
                        displayFailureText();
                        $(".search-result").hide();
                        $(".search-update-text").show();
                    } else {
                        $("#query").val("");
                        RESULT = result.hits;
                        displaySuccessText(result);
                        $(".search-update-text").show();
                        displayRecipeChoices(result.hits);
                        $(".show-recipe").hide();
                        $(".search-result").show();
                    }
                })
                /* if the call is NOT successful show errors */
                .fail(function (jqXHR, error, errorThrown) {
                    console.log(jqXHR);
                    console.log(error);
                    console.log(errorThrown);
                });
        }
    });
});

//button triggers
$(document).on('click', '.query-results li', function (event) {

    event.preventDefault();
    let clickedBtnID = this.id.match(/\d+/)[0];
    console.log(clickedBtnID);
    displayRecipeTitle(clickedBtnID);
    displayRecipeImage(clickedBtnID);
    displayRecipeIngredients(clickedBtnID);
    displayRecipeInstructions(clickedBtnID);
    displayNutritionValues(clickedBtnID);
    $(".show-recipe").show();
    $(".search-result").hide();
    $(".search-update-text").hide();
});
