function getTotal(){
	var gZip = $('.zip input').val();  
	gYear = $('.year input').val();  
	var settings = {
  	"url": "https://api.gsa.gov/travel/perdiem/v2/rates/zip/" + gZip + "/year/" + gYear + "?api_key=" + apiKey,
  	"method": "GET",
  	"timeout": 0,
};

$.ajax(settings).done(function (responseA) {
  tMeals = responseA.rates[0].rate[0].meals;
  getMie();

});
  
}

function getMie(){
	var settings = {
  	"url": "https://api.gsa.gov/travel/perdiem/v2/rates/conus/mie/" + gYear + "?api_key=" + apiKey,
  	"method": "GET",
  	"timeout": 0,
};

$.ajax(settings).done(function (responseB) {

  var tTotals = responseB.length;

  for(i = 0; i < tTotals; i++){

    if(responseB[i].total == tMeals){
        $('.breakfast input').val(responseB[i].breakfast);
  		$('.lunch input').val(responseB[i].lunch);
  		$('.dinner input').val(responseB[i].dinner);
  		$('.incidentals input').val(responseB[i].incidental);
  		$('.firstLast input').val(responseB[i].FirstLastDay);
      	$('.total input').val(responseB[i].total);
    }
    else{}
  }
});
  
}


