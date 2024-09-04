console.log("hello");

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


async function showWeather (){

    try{
        let city = "vikarabad";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    let data = await response.json();

    console.log("the data is",data)

    let newPara = document.createElement("p");
    newPara.textContent = `${data?.main?.temp.toFixed(2) } .C`
    document.body.appendChild(newPara);

    }

    catch(err){
        console.log("error occured",err);
    }
}

//geolaction function
function getLocation(){

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("error");
    }

}

function showPosition(position){
    let lati = position.coords.latitude;
    let longi = position.coords.longitude;
    console.log(lati);
    console.log(longi);
}