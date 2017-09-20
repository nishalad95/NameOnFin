// preload all names on fin to view when browser loads
$(document).ready(function(){
    function getAllNames(){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://129.146.81.161/fin/?func_name=get_data",
            
            success: function(data){
                var names = JSON.stringify(data);
                var obj = $.parseJSON(names);
                var name_array = obj.NAME;

                for(var i = 0; i < name_array.length; i++){
                    $(".name_area").append("<div id='name_'>" + name_array[i] + ", &nbsp</div>");
                }
            }
        });
    }

getAllNames();
    $("#search").submit(function(){
        var query = $("#search").serialize();
        query = query.split('=');
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://129.146.81.161/fin/?func_name=search&q=" + query[1],

            success: function(data){
                    var names = JSON.stringify(data);
                    var obj = $.parseJSON(names);
                    var name_array = obj.NAME;
                    for(var i = 0; i < name_array.length; i++){
                            $(".name_area").append("<div id='name_' style='z-index: 17;'>" + name_array[i] + "</div>");
                    }
            }
        });	
    });
    
    
    /* This is for the search bar, selecting only the names that matter. */
	$("#search_names").submit(function(){
		
                $("#overlay").style.display = "block";
                $("#greeting").style.display = "none";
                
		var data = $("#search_names").serializeArray().reduce(function(obj, item){
		
			obj[item.name] = item.value;
			return obj;
		}, {});
		
		var searchTerm = data["name"];
		
		var names = $.parseJSON($.ajax({
		
			url: "http://129.146.81.161/fin/?func_name=search&q=" + searchTerm,
			dataType: "JSON",
			async: false
		}).responseText);
	
		// This is the search results.. Here is the best bet for generating the panel.
		searchResults = names.NAME;
                
                alert(searchResults);
                
                if (searchResults.length > 1) {
                    $("#namesScrollBar").style.display = "block";
                } else if (searchResults.length === 1) {
                    //go straight to the name in the canvas
                } else {
                    alert("No results found");
                }
		
	
	});
    
 
        
    
    
    function loadImages() {
        const TOTALNUMSELFIES = 70;
       
        for (var i = 1; i <= TOTALNUMSELFIES; i++) {
            var thumbnailContainer = "<a href=\"#img" + i +  "\"><img id='selfie' src='images/Selfies/" + i + ".jpg' alt='selfie' /></a>";
            
            var prev = i - 1;
            var next = (i + 1) % 70;
            if (prev === 0) { prev = 70; }
        
            /* scrolling photo  */
            $(".innerScrollArea").append(thumbnailContainer);
            $(".innerScrollArea").append("&nbsp;");
            
            /* what the user sees after click */
            $(".lightboxArea").append("<div id=\"img" + i + "\" class=\"lightbox\"></div>");
            /*previous button*/
            $(".lightbox#img" + i + "").append("<a href=\"#img" + prev + "\" class='previous'>&lt;</a>");
            /* lightbox image */
            $(".lightbox#img" + i + "").append("<a href=\"#_\"><img src=\"images/Selfies/" + i + ".jpg\" alt=\"selfie\" /></a>");
            /* exit button */
            $(".lightbox#img" + i + "").append("<a href=\"#_\" class='exit'>&times;</a>");
            /* next button*/
            $(".lightbox#img" + i + "").append("<a href=\"#img" + next + "\" class='next'>&gt;</a>");
        }

    }
loadImages();

});
