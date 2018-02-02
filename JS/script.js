var contactid = null;
var currentMarker = null;

// Transformation factor for intrisic image size to leaflet image size
var x_trans = 16;
var y_trans = 15.574;
// Intrinsic height and width of image in pixels
var imageHeight = 1000;
var imageWidth = 2000;
//
var current_view = "near";


function setup_slider() {
	$('#lightSlider').lightSlider({
        item:4,
        loop:false,
        slideMove:1,
        responsive : [{	breakpoint:800,
			settings: { 
				item:3,
				slideMove:1,
				slideMargin:6
			}	
		},
        {
			breakpoint:480,
			settings: {
				item:2,
				slideMove:1
			}
        	}
        ]
    });

}

$(document).ready(function (){


	$("#backgroundImage").on('click', function(e) {
		if (e.pageX <= 25 && e.pageY <= 25) {
			alert("This site was developed by Nisha Lad & Chris Wing :-)");
		}
	});

	// On page load, hide the off side until the flip button is pressed.
	$("#offSide").hide();
	
	// Opera browser adjustments
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	
	if(isOpera){
    		$("#overlay").css('margin','-14% 0% 0% 0%');
	}

	$.ajax({	
		url: 'SelfieMessages.csv',
		dataType: 'text',
		async: true,
		success: function (e){
			loadImages(e);
		}
	});

    window.setTimeout("setup_slider()", 5);				
	
	$("#tabs").tabs({});

	// Nearside map.
	var map = L.map('nearSide', {
		crs: L.CRS.Simple,
		minZoom: -1,
        maxZoom: 4,
		zoomControl: false,

	});
	
	// Offside map.
	var mapOff = L.map('offSide', {
		crs: L.CRS.Simple,
		minZoom: -1,
        maxZoom: 4,
		zoomControl: false,

	});

	// Make the bloodhound marker for map
	var bloodhoundIcon = L.icon({
		iconUrl: 'images/custom_marker.png',
		iconSize:     [200, 100], // size of the icon
		iconAnchor:   [100, 50] // point of the icon which will correspond to marker's location
	});

    // change zoom level of fin depending on device 
	window.addEventListener('resize', function(event){
		
		var width = document.documentElement.clientWidth;
		// phones are less than 768 pixels wide
		if (width < 768) {
			map.setZoom(4);
		}
	});	
		
	// Handles map zooming.
	$('#zoom-in').click(function(){
        
		if(current_view == "near"){
			
			map.setZoom(map.getZoom() + 1)
		}
		else{
			
			mapOff.setZoom(map.getZoom() + 1)
		}
		
    });

	// Handles map zooming.
	$('#zoom-out').click(function(){
		
		if(current_view == "near"){
			
			map.setZoom(map.getZoom() - 1)
		}
		else{
			
			mapOff.setZoom(map.getZoom() - 1)
		}
	});
	
	// Handles flipping map.
	$('#Flip').click(function(){
		
		if(current_view == "near"){
			
			$("#nearSide").hide();
			$("#offSide").show();
			
			current_view = "off";
		}
		else{
						
			$("#offSide").hide();
			$("#nearSide").show();
			
			current_view = "near";
		}
	});

	// Add the new names in the 2nd tab
	$.ajax({
			
		url: "PHP/new_names_pull.php",
		type: "GET",
		asyn: false,
		dataType: "json",
		success: function(data){
		
			$("#title").append("<h3 id='namesHeader'>The next set of names which will be added to the fin of Bloodhound on XX/XX/XXXX are:</h3>");
			if (data.length !== 0) {
				var newRecord;
				var newNames = "";
				for (var i = 0; i < data.length; i++) {
					newRecord = data[i].name;
					newNames += "<li>" + newRecord + "</li>";
				}
				$("#newNamesList").append(newNames);
			}
		}

	});	

	var data = addImagesToMap("near");
	var dataOff = addImagesToMap("off");
	var width = data[0];
	var height = data[1];
	
	function addImagesToMap(side) {
		
		var width = 0, height = 0, tmp = 0;
		var counter, bounds, image, path;
	
		for(x = 0; x < 10; x++){	
			
			height = 0;
			tmp += 1;
		
			for(var y = 90; y >= 0; y -= 10){	
		
				counter = y + tmp;
				bounds = [[height, width], [height + 100, width + 200]];
			
				if (side == "near"){
					
					path = "leaflet/Near side/master_sliced/master_near_"
					
					if (counter < 10){
						path += "0";
					}
					
					path += counter  + ".png";

					image = L.imageOverlay(path, bounds).addTo(map);	
					map.fitBounds(bounds);
					counter -= 1;
					height += 100;
				}
				else{
					
					path = "leaflet/Off side/master_sliced/master_off_"
					
					if (counter < 10){
						path += "0";
					}
					
					path += counter  + ".png";

					image = L.imageOverlay(path, bounds).addTo(mapOff);	
					mapOff.fitBounds(bounds);
					counter -= 1;
					height += 100;
				}
			}
		
			width += 200;
		}

		return [width, height];
	}

	// Show middle of map on page load (y, x, zoomLevel)
	map.setView([imageHeight / 2, imageWidth / 2], 0);
	mapOff.setView([imageHeight / 2, imageWidth / 2], 0);


	// Restrict dragging of fin image to bounds
	var southWest = L.latLng(0, 0), northEast = L.latLng(1000, 2000);
	var bounds = L.latLngBounds(southWest, northEast);
	
	map.setMaxBounds(bounds);
	mapOff.setMaxBounds(bounds);
	
	map.on('drag', function() {
    		map.panInsideBounds(bounds, { animate: false });
	});
	
	mapOff.on('drag', function() {
    		mapOff.panInsideBounds(bounds, { animate: false });
	});

	$(".leaflet-control-attribution").hide();

	$("#recenter").click(function () {
		
		if(current_view == "near"){
			
			map.setView([imageHeight/2, imageWidth/2], 0);
		}
		else{
			
			mapOff.setView([imageHeight/2, imageWidth/2], 0);
		}    
	});
  
	$("#search_names").submit(function(e){
  
		e.preventDefault();
		$("#overlay").hide();
		$("#greeting").hide();
		$(".namesScrollBar").remove();
		$(".wrapper").show();
	
		var data = $("#search_names").serializeArray().reduce(function(obj, item){
			obj[item.name] = item.value;
			return obj;
		}, {});


		var searchTerm = data["name"];
	
		$.ajax({
			
			url: "PHP/search.php?term=" + searchTerm,
			type: "POST",
			asyn: false,
			dataType: "json",
			success: function(data){
				
				var count = data.length;
				var coords, name, key, x, y, xOffset, yOffset;
				
				alert(count);
				if(count > 1){
				
					// create names panel
					$("#name_area").append("<div class='namesScrollBar' id='accordion'></div>");
					$(".namesScrollBar").append("<div class='searchQuery'> Results For: " + searchTerm + "</div>" +
						"<div><ul class='searchList'></ul></div>");
				
					var sBuilder = "";
					
					for(var i = 0; i < count; i++){
					
						name = data[i].name;
						key = data[i].key_;
						coords = data[i].coord;
						coords = coords.split(",");
						x = coords[0];
						y = coords[1];
												
						sBuilder += "<a id='nameLink' href='#'><li class='listItem' id='res_" + key + "_" + x + "_" + y + "'>" + name + "</li></a>";
					}
				
					$(".searchList").append(sBuilder);
			
					var state = $("#accordion").accordion({
						collapsible: true,
						autoHeight: true,
						heightStyle: "content",
						refresh: true,
						icons: {"header": "ui-icon-circle-plus", "activeHeader": "ui-icon-circle-minus"}
					});
					$("#accordion").accordion("option", state);


				}
				else if(count == 1){
					
					var key = data[0].key_;
					var coords = data[0].coord;
					coords__ = coords.split(",");
					x = coords__[0];
					y = coords__[1];
					
					if(key == "sc" || key == "nn"){
						
						// Name belongs on near side.
						
						if(current_view != "near"){
							
							// We must change to near side.
							
							current_view = "near";
							
							$("#offSide").hide();
							$("#nearSide").show();
						}
					}
					else{
						
						// Name belongs on off side.
						
						if(current_view != "off"){
							
							// We must change to near side.
							current_view = "off";
							
							$("#nearSide").hide();
							$("#offSide").show();
						}
					}
					
					panToName(x, y, key);
					
				}
				else{
					
					alert("Sorry, no results were found.");
				}


				$('.listItem').on('click', function(){
					
					var id_data = $(this).attr("id").replace("res_", "");
					var pre_key = id_data.split("_");
					var key_ = pre_key[0];
					var x = pre_key[1];
					var y = pre_key[2];
					
					if(key_ == "sc" || key_ == "nn"){
						
						// Name belongs on near side.
						
						if(current_view != "near"){
							
							// We must change to near side.
							
							current_view = "near";
							
							$("#offSide").hide();
							$("#nearSide").show();
						}
					}
					else{
						
						// Name belongs on off side.
						
						if(current_view != "off"){
							
							// We must change to near side.
							current_view = "off";
							
							$("#nearSide").hide();
							$("#offSide").show();
						}
					}
					panToName(x, y, key_);
				});				
			}
		});
	});

	function panToName(x, y, key_){
		
		/*
		// If a map marker already exists.
		if(currentMarker != null){
			map.removeLayer(currentMarker);
			mapOff.removeLayer(currentMarker);
		}
		*/
		
		// Calculate coords and pan.
		y_off = (height - (y / y_trans)) - 35;
		x_off = (x / x_trans);
		
		var zoom_level = 3;
		
		// Depending what level the names are, we may need to adjust pan-to zoom and transformation constants.
		if(key_ == "nn" || key_ == "no"){
			
			zoom_level = 4;
			x_off = (x / 15.32);
		}
		// Set the custom marker.
		
		currentMarker = L.marker([y_off, x_off], {icon: bloodhoundIcon});
		
		if(current_view == "near"){
			
			map.setView([y_off, x_off], zoom_level);
			// currentMarker.addTo(map);
		}
		else{
			
			mapOff.setView([y_off, x_off], zoom_level);
			// currentMarker.addTo(mapOff);
		}	
	}
});

function loadImages(data) {
	
	const TOTALNUMSELFIES = 68;
	var allRows = data.split(/\r?\n|\r/);

	for (var i = 1; i <= TOTALNUMSELFIES; i++) {
		
		var prev = i - 1;
		var next = (i + 1) % TOTALNUMSELFIES;
		if (prev === 0) { prev = TOTALNUMSELFIES; }

		/* what the user sees after click */
		$(".lightboxArea").append("<div id=\"imgSupersonicSelfie" + i + "\" class=\"lightbox\"></div>");

		/*previous button, image, message, exit button, next button */
		$(".lightbox#imgSupersonicSelfie" + i + "").append("<a href=\"#imgSupersonicSelfie" + prev + "\" class='previous'>&lt;</a>" + 
			"<a href=\"#_\"><img src=\"images/Selfies/SupersonicSelfie" + i + ".png\" alt=\"selfie\" /></a>" + 
			"<a href=\"#_\" class='exit'>&times;</a>" +
			"<a href=\"#imgSupersonicSelfie" + next + "\" class='next'>&gt;</a>");
	}
}
