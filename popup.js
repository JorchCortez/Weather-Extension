const api = {
    key:"01a20d2f630634cf6699c7899ec94813",
    baseurl:"https://api.openweathermap.org/data/2.5/",
}

const searchBox = document.querySelector('.search-box');
searchBox.addEventListener('keypress', setQuery);

function setQuery(evt){
    if(evt.keyCode==13){
        getResults(searchBox.value); 
    }
}

const getResults = (query) => {
    fetch(`${api.baseurl}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults)
}

const displayResults = (weather) =>{
    console.log(weather)
    
    //Setting the city, Country
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    //Setting up the date
    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);


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