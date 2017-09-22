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
                $(".finNames").append("<div class='name' id='"+name_array[i]+"'>" + name_array[i] + ", &nbsp</div>");
                }
            }
        });
    }

getAllNames();
    

/** Draggable fin and names **/
$( function() {
    $( "#draggable" ).draggable();
} );

    /* This is for the search bar, selecting only the names that matter. */
	$("#search_names").submit(function(e){
		
                e.preventDefault();
                $(".namesHolder").css({transform: 'scale(1)'});
                $("#overlay").hide();
                $("#greeting").hide();
                $(".namesScrollBar").remove();
                
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

		searchResults = names.NAME;
                
                if (searchResults.length > 1) {
                    $(".name_area").append("<div class='namesScrollBar' id='scrollBarStyle'></div>");
                    $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
                    $(".namesScrollBar").append("<ul class='searchList'>");
                    for (var i = 0; i < searchResults.length - 1; i++) {
                        $(".searchList").append("<a id='nameLink' href='#'><li class='listBorder"+ i +"'>" + searchResults[i] + "</li></a>");
                    }
                    
                    $('li[class^="listBorder"]').on('click', function(){
                        selectedName = $(this).text();
                        $(".namesHolder").css({transform: 'scale(10)'});
                    });
                
                } else if (searchResults.length === 1) {
                    //go straight to the name in the canvas
                } else {
                    alert("No results found");
                }

                
	});           
                
    function loadImages() {
        const TOTALNUMSELFIES = 68;
       
        for (var i = 1; i <= TOTALNUMSELFIES; i++) {
            var thumbnailContainer = "<a href=\"#img" + i +  "\"><img id='selfie' src='images/Selfies/" + i + ".png' alt='selfie' /></a>";
            
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
            $(".lightbox#img" + i + "").append("<a href=\"#_\"><img src=\"images/Selfies/" + i + ".png\" alt=\"selfie\" /></a>");
            /* exit button */
            $(".lightbox#img" + i + "").append("<a href=\"#_\" class='exit'>&times;</a>");
            /* next button*/
            $(".lightbox#img" + i + "").append("<a href=\"#img" + next + "\" class='next'>&gt;</a>");
        }

    }
loadImages();

});
