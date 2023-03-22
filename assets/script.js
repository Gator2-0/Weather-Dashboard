const apiKey = 'd90d1ffad25d55d6207980f2e62347a6'
let city = 'Sydney'
const longlatUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+ apiKey;
let coordonates = [];


function getCurrentWeather(requestUrl){
  console.log('inside getCurrentWeather function');
  fetch(requestUrl)
    .then(function (response){
      console.log(response);
      if(response.status == 200){
        console.log('response status is '+ response.status)
      }
      return response.json()
    })
    .then(function (data){ 
      console.log(data[0])
      coordonates.push(data[0].lat);
      coordonates.push(data[0].lon)
      console.log('lat is: '+ data[0].lat);
      console.log('long is: '+data[0].lon);
      console.log(coordonates);
      return coordonates
    })
    .then(function (coordonates){
      console.log('in getweather function')
      let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+coordonates[0]+"&lon="+coordonates[1]+"&units=metric&&appid=" + apiKey;
      fetch(currentWeatherUrl)
        .then(function (response){
          console.log(response);
          if(response.status == 200){
            console.log('response status is '+ response.status)
          }

          return response.json()
        })
        .then(Current(data,''))
    })
    .then(function(){
      let forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat='+coordonates[0]+'&lon='+coordonates[1]+'&appid=' + apiKey;
      fetch(forecastUrl)
      .then(function(response){
        if(response.status !== 200){
          console.log('fetch forecast status= '+ response.status)
        }
        return response.json();
      })
      .then(function (data){
        console.log(data);
      })
    })   
}

function displayCurrentWeatherData(object, htmlLocation){
  console.log(object)
          let city = $("<p>").text(object.name); 
          console.log(city.text())
          let temp = $("<p>").text(object.main.temp);
          console.log(temp.text());
          let wind= $("<p>").text(object.wind.speed);
          console.log(wind.text())
          let hum = $("<p>").text(object.main.humidity);
          console.log(hum.text())

          $(htmlLocation).append(city,temp, wind, hum);
}

function displayForecastWeatherData(object, htmlLocation){
  let card = $("<div>").addClass('.card');

  let date = $("<p>").text(object.dt_txt.split(' ')[0]);
  let icon = $("<img>").attr('src',"http://openweathermap.org/img/w/"+object.weather[0].icon+".png");
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
    displayForecastWeatherData(selectedDay, '.card-divider');
    
  }
  
}

async function getCurrentWeather(){
  let coordonates = await getcoordonates();
  console.log(coordonates);
  let currentWeatherObject = await (await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+coordonates[0]+'&lon='+coordonates[1]+'&units=metric&&appid=' + apiKey)).json()
  console.log(currentWeatherObject);
  displayCurrentWeatherData(currentWeatherObject, '.current-weather');
}



getForecast();
getCurrentWeather();
//getCurrentWeather(longlatUrl);
//console.log(coordonates)





