var apiKey = "eb45e13bc37e0b171df80c35b694b693";
var searchedCitys = [];
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
    displayDetails(weatherData);
}

var displayTitle = function(weatherData, cityName) {
    var today = getTodaysDate();
    var icon = weatherData.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

    var cityTitleEL = document.createElement("h1");
    cityTitleEL.textContent = cityName + " " + today;
    cityTitleEL.classList = "ml-3 mt-4 col-12";

    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);

    cityTitleEL.appendChild(iconEl);

    cityCardEl.appendChild(cityTitleEL);
}

var displayDetails = function(weatherData) {
    
    var detailsEl = document.createElement("div");
    detailsEl.classList = "ml-3 col-12 mb-4";
    detailsEl.setAttribute("id", "city-details")

    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + weatherData.main.temp + " °F";
    temperatureEl.classList = "city-detail";
    detailsEl.appendChild(temperatureEl);

    console.log(weatherData);

    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";
    humidityEl.classList = "city-detail";
    detailsEl.appendChild(humidityEl);

    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind Speed: " + weatherData.wind.speed + " MPH";
    windSpeedEl.classList = "city-detail";
    detailsEl.appendChild(windSpeedEl);

    var lat = weatherData.coord.lat;
    var lon = weatherData.coord.lon;
    getTodaysUV(lat, lon, detailsEl);

    cityCardEl.appendChild(detailsEl);
}

var displayUV = function(uv, detailsEl) {
    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "city-detail";

    var uvBadgeEl = document.createElement("span");
    uvBadgeEl.classList = "badge p-2";
    uvBadgeEl.textContent = uv;

    //determines what class to apply for danger rating of the UV index
    if (uv <= 2) {
        uvBadgeEl.classList += " badge-success";
    } else if (uv <= 5 && uv > 2) {
        uvBadgeEl.classList += " badge-warning";
    } else if (uv <= 7 && uv > 5) {
        uvBadgeEl.classList += " badge-caution";
    } else if (uv <= 10 && uv > 7) {
        uvBadgeEl.classList += " badge-danger";
    } else if (uv > 10) {
        uvBadgeEl.classList += " badge-doomed";
    }
    //

    uvIndexEl.appendChild(uvBadgeEl);

    detailsEl.appendChild(uvIndexEl);
}

var getTodaysUV = function(lat, lon, detailsEl) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
            displayUV(data.value, detailsEl);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    }); 
}

var clearElement = function(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


getTodaysWeather("Atlanta");