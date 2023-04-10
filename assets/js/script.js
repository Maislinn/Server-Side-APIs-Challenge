//const apiKey = '743ea4c7bdf1f7b353db6f0970bd117f'
//const savedCities = [];

var cityName = $('#city-name');
var citySearch = $('#city-search');
var cities = [];
var apiKey = '743ea4c7bdf1f7b353db6f0970bd117f';

// format for the day
function formatDate(date) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();

    console.log(date);

    var dateGenerated = month + '/' + day + '/' + year;
    return dateGenerated;
}

//call function init
init();

// function to display the current weather
function init() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    renderCities();
}


function storedCities() {
    localStorage.setItem("cities", JSON.stringify(cities));
    //local storage 
    console.log(localStorage);
}

// function to render the cities
function renderCities() {
    cityName.empty();

    // lists for city attributes
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = $("<li>").text(city);
        li.attr("id", "city");
        li.attr("data-city", city);
        li.attr("class", "list-group-item");
        cityName.append(li);
    }
    if (!city){
        return
    }
    else{
        getWeather(city);
    };
}

//when form is submitted ...
$("#city-search").on("submit", function (event) {
    event.preventDefault();
    var city = $("#city-input").val().trim();
    if (city === "") {
        return;
    }
    cities.push(city);
    storedCities();
    renderCities();
});



