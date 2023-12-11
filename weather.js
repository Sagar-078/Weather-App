const userTab = document.querySelector("[data-userWeather]");
const serchTab = document.querySelector("[data-searchWeather]");
const weatherContaner = document.querySelector(".weather_contaner");
const grantLocationContaner = document.querySelector(".grant_location__contaner");
const searchForm = document.querySelector("[data-seachForm]");
const loadingScreen = document.querySelector(".loading-contaner");
const userInfoContaner = document.querySelector(".user_info__contaner"); 

let currentTab = userTab;
const API_KEY = "e2baa0e7420925fe7977987366ba5fc0";
currentTab.classList.add("current-tab");
getfromSessionStorage();

userTab.addEventListener("click", (e) =>{
    swichTab(userTab);
});

serchTab.addEventListener("click", (e) =>{
    swichTab(serchTab);
});

function swichTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            // if seachtab form is invisible then visible it and invisible all  
            userInfoContaner.classList.remove("active");
            grantLocationContaner.classList.remove("active");
            searchForm.classList.add("active");
        }else{
            // if prasent in seachtab then want to visible your weather tab
            // then invisible seachform 
            searchForm.classList.remove("active");
            // weather innformation will be remove
            userInfoContaner.classList.remove("active");
            // call a function for disply weather for that let's check local storage first,
            // for coordinates if have saved.
            getfromSessionStorage();   
        }
    }
}

// for check if coordinates are alrady prasent in sassion storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){ // if local coordinates are not prasent then show grant location con
        grantLocationContaner.classList.add("active");
    }
    else{ // if local coordinates alrady prasent then use this coordinates and 
        // 1st convert to json format and then call a function for fetch weather information
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeather(coordinates);

    }
}
//xxxx
const errContaner = document.querySelector(".error_Contaner");

//creat this function fetchuserweather
async function fetchUserWeather(coordinates){
    const {lat, lon} = coordinates;
    // 1st invisible grant location ccontaner
    grantLocationContaner.classList.remove("active");
    // then visible loader 
    loadingScreen.classList.add("active");

    // then call api
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        // invisible this loader
        loadingScreen.classList.remove("active");
        //visible userinfocontaner 
        userInfoContaner.classList.add("active"); 

        // then show this data or rander on ui for that creat a function
        renderWeatherInfo(data);

    }
    catch(err){
        loadingScreen.classList.remove("active");
        // xxxxxxxx
        userInfoContaner.classList.remove("active");
        errContaner.classList.add("active");
    }
}

// render this function
function renderWeatherInfo(weatherInfo){

    // 1st fetch elemets of user info contaner
    const cityName = document.querySelector("[data-cityName]");
    const contryIcon = document.querySelector("[data-contryIcon]"); 
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp  = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness  = document.querySelector("[data-clouds]");

    // fetch values from weather info object put in ui element
    // using by optional chaning 
    cityName.innerText = weatherInfo?.name;
    contryIcon.src = `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = ` ${weatherInfo?.main?.temp} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;


}

//for check if coordinates are absent in storage
//then find location

const grantAccessBtn = document.querySelector("[data-grantAccess]");

// add eventlistener on this btn for on click and call a functon for get location 
grantAccessBtn.addEventListener("click", getlocation);

function getlocation(){
    if(navigator.geolocation){ 
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // show an alert for no geolocation support avelable
        alert("No geolocation support avelable!!");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    //store this coordinates or set items of coordinates in sessionstorage in name of
    // user-coordinates.
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // for show in ui
    fetchUserWeather(userCoordinates);

}

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e)=>{
    // prevet defult method 
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === ""){
        return;
    }
    else{
        // call a function for fetch weather for this input city
        fetchSearchWeatherInfo(cityName);
    }

})

async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContaner.classList.remove("active");
    grantLocationContaner.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContaner.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        //xxxxxxx
        loadingScreen.classList.remove("active");
        userInfoContaner.classList.remove("active");
        errContaner.classList.add("active");
    }
}