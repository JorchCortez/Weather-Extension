const api = {
    key:"01a20d2f630634cf6699c7899ec94813",
    baseurl:"https://api.openweathermap.org/data/2.5/",
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
    weather_el.innerText = weather.weather[0].main;

    //Setting up hi/low temperatures
    let hilo = document.querySelector('.hi-low')
    hilo.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C `
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
        savedPlaces += `<div class="place" onclick="getResults("${el}")" >${el}</div>`
    });
    places.innerHTML = savedPlaces;
}


let currSaved = [
    "Monterrey, MX",
    "Vancouver, CA"
    ]