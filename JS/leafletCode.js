$(document).ready(function () {
	
	// The map object the tile layers are drawn onto.
	var map = L.map('mapid', {
		
		crs: L.CRS.Simple,
		minZoom: 0,
        maxZoom: 10
	});
	
	var bloodhoundIcon = L.icon({
		
		iconUrl: 'custom_marker.png',

		iconSize:     [200, 100], // size of the icon
		iconAnchor:   [100, 50] // point of the icon which will correspond to marker's location
	});
	
	// Initial width/ height of the image.
	width = 0;
	height = 0;
	
	tmp = 0;
	
	for(x = 0; x < 10; x++){	
			
		height = 0;
		tmp += 1;
		
		for(var y = 90; y >= 0; y -= 10){	
			
			counter = y + tmp;
			
			// Here we calculate the bounds of each tile object.
			var bounds = [[height, width], [height + 100, width + 200]];
			
			var path = "";
			
			// Loac up each tile object.
			if (counter < 10){
				
				path = "leaflet/slices/bloodhound_spliced__0" + counter  + ".png";				
			}
			else{
				path = "leaflet/slices/bloodhound_spliced__" + counter  + ".png";	
			}
			var image = L.imageOverlay(path, bounds).addTo(map);
			
			map.fitBounds(bounds);
			
			counter -= 1;
			height += 100;
		}
		
		width += 200;
	}
	
	// Allows the middle of the map to be shown on page load.
	map.setView([height / 2, width / 2], 0);

	$(".leaflet-control-attribution").hide();
	
	/*
		The search function that pulls names from the database.
	*/
    $("#search_names").submit(function(e){
	  

		// Show fin and names when a name is searched
		e.preventDefault();

		searched = true;

		
		var data = $("#search_names").serializeArray().reduce(function(obj, item){
			   obj[item.name] = item.value;
			   return obj;
		}, {});

		var searchTerm = data["searchTerm"];
		
		$.ajax({
			
			url: "search_names.php?term=" + searchTerm,
			type: "POST",
			asyn: false,
			dataType: "json",
			success: function(data){
				
				var count = data.length
				
				if(count = 1){
					
					// Coord data pulled from the database.
					var coords = data[0].coord;
					
					coords__ = coords.split(",");
					
					x = coords__[0];
					y = coords__[1];
					
					// This is the image width/ height divided by leaflet width/height.
					x_trans = 12.28;
					y_trans = 10.864;
					
					// Here we calculate the coordinates to pan to.
					y_off = height - (y / y_trans);
					x_off = x / x_trans;
					
					// Pan to coords.
					map.setView([y_off, x_off], 3);

					L.marker([y_off - 10, x_off], {icon: bloodhoundIcon}).addTo(map);					
					
				} 
				else if (count > 1){
					
					alert(data);
					
				}else{
					
					alert("Sorry, no results were found.");
				}	
			}
		});
			
	});
});
