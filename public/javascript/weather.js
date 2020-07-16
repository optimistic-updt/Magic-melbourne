const url = `https://api.openweathermap.org/data/2.5/weather?lat=-37.8136&lon=144.9631&appid=85b2075ab64f6cec5e15fbc34c0d2a5e`
// const url = `http://api.openweathermap.org/data/2.5/weather?lat=-37.8136&lon=144.9631&appid=753de0d43c90ad8a12bf508c48b1f51e`

axios.get(url).then(res =>  {
    
    const temp = res.data.main.temp;
    const description = res.data.weather[0].description;
    const icon = res.data.weather[0].icon;

    const displayTemp = document.querySelector(".weather_temp");
    const dislayDescription = document.querySelector(".weather_description");
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;
    const kelvin = 273;
    const  navBarHeading = document.querySelector(".navbar_heading");

    displayTemp.textContent = Math.round(temp - kelvin) + "°C";
    dislayDescription.textContent = description;
    const iconElem = document.createElement("img");
    iconElem.classList.add('header_icon');
    iconElem.setAttribute("src", iconUrl);
    dislayDescription.appendChild(iconElem);
})   
