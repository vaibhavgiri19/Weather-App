const apiKey = 'db129adcc4591ac164244f3cf31436df'; // Get your API key from OpenWeatherMap

const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const cityInput = document.getElementById('city_input');

searchBtn.addEventListener('click', () => {
    const city = cityInput.value;
    if (city) {
        getWeatherData(city);
    }
});

locationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getWeatherDataByLocation(lat, lon);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
});

function getWeatherData(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => updateWeatherData(data))
        .catch(err => alert('City not found.'));
}

function getWeatherDataByLocation(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => updateWeatherData(data))
        .catch(err => alert('Location not found.'));
}

function updateWeatherData(data) {
    document.getElementById('currentTemp').innerText = `${data.main.temp}°C`;
    document.getElementById('currentDesc').innerText = data.weather[0].description;
    document.getElementById('location').innerText = `${data.name}, ${data.sys.country}`;
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString();
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('pressure').innerText = `${data.main.pressure} hPa`;
    document.getElementById('visibility').innerText = `${data.visibility / 1000} km`;
    document.getElementById('windSpeed').innerText = `${data.wind.speed} m/s`;
    document.getElementById('feelsLike').innerText = `${data.main.feels_like}°C`;

    const iconCode = data.weather[0].icon;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Get sunrise and sunset times
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('sunrise').innerText = sunrise;
    document.getElementById('sunset').innerText = sunset;

    // Call for 5-day forecast
    getForecast(data.coord.lat, data.coord.lon);
}

function getForecast(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => updateForecast(data))
        .catch(err => console.error(err));
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    const forecastDays = data.list.filter((forecast, index) => index % 8 === 0); // 5-day forecast, 3-hour intervals

    forecastDays.forEach(forecast => {
        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric' });
        const forecastTemp = forecast.main.temp;
        const forecastIcon = forecast.weather[0].icon;

        const forecastItem = `
            <div class="forecast-item">
                <p>${forecastDate}</p>
                <img src="http://openweathermap.org/img/wn/${forecastIcon}@2x.png" alt="weather icon">
                <p>${forecastTemp}°C</p>
            </div>
        `;

        forecastContainer.insertAdjacentHTML('beforeend', forecastItem);
    });
}
