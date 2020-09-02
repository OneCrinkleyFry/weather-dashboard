var apiKey = "eb45e13bc37e0b171df80c35b694b693";
var searchedStates = [];
var 


var getTodaysWeather = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var getTodaysDate = function() {
    return moment().format("MM/DD/YYYY");
}

var displayTodaysWeather = function(weather, cityName) {

}


getTodaysWeather("atlanta");