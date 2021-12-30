const inputDataForm = document.getElementById("input-location-form");
const tempReportWrap = document.querySelector("#temp-report-wrapper");
const tempDisplay = document.getElementById("temp");
const tempHeading = document.getElementById('temp-report-heading');
const tempMore = document.querySelector('#temp-more');
const generateButton = document.getElementById("generate-button");
const tempReport = $("#temp-report");
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



// start helper functions and classes
class Loader {
    constructor() {
        this.id = `loader-${Math.floor(Math.random() * 1000)}`;
    }
    show = function (parent) {
        this.element = document.createElement("div");
        this.element.classList.add("loader");
        this.element.id = this.id;
        parent.appendChild(this.element);
    };
    hide = function () {
        document.querySelector(`#${this.id}`).remove();
    };
}


const resetBackground = function() {
    for (let i in backgrounds) {
        backgrounds[i].hide();
    }
}
// end helper functions and classes


// start main functions
const getWeatherData = async function(city) {
    const response = await fetch(`${baseUrl}&q=${city}&apikey=${apiKey}`);
    const weatherData = await response.json();
    return weatherData;
}

const updateTemp = async function(weatherData) {
    if (weatherData.cod == 200) {
        tempHeading.innerHTML = `Temperature right now in ${weatherData.name}, ${weatherData.sys.country} is:`
        tempDisplay.innerHTML = `${weatherData.main.temp}&#176;`;
        tempMore.innerHTML = `<p id="temp-max">Max. temp: ${weatherData.main.temp_max}&#176;</p><p id="temp-min">Min. temp: ${weatherData.main.temp_min}&#176;</p><p id="weather">Weather: ${weatherData.weather[0].main}</p>`;

        resetBackground();
        const weatherState = weatherData.weather[0].main.toLowerCase();
        backgrounds[weatherState].fadeIn(250);

    } else {
        tempHeading.innerHTML = "invalid city";
        tempDisplay.innerHTML = "NA&#176;";
        tempMore.innerHTML = "";
    }
}

const requestData = function(city) {
    if (!city) {return;}
    const loader = new Loader();
    tempReport.hide();
    loader.show(tempReportWrap);

    getWeatherData(city)
    .then(weatherData => {
            loader.hide();
            tempReport.show();
            updateTemp(weatherData);
        })
    .catch(err => console.log(err))
}
// end main functions


inputDataForm.onsubmit = (e) => {
    e.preventDefault();
    requestData(document.getElementById("city-input").value);
}

requestData("new york");
