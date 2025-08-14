const weatherApp = {
    units: 'F',
    lastLocation: null,

    init: function () {
        this.cacheDom();
        this.bindEvents();
    },

    cacheDom: function () {
        this.mainGrid = document.querySelector('.main-grid');
        this.emptyState = document.querySelector('.empty-state');

        this.currentTemp = document.querySelector('.temp-amount');
        this.hiTemp = document.querySelector('.hi-amount');
        this.loTemp = document.querySelector('.low-amount');
        this.currentLocation = document.querySelector('.location');
        this.feelsLike = document.querySelector('.feels-like-amount');
        this.humidity = document.querySelector('.humidity-amount');
        this.precipitation = document.querySelector('.precipitation-amount');
        this.windSpeed = document.querySelector('.wind-speed-amount');
        this.uvIndex = document.querySelector('.uv-index-amount');

        this.weatherIcon = document.querySelector('.weather-icon');
        this.form = document.getElementById('search-location-form');
        this.input = this.form.querySelector('input[name="search-location"]');

        this.toggleUnits = document.querySelector('.toggle-units');
        this.fahrenheit = document.querySelector('.F-units');
        this.celsius = document.querySelector('.C-units');

        this.conditionsDisplay = document.querySelector('.conditions');

        this.nextDays = document.querySelector('.next-3-days');
        this.dayOne = document.querySelector('.day-1');
        this.dayTwo = document.querySelector('.day-2');
        this.dayThree = document.querySelector('.day-3');

        this.dayOneTemp = this.dayOne.querySelector('.temp');
        this.dayTwoTemp = this.dayTwo.querySelector('.temp');
        this.dayThreeTemp = this.dayThree.querySelector('.temp');
        this.dayOneIcon = this.dayOne.querySelector('img');
        this.dayTwoIcon = this.dayTwo.querySelector('img');
        this.dayThreeIcon = this.dayThree.querySelector('img');
        this.dayOneDate = this.dayOne.querySelector('.date');
        this.dayTwoDate = this.dayTwo.querySelector('.date');
        this.dayThreeDate = this.dayThree.querySelector('.date');
    },

    bindEvents: function () {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const value = this.input.value.trim();
            if (value) {
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

    locationSearch: async function (location) {
        try {
            location = encodeURIComponent(location);
            const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=HSAU33NGAHW4EDPY5995Q4MUQ&contentType=json`;
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) {
                throw new Error(`Error: status ${response.status}`);
            }
            const weatherInfo = await response.json();
            this.lastLocation = weatherInfo;
            this.firstSearch();
            this.render(this.lastLocation);
        } catch (err) {
            console.error('Fetch failed:', err);
        }
    },

    render: function (weatherInfo) {
        console.log('Full API response:', weatherInfo);

        this.currentLocation.textContent = weatherInfo.resolvedAddress;
        this.conditionsDisplay.textContent =
            weatherInfo.currentConditions.conditions;
        this.humidity.textContent = this.formatValue(
            weatherInfo.currentConditions.humidity,
            '%'
        );
        this.precipitation.textContent = this.formatValue(
            weatherInfo.currentConditions.precip,
            '%'
        );
        this.uvIndex.textContent = this.formatValue(
            weatherInfo.currentConditions.uvindex
        );

        this.renderNextDates(weatherInfo);

        if (this.units === 'F') {
            this.renderFahrenheit(weatherInfo);
        } else {
            this.renderCelsius(weatherInfo);
        }
        this.chooseImg(weatherInfo);
    },

    renderNextDates: function (weatherInfo) {
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
            });
        };

        if (weatherInfo.days.length > 1) {
            this.dayOneDate.textContent = formatDate(
                weatherInfo.days[1].datetime
            );
        }
        if (weatherInfo.days.length > 2) {
            this.dayTwoDate.textContent = formatDate(
                weatherInfo.days[2].datetime
            );
        }
        if (weatherInfo.days.length > 3) {
            this.dayThreeDate.textContent = formatDate(
                weatherInfo.days[3].datetime
            );
        }
    },

    renderCelsius: function (weatherInfo) {
        this.currentTemp.textContent = this.formatValue(
            Math.round((weatherInfo.currentConditions.temp - 32) * (5 / 9)),
            '°'
        );
        this.feelsLike.textContent = this.formatValue(
            Math.round(
                (weatherInfo.currentConditions.feelslike - 32) * (5 / 9)
            ),
            '°'
        );
        this.hiTemp.textContent = this.formatValue(
            Math.round((weatherInfo.days[0].tempmax - 32) * (5 / 9)),
            '°'
        );
        this.loTemp.textContent = this.formatValue(
            Math.round((weatherInfo.days[0].tempmin - 32) * (5 / 9)),
            '°'
        );
        this.windSpeed.textContent = this.formatValue(
            Math.round(weatherInfo.currentConditions.windspeed * 1.6),
            'km/h'
        );

        if (weatherInfo.days.length > 1) {
            this.dayOneTemp.textContent = this.formatValue(
                Math.round((weatherInfo.days[1].temp - 32) * (5 / 9)),
                '°'
            );
        }
        if (weatherInfo.days.length > 2) {
            this.dayTwoTemp.textContent = this.formatValue(
                Math.round((weatherInfo.days[2].temp - 32) * (5 / 9)),
                '°'
            );
        }
        if (weatherInfo.days.length > 3) {
            this.dayThreeTemp.textContent = this.formatValue(
                Math.round((weatherInfo.days[3].temp - 32) * (5 / 9)),
                '°'
            );
        }
    },

    renderFahrenheit: function (weatherInfo) {
        this.currentTemp.textContent = this.formatValue(
            Math.round(weatherInfo.currentConditions.temp),
            '°'
        );
        this.feelsLike.textContent = this.formatValue(
            Math.round(weatherInfo.currentConditions.feelslike),
            '°'
        );
        this.hiTemp.textContent = this.formatValue(
            Math.round(weatherInfo.days[0].tempmax),
            '°'
        );
        this.loTemp.textContent = this.formatValue(
            Math.round(weatherInfo.days[0].tempmin),
            '°'
        );
        this.windSpeed.textContent = this.formatValue(
            Math.round(weatherInfo.currentConditions.windspeed),
            'mph'
        );

        if (weatherInfo.days.length > 1) {
            this.dayOneTemp.textContent = this.formatValue(
                Math.round(weatherInfo.days[1].temp),
                '°'
            );
        }
        if (weatherInfo.days.length > 2) {
            this.dayTwoTemp.textContent = this.formatValue(
                Math.round(weatherInfo.days[2].temp),
                '°'
            );
        }
        if (weatherInfo.days.length > 3) {
            this.dayThreeTemp.textContent = this.formatValue(
                Math.round(weatherInfo.days[3].temp),
                '°'
            );
        }
    },

    formatValue: function (value, unit = '') {
        if (value != null && !isNaN(value)) {
            return value + unit;
        } else {
            return 'N/A';
        }
    },

    firstSearch: function () {
        this.mainGrid.style.display = 'grid';
        this.emptyState.style.display = 'none';
    },

    chooseImg: function (conditions) {
        const weatherIconURL = conditions.currentConditions.icon;
        this.weatherIcon.src = './icons/' + weatherIconURL + '.png';

        if (conditions.days.length > 1) {
            const weatherIconDayOne = conditions.days[1].icon;
            this.dayOneIcon.src = './icons/' + weatherIconDayOne + '.png';
        }
        if (conditions.days.length > 2) {
            const weatherIconDayTwo = conditions.days[2].icon;
            this.dayTwoIcon.src = './icons/' + weatherIconDayTwo + '.png';
        }
        if (conditions.days.length > 3) {
            const weatherIconDayThree = conditions.days[3].icon;
            this.dayThreeIcon.src = './icons/' + weatherIconDayThree + '.png';
        }
    },
};

weatherApp.init();
