var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
let apiKey = '0ecbaa56bcc2f6f9e4add22ec1d79c2c';
let today = dayjs();
let resultObJ;


function printCurResults(resultObj) {
  console.log(resultObj);
  resultObJ = resultObj;
  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');

  titleEl.textContent = resultObj.name + " "+ today.format('M/DD/YYYY') + " ";
  
  // let imgEl = document.createElement('img');
  // console.log(typeof resultObj.weather[0]);
  // let weather = resultObj.weather[0].tostring();
  // let weatherIcon = weather.split(',').pop();
  // console.log(weatherIcon);
  // imgEl.setAttribute("src", "http://openweathermap.org/img/wn/"+weatherIcon +".png");



  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    'Temp: ' + resultObj.main.temp + " °F<br/>"
    + 'Wind: ' + resultObj.wind.speed + " MPH <br />"
    + "Humidity: " + resultObj.main.humidity + " %";

  resultBody.append(titleEl);
  // resultBody.append(imgEl);
  resultBody.append(bodyContentEl);
  resultContentEl.append(resultCard);
}

function searchGeoApi(query) {
  let geocodingUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  let locQueryUrl = "https://api.openweathermap.org/data/2.5/weather";
  let fiveDayUrl = "https://api.openweathermap.org/data/2.5/forecast";

  geocodingUrl = geocodingUrl + '?q=' + query + '&appid=' + apiKey;

  fetch(geocodingUrl)
    .then(function (geocodeResponse) {
      if (!geocodeResponse.ok) {
        throw geocodeResponse.json();
      } else {
        return geocodeResponse.json();
      }
    })
    .then(function (Response) {

      locQueryUrl = locQueryUrl + "?lat=" + Response[0].lat + "&lon=" + Response[0].lon + "&appid=" + apiKey + "&units=imperial";
      fiveDayUrl = fiveDayUrl +"?lat=" + Response[0].lat + "&lon=" + Response[0].lon + "&appid=" + apiKey + "&units=imperial";
      console.log(locQueryUrl);
      console.log(fiveDayUrl);
      searchCurWApi(locQueryUrl);
      searchFDayApi(fiveDayUrl);
    })
}

function searchCurWApi(locQueryUrl) {

  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {
      
      if (!Object.keys(locRes).length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < 1; i++) {
          printCurResults(locRes);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function searchFDayApi(fiveDayUrl) {

  fetch(fiveDayUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (FDayRes) {
      
      if (!Object.keys(FDayRes).length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < 6; i++) {
          printFDayResults(FDayRes);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}


function printFDayResults(FDayresultObj) {
  console.log(FDayresultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');

  titleEl.textContent = FDayresultObj.city.name + " "+ FDayresultObj.list.dt_txt + " ";
  
  // let imgEl = document.createElement('img');
  // console.log(typeof resultObj.weather[0]);
  // let weather = resultObj.weather[0].tostring();
  // let weatherIcon = weather.split(',').pop();
  // console.log(weatherIcon);
  // imgEl.setAttribute("src", "http://openweathermap.org/img/wn/"+weatherIcon +".png");



  var bodyContentEl = document.createElement('p');
  let listIndex = (i+1)*9;
  bodyContentEl.innerHTML =
    'Temp: ' + FDayresultObj.list[listIndex] + " °F<br/>"
    + 'Wind: ' + FDayresultObj.wind.speed + " MPH <br />"
    + "Humidity: " + FDayresultObj.main.humidity + " %";

  resultBody.append(titleEl);
  // resultBody.append(imgEl);
  resultBody.append(bodyContentEl);
  resultContentEl.append(resultCard);
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchGeoApi(searchInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
