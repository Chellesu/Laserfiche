var index;

$(document).ready(function(){
    $('.miles input').attr('readonly','True');
	$(".cf-collection-append").click(function(){
  	$('.miles input').attr('readonly','True');
}); 
  
  const API_KEY = 'AIzaSyC_SajsdW24MRndK1RiTNYTQcu__n-Ayqk';
  $.getScript('https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&libraries=places',
              function (data, status) { 
                $(".myTable").on('focus', '.pointA, .pointB', initAutocomplete); 
                $(".myTable").on('focusout', '.pointA, .pointB', initmap);

              });
});
  

function initAutocomplete() {
  var addressField = $(this).find('input').attr("id");
  autocomplete = new google.maps.places.Autocomplete(
      document.getElementById(addressField), {types: ['geocode']});   
  autocomplete.setFields(['address_component']);
}

function initmap() {
  $('.Submit').hide();
  index = $(this).closest("div.form-q").index() + 1;
  
  setTimeout(function(){        
     
    var origin1 = document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .pointA input").value;
	var destinationA = document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .pointB input").value;  

                                  
var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: [destinationA],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.IMPERIAL,
    avoidHighways: false,
    avoidTolls: true,
  }, callback);
    
  }, 500);                 
}


function callback(response, status) {
  if (status == 'OK') {
    var origins = response.originAddresses;
    var destinations = response.destinationAddresses;
    for (var i = 0; i < origins.length; i++) {
      var results = response.rows[i].elements;
      
       if (i == 0)

      for (var j = 0; j < results.length; j++) {
        var element = results[j];
        var distance = element.distance.text;
        var duration = element.duration.text;
        var from = origins[i];
        var to = destinations[j];                  
      }      
    }
  }
  var rMile = 0;
  var tdistance = parseNumber(distance);


  if (distance!='1 ft'){
    document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .miles input").value = tdistance;
    $('.miles input').change(); 
    $('.Submit').show();      
  }  
  else {
    alert('Error. Please try again.');
    document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .pointB input").value = '';
    document.querySelector(".myTable .kx-repeatable > div:nth-child(" + index + ") .miles input").value = '';
  }
}

function parseNumber(n) {
        var f = parseFloat((n).replace(',', '')); 
        return isNaN(f) ? 0 : f;
    }




