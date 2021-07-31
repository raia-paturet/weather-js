//supprimer les meteos precedentes
$( "form" ).click(function(){
    $( "ul" ).empty();
  });


// recuperer le nom de la ville et la convertir en coordonnees GPS via api opencage
$( "button" ).click(function() {
  event.preventDefault()
  var city = document.forms["cityForm"]["inputCity"].value;
  var num_days = parseInt(document.forms["cityForm"]["weekDays"].value);
  const apikey_openCage = '1ddc5c76f4c443398bb62c8266524698';
  const url_openCage = 'https://api.opencagedata.com/geocode/v1/json'
  var request_openCage = url_openCage 
    + '?' 
    + 'q=' + city 
    + '&key=' + apikey_openCage
    + "&limit=1"

  $.get(request_openCage, function(data) {
    var all = data["results"];
    lat = data["results"][0]["geometry"]['lat'];
    lon = data["results"][0]["geometry"]['lng'];
    rise = data["results"][0]["annotations"]["sun"]["rise"]["apparent"];
    set = data["results"][0]["annotations"]["sun"]["set"]["apparent"];
    t = data["timestamp"]["created_unix"];
    weather(lat, lon, num_days);
  }); 
});



//recuperer la meteo via les coordonnees GPS, recuperer identifiant puis les renvoyez en pictos dans html
function weather(lat, lon, num_days) {
  const apikey_openWeather = '12e325edd2b9f7fdb74f6220d37a5d79';
  const url_openWeather = 'https://api.openweathermap.org/data/2.5/onecall'
  var request_openWeather = url_openWeather 
    + '?' 
    + 'lat=' + lat
    + '&lon=' + lon
    + '&appid=' + apikey_openWeather

  $.get(request_openWeather, function(data) {
    for (var i = 0; i < num_days; i++) {
    d = (data["daily"][i]["dt"]);
    d_weather = (data["daily"][i]["weather"][0]["main"]);
    d_cloud = (data["daily"][i]["clouds"]);
    day(d,d_weather, d_cloud);
    }
  });
} 


function find_the_weather(main_weather, cloud_weather) {
    if (main_weather == "Clouds" & cloud_weather > 50) {
      var clouds = document.createElement("img");
      clouds.src = "./static/icons/clouds.svg"; 
      return clouds.src;
    } else if (main_weather == "Clouds" & cloud_weather < 50) {
        var cloudy = document.createElement("img");
        cloudy.src = "./static/icons/cloudy.svg";
        return cloudy.src;
    } else if (main_weather == "Clear") {
        var sun = document.createElement("img");
        sun.src = "./static/icons/sun.svg";
        return sun.src;
    } else if (main_weather == "Snow") {
        var snow = document.createElement("img");
        snow.src = "./static/icons/snow.svg";
        return snow.src;
    } else {
        var rain = document.createElement("img");
        rain.src = "./static/icons/rain.svg"; //La propriété src contient l'adresse URL de l'image.
        return rain.src;
    }
}

// convertir  unix timestamp en jour
function dt_convert(dt) {
  var millisecondes = dt * 1000 // conv en millisecondes pour js
  var full_date = new Date(millisecondes)// variable format date
  var week_day = full_date.toLocaleDateString ( "en-US" , {weekday: "long"}) // le jour
  return week_day; 
}


// fonction qui recyupere les donnees et les envoies a html
function day(d, d_weather, d_cloud) {
  var day = dt_convert(d);
  var picto = find_the_weather(d_weather, d_cloud);
  var results = "<div class='perDay'>" + "<span>" + day + "</span>" + "<img src=" + picto + ">" + "</div>";
  $("#on_screen").append('<li >' + results + '</li>')
  }