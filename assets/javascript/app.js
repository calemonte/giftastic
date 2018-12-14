var movies = {

    // The list of pre-set movies.
    list: [
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
        "Dr. Strangelove",
        "Django Unchained",
        "IT",
        "Sunset Boulevard",
        "Grease",
        "The Good, The Bad, and The Ugly"
    ],

    // Method for getting array of movies.
    getMovies: function() {
        return this.list;
    },

    // Method for setting array of movies.
    setMovies: function(newMovie) {
        this.list.push(newMovie);
    }
};

// Function for displaying movie buttons.
function displayButtons() {

    var $movieButtonArea = $("#movie-buttons");
    $movieButtonArea.empty();

    // Call array of movies and render initial set of buttons.
    $.each(movies.getMovies(), function(i, movie){
        $movieButtonArea.append(
            $("<button type='button' class='btn btn-dark m-1'>"
            + movie + "</button>")
                .attr("data-name", movie)
                .addClass("movie"));
    });

};

// Function for displaying an extra button.
function displayExtraButton() {

    var $movieButtonArea = $("#movie-buttons");
    var currentList = movies.getMovies();
    var currentMovie = currentList[currentList.length - 1]; 

    $movieButtonArea.append(
        $("<button type='button' class='btn btn-dark m-1'>"
        + currentMovie + "</button>")
            .attr("data-name", currentMovie)
            .addClass("movie"));

};

// Function to hide OMDB output and your favorites list.
function hideExtraContent() {
    $("#omdb-display").hide();
    $("#your-favorites").hide();
};

// Function to show OMDB output and your favorites list.
function showExtraContent() {
    $("#omdb-display > img").remove();
    $("#omdb-display").show("medium");
};

// Function for clearing gifs from the target area.
function clearGifs() {
    $("#gif-target").empty();
};

// Function for querying the GIPHY API and appending responses to the DOM.
function giphyQuery() {

    var $current = $(this).attr("data-name");
    var baseURL = "https://api.giphy.com/v1/gifs/search";
    // Return random set of gifs every time.
    var offset = Math.floor(Math.random() * 30);
    var URL = baseURL + "?api_key=" + returnKey() + "&q=" + $current + "&limit=10" + "&offset=" + offset;
    var $target = $("#gif-target");

    // Return API key.
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

        // Cache response base path.
        var gifs = response.data;

        // Loop through response data and append gifs, badges, ratings, and links to GIPHY.
        for (var i = 0; i < gifs.length; i++) {

            // Create and hide badge for hover effect.
            var $badge = $("<span class='badge badge-pill badge-danger figure-badge p-2'>+ Favorites</span>").hide();
            $badge.attr({
                "data-still-small": gifs[i].images.fixed_height_small_still.url,
                "data-animate-small": gifs[i].images.fixed_height_small.url
            });

            // Create gif image, add data attributes, add gif-still class for targeting later.
            var $img = $("<img class='figure-img img-fluid rounded' src='" + gifs[i].images.fixed_height_still.url + "'/>");
            $img.attr({
                "data-animate": gifs[i].images.fixed_height.url,
                "data-still": gifs[i].images.fixed_height_still.url,
            });
            $img.addClass("gif-still");

            // Create caption with GIPHY rating and link to the original on GIPHY.com.
            var $figCaption = $("<figcaption class='figure-caption text-center'> Rating: "
                + gifs[i].rating + "  |  " + "<a target='_blank' href='" + gifs[i].bitly_gif_url 
                + "' download> View on GIPHY </a>" + "</figcaption>");

            // Create figure and then append gif, badge, and caption to it.
            var $gif = $("<figure class='figure m-3' />");
            $gif.append($badge, $img, $figCaption);
            $target.prepend($gif);

        }

    });

};

// Query the OMDB database and add data to page.
function queryOMDB() {

    // Construct the URL.
    var $current = $(this).attr("data-name");
    var baseURL = "https://www.omdbapi.com/?t=";
    var URL = baseURL + $current + "&y=&plot=short&apikey=" + returnKey();

    // Cache reference to OMDB display area.
    var $target = $("#omdb-display");

    // Return API key.
    function returnKey() {
        var key = "trilogy";
        return key;
    }

    // Query the OMDB API.
    $.ajax({
        url: URL,
        method: "GET"
    }).then(function(response){

        // Tell the user if a movie couldn't be found in OMDB.
        if (response.Response === "False") {
            $("#movie-title").text("No movies found. Try again!");
            $("#date-released").text("");
            $("#director").text("");
            $("#synopsis").text("");
            $("#omdb-display > img").remove();

        // Else display appropriate response and then append to the OMDB display.
        } else {
            $("#movie-title").text(response.Title);
            $("#date-released").html("<b>Date Released</b>: " + response.Released);
            $("#director").html("<b>Director</b>: " + response.Director);
            $("#synopsis").html("<b>Synopsis</b>: " + response.Plot);
            $("#omdb-display").append("<img src='" + response.Poster + "'/img>");
        }    

    });

};

// On submission click, add new button to the page.
$("#submit-movie-button").on("click", function(e) {

    e.preventDefault();

    var $value = $("#submit-movie").val().trim();

    if ($value) {
        movies.setMovies($value);
        displayExtraButton();
        $("#submit-movie").val("");
    } else {
        alert("You forgot to add a movie!");
    } 

});

// When a movie button is clicked, query GIPHY and OMDB database and display corresponding set of gifs and movie specs.
$(document).on("click", ".movie", giphyQuery)
           .on("click", ".movie", queryOMDB)
           .on("click", ".movie", showExtraContent);

// Display animated gif and add to favorites badge if hovering over gif.
$(document).on({
    mouseenter: function() {
        $(this).attr("src", $(this).attr("data-animate"));
        $(this).prev("span").show("slow");
    },
    mouseleave: function() {
        $(this).attr("src", $(this).attr("data-still"));
        // $(this).prev("span").hide("slow");
    }
}, ".gif-still");

// Add small gif (only once) to your list of favorites.
$(document).on("click", ".figure-badge", function() {
    var $smallStill = $(this).attr("data-still-small");
    var $smallAnimate = $(this).attr("data-animate-small");

    // Only add item once.
    if (!$(this).hasClass("added")){

        $(this)
            .text("Added!")
            .css("backgroundColor", "goldenrod")
            .addClass("added");

        // Display and append to your favorites list.
        $("#your-favorites").show("medium");
        $("#your-favorites").append("<img class='m-2' src='" + $(this).attr("data-animate-small") + "'/>");

    }
   
});

// Display initial set of gif buttons and hide extra content.
displayButtons();
hideExtraContent();