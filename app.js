document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "I7M1X159GSRLybBzQjeqz3ooCIGkIdaa"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");
    const hourlyDiv = document.getElementById("hourly");
    const dailyDiv = document.getElementById("daily");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchHourlyForecast(locationKey); // Call fetchHourlyForecast here
                    fetchDailyForecast(locationKey); // Call fetchDailyForecast here
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                    hourlyDiv.innerHTML = ''; // Clear hourly forecast div if city is not found
                    dailyDiv.innerHTML = ''; // Clear daily forecast div if city is not found
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
                hourlyDiv.innerHTML = ''; // Clear hourly forecast div on error
                dailyDiv.innerHTML = ''; // Clear daily forecast div on error
            });
    }

    function fetchWeatherData(locationKey) {
        const weatherUrl = `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}&details=true`;

        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyUrl = `https://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}&details=true&metric=true`;

        fetch(hourlyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    hourlyDiv.innerHTML = `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                hourlyDiv.innerHTML = `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}&details=true&metric=true`;

        fetch(dailyUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    dailyDiv.innerHTML = `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                dailyDiv.innerHTML = `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayHourlyForecast(data) {
        let forecastContent = `<h2>Hourly Forecast</h2>`;
        if (data && data.length > 0) {
            data.forEach(hourlyData => {
                const forecastTime = new Date(hourlyData.DateTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                const temperature = hourlyData.Temperature.Value;
                const weather = hourlyData.IconPhrase;
                forecastContent += `
                    <div>
                        <p>Time: ${forecastTime}</p>
                        <p>Temperature: ${temperature}°C</p>
                        <p>Weather: ${weather}</p>
                    </div>
                `;
            });
        } else {
            forecastContent += `<p>No hourly forecast data available.</p>`;
        }
        hourlyDiv.innerHTML = forecastContent;
    }

    function displayDailyForecast(data) {
        let forecastContent = `<h2>5-Day Forecast</h2>`;
        if (data && data.length > 0) {
            data.forEach(dailyData => {
                const date = new Date(dailyData.Date);
                const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
                const temperatureMin = dailyData.Temperature.Minimum.Value;
                const temperatureMax = dailyData.Temperature.Maximum.Value;
                const weather = dailyData.Day.IconPhrase;

                forecastContent += `
                    <div>
                        <p>Date: ${dayOfWeek}</p>
                        <p>Min Temperature: ${temperatureMin}°C</p>
                        <p>Max Temperature: ${temperatureMax}°C</p>
                        <p>Weather: ${weather}</p>
                    </div>
                `;
            });
        } else {
            forecastContent += `<p>No daily forecast data available.</p>`;
        }
        dailyDiv.innerHTML = forecastContent;
    }
});
