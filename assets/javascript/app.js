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

            var $badge = $("<a href='#' />").append($("<span class='badge badge-pill badge-danger figure-badge p-2'>+ Favorites</span>"));

            var $img = $("<img class='figure-img img-fluid rounded' src='" + gifs[i].images.fixed_height_still.url + "'/>");

            $img.attr("data-animate", gifs[i].images.fixed_height.url);
            $img.attr("data-still", gifs[i].images.fixed_height_still.url);
            $img.addClass("gif-still");

            var $figCaption = $("<figcaption class='figure-caption text-center'>Rating: " + gifs[i].rating + "</figcaption>");

            var $gif = $("<figure class='figure m-3' />");

            $gif.append($badge, $img, $figCaption);

            $target.prepend($gif);
        }

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
    When a movie button is clicked, 
    query GIPHY and OMDB database 
    and then display corresponding set of
    gifs and movie specs.
*/
$(document).on("click", ".movie", giphyQuery);

// Display animated gif if hovering over still image.
$(document).on({
    mouseenter: function() {
        $(this).attr("src", $(this).attr("data-animate"));
    },
    mouseleave: function() {
        $(this).attr("src", $(this).attr("data-still"));
    }
}, ".gif-still");

// Display initial set of gif buttons.
displayButtons();