var options = {
  timeout: 5000,
  maximumAge: 0
};

function geocodeLatLng(latitude,longitude) {
  var geocoder = new google.maps.Geocoder();
  var latlng = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      if (results[1]) {
        var adr=results[1].formatted_address.split(',');
        // city name
        $("h1").html(adr[adr.length-2]);
        //country name
        $("#cn").html(adr[adr.length-1]);
      } 
    } else {
      console.log('Geocoder failed due to: ' + status);
    }
  });
}


function success(position){
geocodeLatLng(position.coords.latitude,position.coords.longitude);  
var weatherAPI="https://api.darksky.net/forecast/846d9e89d0782b0f6e0986bcde9bd955/"+position.coords.latitude+","+position.coords.longitude+"?exclude=minutely,hourly,flags,alerts&units=si&callback=?";
//console.log(weatherAPI);
$.getJSON(weatherAPI,function(response){
  $("#weather").html(response.currently.summary);
  $("#temp").html((response.currently.temperature).toFixed(0));
  $("#humidity").html((response.currently.humidity*100).toFixed(0));
  //add the main icon
  var skycons = new Skycons({"color": "teal"});
  skycons.add("icon0", response.currently.icon);
  skycons.play();
  
  //predictions for three days
  for(var i=1;i<4;i++){      $("#d"+i).children("h4").html(moment(response.daily.data[i].time*1000).format('dddd')); 
 $("#d"+i).children("span").html((response.daily.data[i].temperatureMin).toFixed(0)+'/'+(response.daily.data[i].temperatureMax).toFixed(0)+'<i class="wi wi-celsius" style="font-size:22px;"></i>');
  $("#d"+i).children("div").html((response.daily.data[i].humidity*100).toFixed(0)+' <i class="wi wi-humidity forecast"></i>');
    skycons.add("icon"+i, response.daily.data[i].icon);
  skycons.play();
  }
  
}).fail(function(){
  console.log("error retrieving weather data");
});

}

$("#f").click(function(e){
  //converting to Fahrenheit
  e.preventDefault();
  $(this).removeAttr('style');
  $("#c").attr("style",'color:#c0c0c0;');
  var current=$("#temp").html();
  current=1.8*current+32;
  $("#temp").html(current.toFixed(0));
   for(var i=1;i<4;i++){
var ca =$("#d"+i).children("span").html().split('<')[0].split('/');
ca[0]=1.8*ca[0]+32;     
ca[1]=1.8*ca[1]+32;     
$("#d"+i).children("span").html(ca[0].toFixed(0)+'/'+ca[1].toFixed(0)+'<i class="wi wi-fahrenheit" style="font-size:22px;"></i>');
   }
});

$("#c").click(function(e){
  //converting to Fahrenheit
  e.preventDefault();
  $(this).removeAttr('style');
  $("#f").attr("style",'color:#c0c0c0;');
  var current=$("#temp").html();
  current=(current-32)/1.8;
  $("#temp").html(current.toFixed(0));
   for(var i=1;i<4;i++){
var ca =$("#d"+i).children("span").html().split('<')[0].split('/');
ca[0]=(ca[0]-32)/1.8;     
ca[1]=(ca[1]-32)/1.8;     
$("#d"+i).children("span").html(ca[0].toFixed(0)+'/'+ca[1].toFixed(0)+'<i class="wi wi-fahrenheit" style="font-size:22px;"></i>');
   }
});

function error(err) {
 console.log(err.code+' :'+err.message);
};


if (navigator.geolocation) {
  
navigator.geolocation.getCurrentPosition(success,error);
}
else
  {
   // $("#content").html("Your browser does not support geolocation!");
    console.log("your browser does not support geolocation");
  }