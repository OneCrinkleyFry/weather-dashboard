var apiKey = "eb45e13bc37e0b171df80c35b694b693";
var searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
var formEl = document.querySelector(".form-group");
var cityCardEl = document.querySelector("#city-card");
var cityListEl = document.querySelector("#city-list");


// function that takes a city name parameter
var getTodaysWeather = function (cityName) {

    //creates an endpoint url using that city name
    var apiUrl = "//api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    //fetches data from that endpoint
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                //if the array storing searched cities does not already have this city name
                if (!searchedCities.includes(cityName)) {

                    //adds it to the array
                    searchedCities.push(cityName);

                    //save the changed array to the local storage
                    localStorage.setItem("cities", JSON.stringify(searchedCities));

                    //and updates the listed cities
                    displayCities();
                }
                // calls the function to create today's weather elements
                displayTodaysWeather(data, cityName);

                //then calls the function to get the forecast
            }).then(getForecast(cityName));
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

// a function that takes the cityname
var getForecast = function (cityName) {

    //creates an endpoint
    var apiForecastUrl = "//api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey + "&units=imperial";

    //fetches that endpoint
    fetch(apiForecastUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //calls a function that display the forecast card
                displayForecast(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

//finds today's date using moment.js
var getTodaysDate = function () {
    var today = moment().format("(MM/DD/YYYY)");
    return today;
}

//a function that takes the weather data and the city name
var displayTodaysWeather = function (weatherData, cityName) {
    //clears the elements of any data previously inside.
    clearElement(cityCardEl);

    //passes that data to functions to seperate concerns
    displayTitle(weatherData, cityName);
    displayDetails(weatherData);
}

//a function that takes data, and the name of the city.
var displayTitle = function (weatherData, cityName) {
    //stores todays date
    var today = getTodaysDate();

    //determines which icon to use
    var icon = weatherData.weather[0].icon;
    //pulls that icon from it's source
    var iconUrl = "//openweathermap.org/img/w/" + icon + ".png";

    //creates an h1 element and applies the CityName and date.
    var cityTitleEL = document.createElement("h1");
    cityTitleEL.textContent = cityName + " " + today;
    cityTitleEL.classList = "ml-3 text-capitalize mt-4 col-12";

    //creates an image element with the appropriate icon
    var iconEl = document.createElement("img");
    iconEl.setAttribute("src", iconUrl);

    //adds the title element to the DOM
    cityTitleEL.appendChild(iconEl);

    cityCardEl.appendChild(cityTitleEL);
}

//a function that takes the data
var displayDetails = function (weatherData) {

    //creates a div container element
    var detailsEl = document.createElement("div");
    detailsEl.classList = "ml-3 col-12 mb-4";
    detailsEl.setAttribute("id", "city-details")

    // creates a p element that displays the temperature from the data
    // adds it to the div element
    var temperatureEl = document.createElement("p");
    temperatureEl.textContent = "Temperature: " + weatherData.main.temp + " °F";
    temperatureEl.classList = "city-detail";
    detailsEl.appendChild(temperatureEl);

    // creates a p element that displays the humidity from the data
    // adds it to the div element
    var humidityEl = document.createElement("p");
    humidityEl.textContent = "Humidity: " + weatherData.main.humidity + "%";
    humidityEl.classList = "city-detail";
    detailsEl.appendChild(humidityEl);

    // creates a p element that displays the wind-speed from the data
    // adds it to the div element
    var windSpeedEl = document.createElement("p");
    windSpeedEl.textContent = "Wind Speed: " + weatherData.wind.speed + " MPH";
    windSpeedEl.classList = "city-detail";
    detailsEl.appendChild(windSpeedEl);

    //calls a function to get the uvIndex from the api
    getTodaysUV(weatherData.coord.lat, weatherData.coord.lon, detailsEl);

    //adds all the elements to the existing DOM
    cityCardEl.appendChild(detailsEl);
}

// a function that takes the data, and the parent element
var displayUV = function (uv, detailsEl) {

    // creates a p element that displays the uv Index from the data
    var uvIndexEl = document.createElement("p");
    uvIndexEl.textContent = "UV Index: ";
    uvIndexEl.classList = "city-detail";

    //creates a span element to style the uvIndex number only
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

    //adds the element to the DOM
    uvIndexEl.appendChild(uvBadgeEl);
    detailsEl.appendChild(uvIndexEl);
}

// A function that takes the latitude, and longtitude, and a parent element
var getTodaysUV = function (lat, lon, detailsEl) {

    //creates an endpoint
    var apiUrl = "//api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + lat + "&lon=" + lon;
    
    //fetches the data at that endpoint
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                //calls a function to create the element.
                displayUV(data.value, detailsEl);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    });
}

// a function that takes the forecast data
var displayForecast = function (forecast) {
    //takes the first five days listed in the data, and stores them in a new array
    var forecastArr = forecast.list.splice(0, 5);
    //gets the parent element from the HTML
    var forecastCardsEl = document.querySelector("#forecast-cards");

    //empties the element of previously created children
    clearElement(forecastCardsEl);

    //create a card per day stored in the array
    for (var i = 0; i < forecastArr.length; i++) {

        //gets the appropriate weather icon
        var icon = forecastArr[i].weather[0].icon;
        var iconUrl = "//openweathermap.org/img/w/" + icon + ".png";

        //creates a div parent
        var cardEl = document.createElement('div');
        cardEl.classList = "badge badge-primary col-xs-12 col-sm-5 col-lg-3" +
            " col-xl-auto text-center text-md-left font-weight-light forecast-card";

        //creates the h4 element for the date
        //adds it to the parent
        var dateEl = document.createElement("h4");
        dateEl.textContent = moment().add(i + 1, 'days').format("M/D/YYYY");
        dateEl.classList = "forecast-heading";
        cardEl.appendChild(dateEl);

        // creates the icon element
        //adds it to the parent
        var iconEl = document.createElement("img");
        iconEl.setAttribute("src", iconUrl);
        cardEl.appendChild(iconEl);

        //creates a p element for the temperature
        //adds it to the parent
        var temperatureEl = document.createElement("p");
        temperatureEl.textContent = `Temp: ${forecastArr[i].main.temp} °F`;
        temperatureEl.classList = "card-detail";
        cardEl.appendChild(temperatureEl);

        //creates a p element for the humidity
        //adds it to the parent
        var humidityEl = document.createElement("p");
        humidityEl.textContent = `Humidity: ${forecastArr[i].main.humidity}%`;
        humidityEl.classList = "card-detail";
        cardEl.appendChild(humidityEl);

        //adds the card to the document
        forecastCardsEl.appendChild(cardEl);
    }
}

//a function that takes an element, and clears all children
var clearElement = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// a function that takes an event.
var cityFormHandler = function (event) {
    //prevents it from refreshing
    event.preventDefault();

    //makes a city name based off of what is in the form
    var cityName = document.querySelector("#city-search-name").value.toLowerCase();

    //clears the form
    document.querySelector("#city-search-name").value = "";

    //calls the function that gets the weather data
    getTodaysWeather(cityName);
}

//a function to display the list of cities
var displayCities = function () {
    //if there are previously searched cities
    if (searchedCities) {
        //clear the list
        clearElement(cityListEl);
        //for each item in the list
        for (let i = 0; i < searchedCities.length; i++) {

            //create an li element that holds the city name
            var listItemEl = document.createElement("li");
            listItemEl.textContent = searchedCities[i];
            listItemEl.classList = "list-group-item text-capitalize";
            listItemEl.setAttribute("data-name", searchedCities[i]);

            //and adds it to the top of the list
            cityListEl.prepend(listItemEl);
        }
    }
}

// a function to display the city if you click on it's list item
var cityListHandler = function (event) {
    var cityName = event.target.getAttribute("data-name");

    getTodaysWeather(cityName);
}

//event listeners
formEl.addEventListener("submit", cityFormHandler);

cityListEl.addEventListener("click", cityListHandler);

//the initial display of previously searched cities.
displayCities();