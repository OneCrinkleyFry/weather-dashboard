var apiKey = "eb45e13bc37e0b171df80c35b694b693";
var searchedStates = [];
var cityCardEl = document.querySelector("#city-card");

var getTodaysWeather = function(cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                displayTodaysWeather(data, cityName);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var getTodaysDate = function() {
    var today = moment().format("(MM/DD/YYYY)");
    return today;
}

var displayTodaysWeather = function(weatherData, cityName) {
    
    clearElement(cityCardEl);

    displayTitle(weatherData, cityName);
}

var displayTitle = function(weatherData, cityName) {
    var today = getTodaysDate();
    var icon = weatherData.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

    var cityTitleEL = document.createElement("h1");
    cityTitleEL.textContent = cityName + " " + today;
    cityTitleEL.classList = "ml-3 mt-4";

    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);

    cityTitleEL.appendChild(iconEl);

    cityCardEl.appendChild(cityTitleEL);
}

var clearElement = function(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


getTodaysWeather("Atlanta");