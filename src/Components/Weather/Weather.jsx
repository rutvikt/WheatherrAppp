import React, { useState, useEffect } from 'react';
import './Weather.scss';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState('London');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherIcon = (weatherCondition) => {
    switch (weatherCondition.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'smoke':
      case 'haze':
      case 'fog':
      case 'sand':
      case 'dust':
        return '🌫️';
      default:
        return '🌈';
    }
  };

  const search = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      
      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temp: Math.floor(data.main.temp),
        feelsLike: Math.floor(data.main.feels_like),
        location: data.name,
        country: data.sys.country,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000, // convert to km
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      });
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      search(city);
    }
  };

  useEffect(() => {
    search(city);
  }, []);

  return (
    <div className="weather-app">
      <div className="weather-container">
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search for a city..."
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {loading && <div className="loading">Loading...</div>}

        {error && <div className="error-message">{error}</div>}

        {weatherData && !loading && !error && (
          <div className="weather-card">
            <div className="weather-header">
              <h2 className="location">
                {weatherData.location}, {weatherData.country}
              </h2>
              <p className="weather-condition">
                {weatherData.description}
              </p>
            </div>

            <div className="weather-main">
              <div className="temperature-section">
                <div className="weather-icon">
                  {getWeatherIcon(weatherData.condition)}
                </div>
                <div className="temperature">
                  {weatherData.temp}°C
                </div>
              </div>
              <div className="feels-like">
                Feels like: {weatherData.feelsLike}°C
              </div>
            </div>

            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-label">Humidity:</span>
                <span className="detail-value">{weatherData.humidity}%</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Wind:</span>
                <span className="detail-value">{weatherData.windSpeed} m/s</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Pressure:</span>
                <span className="detail-value">{weatherData.pressure} hPa</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Visibility:</span>
                <span className="detail-value">{weatherData.visibility} km</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sunrise:</span>
                <span className="detail-value">{weatherData.sunrise}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sunset:</span>
                <span className="detail-value">{weatherData.sunset}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Weather;