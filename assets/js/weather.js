function convertUnix(data, index) {
    const dateObject = new Date(data.daily[index + 1].dt * 1000);
    return (dateObject.toLocaleDateString());
}

function cityCaseClean(city) {
    var cleanedCity = city.toLowerCase().split(" ");
    var cleanedCityName = "";
    for (var i=0; i < cleanedCity.length; i++) {
        cleanedCity[i] = cleanedCity[i][0].toUpperCase() + cleanedCity[i].slice(1);
        cleanedCityName += " " + cleanedCity[i];
    }
    return cleanedCityName;
}

function getWeather(data) {
    for (var i = 0; i < 5; i++) {
        var weatherForecast = {
            date: convertUnix(data, i),
            icon: "http://openweathermap.org/img/wn/" + data.daily[i + 1].weather[0].icon + "@2x.png",
            temperature: data.daily[i + 1].temp.day.toFixed(1),
            wind: data.daily[i + 1].wind_speed.toFixed(1),
            humidity: data.daily[i + 1].humidity
        }

        var currentSelector = "#day-" + i;
        $(currentSelector)[0].textContent = weatherForecast.date;
        currentSelector = "#img-" + i;
        $(currentSelector)[0].src = weatherForecast.icon;
        currentSelector = "#temp-" + i;
        $(currentSelector)[0].textContent = "Temp: " + weatherForecast.temperature + " \u2109";
        currentSelector = "#wind-" + i;
        $(currentSelector)[0].textContent = "Wind: " + weatherForecast.wind+ " MPH";
        currentSelector = "#hum-" + i;
        $(currentSelector)[0].textContent = "Humidity: " + weatherForecast.humidity + "%";
    }
}

function getCurrentWeather(data) {
    $(".forecast-panel").addClass("visible");

    $("#currentIcon")[0].src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    $("#temperature")[0].textContent = "Temp: " + data.current.temp.toFixed(1) + " \u2109";
    $("#wind-speed")[0].textContent = "Wind: " + data.current.wind_speed.toFixed(1) + " MPH";
    $("#humidity")[0].textContent = "Humidity: " + data.current.humidity + "% ";
    
    getWeather(data);

}
function searchCity() {
    var cityName = cityCaseClean($("#cityName")[0].value.trim());
    var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=a53da2335636723c4cc1f08dcc994683";

    fetch(requestURL).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {

                $("#city-name")[0].textContent = cityName + " (" + dayjs().format('M/D/YYYY') + ")";

                $("#city-list").append('<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' + cityName);

                const lat = data.coord.lat;
                const lon = data.coord.lon;

                var latLon = lat.toString() + " " + lon.toString();

                localStorage.setItem(cityName, latLon);

                requestURL = "https://api.openweathermap.org/data/3.0/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=a53da2335636723c4cc1f08dcc994683";

                fetch(requestURL).then(function (newResponse) {
                    if (newResponse.ok) {
                        newResponse.json().then(function (newData) {
                            getCurrentWeather(newData);
                })
            }
        })
    })
}   else {
        alert("Error: cannot find city!");
}
    })
}