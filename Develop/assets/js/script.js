var resultTextEl = document.querySelector('#result-text');
var resultContentEl = document.querySelector('#result-content');
var searchFormEl = document.querySelector('#search-form');
let apiKey = '0ecbaa56bcc2f6f9e4add22ec1d79c2c';
let today = dayjs();



function printResults(resultObj) {
  console.log(resultObj);

  // set up `<div>` to hold result content
  var resultCard = document.createElement('div');
  resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

  var resultBody = document.createElement('div');
  resultBody.classList.add('card-body');
  resultCard.append(resultBody);

  var titleEl = document.createElement('h3');
  titleEl.textContent = resultObj.name + today.format('M/DD/YYYY')+ " "+resultObj.weather.main; 

  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    'Temp: ' + resultObj.temp + "°F'<br/>"
    + 'Wind: ' + resultObj.wind.speed + "MPH <br />"
    + "Humidity: " + resultObj.main.humidity +" %";

  resultContentEl.append(resultCard);
}

function searchApi(query) {
  let geocodingUrl = 'http://api.openweathermap.org/geo/1.0/direct';
  let locQueryUrl = "https://api.openweathermap.org/data/2.5/weather";

  geocodingUrl = geocodingUrl + '?q=' + query + '&appid=' + apiKey;

  fetch(geocodingUrl)
    .then(function(geocodeResponse){
        if (!geocodeResponse.ok) {
            throw geocodeResponse.json();
          } else {
            return geocodeResponse.json();
          }
     })
     .then(function(geocodeResponse){
     
        console.log(geocodeResponse.result);
        locQueryUrl = locQueryUrl + "?lat=" + location.coord[1] + "&lon=" +location.coord[2]+"&appid="+apiKey+"&units=imperial";
        console.log(locQueryUrl);
     })
         
   

    
  fetch(locQueryUrl)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })
    .then(function (locRes) {

      console.log(locRes);

      if (!locRes.length) {
        console.log('No results found!');
        resultContentEl.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl.textContent = '';
        for (var i = 0; i < 1; i++) {
          printResults(locRes);
        }
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = document.querySelector('#search-input').value;

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  }

  searchApi(searchInputVal);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
