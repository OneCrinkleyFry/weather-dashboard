var apiKey = "eb45e13bc37e0b171df80c35b694b693";
var searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
var formEl = document.querySelector(".form-group");
var cityCardEl = document.querySelector("#city-card");
var cityListEl = document.querySelector("#city-list");

var getTodaysWeather = function (cityName) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                if (!searchedCities.includes(cityName)) {

                    searchedCities.push(cityName);
                    localStorage.setItem("cities", JSON.stringify(searchedCities));

                    displayCities();
                }
                displayTodaysWeather(data, cityName);
            }).then(getForecast(cityName));
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var getForecast = function (cityName) {
    var apiForecastUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    fetch(apiForecastUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayForecast(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var getTodaysDate = function () {
    var today = moment().format("(MM/DD/YYYY)");
    return today;
}

var displayTodaysWeather = function (weatherData, cityName) {

    clearElement(cityCardEl);

    displayTitle(weatherData, cityName);
    displayDetails(weatherData);
}

var displayTitle = function (weatherData, cityName) {
    var today = getTodaysDate();
    var icon = weatherData.weather[0].icon
    var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

    var cityTitleEL = document.createElement("h1");
    cityTitleEL.textContent = cityName + " " + today;
    cityTitleEL.classList = "ml-3 text-capitalize mt-4 col-12";

    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);

    cityTitleEL.appendChild(iconEl);

    cityCardEl.appendChild(cityTitleEL);
}

var displayDetails = function (weatherData) {

    var detailsEl = document.createElement("div");
    detailsEl.classList = "ml-3 col-12 mb-4";
    detailsEl.setAttribute("id", "city-details")

    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + weatherData.main.temp + " °F";
    temperatureEl.classList = "city-detail";
    detailsEl.appendChild(temperatureEl);

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

var displayUV = function (uv, detailsEl) {
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

var getTodaysUV = function (lat, lon, detailsEl) {
    var apiUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayUV(data.value, detailsEl);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

var displayForecast = function (forecast) {
    var forecastArr = forecast.list.splice(0, 5);
    var forecastCardsEl = document.querySelector("#forecast-cards");

    clearElement(forecastCardsEl);

    for (var i = 0; i < forecastArr.length; i++) {

        var icon = forecastArr[i].weather[0].icon;
        var iconUrl = "http://openweathermap.org/img/w/" + icon + ".png";

        var cardEl = document.createElement('div');
        cardEl.classList = "badge badge-primary col-xs-12 col-sm-5 col-lg-3" +
            " col-xl-auto text-center text-md-left font-weight-light forecast-card";

        var dateEl = document.createElement("h4");
        dateEl.textContent = moment().add(i + 1, 'days').format("M/D/YYYY");
        dateEl.classList = "forecast-heading";
        cardEl.appendChild(dateEl);

        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconUrl);
        cardEl.appendChild(iconEl);

        var temperatureEl = document.createElement("p");
        temperatureEl.textContent = `Temp: ${forecastArr[i].main.temp} °F`;
        temperatureEl.classList = "card-detail";
        cardEl.appendChild(temperatureEl);

        var humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${forecastArr[i].main.humidity}%`;
        humidityEl.classList = "card-detail";
        cardEl.appendChild(humidityEl);

        forecastCardsEl.appendChild(cardEl);
    }
}

var clearElement = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

var cityFormHandler = function (event) {
    event.preventDefault();
    var cityName = document.querySelector("#city-search-name").value.toLowerCase();
    document.querySelector("#city-search-name").value = "";

    getTodaysWeather(cityName);
}

var displayCities = function () {
    if (searchedCities) {
        clearElement(cityListEl);
        for (let i = 0; i < searchedCities.length; i++) {

            var listItemEl = document.createElement("li");
            listItemEl.textContent = searchedCities[i];
            listItemEl.classList = "list-group-item text-capitalize";
            listItemEl.setAttribute("data-name", searchedCities[i]);

            cityListEl.prepend(listItemEl);
        }
    }
}

var cityListHandler = function (event) {
    var cityName = event.target.getAttribute("data-name");

    getTodaysWeather(cityName);
}


formEl.addEventListener("submit", cityFormHandler);

cityListEl.addEventListener("click", cityListHandler);

displayCities();