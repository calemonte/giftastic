var movies = [
    "Star Wars",
    "Mary Poppins",
    "Frozen",
    "One Flew Over the Cuckoo's Nest",
    "The Godfather",
    "Rocky",
    "Eternal Sunshine of the Spotless Mind",
    "12 Angry Men",
    "Pulp Fiction",
    "It's a Wonderful Life",
    "Princess Mononoke",
    "She's All That",
    "Dirty Dancing",
    "Dr. Strangelove"
];

// Function for displaying movie buttons.
function displayButtons() {

    var $movieButtonArea = $("#movie-buttons");
    $movieButtonArea.empty();

    $.each(movies, function(i, movie){
        $movieButtonArea.append($("<button type='button' class='btn btn-dark m-1'>" + movie + "</button>").attr("data-name", movie).addClass("movie"));
    });

};

function hideExtraContent() {
    $("#omdb-display").hide();
    $("#your-favorites").hide();
};

function showExtraContent() {
    $("#omdb-display > img").remove();
    $("#omdb-display").show("medium");
};

function clearGifs() {
    $("#gif-target").empty();
};

// Function for querying the GIPHY API.
function giphyQuery() {

    var $current = $(this).attr("data-name");
    var baseURL = "https://api.giphy.com/v1/gifs/search";
    var URL = baseURL + "?api_key=" + returnKey() + "&q=" + $current + "&limit=10";
    var $target = $("#gif-target");

    // Return API key (not sure if this is more secure).
    function returnKey() {
        var key = "qRIyCfMnPI78aoVU1AARjAHhoOBkyKJs";
        return key;
    }
    
    // Query the GIPHY API.
    $.ajax({
        url: URL,
        method: "GET"
    }).then(function(response){

        clearGifs();

        var gifs = response.data;

        for (var i = 0; i < gifs.length; i++) {

            // Hide this bit if you want the special effects (.hide()).
            var $badge = $("<span class='badge badge-pill badge-danger figure-badge p-2'>+ Favorites</span>");

            $badge.attr({
                "data-still-small": gifs[i].images.fixed_height_small_still.url,
                "data-animate-small": gifs[i].images.fixed_height_small.url
            });

            var $img = $("<img class='figure-img img-fluid rounded' src='" + gifs[i].images.fixed_height_still.url + "'/>");

            $img.attr({
                "data-animate": gifs[i].images.fixed_height.url,
                "data-still": gifs[i].images.fixed_height_still.url,
            });

            $img.addClass("gif-still");

            var $figCaption = $("<figcaption class='figure-caption text-center'>Rating: " + gifs[i].rating + "</figcaption>");

            var $gif = $("<figure class='figure m-3' />");

            $gif.append($badge, $img, $figCaption);

            $target.prepend($gif);
        }

        // $target.append("<button class='btn btn-dark mb-3 mt-3' id='load-more'>Load More!</button>");

        // $("#load-more").on("click", function() {

        // });

    });

};

// Query the OMDB database and add data to page.
function queryOMDB() {

    var $current = $(this).attr("data-name");
    var baseURL = "https://www.omdbapi.com/?t=";
    var URL = baseURL + $current + "&y=&plot=short&apikey=" + returnKey();
    var $target = $("#omdb-display");

    // Return API key (not sure if this is more secure).
    function returnKey() {
        var key = "trilogy";
        return key;
    }

    // Query the OMDB API.
    $.ajax({
        url: URL,
        method: "GET"
    }).then(function(response){

        $("#movie-title").text(response.Title);
        $("#date-released").text(response.Released);
        $("#director").text(response.Director);
        $("#synopsis").text(response.Plot);
        $("#omdb-display").append("<img src='" + response.Poster + "'/img>");
        
    });

};

// On submission click, add new button to the page.
$("#submit-movie-button").on("click", function(e) {

    e.preventDefault();

    var $value = $("#submit-movie").val().trim();

    if ($value) {
        movies.push($value);
        displayButtons();
    } else {
        alert("You forgot to add a movie!");
    } 

});

/* 
    When a movie button is clicked, query GIPHY and OMDB database 
    and then display corresponding set of gifs and movie specs.
*/
$(document).on("click", ".movie", giphyQuery)
           .on("click", ".movie", queryOMDB)
           .on("click", ".movie", showExtraContent);

// Display animated gif if hovering over still image.
$(document).on({
    mouseenter: function() {
        $(this).attr("src", $(this).attr("data-animate"));
        // $(".figure-badge").first().show("slow");
    },
    mouseleave: function() {
        $(this).attr("src", $(this).attr("data-still"));
        // $(".figure-badge").first().hide("slow");
    }
}, ".gif-still");

// Add small gif to your favorites.
$(document).on("click", ".figure-badge", function() {
    var $smallStill = $(this).attr("data-still-small");
    var $smallAnimate = $(this).attr("data-animate-small");

    $("#your-favorites").show("medium");

    $("#your-favorites").append("<img class='m-2' src='" + $(this).attr("data-animate-small") + "'/>");
});

// Display initial set of gif buttons.
displayButtons();
hideExtraContent();