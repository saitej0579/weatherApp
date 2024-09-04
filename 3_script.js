const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");

//const userContainer = document.querySelector(".WeatherSection");
const grantAccessContainer = document.querySelector(".grantLocation");
const seachForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".LoadingSection");
const userinformationSection = document.querySelector(".userinformationSection");

//initial conditions
let currentTab = userTab;
const API_KEY = "168771779c71f3d64106d8a88376808a";
currentTab.classList.add("current-tab");
// getFromSessionStorage();

//logic for switching the tab

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        //remove the active class from the current tab
        currentTab.classList.remove("current-tab");
        //assign current tab to clicked tab
        currentTab = clickedTab;
        //add the active class to current tab
        currentTab.classList.add("current-tab"); 
    }
    //this is for knowing on which tab we are
    if(!searchForm.classList.contains("active")){
        //this is for making visible the searchtab
        //this line tells wheather the searchform contains active class or not if not contiains 
        //this means we were in usertab we need to go to search tab
        //step 1 : hide userinformation
        userinformationSection.classList.remove("active");
        //step 2: hide grantlocation section also
        grantAccessContainer.classList.remove("active");
        //step 3: now make visible the searchForm
        seachForm.classList.add("active");
    }
    else{
        //this means we need to go to user tab (or) display Your information
        // step1 : remove search Form
        seachForm.classList.remove("active");
        //step 2: hide userinformation also when we searched it would not removed
        userinformationSection.remove("active");
        //step 3: we need to display the weather of given coordination
        //for this we will store the coordintes in the local storage and display
        getFromSessionStorage();
    }
}

userTab.addEventListener("click", ()=> {
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=> {
    switchTab(searchTab);
});

//function fo checking the coordinates if already present in the session storage

function getFromSessionStorage(){
    //first check user cordinates are present 
    //this will get from showposition function
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    //if not there then get
    if(!localCoordinates){
        //step 1: display grantLocation container On UI
        grantAccessContainer.classList.add("active");
    }
    //if the coordintes are present use them
    const coordinates = JSON.parse(localCoordinates);
    //here we coverted the localcordinates into json format and stored in the coordinates 
    //now call the function for fetching the weather and pass coordinates
    fetchUserWeatherInfo(coordinates);
}

//function for getting the weather info by passing the usercordinates
async function fetchUserWeatherInfo(coordinates){

    //assign the longitude and latitude from the coordinates that passed
    
    //The syntax { lat, lon } is called destructuring assignment. Its a JavaScript feature that allows you to 
    //extract values from an object and assign them to variables with the same name.
    //In the context of your code, { lat, lon } = coordinates; is equivalent to:
    //const lat = coordinates.lat;
    //const lon = coordinates.lon;
    
    const { lat, lon } = coordinates;
    //now do the API call with this lon and lat values
    //as the coordinates are found here hide grantaccess container
    grantAccessContainer.classList.remove("active");
    //now make loader visible
    loadingScreen.classList.add("active");


    //API CALL
    try{
        //here we called the api by passing lat lon
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        //here we converted the api information into json object and store in data
        const data = await response.json();
        //by this the api call have successfully completed and now hide the loaderscreen
        loadingScreen.classList.remove("active");
        //no display the userinfo container
        userinformationSection.classList.add("active");
        //now render the UI with th api information
        //here we passed data as it cointains all the information
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
    }
}

//rendering the userinfo UI
function renderWeatherInfo(weatherInfo){
    //now get the element to be updated and render them
    let cityName = document.querySelector("[data-userPlace]");
    let countryFlag = document.querySelector("[data-countryFlag]");
    let description = document.querySelector("[data-weatherDescription]");
    let weatherLogo = document.querySelector("[data-weatherIcon]");
    let temp = document.querySelector("[data-weatherTemperature]");
    let windSpeed = document.querySelector("[data-windSpeed]");
    let humidity = document.querySelector("[data-humidity]");
    let clouds = document.querySelector("[data-clouds]");

    //fetch values from data
    //here we dynamically assigned them with optional chain opertaor and notation
    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherLogo.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;
}

function getLocation(){
    //here we checked is your device hav geolocation option
    if(navigator.geolocation){
        //if yes get the position by callin showposition function
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //display any error message that no support available
    }
}

function showPosition(position){
    //here we created a dictionary where stored the lon and lat
    const userCoordinates = {
    lat : position.coords.latitude,
    lon : position.coords.longitude,
    }
    //here we got the user coordinates and converted into json object
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    //now passed this to fetchUserWeatherInfo function
    fetchUserWeatherInfo(userCoordinates);
}


//adding event listener on grantaccess button
const granatAccessButton = document.querySelector("[data-grantAccessButton]");
//here we created on grantaccess button and called the callback function getLocation function
granatAccessButton.addEventListener("click",getLocation)


//addiding eventlistner to the search input form
const searchInput = document.querySelector("[ data-searchInput]");

seachForm.addEventListener("submit", (e)=>{
    //here we prevented default condition of the form
    e.preventDefault();

    let cityName = searchInput.value;
    if(cityName ==""){
        return;
    }
    else{
        //here we call a function which calls api based on the cityname;
        fetchSearchWeatherInfo(cityName);
    }
})

//writing function for getting information based on the city

async function fetchSearchWeatherInfo(city){

    //now add loader as we calling API
    loadingScreen.classList.add("active");
    //remove userinfocontainer
    userinformationSection.classList.remove("active");
    //remove grant access container also
    grantAccessContainer.classList.remove("active");

    //API CALL based on the city

   try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();
    //now remove laoder
    loadingScreen.classList.remove("active");
    //now show the userinfo container on UI
    userinformationSection.classList.add("active");

    //now call the function to show the data
    renderWeatherInfo(data);
   }
   catch(e){
    //HW
   }


}