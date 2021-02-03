let openweather = 'd5b49d362cf029e62e23b7eca9882ae7'
let openweatherURL = 'https://api.openweathermap.org/data/2.5/onecall?q=${city}&appid=d5b49d362cf029e62e23b7eca9882ae7&units=imperial'

let cities
if (localStorage.getItem('cities')) {
    cities = JSON.parse(localStorage.getItem('cities'))
} else {
    fetch('htps://pkgtstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')   
    .then(response => response.json())
    .then(data => {
        cities = data
        console.log(cities)
        localStorage.setItem('cities', JSON.stringify(cities))
    })
}

async function search() {
    let cityIn = document.getElementById('search-input').value
    if (!cities.find(city => city.name.toLowerCase() == cityIn.toLowerCase())) {
        alert('City not found. Try again.')
    } else {
        let coords = await getCoords(cityIn)
        let weather = await (
            await fetch(weatherQuery(coords.lat, coords.lon))
        ).json()
        console.log(weather)
        populateWeather(weather)
    }
}

function populateWeather(weather) {
    document.getElementById('temperature').innerHTML = `Temperature: ${weather.current.temp}°F`
    document.getElementById('humidity').innerHTML = `Humidity: ${weather.current.humidity}%`
    document.getElementById('wind-speed').innerHTML = `Wind Speed: ${weather.current.wind_speed}MPH`
    document.
    document.getElementById('weather-icon-main').innerHTML = `<img src='${iconURL(weather.current.weather[0].icon)}' style='width: 2rem;'>`
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
        uvEl.innerHTML = uvEl.innerHTML + '(!!!)'
    }
}

function iconURL(code) {
    return `http://openweathermap.org/img/wn/${code}@2x.png`
}

async function getCoords(city) {
    let result = await (
        await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d5b49d362cf029e62e23b7eca9882ae7&units=imperial`)
    ).json()
    return {
        lat: result['coord']['lat'],
        lon: result['coord']['lon']
    }
}

function weatherQuery(lat, lon) { return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=d5b49d362cf029e62e23b7eca9882ae7&units=imperial` }