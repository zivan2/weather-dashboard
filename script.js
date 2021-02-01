let apiKey = 'd5b49d362cf029e62e23b7eca9882ae7'
let cities
fetch('https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')   
    .then(response => response.json())
    .then(data => cities = data)
console.log(cities)

function search() {
    let cityIn = document.getElementById('search-input').value
    if (!cities.find(city => city.name.toLowerCase() == cityIn.toLowerCase())) {
        alert('City not found. Try again.')
    } else {
        fetch(cityQuery(cityIn)).then(function(response) {
            if (response.ok) {
                return response.json()
            } else {
                console.log(response)
            }
        }).then(data => {
            populateWeather(data)
        })
    }
}

function populateWeather() {
    document.getElementById('temperature').innerHTML = `Temperature: ${weather.current.temp}°F`
    document.getElementById('humidity').innerHTML = `Humidity: ${weather.current.humidity}%`
    document.getElementById('wind-speed').innerHTML = `Wind Speed: ${weather.current.wind_speed}MPH`
    let uvi = weather.current.uvi
    let uvEl = document.getElementById('uv')
    uvEl.innerHTML = uvi
    if (uvi < 8) {
        if (uvi < 6) {
            if (uvi < 3) {
                // low
                uvEl.className = 'bg-primary'
            } else {
                // moderate
                uvEl.className = 'bg-warning'
            }
        } else {
            // high
            uvEl.className = 'bg-danger'
        }
    } else {
        // very high
        uvEl.className = 'bg-danger'
        uvEl.innerHTML = uvEl.innerHTML + '(!)'
    }
}

function cityQuery(city) { return `https://api.openweathermap.org/data/2.5/onecall?q=${city}&appid=d5b49d362cf029e62e23b7eca9882ae7&units=imperial` }