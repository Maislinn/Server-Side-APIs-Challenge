//const apiKey = '743ea4c7bdf1f7b353db6f0970bd117f'
//const savedCities = [];

var cityName = $('#city-name');
//var citySearch = $('#city-search');
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

//Form Submission
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

//function to get response weather from API
function getWeather(city) {
    var queryURL1 = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    $.ajax({
        url: queryURL1,
        method: "GET"
    }).then(function (response) {

 //create a new table row element
    title = $("<h3>").text(response.name + " (" + formatDate() + ") ");
    $("#current-weather").append(title);
    var TempToNum = parseInt(response.main.temp);
    var temp = $("<p>").text("Temperature: " + TempToNum + " °F");
    $("#current-weather").append(temp);
    var humidity = $("<p>").text("Humidity: " + response.main.humidity + "%");
    $("#current-weather").append(humidity);
    var windSpeed = $("<p>").text("Wind Speed: " + response.wind.speed + " MPH");
    $("#current-weather").append(windSpeed);
    var lat = response.coord.lat;
    var lon = response.coord.lon;

//call function to get UV index
    var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function (response) {
        var uvIndex = $("<p>").text("UV Index: " + response.value);
        var uvIndexValue = $("<p>").text("Uv Index Value: " + response.value);
        $("#current-weather").append(uvIndex);
        $("#current-weather").append(uvIndexValue);
    });
});
// Api to get 5 day forecast
var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
$.ajax({
    url: queryURL3,
    method: "GET"
}).then(function (responseForecast) {
    $("#forecast").empty();
    console.log(responseForecast);
    for (var i = 0, j=0; j<=5; i=i+6){
        var dateResponse = responseForecast.list[i].dt;
        if(responseForecast.list[i].dt !== responseForecast.list[i+1].dt){
            var forcastFive = $("<div>").attr("class", "card col-md-2 ml-4 bg-primary text-white");
            var d = new Date(0);
            d.setUTCSeconds(dateResponse);
            var date = d;
        console.log(date);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            var dateGenerated = month + '/' + day + '/' + year;
            var dateForecast = $("<h5>").text(dateGenerated);
            forcastFive.append(dateForecast);
            var tempForecast = $("<p>").text("Temp: " + responseForecast.list[i].main.temp + " °F");
            forcastFive.append(tempForecast);
            var humidityForecast = $("<p>").text("Humidity: " + responseForecast.list[i].main.humidity + "%");
            forcastFive.append(humidityForecast);
            $("#forecastBox").append(forcastFive);
        console.log(forecastFive);
            j++;
        }
    }

});

}

//Click function to each list item
$(document).on("click", "#cityList", function () {
    var selectCity = $(this).attr("data-city");
    getWeather(selectCity);
});
