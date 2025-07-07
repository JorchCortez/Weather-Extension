const API = {
    baseurl: 'https://api.open-meteo.com/v1/',
    currentParams: 'current=wind_speed_10m,is_day,apparent_temperature,weather_code,temperature_2m,relative_humidity_2m,wind_direction_10m,precipitation',
    dailyParams: 'daily=daylight_duration,weather_code,precipitation_probability_max,cloud_cover_mean',
    hourlyParams: 'hourly=apparent_temperature,is_day,weather_code,temperature_2m',
};

const apiEndpoints = [
    search = 'search',
    forecast = 'forecast',
]

const requestOptions = {
  method: "GET",
  redirect: "follow"
};

class manageData {
    constructor() {
        this.searchBox = document.querySelector('.search-box');
        this.temperature = document.querySelector('[w-val="temp"]');
        this.city = document.querySelector('[w-val="location"]');
        this.windDirection = document.querySelector('[w-val="wind-dir"]');
        this.windSpeed = document.querySelector('[w-val="wind-speed"]');
        this.weatherDescription = document.querySelector('[w-val="desc"]'); 
        this.humidity = document.querySelector('[w-val="humidity"]');
        this.hourlyForecast = document.querySelector('[w-val="hourly-forecast"]');
        this.weatherDescriptions = null;
        this.data = [];
        
        this.init();
    }

    async init () {
        await this.getWeatherData();
        await this.getWeatherDescriptions();
        this.setWeatherData();

                

    }

    async getWeatherDescriptions() { 
        const url = chrome.runtime.getURL('descriptions.json');
        await fetch(url)
        .then(response => response.json())
        .then(data => {
            this.weatherDescriptions = data;
            console.log('Weather descriptions loaded:', data);
        })
        .catch(error => console.error('Error loading weather descriptions:', error));
    }
        
    setWeatherData() {
        console.log('Setting Weather Data');
        console.log('Data:', this.data);
        if(this.data && this.data.length > 0) {
            const currentData = this.data[0].current;
            const dailyData = this.data[0].daily;
            const hourlyData = this.data[0].hourly;

            this.temperature.innerHTML = `${Math.round(currentData.temperature_2m)}<span w-val="temp-unit">°C</span>`;
            this.city.innerHTML = 'Vancouver'; // Placeholder, can be set dynamically
            this.windDirection.innerHTML = this.setWindDirection(currentData.wind_direction_10m);
            this.windSpeed.innerHTML = `${Math.round(currentData.wind_speed_10m)}`;
            this.weatherDescription.innerHTML = currentData; // Placeholder, can be set dynamically
            this.humidity.innerHTML = `${currentData.relative_humidity_2m}%`;

            // Set hourly forecast
            hourlyData.apparent_temperature.forEach((temp, index) => {
                if (index < 24) { // Limit to 5 items
                    const hourItem = document.createElement('div');
                    hourItem.className = 'hourly-forecast__item';
                    hourItem.innerHTML = `<span class="hour">${new Date().getHours() + index}:00</span>
                                          <img class="hourly-forecast__icon" src="${this.setWeatherIcon(currentData.is_day, currentData.weather_code)}" />
                                          <span class="temp">${Math.round(temp)}<span>°C</span></span>`;
                    this.hourlyForecast.appendChild(hourItem);
                }
            });
        }
    }


    async getCurrentLocation() { 
        try {
            const response = await fetch(`${API.baseurl}${apiEndpoints.search}${API.additionalParams}`);
            const data = await response.json();
            this.addData(data);
            return data;
        } catch (error) {
            return console.error('Error fetching weather data:', error);
        }
    }

    async getWeatherData() {
        try {
            const response = await fetch(`${API.baseurl}forecast?latitude=49.24966&longitude=-123.11934&${API.currentParams}&${API.dailyParams}&${API.hourlyParams}`, requestOptions);
            const data = await response.json();
            console.log('Current Location Data:', data);
            this.addData(data);
            return data; 
        } catch (error) {
            return console.error('Error fetching weather data:', error);
        }
    }

    addData(newData) {
        this.data.push(newData);
    }

    getData() {
        return this.data;
    }

    setWeatherDescription(weather_code) {
        const time = is_day ? 'day' : 'night';
        return this.weatherDescriptions[weather_code][time].description; // Assuming weatherDescriptions is an object with weather codes as keys
    }

    setWeatherIcon(is_day, weather_code) {
        const time = is_day ? 'day' : 'night';
        return this.weatherDescriptions[weather_code][time].image; // Assuming weatherDescriptions is an object with weather codes as keys
    }
    
    setDayBackground(is_day, weather_code) {
        if (is_day) {
            return 'https://open-meteo.com/images/weather-icons/day/01.png'; // Day background URL
        } else {
            return 'https://open-meteo.com/images/weather-icons/night/01.png'; // Night background URL
        }
    }

    setWindDirection(deg) {
        if (deg >= 0 && deg < 22.5) return 'N';
        if (deg >= 22.5 && deg < 67.5) return 'NE';
        if (deg >= 67.5 && deg < 112.5) return 'E';
        if (deg >= 112.5 && deg < 157.5) return 'SE';
        if (deg >= 157.5 && deg < 202.5) return 'S';
        if (deg >= 202.5 && deg < 247.5) return 'SW';
        if (deg >= 247.5 && deg < 292.5) return 'W';
        if (deg >= 292.5 && deg < 337.5) return 'NW';
        return 'N'; // Default case
    }

}

const weatherData = new manageData();