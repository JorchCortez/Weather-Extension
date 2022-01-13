const api = {
    key:"01a20d2f630634cf6699c7899ec94813",
    baseurl:"https://api.openweathermap.org/data/2.5/"
}

window.onload = () => {
    getResults("Monterrey, Mx") 
} 

//Search box event listener
const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

//Save city click event listener 
const pin = document.querySelector('.icon');
pin.addEventListener('click', pinAddress);


function pinAddress(){
    let city = document.querySelector('.location .city').innerText;
    console.log(city)
    saveCities(city)
}

function setQuery(evt){
    if(evt.keyCode==13){
        getResults(searchBox.value); 
    }
}

function getResults(query) {
    console.log(query)
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults)
}

function getForecast(query){
    fetch(`${api.baseurl}onecall?lat=${query.lat}&lon=${query.lon}&exclude=hourly,minutely,current&units=metric&appid=${api.key}`)
    .then(forecast =>{
        return forecast.json();
    }).then(displayForecast)
}

const displayForecast = (forecast) => {
    
    let fc = document.querySelector('.forecast');
    fc.innerHTML = "";
    forecast.daily.map( (day, index) => {
        if(index < 5){
            fc.innerHTML += `<div class="fc-day"><div class="icon-small"><img src="http://openweathermap.org/img/w/${day.weather[0].icon}.png" /></div><div class="day-name">${calcDay(index + 1)}</div><div class="temp">${Math.round(day.temp.min)}<span>°C</span> / ${Math.round(day.temp.max)}<span>°C</span></div></div>`
            console.log(forecast)
            console.log(calcDay(index + 1) ,day.temp.min + "  " + day.temp.max)
        }
    })
}

const displayResults = (weather) =>{
    console.log(weather)

    //Setting the city, Country
    let city = document.querySelector('.location .city');
    city.innerHTML = `<span class="icon"><i class="fas fa-thumbtack"></i></span>${weather.name}, ${weather.sys.country}`;

    //Setting up the date
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    //Setting up Temperature
    let temp = document.querySelector('.current .temp')
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`

    //Setting up weather
    let weather_el = document.querySelector('.current .weather')
    weather_el.innerText = weather.weather[0].description;

    //Setting up hi/low temperatures
    let hilo = document.querySelector('.hi-low')
    hilo.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C `

    //Setting up icon
    let weatherIcon = document.querySelector('.weather-icon')
    weatherIcon.src = "http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png";

    //Requesting weekly forecast
    getForecast(weather.coord)
}

const dateBuilder = (d) => {
    let months = [  'January', 'February', 'March', 
                    'April', 'May', 'June', 
                    'July', 'August', 'September',
                    'October', 'November', 'December'];

    let days    = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
                    'Thursday', 'Friday', 'Saturday'];

    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let date = d.getDate();
    let year = d.getFullYear();
    return `${day} ${date} ${month} ${year}` 
}

const saveCities = (city) => {

    /*let cities = chrome.storage.sync.get(["currentCities"], function(items){
        //  items = [ { "yourBody": "myBody" } ]
    });
    console.log(cities)
    */
    //chrome.storage.sync.set({ "currentCities": city }, function(){});  
    loadSavedCities(currSaved); 
}

const loadSavedCities = (c) =>{
    let places = document.querySelector('.saved-places')
    let savedPlaces = ""
    c.forEach(el => {
        savedPlaces += `<div class="place" onclick="getResults('${el}')" >${el}</div>`
    });
    places.innerHTML = savedPlaces;
}

const calcDay = (targetDay) => {
    let now = new Date(); 
    now.setDate(now.getDate() + targetDay) 
    let Days =["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]
    return Days[now.getDay()]
}

let currSaved = [
    "Monterrey, MX",
    "Vancouver, CA"
    ]