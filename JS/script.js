// preload all names on fin to view when browser loads
$(document).ready(function(){
    var namesIDMap = {};
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
                    $(".finNames").append("<div class='name' id='name"+i+"'>" + name_array[i] + ", &nbsp</div>");
                    // add to namesIDMap
                    namesIDMap[name_array[i]] =  i;
                }
            }
        });
    }

getAllNames();
    

/** Draggable fin and names **/
$( function() {
    $("#draggable").draggable();
} );

    /* This is for the search bar, selecting only the names that matter. */
	$("#search_names").submit(function(e){
		
                e.preventDefault();
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
                $(".namesHolder").css({transform: 'scale(1)'});
                var x, y, currentID, percentLeft, percentTop, xDiff, yDiff;
                
                
                if (searchResults.length > 1) {
                    $(".name_area").append("<div class='namesScrollBar' id='panel'></div>");
                    $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
                    $(".namesScrollBar").append("<ul class='searchList'>");
                    
                    for (var i = 0; i < searchResults.length - 1; i++) {
                        $(".searchList").append("<a id='nameLink' href='#'><li class='listBorder"+ i +"'>" + searchResults[i] + "</li></a>");
                    }
                    
                    $('li[class^="listBorder"]').on('click', function(){
                        var selectedName = $(this).text();
                        currentID = namesIDMap[selectedName];
                        
                        // calc difference between center coord (x,y) and name div (x,y)
                        x = $("#name" + currentID).position().left;
                        y = $("#name" + currentID).position().top;
                        percentLeft = x/$(".name_area").width() * 100;
                        percentTop = y/$(".name_area").height() * 100;
                        console.log("x is: ", x);
                        console.log("y is: ", y);
                        console.log("x% is: ", percentLeft);
                        console.log("y% is: ", percentTop);
                        
                        xDiff = 50 - percentLeft;
                        yDiff = 50 - percentTop;
                        
                        console.log("xDiff: ", xDiff);
                        console.log("yDiff: ", yDiff);
                        
                        // translate the name to center
                        $(".namesHolder").css({transform: 'scale(2) translate('+xDiff+'%,'+yDiff+'%)'});
                        x = .0;
                        y = .0;
                    });
                    
                    
                } else if (searchResults.length === 1) {
                    
                    // calc difference between center coord (x,y) and name div (x,y)
                    currentID = namesIDMap[searchResults];
                    x = $("#name" + currentID).position().left;
                    y = $("#name" + currentID).position().top;
                    percentLeft = x/$(".name_area").width() * 100;
                    percentTop = y/$(".name_area").height() * 100;
                    xDiff = 50 - percentLeft;
                    yDiff = 50 - percentTop;
                    
                    // translate the name to center
                    $(".namesHolder").css({transform: 'scale(5) translate('+xDiff+'%,'+yDiff+'%)'});
                    
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
