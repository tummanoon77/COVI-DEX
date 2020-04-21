// global variables
var allSearch = [];

var MyDate = new Date();
var displayTodayDate = (MyDate.getMonth() + 1) + "/" + MyDate.getDate() + "/" + MyDate.getFullYear();

var yesterday;
MyDate.setDate(MyDate.getDate() - 1);
yesterday = MyDate.getFullYear() + ('0' + (MyDate.getMonth() + 1)).slice(-2) + ('0' + MyDate.getDate()).slice(-2);
var displayYesterdayDate = (MyDate.getMonth() + 1) + "/" + MyDate.getDate() + "/" + MyDate.getFullYear();

// function to create button
function renderButtons() {
  $("#buttonsHere").html("");
  for (i = 0; i < allSearch.length; i++) {
    var btn = $("<button>");
    btn.text(allSearch[i]);
    $("#buttonsHere").append(btn);
    btn.attr("class", "stateAsButton");
  }
};

// This on click will render out buttons from user input

$("#find-state").on("click", function (event) {
  event.preventDefault();
  // var search = $("#state-input").val();
  // allSearch.push(search)
  var searchedState = getStateName();
  var capitalizedSearchedState = searchedState;
  searchedState = searchedState.toLowerCase();

  var abbrSearchedState = getStateTwoDigitCode(searchedState);
  if (!abbrSearchedState) {
    $("#error").text("Please enter a valid state name.");
    resetSearchBar();
  } else {
    $.ajax({
      url: "https://covidtracking.com/api/states/daily?state=" + abbrSearchedState + "&date=" + yesterday,
      method: "GET"
    }).then(function (response) {
      var statePositive = response.positive;
      var stateRecovered = response.recovered;
      var stateDeath = response.death;
      renderStates(statePositive, stateRecovered, stateDeath);
    });

    $("#state-name").text(": " + capitalizedSearchedState);
    renderButtons();
    storeSearch();
    resetSearchBar();
    $("#error").text("");
  }
});

function resetSearchBar() {
  $("#state-input").val("");
}

// function to store users' input into Array
function getStateName() {
  var search = $("#state-input").val();
  search = search.toLowerCase();
  var abbrSearchedState = getStateTwoDigitCode(search);
  if(abbrSearchedState){
  search = search.toUpperCase();
  allSearch.push(search);
  return search;
  } else{
    return search;
  }
};

// acutaly click on the arleady existing state as a button
// function to classify each button being clicked
$("#buttonsHere").on("click", "button", function () {
  var buttonState = $(this).text();
  $("#state-name").text(": " + buttonState);
  buttonState = buttonState.toLowerCase();
  var abbrButtonState = getStateTwoDigitCode(buttonState);

  $.ajax({
    url: "https://covidtracking.com/api/states/daily?state=" + abbrButtonState + "&date=" + yesterday,
    method: "GET"
  }).then(function (response) {
    var statePositive = response.positive;
    var stateRecovered = response.recovered;
    var stateDeath = response.death;
    renderStates(statePositive, stateRecovered, stateDeath);
  });

  renderButtons();
  storeSearch();
  resetSearchBar();

})

// function to localStorage users' search
function storeSearch() {
  localStorage.setItem("states", JSON.stringify(allSearch));
}

// function to get localStorage item

function getSearch() {
  var storedSearch = JSON.parse(localStorage.getItem("states"));
  if (storedSearch !== null) {
    allSearch = storedSearch;
  }
  renderButtons();
}

getSearch();

function getStateTwoDigitCode(stateFullName) {

  stateList = {
    'arizona': 'AZ',
    'alabama': 'AL',
    'alaska': 'AK',
    'arkansas': 'AR',
    'california': 'CA',
    'colorado': 'CO',
    'connecticut': 'CT',
    'delaware': 'DE',
    'florida': 'FL',
    'georgia': 'GA',
    'hawaii': 'HI',
    'idaho': 'ID',
    'illinois': 'IL',
    'indiana': 'IN',
    'iowa': 'IA',
    'kansas': 'KS',
    'kentucky': 'KY',
    'louisiana': 'LA',
    'maine': 'ME',
    'maryland': 'MD',
    'massachusetts': 'MA',
    'michigan': 'MI',
    'minnesota': 'MN',
    'mississippi': 'MS',
    'missouri': 'MO',
    'montana': 'MT',
    'nebraska': 'NE',
    'nevada': 'NV',
    'new hampshire': 'NH',
    'new jersey': 'NJ',
    'new mexico': 'NM',
    'new york': 'NY',
    'north carolina': 'NC',
    'north dakota': 'ND',
    'ohio': 'OH',
    'oklahoma': 'OK',
    'oregon': 'OR',
    'pennsylvania': 'PA',
    'rhode island': 'RI',
    'south carolina': 'SC',
    'south dakota': 'SD',
    'tennessee': 'TN',
    'texas': 'TX',
    'utah': 'UT',
    'vermont': 'VT',
    'virginia': 'VA',
    'washington': 'WA',
    'west virginia': 'WV',
    'wisconsin': 'WI',
    'wyoming': 'WY'
  }

  return this.stateList[stateFullName];

}



$.ajax({
  url: "https://covidtracking.com/api/v1/us/current.json",
  method: "GET"
}).then(function (response) {
  var countryPositive = response[0].positive;
  var countryRecovered = response[0].recovered;
  var countryDeath = response[0].death;
  renderCountry(countryPositive, countryRecovered, countryDeath);
});

function renderStates(statePositive, stateRecovered, stateDeath) {
  if(statePositive){
  $("#data-pos-search").text(statePositive);
  } else {
    $("#data-pos-search").text("NO DATA");
  }
  
  if(stateRecovered){
  $("#data-rec-search").text(stateRecovered);
  } else {
    $("#data-rec-search").text("NO DATA");
  }
  
  if(stateDeath){
  $("#data-death-search").text(stateDeath);
  } else {
    $("#data-death-search").text("NO DATA");
  }
  
  $("#data-date-search").text(displayYesterdayDate);
}

function renderCountry(countryPositive, countryRecovered, countryDeath) {
  $("#data-pos-total").text(countryPositive);
  $("#data-rec-total").text(countryRecovered);
  $("#data-death-total").text(countryDeath);
  $("#data-date-total").text(displayTodayDate);
}
