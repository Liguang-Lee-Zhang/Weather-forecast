var resultContentEl = document.querySelector('#result-content');
var resultContentEl2 = document.querySelector('#FDayResult');
var searchFormEl = document.querySelector('#search-form');
let searchInput = document.querySelector('#search-input');
let searchHistory = document.querySelector('#search-history');
let historyList = document.querySelector("#historyList");
let apiKey = '0ecbaa56bcc2f6f9e4add22ec1d79c2c';
let today = dayjs();
let resultObJ;
let Obj;
let his = [];

console.log(typeof his);



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

  titleEl.textContent = resultObj.name + " " + today.format('M/DD/YYYY') + " ";

  let imgEl = document.createElement('img');
  console.log(typeof resultObj.weather[0]);
  let weatherIcon = resultObj.weather[0].icon;
  // let weatherIcon = weather.icon;
  console.log(weatherIcon);
  imgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");



  var bodyContentEl = document.createElement('p');
  bodyContentEl.innerHTML =
    'Temp: ' + resultObj.main.temp + " °F<br/>"
    + 'Wind: ' + resultObj.wind.speed + " MPH <br />"
    + "Humidity: " + resultObj.main.humidity + " %";

  resultBody.append(titleEl);
  resultBody.append(imgEl);
  resultBody.append(bodyContentEl);
  resultContentEl.append(resultCard);
  console.log("appended current weather!");
  console.log(resultContentEl.innerHTML);
}

// function searchHistory(){







// }


function searchGeoApi(query) {
  let geocodingUrl = 'https://api.openweathermap.org/geo/1.0/direct';
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
      fiveDayUrl = fiveDayUrl + "?lat=" + Response[0].lat + "&lon=" + Response[0].lon + "&appid=" + apiKey + "&units=imperial";
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
        printCurResults(locRes);
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
        resultContentEl2.innerHTML = '<h3>No results found, search again!</h3>';
      } else {
        resultContentEl2.textContent = '';
        printFDayResults(FDayRes);
      }
    })
    .catch(function (error) {
      console.error(error);
    });
}

function printFDayResults(FDayresultObj) {
  console.log(FDayresultObj);
  Obj = FDayresultObj;

  for (let i = 0; i < FDayresultObj.list.length; i += 8) {

    // set up `<div>` to hold result content
    var resultCard = document.createElement('div');
    resultCard.classList.add('card', 'bg-light', 'text-dark', 'mb-3', 'p-3');

    var resultBody = document.createElement('div');
    resultBody.classList.add('card-body');
    resultCard.append(resultBody);

    var titleEl = document.createElement('h3');

    titleEl.textContent = FDayresultObj.city.name + " " + FDayresultObj.list[i].dt_txt + " ";

    // // Obj.list[3].weather[0].icon
    let imgEl = document.createElement('img');
    let weatherIcon = FDayresultObj.list[i].weather[0].icon;
    // console.log(weatherIcon);
    imgEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIcon + ".png");


    var bodyContentEl = document.createElement('p');
    let listIndex = (i + 1) * 9;
    bodyContentEl.innerHTML =
      'Temp: ' + FDayresultObj.list[i].main.temp + " °F<br/>"
      + 'Wind: ' + FDayresultObj.list[i].wind.speed + " MPH <br />"
      + "Humidity: " + FDayresultObj.list[i].main.humidity + " %";

    resultBody.append(titleEl);
    resultBody.append(imgEl);
    resultBody.append(bodyContentEl);
    resultContentEl2.append(resultCard);
    console.log("appended 5 day weather!");
    console.log(resultContentEl.innerHTML);

  }

}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var searchInputVal = searchInput.value.trim();

  if (!searchInputVal) {
    console.error('You need a search input value!');
    return;
  } else {
    storeHistory();
    searchGeoApi(searchInputVal);
    
  }

}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

historyList.addEventListener('click',function(){
  console.log(this);
  searchGeoApi(event.target.textContent);
});

function renderHistory() {

  historyList.innerHTML = "";
  for (let i = 0; i < his.length; i++) {
    let li = document.createElement("button");
    li.textContent = his[i];
    historyList.append(li);
  }

}

function storeHistory() {
  let input = searchInput.value.trim();
  let value = [input];
  console.log(his);
  console.log(typeof his);
  console.log(value);
  console.log(typeof value);
  his.push(value);
  localStorage.setItem("searchHistory",JSON.stringify(his));
  renderHistory();

}

function init() {

  let storedHistory = JSON.parse(localStorage.getItem("searchHistory"));

  if (storedHistory !== null) {
    his = storedHistory;
  }

  renderHistory();
}

init();