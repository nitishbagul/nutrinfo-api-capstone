/* Step1: Defining Global variable functions and objects*/
let RESULT = null;

function displayRecipeChoices(result) {
    console.log(result);
    //create an empty variable to store one LI for each one the results
    var buildTheHtmlOutput = "";

    $.each(result, function (resultKey, resultValue) {
        //create and populate one LI for each of the results ( "+=" means concatenate to the previous one)
        buildTheHtmlOutput += `<li id="item-${resultKey}">`;
        buildTheHtmlOutput += resultValue.recipe.label;
        buildTheHtmlOutput += "</li>";
    });

    //use the HTML output to show it in the index.html
    $(".query-results").html(buildTheHtmlOutput);
}

function displayRecipeDetails(clickedBtnID) {
    console.log(RESULT[0]);
    var buildTheHtmlOutput = "";

    //show image
    buildTheHtmlOutput += `<img src="${RESULT[clickedBtnID].recipe.image}" alt="main image" class="title-image"> `;
    //show title
    buildTheHtmlOutput += `<h4 class="item-name">${RESULT[clickedBtnID].recipe.label}</h4>`;

    $(".title-area").html(buildTheHtmlOutput);
}

/* Step2: Using Global variable functions and objects {triggers}*/

//when the page loads...
$(document).ready(function () {
    //do stuff
    $(".show-recipe").hide();
    $(".search-result").hide();
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
                    //console.log(result);
                    RESULT = result.hits;
                    displayRecipeChoices(result.hits);
                    $(".show-recipe").hide();
                    $(".search-result").show();
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
    displayRecipeDetails(clickedBtnID);
    $(".show-recipe").show();
    $(".search-result").hide();
});
