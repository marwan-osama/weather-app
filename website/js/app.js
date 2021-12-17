const inputDataForm = document.getElementById("input-location-form");
const tempDisplay = document.getElementById("temp");
const tempHeading = document.getElementById('temp-report-heading');
const tempMore = document.querySelector('#temp-more');
const generateButton = document.getElementById("generate-button");
const contentBackgroundClouds = document.getElementById("clouds-background");
const contentBackgroundRain = document.getElementById("rain-background");
const contentBackgroundClear = document.getElementById("clear-background");
const contentBackgroundMist = document.getElementById("mist-background");
const contentBackgroundHaze = document.getElementById("haze-background");

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric';
const apiKey = '180bd9f9a2698eb069f24a0d48ea1833';

const resetBackground = function() {
    $(contentBackgroundClear).hide();
    $(contentBackgroundRain).hide();
    $(contentBackgroundClouds).hide();
    $(contentBackgroundMist).hide();
}

const getWeatherData = async function(city) {
    const response = await fetch(`${baseUrl}&q=${city}&apikey=${apiKey}`);
    try {
        const weatherData = await response.json();
        console.log(weatherData);
        return weatherData;
    }
    catch(error) {
        console.log(error);
    }
}
const updateTemp = async function(weatherData) {
    if (weatherData.cod == 200) {
        tempHeading.innerHTML = `Temperature right now in ${weatherData.name} is:`
        tempDisplay.innerHTML = `${weatherData.main.temp}&#176;`;
        tempMore.innerHTML = `<p id="temp-max">Max. temp: ${weatherData.main.temp_max}&#176;</p><p id="temp-min">Min. temp: ${weatherData.main.temp_min}&#176;</p><p id="weather">Weather: ${weatherData.weather[0].main}</p>`;

        resetBackground();
        if (weatherData.weather[0].main == "Clouds") {
            $(contentBackgroundClouds).fadeIn(250);
        } else if (weatherData.weather[0].main == "Rain") {
            $(contentBackgroundRain).fadeIn(250);
        } else if (weatherData.weather[0].main == "Clear") {
            $(contentBackgroundClear).fadeIn(250);
        } else if (weatherData.weather[0].main == "Mist") {
            $(contentBackgroundMist).fadeIn(250);
        } else if (weatherData.weather[0].main == "Haze") {
            $(contentBackgroundHaze).fadeIn(250);
        }
    } else 
    {
        tempHeading.innerHTML = "invalid city";
        tempDisplay.innerHTML = "NA&#176;";
        tempMore.innerHTML = "";
    }
}
const handleFormSubmit = function(event) {
    event.preventDefault();
    const city = document.getElementById("city-input").value;
    if (city) {
        getWeatherData(city).then(
            function(weatherData) {
                updateTemp(weatherData);
            }
        )
    }
}


const getJson = async function() {
    const city = document.getElementById("city-input").value;
    const response = await fetch(`http://localhost:8000/search-suggest/${city}`);
    try {
        const filteredCities = await response.json();
        console.log(filteredCities);
        return filteredCities;
    }
    catch(error) {
        console.log(error);
    }
}

const updateUI = async function(data) {
    const cities = await data
    let fragment = '';
    try {
        for (let i = 0; i < 10; i++) {
            try{
                fragment += `<option value="${cities[i]}"></option>`;
            }
            catch(error) {
                continue
            }
        }
        const suggestionDataList = document.querySelector("#search-suggest");
        suggestionDataList.innerHTML = fragment;
    }
    catch(error) {
        console.log(error)
    }
}

inputDataForm.onsubmit = handleFormSubmit;
inputDataForm.oninput = function () {getJson().then(function(data){updateUI(data)})};

getWeatherData("new york").then(
    function(weatherData) {
        updateTemp(weatherData);
    }
)
