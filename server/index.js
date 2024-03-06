// server/index.js
const path = require("path");
const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));

//API endpoint to get weather data for a given zip code
app.get("/api/weather/:id", (req, res) => {
  //Get the zip code from the URL
  const zip = req.params.id;

  //Get the lat and long coordinates
  getLocationByZip(zip, (locationData) => {
    locationData = JSON.parse(locationData);
    if (!locationData.hasOwnProperty('zip')) {
      //Something wrong, show an error
      console.log(locationData);
      res.json({ message: "Something went wrong, please that you have entered a valid zip code and try again." });
    } else {
      //Get the weather data
      getWeatherForLatLong(locationData.lat, locationData.lon, (weatherData) => {
        weatherData = JSON.parse(weatherData);
        if (!weatherData.hasOwnProperty('current')) {
          //No current weather data returned, return an error
          console.log(weatherData);
          res.json({ message: "Something went wrong fetching the weather data." });
        } else {
          //TODO: log this as a previous search

          //Should be good, return the current weather data
          let weatherString = '';
          weatherString += "Current Temperature in " + locationData.name + ": " + Math.round(weatherData.current.temp) + " °F (feels like " + Math.round(weatherData.current.feels_like) + " °F)";
          res.json({ message: weatherString });
        }
      });
    }
  });
});

//Function to get location data by zip code
function getLocationByZip(zip, callback) {
  let data = '';

  //Setup the request
  const appId = 'fdbb5b4acef2714cad95aef932cc8eca'; //API Key
  const options = {
    hostname: 'api.openweathermap.org',
    path: '/geo/1.0/zip?zip=' + zip + ',US&appid=' + appId,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Make the request
  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      callback(data);
    });
  });
  request.on('error', (error) => {
    console.log(error);
    callback({'error': error});
  });
  request.end();
};

//Gets weather data for latitude and longitude coordinates
function getWeatherForLatLong(lat, lon, callback) {
  let data = '';

  //Setup the request
  const appId = 'fdbb5b4acef2714cad95aef932cc8eca'; //API Key
  const options = {
    hostname: 'api.openweathermap.org',
    path: '/data/3.0/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + appId + '&exclude=minutely,hourly,daily,alerts&units=imperial',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  //Make the request
  const request = http.request(options, (response) => {
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      callback(data);
    });
  });
  request.on('error', (error) => {
    console.log(error);
    callback({'error': error});
  });
  request.end();
}

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});