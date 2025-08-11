
const weatherApp = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.render();
    },
    

    locationSearch: function() {
        fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchLocation}?unitGroup=us&key=HSAU33NGAHW4EDPY5995Q4MUQ&contentType=json", {
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