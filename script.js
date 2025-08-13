
const weatherApp = {

    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.render();
    },
    
    cacheDom: function() {
        this.currentTemp = document.querySelector('.temp-amount');
        this.hiTemp = document.querySelector('.hi-amount');
        this.loTemp = document.querySelector('.low-temp');
        this.currentLocation = document.querySelector('.location');
        this.currentCity = document.querySelector('.city');
        this.currentState = document.querySelector('.state');
        this.feelsLike = document.querySelector('.feels-like-amount');
        this.humidity = document.querySelector('.humidity-amount');
        this.precipitation = document.querySelector('.precipitation-amount');
        this.windSpeed = document.querySelector('.wind-speed-amount');
        this.uvIndex= document.querySelector('.uv-index-amount');
        this.searchBar = document.querySelector('search-location');
        
        this.form = document.getElementById('search-location-form');
        this.input = this.form.querySelector('input[name="search-location"]');
    },

    bindEvents: function() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const value = this.input.value.trim();
            if (value){
                this.locationSearch(value);
            } 
        });
    },

    locationSearch: function(location) {
        location = encodeURIComponent(location);
        const url = "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/" + location + "unitGroup=us&key=HSAU33NGAHW4EDPY5995Q4MUQ&contentType=json"
        fetch(url, {
        "method": "GET",
        "headers": {
        }})
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.error(err);
        });
    },
}

weatherApp.init();