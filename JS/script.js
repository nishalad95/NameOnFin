var contactid = null;

// Transformation factor for intrisic image pixel size to leaflet image size
var x_trans = 16; 
var y_trans = 16;
// Height and width of leaflet image in pixels
var imageHeight = 1000;
var imageWidth = 1000;
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
	
	// Opera browser adjustments
	var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	
	if(isOpera){
    		$("#overlay").css('margin','-14% 0% 0% 0%');
	}


    window.setTimeout("setup_slider()", 5);				
	
	$("#tabs").tabs({});
	
	var map = L.map('map', {
			crs: L.CRS.Simple,
			minZoom: 0,
			maxZoom: 5,
			zoomControl: false,

	});

	
	addImagesToMap();
	
	function addImagesToMap() {
		
		var width = 0, height = 0, inc = 0;
		var counter, bounds, image1, image2, path;
				
		map.eachLayer(function (layer) {
			map.removeLayer(layer);
		}); 
	
		for(x = 0; x < 10; x++){	
			
			height = 0;
			inc += 1;
		
			for(var y = 40; y >= 0; y -= 10){	
		
				counter = y + inc;
				bounds = [[height, width], [height + 100, width + 100]];
								
				path = "leaflet/" + current_view + "_side/master_" + current_view + "_";
					
				if (counter < 10) { path += "0";}
					
				path += counter  + ".png";
				image = L.imageOverlay(path, bounds).addTo(map);
				counter -= 1;
				height += 100;
					
			}		
			width += 100;
		}
		map.setView([imageHeight / 2, imageWidth / 2], 0);
	}
	
	
	
	
    // change zoom level of fin depending on device 
	window.addEventListener('resize', function(event){
		
		var width = document.documentElement.clientWidth;
		// phones are less than 768 pixels wide
		if (width < 768) {
			map.setZoom(4);
		}
	});
	
	$('#zoom-in').click(function(){ map.setZoom(map.getZoom() + 1); });
	$('#zoom-out').click(function(){ map.setZoom(map.getZoom() - 1); });
	
	
	$('#Flip').click(function(){
		if (current_view == "near") {
			current_view = "off";
			addImagesToMap();

		} else {
			current_view = "near";
			addImagesToMap();
		}
	});

	
	$("#recenter").click(function () { map.setView([imageHeight/2, imageWidth/2], 0); });
	map.setView([imageHeight / 2, imageWidth / 2], 0);
	$(".leaflet-control-attribution").hide();

	
	var southWest = L.latLng(0, 0), northEast = L.latLng(500, 1000);
	var bounds = L.latLngBounds(southWest, northEast);
	map.setMaxBounds(bounds);
	
	
	map.on('drag', function() {
    		map.panInsideBounds(bounds, { animate: false });
	});

	


	// Add the upcoming names in the 2nd tab
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
							current_view = "near";
							addImagesToMap();
						}
					}
					else{
						
						// Name belongs on off side.
						if(current_view != "off"){	
							current_view = "off";
							addImagesToMap();
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
							// change to near side	
							current_view = "near";
							addImagesToMap();
						}
					}
					else{
						
						// Name belongs on off side.
						if(current_view != "off"){
							// We must change to near side.
							current_view = "off";
							addImagesToMap();
						}
					}
					panToName(x, y, key_);
				});				
			}
		});
	});

	function panToName(x, y, key_){
		
		y_off = ((imageHeight / 2) - (y / y_trans));
		x_off = (x / x_trans);		
		var zoom_level = 3;
		
		if(key_ == "nn" || key_ == "no"){			
			zoom_level = 7;
		}
		map.setView([y_off, x_off], zoom_level);

	}
	
	
});



