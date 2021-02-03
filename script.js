let openweather = 'd5b49d362cf029e62e23b7eca9882ae7'
let openweatherURL = 'https://api.openweathermap.org/data/2.5/onecall?q=${city}&appid=d5b49d362cf029e62e23b7eca9882ae7&units=imperial'

let cities
let citiesOpenweather
// if (localStorage.getItem('cities')) {
//     cities = JSON.parse(localStorage.getItem('cities'))
// } else {
//     fetch('htps://pkgtstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json')   
//     .then(response => response.json())
//     .then(data => {
//         cities = data
//         console.log(cities)
//         localStorage.setItem('cities', JSON.stringify(cities))
//     })
// }

if (localStorage.getItem('cities')) {
    cities = JSON.parse(localStorage.getItem('cities'))
} else {
    fetch(`${document.URL.substr(0,document.URL.lastIndexOf('/'))}/city_list.json`).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            lg(response)
        }
    }).then(data => cities = data)
    .catch(err => lg(err))
}

async function search() {
    eid('search-history').innerHTML = ''
    let cityIn = eid('search-input').value
    let matches = cities.filter(city => city.name.toLowerCase() == cityIn.toLowerCase())
    if (!matches[0]) {
        appendSearchResult(null, null, null, 'No cities found.')
    } else {
        for (let i in matches) {
            appendSearchResult(matches[i].name, matches[i].subcountry, matches[i].country)
        }
    }
}

async function populateWeather(cityName) {
    eid('loading').style.display = 'block'
    eid('weather-display').style.display = 'none'

    let coords = await getCoords(cityName)
    let weather = await (
        await fetch(weatherQuery(coords.lat, coords.lon))
    ).json()
    lg(weather)

    eid('temperature').innerHTML = `Temperature: ${weather.current.temp}°F`
    eid('humidity').innerHTML = `Humidity: ${weather.current.humidity}%`
    eid('wind-speed').innerHTML = `Wind Speed: ${weather.current.wind_speed}MPH`
    eid('city-name').innerHTML = cityName
    eid('weather-icon-main').innerHTML = `<img src='${iconURL(weather.current.weather[0].icon)}' style='width: 3rem; mix-blend-mode: difference;'>`
    let uvi = weather.current.uvi
    let uvEl = eid('uv')
    eid('uv-text').innerHTML = uvi
    if (uvi < 8) {
        if (uvi < 6) {
            if (uvi < 3) {
                if (uvi == 0) {
                    uvEl.className = 'bg-white'
                    eid('uv-text').innerHTML = '<span style="color: black;">No UV data exists for this area.</span>'
                } else {
                    // low
                    uvEl.className = 'bg-primary'
                }
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
        eid('uv-text').innerHTML = eid('uv-text').innerHTML + '(!!!)'
    }

    eid('loading').style.display = 'none'
    eid('weather-display').style.display = 'block'
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

function appendSearchResult(cityName, citySubCountry, cityCountry, message=null) {
    let shist = eid('search-history')
    if (message) {
        shist.innerHTML = message
        return
    }
    shist.innerHTML = shist.innerHTML + `<li class="list-group-item list-group-item-action" onclick="populateWeather('${cityName}')">${cityName}, ${citySubCountry}, ${cityCountry}</li>`
}

function txt(text) { return document.createTextNode(text) }

function eid(id) { return document.getElementById(id) } // this is way too long

function normal(str) { return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") }

function lg(item) { console.log(item) }