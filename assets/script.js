const apiKey = 'd90d1ffad25d55d6207980f2e62347a6'
let city = 'Sydney'
const longlatUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid="+ apiKey;
let coordonates = [];


function getCurrentWeather(requestUrl){
  console.log('inside getCurrentWeather function');
  let abc = fetch(requestUrl)
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
    .then(function getWeather(coordonates){
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
        .then(function (data){ 
          console.log(data)
          let city = $("<p>").text(data.name); 
          console.log(city.text())
          let temp = $("<p>").text(data.main.temp);
          console.log(temp.text());
          let wind= $("<p>").text(data.wind.speed);
          console.log(wind.text())
          let hum = $("<p>").text(data.main.humidity);
          console.log(hum.text())

          
          $('.current-weather').append(city,temp, wind, hum);
         
        })
    
    })
  
   
}

//
async function getWeather(coordonates){
  console.log('in getweather function')
  let currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather?lat="+coordonates[0]+"&lon="+coordonates[1]+"&appid=" + apiKey;
  fetch(currentWeatherUrl)
    .then(function (response){
      console.log(response);
      if(response.status == 200){
        console.log('response status is '+ response.status)
      }
      return response.json()
    })
    .then(function (data){ 
      console.log(data)
     
    })

}



getCurrentWeather(longlatUrl);
console.log(coordonates)

//getWeather(coordonates);



