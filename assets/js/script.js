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

function renderCities() {
    $("#city-name").empty();
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];
        var li = $("<li>").text(city);
        li.attr("data-index", i);
        li.attr("class", "list-group-item");
        li.attr("id", "cityList");
    console.log(li);
        $("#city-name").prepend(li);
    }

    var city = cities[0];
citySearch.on('submit', function (event) {
    event.preventDefault();
    var city = cityName.val().trim();
    if (city === "") {
        return;
    }
    cities.push(city);
    storedCities();
    renderCities();
});

//function get response weather

function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var city = response.name;
        var temp = response.main.temp;
        var humidity = response.main.humidity;
        var wind = response.wind.speed;
        var icon = response.weather[0].icon;
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var date = formatDate();
        var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
        var iconImg = $("<img>").attr("src", iconURL);
        $("#current-city").text(city + " (" + date + ")").append(iconImg);
        $("#temp").text("Temperature: " + temp + " °F");
        $("#humidity").text("Humidity: " + humidity + "%");
        $("#wind").text("Wind Speed: " + wind + " MPH");
        getUV(lat, lon);
        getForecast(city);
    

    // api to get the UV index
    function getUV(lat, lon) {
        var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var uv = response.value;
            $("#uv").text("UV Index: " + uv);
        });
    }

    // api to get the 5 day forecast
    function getForecast(city) {
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            var results = response.list;
            for (var i = 0; i < results.length; i += 8) {
                var date = results[i].dt_txt;
                var temp = results[i].main.temp;
                var humidity = results[i].main.humidity;
                var icon = results[i].weather[0].icon;
                var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
                var iconImg = $("<img>").attr("src", iconURL);
                $("#date" + i).text(date);
                $("#icon" + i).append(iconImg);
                $("#temp" + i).text("Temp: " + temp + " °F");
                $("#humidity" + i).text("Humidity: " + humidity + "%");
            }
        });
    }
}

// clicked function to each li
$(document).on("click", "#cityList", function () {
    var index = $(this).attr("data-index");
    getWeather(cities[index]);
}

