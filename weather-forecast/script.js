const container = document.querySelector('.container');
const searchButton = document.getElementById('search-button');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');

searchButton.addEventListener('click', () => {
    const city = document.getElementById('search-btn').value.trim();

    if (!city) {
        alert('Please enter a city name.');
        return;
    }
    fetch(`https://www.metaweather.com/api/location/search/?query=${city}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Location not found');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                throw new Error('Location not found');
            }
            const locationId = data[0].woeid;
            return fetch(`https://www.metaweather.com/api/location/${locationId}/`);
        })
        .then(response => response.json())
        .then(json => {
            container.style.height = '560px';
            weatherBox.classList.add('active');
            weatherDetails.classList.add('active');
            error404.classList.remove('active');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            const weatherData = json.consolidated_weather[0];
            switch (weatherData.weather_state_abbr) {
                case 'sn':
                    image.src = 'images/snow-new.png';
                    break;
                case 'sl':
                case 'h':
                case 't':
                case 'hr':
                case 'lr':
                    image.src = 'images/rain-new.png';
                    break;
                case 'c':
                    image.src = 'images/clear-new.png';
                    break;
                case 'hc':
                    image.src = 'images/cloud-new.png';
                    break;
                default:
                    image.src = 'images/clear-new.png';
            }
            temperature.innerHTML = `${Math.round(weatherData.the_temp)}<span>°C</span>`;
            description.innerHTML = weatherData.weather_state_name;
            humidity.innerHTML = `${weatherData.humidity}%`;
            wind.innerHTML = `${Math.round(weatherData.wind_speed)} Km/h`;
        })
        .catch(error => {
            container.style.height = '450px';
            weatherBox.classList.remove('active');
            weatherDetails.classList.remove('active');
            error404.classList.add('active');
        });
});
