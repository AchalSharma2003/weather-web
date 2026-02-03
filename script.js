// API Key - Replace with your OpenWeatherMap API key
const API_KEY = '96d857dad3872479c28db0e74bfab126';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const inputSection = document.getElementById('input-section');
const weatherSection = document.getElementById('weather-section');
const form = document.getElementById('weather-form');
const errorMessage = document.getElementById('error-message');
const weatherError = document.getElementById('weather-error');
const backBtn = document.getElementById('back-btn');
const weatherIcon = document.getElementById('weather-icon'); // New: For displaying icon

// Form Submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const city = document.getElementById('city').value.trim();
    const country = document.getElementById('country').value.trim();
    const unit = document.querySelector('input[name="unit"]:checked').value;
    
    // Validation
    if (!city || !country) {
        showError('Please enter both city and country.', errorMessage);
        return;
    }
    
    // Clear previous errors
    hideError(errorMessage);
    hideError(weatherError);
    
    // Fetch weather data
    try {
        const data = await fetchWeather(city, country, unit);
        displayWeather(data, unit);
        toggleSections();
    } catch (error) {
        showError(error.message, weatherError);
        toggleSections();
    }
});

// Back Button
backBtn.addEventListener('click', () => {
    toggleSections();
    form.reset();
    hideError(errorMessage);
    hideError(weatherError);
    weatherIcon.style.display = 'none'; // Hide icon on back
});

// Fetch Weather Data
async function fetchWeather(city, country, unit) {
    const response = await fetch(`${API_URL}?q=${city},${country}&appid=${API_KEY}&units=${unit}`);
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('City or country not found. Please check your input.');
        } else {
            throw new Error('Unable to fetch weather data. Please try again later.');
        }
    }
    return await response.json();
}

// Display Weather Data
function displayWeather(data, unit) {
    const unitSymbol = unit === 'metric' ? '°C' : '°F';
    const windUnit = unit === 'metric' ? 'm/s' : 'mph';
    
    document.getElementById('city-display').textContent = data.name;
    document.getElementById('country-display').textContent = data.sys.country;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}${unitSymbol}`;
    document.getElementById('condition').textContent = data.weather[0].description;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} ${windUnit}`;
    document.getElementById('feels-like').textContent = `${Math.round(data.main.feels_like)}${unitSymbol}`;
    
    // New: Display weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.style.display = 'block';
    weatherIcon.alt = data.weather[0].description;
}

// Toggle Sections
function toggleSections() {
    inputSection.classList.toggle('active');
    weatherSection.classList.toggle('active');
}

// Error Handling
function showError(message, element) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.style.display = 'none';
}