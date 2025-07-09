 const cityinput=document.querySelector(".city-input");
 const searchbtn= document.querySelector(".search-btn");


 const notFoundSection= document.querySelector(".not-found");
 const searchcitysection=document.querySelector(".search-city");
 const weatherinfosection=document.querySelector(".weather-info");


//  section of the html
const countryTxt=document.querySelector(".country-txt")
const temptxt = document.querySelector(".temp-txt");
const conditiontxt= document.querySelector(".condition-txt "); 
const humidityvaluetxt = document.querySelector(".humidity-value-txt");
const windvaluetxt = document.querySelector(".wind-value-txt");
const weathersummaryimg = document.querySelector(".weather-summary-img");
const currentdatatxt = document.querySelector(".current-data-txt "); 

const forcastItemsContainer =document.querySelector(".forecast-item-container");


 const Apikey='5883a466960b3b7fe8e23be2868eba82';

 searchbtn.addEventListener("click", ()=>{
    if( cityinput.value.trim() != ''){
                updateWeatherInfo(cityinput.value);
                cityinput.value='';
                cityinput.blur();
    }
 })

cityinput.addEventListener('keydown',(event)=>{
     if(event.key =='Enter' && 
            cityinput.value.trim() != ''
     ) {
   
             updateWeatherInfo(cityinput.value);
             cityinput.value='';
             cityinput.blur();
     }
})  

async function getFetchData(endpoint, city){
const apiurl =  `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${Apikey}&units=metric `;
    
const response = await fetch(apiurl);
   return response.json();

}
 
function getweatherIcon(id){
   // console.log(id)

   if(id <=232) return 'thunderstorm.svg'
   if(id <=321) return 'drizzle.svg'
   if(id <=531) return 'rain.svg'
   if(id <=622) return 'snow.svg'
   if(id <=781) return 'atmosphere.svg'
   if(id <=800) return 'clear.svg'
   else  return 'clouds.svg'
}
function getcurrentdate(){
   const currentDate = new Date();
   const options = {
      weekday: 'short',
      day: '2-digit',
      month: 'short'
   };
   return currentDate.toLocaleDateString('en-GB', options);
}

 

async function updateWeatherInfo(city){
    const weatherData =  await getFetchData('weather',city);
   // console.log(weatherData);

   if(weatherData.cod !=200 ){
      showDisplaySection(notFoundSection);
      return

   }
   console.log(weatherData)
   
   const{
      name: country,
      main:{ temp ,humidity},
      weather:[ { id,main}],
      wind: {speed}
   } = weatherData;

    countryTxt.textContent = country
    temptxt.textContent =Math.round(temp) +'°C'
    conditiontxt.textContent=main
    humidityvaluetxt.textContent= humidity +'%'
    windvaluetxt.textContent= speed + 'M/s'

    
    currentdatatxt.textContent = getcurrentdate()
   console.log(getcurrentdate());


    weathersummaryimg.src =` assets/weather/${getweatherIcon(id)}`

   await updateForecastInfo(city)
   showDisplaySection(weatherinfosection)
  }



  async function updateForecastInfo(city  ){
   const forecastData = await getFetchData('forecast',city );

   const timetaken ='12:00:00'
   const todayDate = new Date().toISOString().split('T'[0]);

   forcastItemsContainer.innerHTML ='';
   forecastData.list.forEach(forecastWeather =>{
if (
   forecastWeather.dt_txt.includes(timetaken) &&
   !forecastWeather.dt_txt.includes(todayDate)
){
         // console.log(forecastWeather)
        updateForecastItems(forecastWeather)
     

      }
   })
   // console.log(todayDate)
   // console.log(forecastData)
}
        function updateForecastItems(weatherData){
          console.log(weatherData)
           const {
             dt_txt : date,
             weather : [{id}],
             main : { temp}
                }=weatherData

                const dateTaken = new Date(date)
                const dateOption = {
                  day :'2-digit',
                  month:'short',

                }
                const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)

                const  forecastItem =`
                     <div class="forecast-item">
                        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                        <img src="assets/weather/${getweatherIcon(id)}" alt="" class="forecast-item-img">
                        <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
                      </div>  
                `
                forcastItemsContainer.insertAdjacentHTML('beforeend',forecastItem)
           }
   


   function showDisplaySection(section){
      [weatherinfosection,searchcitysection,notFoundSection]
             .forEach(section => section.style.display='none')
      
       section.style.display ='flex';
   }
  