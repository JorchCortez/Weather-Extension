const api = {
    key:"01a20d2f630634cf6699c7899ec94813",
    baseurl:"https://api.openweathermap.org/data/2.5/"
}

window.onload = () => {
    //getResults("Monterrey, Mx") 
    saveCities();
} 

//Search box event listener
const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);
let currCities = [];
//Save city click event listener   
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("pin").addEventListener("click", function(){pinAddress()});
}); 



function pinAddress(){
    let city = document.querySelector('.location .city .city-txt').innerText;
    saveCities(city)
}

function setQuery(evt){
    if(evt.keyCode==13){
        getResults(searchBox.value); 
        searchBox.value = ""
    }
}

function getResults(query) {
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults)
}
function getGeoResults(lat,lon) {
    fetch(`${api.baseurl}weather?lat=${lat}&lon=${lon}&units=metric&appid=${api.key}`)
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
        }
    })
}

const displayResults = (weather) =>{
    console.log(weather)
    //Setting the city, Country
    let city = document.querySelector('.location .city .city-txt');
    city.innerHTML = `${weather.name}, ${weather.sys.country}`;

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

    //Settubg up Background
    getBg(weather.weather[0].main,weather.main.temp);

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
    currCities = []
    chrome.storage.sync.get(["myCities"], function(items){ 
        console.log(city)
        if(items.myCities.length > 0 || city){
            if(city){ 
                currCities = [...items.myCities, city]
                getResults(currCities[0]) 
                loadSavedCities(currCities)
                chrome.storage.sync.set({ "myCities": currCities }, function(){}); 
            }
            else{ 
                getResults(items.myCities[0]) 
                loadSavedCities(items.myCities)
            }
        }
        else{
            console.log("Here!")
            //If no locations stored bring the current geolocation
            navigator.geolocation.getCurrentPosition(success, error, options);
        }
    });
}

const deleteCity = (city) => {
    let currCities = []
    chrome.storage.sync.get(["myCities"], function(items){
        console.log(items.myCities)
        currCities = [...items.myCities, city]
        
        //Delete the specific city
        let newCities = currCities.filter(function(ele){ 
            return ele != city; 
        });

        console.log(newCities)
        loadSavedCities(newCities)
        chrome.storage.sync.set({ "myCities": newCities }, function(){
            console.log("Updated")
            //  A data saved callback omg so fancy
        });

    });
}

const loadSavedCities = (c) =>{
    let places = document.querySelector('.saved-places')
    let savedPlaces = ""
    c.forEach(el => { 
        savedPlaces += `<div class="place" value="${el}" >${el}<span class="delete-city"><img src="./Img/trashcan.png" /></span></div>`
    });
    places.innerHTML = savedPlaces;
    AddEvents();
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

const AddEvents = () => {
    //Load event
    let placeList = document.getElementsByClassName("place");
    console.log(placeList)
    for (var i = 0; i < placeList.length; i++) { 
        let p = placeList[i].innerText
        placeList[i].addEventListener("click", function(){getResults(p)}); 
        placeList[i].children[0].addEventListener("click", function(){deleteCity(p)});
    }
}

const getBg = (weatherType, temp) => {

//Find background object
let main = document.querySelector('.app-container')
const bgRoute = "./Img/"
console.log(weatherType, temp)
switch(weatherType){
    case("Thunderstorm"):
        main.style.backgroundImage = `url("${bgRoute}bg-thunderstorm.png")`
    break;
    case("Drizzle"):
        main.style.backgroundImage = `url("${bgRoute}bg-drizzle.png")`
    break;
    case("Rain"):
        main.style.backgroundImage = `url("${bgRoute}bg-rain.png")`
    break;
    case("Snow"):
        main.style.backgroundImage = `url("${bgRoute}bg-snow.png")`
    break;
    case("Clear"):
        console.log("yeet!")
        if(temp < 10)
        main.style.backgroundImage = `url("${bgRoute}bg-cold.png")`
        else if(temp > 30)
        main.style.backgroundImage = `url("${bgRoute}bg-hot.png")`
        else
        main.style.backgroundImage = `url("${bgRoute}bg-normal.png")`
    break;
    case("Clouds"):
        main.style.backgroundImage = `url("${bgRoute}bg-clouds.png")`
    break;
    case("Fog"):
        main.style.backgroundImage = `url("${bgRoute}bg-fog.png")`
    break;
}

}
 
//Geolocation functions
var options = {
    enableHighAccuracy: false,
    timeout: 2500,
    maximumAge: 0
};

function success(pos) {
var crd = pos.coords;
    getGeoResults(crd.latitude,crd.longitude) 
}

function error(err) {
console.warn(`ERROR(${err.code}): ${err.message}`);
}
