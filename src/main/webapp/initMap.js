// JavaScript Document
var map;                //Map element
var xmlhttp;            //AJAX request
var currentPosition;    //My position on map
var I_Marker;           //marker in my position

google.maps.event.addDomListener(window, 'load', initialize);

//Initializing map in start position
function initialize() {
	GetLocation();
	var defaultMapOptions = {
		center: {lat : 48.9501, lng : 24.701},
		zoom: 14
	};
	map = new google.maps.Map(document.getElementById('map_container'), defaultMapOptions);
	//Adding marker to map in click_point and sending addRequest to server
	google.maps.event.addListener(map, 'click', function(e) {
	                                               var description = document.getElementById("description").value;
                                                   addMarker(e.latLng, description, "ATM");
                                                   addReq(e.latLng, description);
                                                   document.getElementById("address_string").value = "";
                                               });
	addMarker(currentPosition, "i", "i");
};

//Getting location from browser
function GetLocation(){
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(setLocation);
	}
};

//Setting current location in position received from browser
function setLocation(position){
	currentPosition = { lat: position.coords.latitude, lng: position.coords.longitude};
	I_Marker = addMarker(currentPosition, "I", "I");
	map.panTo(currentPosition);
};

//Setting current location in position given as latLng var
function setLocationByLatLng(lat_lng_position){
	addMarker(lat_lng_position, "I", "I");
	map.panTo(lat_lng_position);
}

//Adding marker to map
function addMarker(position, title, type){
	var	marker = new google.maps.Marker({
		position: position,
		map: map,
		title: title
	});	
	/*if(type == "ATM"){
		marker.setIcon("resources\\ATM.png");
	}*/
	marker.setMap(map);
	//Removing marker from map and sending request for removing to server
	google.maps.event.addListener(marker, 'click', function removeMarker() {
	                                                   if(marker != I_Marker){//If this marker not my position marker then remove
                                                            marker.setMap(null);
                                                            removeReq(marker.getPosition());
                                                       }
                                                   });
    return marker;
}

//Setting current position to address given in text_field
function setLocationByAddress(){
	var addres_str = document.getElementById("address_string").value;
		if(addres_str){
			var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : addres_str}, function(data, status){
            	if(status == google.maps.GeocoderStatus.OK){
            	    I_Marker.setMap(null);
            		currentPosition = {lat : data[0].geometry.location.lat(), lng : data[0].geometry.location.lng()};
            		I_Marker = addMarker(currentPosition, "I", "I");
            	    map.panTo(currentPosition);
            	} else {
            		window.alert("Address is invalid");
            	}
            })
		}
};

//Sending request to server for ATMs
function getReq() {
	xmlhttp=GetXmlHttpObject();

    if (xmlhttp==null){
   		alert ("Your browser does not support Ajax HTTP");
   		return;
  	}
    var url = "/gmplaces/getdata";
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function() {
  		if (xmlhttp.readyState == 4) {
     		if(xmlhttp.status == 200) {
       			parseRequest();
         	}
  		}
	};
    xmlhttp.send(null);
};

//Receiving data about markers from server and adding marker to map
function parseRequest() {
    ATMs = JSON.parse(xmlhttp.responseText);
    for (var i = 0; i < ATMs.points.length; i++) {
		var address = ATMs[i];
   		addMarker({"lat" : address.lat(), "lng" : address.lng()}, address.description , "ATM");
	}
};

//Sending request for adding to server
function addReq(position, description) {
	xmlhttp=GetXmlHttpObject();

    if (xmlhttp==null){
   		alert ("Your browser does not support Ajax HTTP");
   		return;
  	}
    var url = "/gmplaces/putdata?lat="+position.lat+"&lng="+position.lng+"&description="+description;
    xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
  		if (xmlhttp.readyState == 4) {
     		if(xmlhttp.status == 200) {
       			reqResult = JSON.parse(xmlhttp.responseText);
				if(reqResult.codeAns == "OK"){
					window.alert("Point was successfully added to XML in server");
				} else {
					window.alert("Point wasn't added to XML in server");
				}
         	}
  		}
	};
    xmlhttp.send(null);
};

//Sending request for removing point from XML on server
function removeReq(position) {
	xmlhttp=GetXmlHttpObject();

    if (xmlhttp==null){
   		alert ("Your browser does not support Ajax HTTP");
   		return;
  	}
    var url = "/gmplaces/removedata?lat="+position.lat+"&lng="+position.lng;
    xmlhttp.open("GET", url, true);
	xmlhttp.onreadystatechange = function() {
  		if (xmlhttp.readyState == 4) {
     		if(xmlhttp.status == 200) {
       			reqResult = JSON.parse(xmlhttp.responseText);
				if(reqResult.codeAns == "OK"){
					window.alert("Point was successfully removed from XML in server");
				} else {
					window.alert("Point wasn't removed from XML in server");
				}
         	}
  		}
	};
    xmlhttp.send(null);
};

//Creating GET HTTP request object
function GetXmlHttpObject(){
    if (window.XMLHttpRequest){
       	return new XMLHttpRequest();
    }
    if (window.ActiveXObject){
      	return new ActiveXObject("Microsoft.XMLHTTP");
    }
 	return null;
}


//