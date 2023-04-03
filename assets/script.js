const apiKey = 'd90d1ffad25d55d6207980f2e62347a6'
let city ='';

let searchButton = $('#search-button');
let inputBar = $('#input-bar');



function displayCurrentWeatherData(object, htmlLocation){
  console.log(object)
          let city = $("<strong>").text(object.name+' '+ dayjs().format('(d/m/YYYY)'));
          let icon = $("<img>").attr({'src':'http://openweathermap.org/img/w/'+object.weather[0].icon+'.png'}); 
          let temp = $("<p>").text('Temp: '+ object.main.temp +'°C');     
          let wind= $("<p>").text('Wind: '+ object.wind.speed + 'KM/h');      
          let hum = $("<p>").text('Humidity: '+ object.main.humidity+ '%');

          $(htmlLocation).append(city,icon,temp,wind,hum);
}

function displayForecastWeatherData(object, htmlLocation){
  let card = $("<div>").addClass('card');

  let date = $("<strong>").text(object.dt_txt.split(' ')[0]);
  let icon = $("<img>").attr({'src':'http://openweathermap.org/img/w/'+object.weather[0].icon+'.png'});
  let temp = $("<p>").text('Temp: '+ object.main.temp +'°C') ;
  let wind = $("<p>").text('Wind: '+ object.wind.speed + 'KM/h');
  let hum = $("<p>").text('Humidity: '+ object.main.humidity+ '%');

  card.append(date,icon,temp,wind,hum);
  $(htmlLocation).append(card)
}


async function getcoordonates(){
  let response = await fetch( "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+ apiKey);
  let data = await response.json()
  let coordonates = [data[0].lat, data[0].lon]
  console.log(coordonates)
  return coordonates;
}

async function getForecast(){
  let coordonates = await getcoordonates();
  console.log(coordonates);
  let dataForecast = await (await (await fetch('https://api.openweathermap.org/data/2.5/forecast?lat='+coordonates[0]+'&lon='+coordonates[1]+'&units=metric&&appid=' + apiKey)).json()).list
  console.log(dataForecast) 
  const days = [0,8,16,24,32]
  for (let index = 0; index < days.length; index++) {
    let selectedDay = dataForecast[days[index]];
    console.log(selectedDay);
    displayForecastWeatherData(selectedDay, '.card-section');
    
  }
  
}

async function getCurrentWeather(){
  let coordonates = await getcoordonates();
  console.log(coordonates);
  let currentWeatherObject = await (await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+coordonates[0]+'&lon='+coordonates[1]+'&units=metric&&appid=' + apiKey)).json()
  console.log(currentWeatherObject);
  displayCurrentWeatherData(currentWeatherObject, '.current-weather');
}

function renderBlank(){
  $(".card-section").children().remove();
  $(".current-weather").children().remove();
  $(".previous-search").children().remove();
}

function displayPreviousSearch(){
  let previoussearch = JSON.parse(localStorage.getItem('citySearched'));
  if(!previoussearch){
    return
  }else{
    for (let index = 0; index < previoussearch.length; index++) {
      let search = previoussearch[index];
      let li =$("li").text(search).addClass(list)
      $(".previous-search").append(li);
    }
  }
}
function updateLocalStorage(city){
  let retrievedSearch =JSON.parse(localStorage.getItem('previousSearch'));
  if(!retrievedSearch){
    retrievedSearch = []
  }
  retrievedSearch.push(city)
  retrievedSearch.forEach(element => {
    $(".previous-search").append($("<li>").text(element))
  });
  localStorage.setItem('previousSearch', JSON.stringify(retrievedSearch))
}

function renderResult(city) { 
  city = inputBar.val();
  if(city){
  console.log('the city chosen is: '+ city)
  renderBlank();
  updateLocalStorage(city);
  getForecast();
  getCurrentWeather();
  
  }
}



searchButton.on('click',function(){
  
  city = inputBar.val();
  // if(city){
  // console.log('the city chosen is: '+ city)
  // renderBlank();
  // updateLocalStorage(city);
  // getForecast();
  // getCurrentWeather();
  // renderResult("test = "+inputBar.val())


  // }
  renderResult(city)
   
});






