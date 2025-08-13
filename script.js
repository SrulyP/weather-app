
const weatherApp = {
    units: 'F',
    lastLocation: null,

    init: function() {
        this.cacheDom();
        this.bindEvents();
    },
    
    cacheDom: function() {
        this.currentTemp = document.querySelector('.temp-amount');
        this.hiTemp = document.querySelector('.hi-amount');
        this.loTemp = document.querySelector('.low-amount');
        this.currentLocation = document.querySelector('.location');
        this.currentCity = document.querySelector('.city');
        this.currentState = document.querySelector('.state');
        this.feelsLike = document.querySelector('.feels-like-amount');
        this.humidity = document.querySelector('.humidity-amount');
        this.precipitation = document.querySelector('.precipitation-amount');
        this.windSpeed = document.querySelector('.wind-speed-amount');
        this.uvIndex= document.querySelector('.uv-index-amount');
        
        this.form = document.getElementById('search-location-form');
        this.input = this.form.querySelector('input[name="search-location"]');

        this.toggleUnits = document.querySelector('.toggle-units');
        this.fahrenheit = document.querySelector('.F-units');
        this.celsius = document.querySelector('.C-units');
    },

    bindEvents: function() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const value = this.input.value.trim();
            if (value){
                this.locationSearch(value);
            } 
        });

        this.fahrenheit.addEventListener('click', () => {
            this.units = 'F';
            this.fahrenheit.classList.add('active');
            this.celsius.classList.remove('active');
            if (this.lastLocation) {
                this.render(this.lastLocation);
            }
        });

        this.celsius.addEventListener('click', () => {
            this.units = 'C';
            this.celsius.classList.add('active');
            this.fahrenheit.classList.remove('active');
            if (this.lastLocation) {
                this.render(this.lastLocation);
            }
        });
    },

    locationSearch: async function(location) {
        try {
            location = encodeURIComponent(location);
            const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "?unitGroup=us&key=HSAU33NGAHW4EDPY5995Q4MUQ&contentType=json"
            const response = await fetch(url, { "method": "GET" });
            if (!response.ok){
                throw new Error(`Error: status ${response.status}`);
            }
            const weatherInfo = await response.json();
            this.lastLocation = weatherInfo;
            this.render(this.lastLocation);
        } catch (err) {
            console.error("Fetch failed:", err);
        }
    },

    render: function(weatherInfo) {
        console.log("Full API response:", weatherInfo);
        this.humidity.textContent = weatherInfo.currentConditions.humidity;
        this.precipitation.textContent = weatherInfo.currentConditions.precip;
        this.windSpeed.textContent = weatherInfo.currentConditions.windspeed;
        this.uvIndex.textContent = weatherInfo.currentConditions.uvindex;
        if (this.units === 'F') {
            this.currentTemp.textContent = Math.round(weatherInfo.currentConditions.temp) + '°';
            this.feelsLike.textContent = Math.round(weatherInfo.currentConditions.feelslike) + '°';
            this.hiTemp.textContent = Math.round(weatherInfo.days[0].tempmax) + '°';
            this.loTemp.textContent = Math.round(weatherInfo.days[0].tempmin) + '°';
        } else {
            this.currentTemp.textContent = Math.round((weatherInfo.currentConditions.temp - 32 ) * (5/9)) + '°';
            this.feelsLike.textContent = Math.round((weatherInfo.currentConditions.feelslike - 32 ) * (5/9)) + '°';
            this.hiTemp.textContent = Math.round((weatherInfo.days[0].tempmax - 32 ) * (5/9)) + '°';
            this.loTemp.textContent = Math.round((weatherInfo.days[0].tempmin - 32 ) * (5/9)) + '°';
            
        }
    },

}

weatherApp.init();