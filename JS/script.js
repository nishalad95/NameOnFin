// Preload all names on fin to view when browser loads
$(document).ready(function(){
    var current_zoom = 1;
    var max_zoom = 16;
    var min_zoom = 1;
    
    var x2 = $("#finIMG").width() * 0.8;
    var y2 = $("#finIMG").height() * 0.8;
    var x1 = -1.0 * x2;
    var y1 = -1.0 * y2;
    alert(x1 + ", " + y1 + ", " + x2 + ", " + y2);
    
    function getAllNames(){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://129.146.81.161/fin/?func_name=get_data",
            
            success: function(data) {
                var names = JSON.stringify(data);
                var obj = $.parseJSON(names);
                var name_array = obj.NAME;
                var ids_array = obj.ID; 
                
                // create names on fin
                for(var i = 0; i < name_array.length; i++){
                    $(".finNames").append("<div class='name' id='contact_"+ids_array[i]+"'> &nbsp"
                            + name_array[i] + ", &nbsp</div>");
                }
            }
        });
    }

getAllNames();


/** zoom buttons **/
$("#zoom-in").click(function(){
    if (current_zoom <= max_zoom){
        current_zoom *= 2.0;
        x2 = $("#finIMG").width() * 0.8;
        y2 = $("#finIMG").height() * 0.8;
        x1 = -1.0 * x2;
        y1 = -1.0 * y2;
        alert(x1 + ", " + y1 + ", " + x2 + ", " + y2);
        $(".namesHolder").css({transform: 'scale(' + current_zoom +')', transformOrigin: 'inherit'});      
    }
});

$("#zoom-out").click(function(){           
    if (current_zoom > min_zoom){
        current_zoom /= 2.0; 
        alert(x1 + ", " + y1 + ", " + x2 + ", " + y2);
        $(".namesHolder").css({transform: 'scale(' + current_zoom +')', transformOrigin: 'inherit'});      
    }
});

    

/** Draggable fin and names **/
$( function() {  
    if (current_zoom > 1) {
        $(".nameHolder").css('cursor', 'move');
        $("#draggable").draggable();
    }
} );


// reset position of fin on another click and panning
function resetPosition() {
    if ($(".namesHolder").position().left !== 0 || $(".namesHolder").position().top !== 0) {
        $(".namesHolder").css('top', 0);
        $(".namesHolder").css('left', 0);
    }
    $(".namesHolder").css({transform: 'scale(1)'});
}

function removeBorder() {
        resetPosition();
        $(".name").css('box-shadow', 'none');
}


// calc % difference between center coord (x,y) and name div (x,y)
function calcOffset(currentID) {
    //console.log("#" + currentID);
    var x = $("#" + currentID).position().left;
    var y = $("#" + currentID).position().top;
    
    var percentLeft = x/$(".name_area").width() * 100;
    var percentTop = y/$(".name_area").height() * 100;
    //console.log("(x,y)% (" + percentLeft + ", " + percentTop + ")");
   
    var xDiff = 50 - percentLeft;
    var yDiff = 50 - percentTop;
    
    return [xDiff, yDiff];
}


// translate name to center 
function translateName(offset, selectedName) {
    //console.log("offset%: " +offset[0]+ ", " +offset[1]);
    $(".namesHolder").css({transform: 'translate('+ offset[0]+'%,'+ offset[1]+'%)'});
    $("#" + selectedName).css('box-shadow', 'inset 0 0 5em #49250e');
}



/* Search bar function */
$("#search_names").submit(function(e){
		
    // show fin and names when a name is searched
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
    var names = $.parseJSON($.ajax({
	url: "http://129.146.81.161/fin/?func_name=search&q=" + searchTerm,
	dataType: "JSON",
	async: false
    }).responseText);

    //reset fin each time search button is clicked
    resetPosition();
    
    searchResults = names.NAME;           
    searchResultsID = names.ID;           
    
    if (searchResults.length > 1) {
        // create names panel
        $(".name_area").append("<div class='namesScrollBar' id='panel'></div>");
        $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
        $(".namesScrollBar").append("<ul class='searchList'>");
    
        // add search results to panel
        for (var i = 0; i < searchResults.length - 1; i++) {
            $(".searchList").append("<a id='nameLink' href='#'><li class='listBorder" +
                    "dbid='"+ searchResultsID[i] +"' id='res_"+searchResultsID[i]+"'>" + searchResults[i] + "</li></a>");
        }
        resetPosition();
        // for each name in panel, move fin to the name clicked
        $('li[class^="listBorder"]').on('click', function(){
            resetPosition();
            var contact_id = "contact_"+$(this).attr("id").replace("res_", "");
            removeBorder(); 
            //console.log("name: "+ contact_id);
            offset = calcOffset(contact_id);
                                    
            translateName(offset, contact_id);
        });
                    
    } else if (searchResults.length === 1) {
        var contact_id = "contact_" + searchResultsID[0];
        removeBorder(); 
        //console.log("name: "+ contact_id);
        offset = calcOffset(contact_id);                       
        translateName(offset, contact_id);
        
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
