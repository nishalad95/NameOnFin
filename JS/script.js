var contactid = null;
var current_view = "near";

var currentMarker = null;

var imageHeight = 1000;
var imageWidth = 2000;


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

	// hide the off side 
	$(".off").hide();


    	$.ajax({	
		url: 'SelfieMessages.csv',
		dataType: 'text',
		async: true,
		success: function (e){
			loadImages(e);
		}
    	});


    	window.setTimeout("setup_slider()", 5);
				
	

	$( function() {
		$("#tabs").tabs({
		});
  	} );




	// The map object the tile layers are drawn onto.
	var map = L.map('nearSide', {
		crs: L.CRS.Simple,
		minZoom: -1,
        	maxZoom: 4,
		zoomControl: false,

	});

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
	
	
	
	$('#zoom-in').click(function(){
          map.setZoom(map.getZoom() + 1)
        });


        $('#zoom-out').click(function(){
          map.setZoom(map.getZoom() - 1)
        });
	
	$("#tab").tabs();

	var data = addImagesToMap();
	
	var width = data[0];
	var height = data[1];
	
	function addImagesToMap() {
		
		var width = 0, height = 0, tmp = 0;
		
		var counter, bounds, image, path;
	
		for(x = 0; x < 10; x++){	
			
			height = 0;
			tmp += 1;
		
			for(var y = 90; y >= 0; y -= 10){	
		
				counter = y + tmp;
				bounds = [[height, width], [height + 100, width + 200]];
			
				path = "leaflet/slices/bloodhound_spliced__";			

				if (counter < 10){
					path += "0";
				}
				
				path += counter  + ".png";

				image = L.imageOverlay(path, bounds).addTo(map);	
				map.fitBounds(bounds);
				counter -= 1;
				height += 100;
			}
		
			width += 200;
		}

		return [width, height];
	
	}

	// The width and height of the image (total) being used.
	var img_h = 10864;
	var img_w = 24560;

	// This is the image width/ height divided by leaflet width/height.
	x_trans = img_w / width;
	y_trans = img_h / height;

	// Show middle of map on page load (y, x, zoomLevel)
	map.setView([imageHeight / 2, imageWidth / 2], 0);

	// Restrict dragging of fin image to bounds
	var southWest = L.latLng(0, 0), northEast = L.latLng(1000, 2000);
	var bounds = L.latLngBounds(southWest, northEast);
	map.setMaxBounds(bounds);
	
	map.on('drag', function() {
    	map.panInsideBounds(bounds, { animate: false });
	});

	$(".leaflet-control-attribution").hide();


	$("#recenter").click(function () {
		map.setView([imageHeight/2, imageWidth/2], 0);  
    });
  
	$("#Flip").on("click", function(){
	
		if(current_view == "near"){


		}
		else{


		}
	});	

	var state = $("#newNames").accordion({
		collapsible: true,
		autoHeight: true,
		heightStyle: "content",
		refresh: true,
		icons: {"header": "ui-icon-circle-plus", "activeHeader": "ui-icon-circle-minus"}
	});
	
	$("#newNames").accordion("option", state);

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
				
				if(count > 1){
				
					// create names panel
					$("#name_area").append("<div class='namesScrollBar' id='accordion'></div>");
					$(".namesScrollBar").append("<div class='searchQuery'> Showing Results For: " + searchTerm + "</div>" +
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
				else if(count = 1){
					
					// Coord data pulled from the database.
					var coords = data[0].coord;
					
					coords__ = coords.split(",");
					
					x = coords__[0];
					y = coords__[1];
					
					panToName(x, y);
					
				} 
				else{
					
					alert("Sorry, no results were found.");
				}

				$('.listItem').on('click', function(){
					
					/* This is where we handle names inside the results list being clicked. */
					
					var id_data = $(this).attr("id").replace("res_", "");
					
					var pre_key = id_data.split("_");
					
					var x = pre_key[1];
					var y = pre_key[2];
					
					panToName(x, y);
					
				});				
			}
		});
	

	});
	
	/*
		this function will pan the Leaflet view-port to the given xy coordinate.
		It will also check to see if there is already a marker added to the map, if there is it will delete it.
	*/
	function panToName(x, y){
		
		// If a map marker already exists.
		if(currentMarker != null){

			map.removeLayer(currentMarker);
		}

		// Here we calculate the coordinates to pan to.
		y_off = height - (y / y_trans);
		x_off = x / x_trans;

		// Pan to coords.
		map.setView([y_off, x_off], 3);

		currentMarker = L.marker([y_off - 10, x_off], {icon: bloodhoundIcon});
		currentMarker.addTo(map);
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
