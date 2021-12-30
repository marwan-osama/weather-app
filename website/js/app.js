const inputDataForm = document.getElementById("input-location-form");
const tempReportWrap = document.querySelector("#temp-report-wrapper");
const tempDisplay = document.getElementById("temp");
const tempHeading = document.getElementById('temp-report-heading');
const tempMore = document.querySelector('#temp-more');
const generateButton = document.getElementById("generate-button");
const backgrounds = {
    rain: $("#rain-background"),
    clear: $("#clear-background"),
    mist: $("#mist-background"),
    haze: $("#haze-background"),
    snow: $("#snow-background"),
    clouds: $("#clouds-background")
}

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?units=metric';
const apiKey = '180bd9f9a2698eb069f24a0d48ea1833';


function Loading() {
    this.id = `loading-${Math.floor(Math.random() * 1000)}`
    this.loadingHtml = `<div class='loader' id=${this.id}></div>`;
    this.fragment;

    this.show = function(parent) {
        this.element = document.createElement("div");
        this.element.classList.add("loader");
        this.element.id = this.id;
        parent.appendChild(this.element);
    }
    this.hide = function() {
        document.querySelector(`#${this.id}`).remove();
    }
}


const resetBackground = function() {
    for (let i in backgrounds) {
        backgrounds[i].hide();
    }
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
        tempHeading.innerHTML = `Temperature right now in ${weatherData.name}, ${weatherData.sys.country} is:`
        tempDisplay.innerHTML = `${weatherData.main.temp}&#176;`;
        tempMore.innerHTML = `<p id="temp-max">Max. temp: ${weatherData.main.temp_max}&#176;</p><p id="temp-min">Min. temp: ${weatherData.main.temp_min}&#176;</p><p id="weather">Weather: ${weatherData.weather[0].main}</p>`;

        resetBackground();
        backgrounds[weatherData.weather[0].main.toLowerCase()].fadeIn(250);

    } else 
    {
        tempHeading.innerHTML = "invalid city";
        tempDisplay.innerHTML = "NA&#176;";
        tempMore.innerHTML = "";
    }
}
const handleFormSubmit = function(event) {
    event.preventDefault();
    requestData();
}

const requestData = function() {
    const city = document.getElementById("city-input").value;
    const loader = new Loading();
    const tempReport = $("#temp-report");
    tempReport.hide();
    loader.show(tempReportWrap);
    
    if (city) {
        getWeatherData(city).then(
            function(weatherData) {
                loader.hide();
                tempReport.show();
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

document.getElementById("city-input").value = "new york";
requestData();
