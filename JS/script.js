// Preload all names on fin to view when browser loads
$(document).ready(function(){
    function getAllNames(){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://129.146.81.161/fin/?func_name=get_data",
            
            success: function(data) {
                var names = JSON.stringify(data);
                var obj = $.parseJSON(names);
                var name_array = obj.NAME;
                
        
                // create names on fin
                for(var i = 0; i < name_array.length; i++){
                    var concatName = name_array[i].split(" ").join("");
                    concatName = concatName.replace(/^[^a-z]+|[^\w:.-]+/gi, "");
                    $(".finNames").append("<div class='name' id='"+ concatName +"'> &nbsp"
                            + name_array[i] + ", &nbsp</div>");
                }
            }
        });
    }

getAllNames();
    

/** Draggable fin and names **/
$( function() {
    $("#draggable").draggable();
} );


// reset position of fin on another click and panning
function reset() {
    if ($(".namesHolder").position().left !== 0 || $(".namesHolder").position().top !== 0) {
        $(".namesHolder").css('top', 0);
        $(".namesHolder").css('left', 0);
    }
}



// calc % difference between center coord (x,y) and name div (x,y)
function calcOffset(currentID) {
    console.log("#" + currentID);
    var x = $("#" + currentID).position().left;
    var y = $("#" + currentID).position().top;
    
    var percentLeft = x/$(".name_area").width() * 100;
    var percentTop = y/$(".name_area").height() * 100;
    
    console.log("(x,y)% (" + percentLeft + ", " + percentTop + ")");
   
    var xDiff = 50 - percentLeft;
    var yDiff = 50 - percentTop;
    
    return [xDiff, yDiff];
}


// translate name to center 
function translateName(offset) {
    console.log("offset%: " +offset[0]+ ", " +offset[1]);
    $(".namesHolder").css({transform: 'scale(5) translate('+ offset[0]+'%,'+ offset[1]+'%)'});
    //$("#" + selectedName).css = ('border', 'thick solid #0000FF');
}



/* Search bar function */
$("#search_names").submit(function(e){
		
    // show fin and names when a name is searched
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

    //reset fin each time search button is clicked
    reset();
    $(".namesHolder").css({transform: 'scale(1)'}); 
    
    searchResults = names.NAME;           
                
    if (searchResults.length > 1) {
        // create names panel
        $(".name_area").append("<div class='namesScrollBar' id='panel'></div>");
        $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
        $(".namesScrollBar").append("<ul class='searchList'>");
    
        // add search results to panel
        for (var i = 0; i < searchResults.length - 1; i++) {
            $(".searchList").append("<a id='nameLink' href='#'><li class='listBorder"
                    + i +"'>" + searchResults[i] + "</li></a>");
        }
        
        // for each name in panel, move fin to the name clicked
        $('li[class^="listBorder"]').on('click', function(){
            
            reset();            
            var selectedName = $(this).text().split(" ").join("");
            selectedName = selectedName.replace(/^[^a-z]+|[^\w:.-]+/gi, "");
            console.log("name: "+ selectedName);
            offset = calcOffset(selectedName);
            
            console.log("offset%: " +offset[0]+ ", " +offset[1]);
                        
            translateName(offset);
        });
                    
    } else if (searchResults.length === 1) {
        reset();
        var selectedName = searchResults[0].split(" ").join("");
        selectedName = selectedName.replace(/^[^a-z]+|[^\w:.-]+/gi, "");
        console.log("name: "+ selectedName);
        offset = calcOffset(selectedName);
        
        console.log("offset%: " +offset[0]+ ", " +offset[1]);
                    
        translateName(offset);
        
    } else {
        alert("No results found");
    }
            
});           
                
                
                
    function loadImages() {
        const TOTALNUMSELFIES = 68;
       
        for (var i = 1; i <= TOTALNUMSELFIES; i++) {
            var thumbnailContainer = "<a href=\"#img" + i + 
                    "\"><img id='selfie' src='images/Selfies/" + i + ".png' alt='selfie' /></a>";
            
            var prev = i - 1;
            var next = (i + 1) % 70;
            if (prev === 0) { prev = 70; }
        
            /* scrolling photo  */
            $(".innerScrollArea").append(thumbnailContainer);
            $(".innerScrollArea").append("&nbsp;");
            
            /* what the user sees after click */
            $(".lightboxArea").append("<div id=\"img" + i + "\" class=\"lightbox\"></div>");
            /*previous button*/
            $(".lightbox#img" + i + "").append("<a href=\"#img" + prev + 
                    "\" class='previous'>&lt;</a>");
            /* lightbox image */
            $(".lightbox#img" + i + "").append("<a href=\"#_\"><img src=\"images/Selfies/" + i + 
                    ".png\" alt=\"selfie\" /></a>");
            /* exit button */
            $(".lightbox#img" + i + "").append("<a href=\"#_\" class='exit'>&times;</a>");
            /* next button*/
            $(".lightbox#img" + i + "").append("<a href=\"#img" + next + 
                    "\" class='next'>&gt;</a>");
        }

    }
loadImages();

});
