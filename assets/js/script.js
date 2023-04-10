//pull in my API Key
const apiKey = '743ea4c7bdf1f7b353db6f0970bd117f'
const savedCities = [];

//Adding a clock function
function clock() {
    var realDateAndTime = dayjs().format("MMMM DD, YYYY - HH:mm:ss");
    $('#todayWeather').text(realDateAndTime);
}

//function
$('form').submit(function (event) {
    event.preventDefault();
    var citySearch = $(this).find('.form-control').val();
    savedCities.push($.trim(citySearch));
    localStorage.setItem("Cities", JSON.stringify(savedCities));
    var storedCities = JSON.parse(localStorage.getItem('Cities'));
    callWeather(citySearch);
})
function callWeather(citySearch) {
    $('.fiveDayForecast').empty();

    $('.localWeather').empty();
    fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + citySearch + '&appid=' + apiKey + '&units=imperial').then(response => response.json())
//saving searches to go back to
        .then(apiResults => {
            console.log(apiResults)
                var lat = apiResults.city.coord.lat
                var lon = apiResults.city.coord.lon
            console.log(lat, lon)
            if (apiResults.cod == 200) {
                renderCities(citySearch);
            }
            
// forcecast items
            const liTemp = $("<li>").addClass("listAllRequest temp")
            const liWind = $("<li>").addClass("listAllRequest wind")
            const liHumidity = $("<li>").addClass("listAllRequest humidity")
            const fiveDayHeader = $("<div>").addClass("cardHeader")
            const fdcContainer = $("<div>").addClass("allCards row")
            $('.fiveDayForecast').text("5 Day Forecast")
            $('.fiveDayForecast').append("<div>")

            for (var i = 1; i < apiResults.list.length; i = i + 8) {
                var tempID = ("temp-" + [i])
                var windID = ("wind-" + [i])
                var humidityID = ("humidity-" + [i])
                var headerID = ("header-" + [i])

                    $('.allCards').append(fiveDayHeader).append(liTemp).append(liWind).append(liHumidity).wrap(fdcContainer)
                    $('.fiveDayForecast').append(fdcContainer) 
                    $('.cardHeader').text(apiResults.city.name)
                    $('.temp').text(`Temp: ${apiResults.list[i].main.temp}`)
                    $('.wind').text(`Wind: ${apiResults.list[i].wind.speed}`)
                    $('.humidity').text(`Humidity: ${apiResults.list[i].main.humidity}`)  

            }

//pulling the weather for today and the few days
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`).then(res => res.json())
                .then(apiRezz => {
                    console.log(apiRezz)
                    $('.localWeather').append("<div class='cardHeader' id='header-0' style='width: 100%'></div").append("<li class='listAllRequest' id='temp-0'></li>").append("<li class='listAllRequest' id='wind-0'></li>").append("<li class='listAllRequest' id='humidity-0' </li>").wrapInner("<ul class='listAll listAllMain'> </ul").wrapInner("<div class='card EXTREME'> </div>")
                    const icon = apiRezz.weather[0].icon
                    const iconLink = $("<img src=http://openweathermap.org/img/wn/" + icon + "@2x.png></img>")
                    const div = $("<div>").addClass("headerDiv")
                
    console.log(apiRezz.weather[0].main)
                    $('#header-0').text(`${apiRezz.name}`).append(div)
                    $('.headerDiv').text(`Current Weather: ${apiRezz.weather[0].main}`).append(iconLink)
                    $('#temp-0').text(`Temperature: ${apiRezz.main.temp}F `)
                    $('#wind-0').text(`Wind: ${apiRezz.wind.speed} MPH`)
                    $('#humidity-0').text(`Humidity: ${apiRezz.main.humidity}`)
                })
        })
}

//city for li rendering
function renderCities(citySearch) {
    $(document).ready(function () {
        var saveBtn = $('<li class="saveBtn"><button class="btn-styled" type="button" dataCity= " ' + citySearch + '">' + citySearch + '</button></li>');
        saveBtn.appendTo('.savedCities')
        saveBtn.click(function (event) {
            callWeather($(this).find('button').data('city'))
        })
    });
}
setInterval(clock, 1000);