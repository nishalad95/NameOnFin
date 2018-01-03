var contactid = null;
var current_view = "near";

// Transformation factor for intrisic image size to leaflet image size
var x_trans = 12.28;
var y_trans = 10.864;
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



$(document).ready(function () {


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
				


	// The map object the tile layers are drawn onto.
	var map = L.map('mapid', {
		crs: L.CRS.Simple,
		minZoom: -1,
        	maxZoom: 4,
		zoomControl: false,

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

	

	var bloodhoundIcon = L.icon({
		iconUrl: 'custom_marker.png',
		iconSize:     [200, 100], 
		iconAnchor:   [100, 50]
	});
	
	
	$("#tab").tabs();

	addImagesToMap();
	
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
	
	}



	// Show middle of map on page load (y, x, zoomLevel)
	map.setView([imageHeight / 2, imageWidth / 2], -1);

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
	

		} else{


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
						$(".name_area").append("<div class='namesScrollBar' id='accordion'></div>");
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
							yOffset = height - (y / y_trans);
							xOffset = x / x_trans;
							sBuilder += "<a id='nameLink' href='#'><li class='listItem' id='res_" + key + "_" + yOffset + "_" + xOffset + "'>" + name + "</li></a>";
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


					} else if(count == 1){
					
						coords = data[0].coord;
						coords = coords.split(",");
						x = coords[0];
						y = coords[1];
						yOffset = height - (y / y_trans);
						xOffset = x / x_trans;
						map.setView([yOffset, xOffset], 3);
						L.marker([yOffset - 10, xOffset], {icon:bloodhoundIcon}).addTo(map);
					
					} else{
					
						alert("Sorry, no results were found.");
					}
				
				
					$('.listItem').on('click', function(){
					
						var info = $(this).attr("id").split("_");
						// KEY INFORMATION IS ALSO NEEDED TO IMPLEMENTED
						y = info[2];
						x = info[3];
						map.setView(y, x, 3);
						L.marker([y - 10, x], {icon:bloodhoundIcon}).addTo(map);

					});

	
				}
			});
		

    	});

	

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
			"<div class='selfieMessage'>" + allRows[i-1] + "</div> " +
			"<a href=\"#_\" class='exit'>&times;</a>" +
			"<a href=\"#imgSupersonicSelfie" + next + "\" class='next'>&gt;</a>");
	}
}
