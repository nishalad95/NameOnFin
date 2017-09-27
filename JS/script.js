// Preload all names on fin to view when browser loads
$(document).ready(function(){
    var current_zoom = 1;
    var max_zoom = 16;
    var min_zoom = 1;
    var contactid;
    
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

var contain = $("#dragArea")[0];
var draggable = $("#draggable")[0];

function getDragBox() {
    var c = contain.getBoundingClientRect();
    var d = draggable.getBoundingClientRect();
    return [
        c.right - d.width,
        c.bottom - d.height,
        Math.max(c.left, c.right-d.width),
        Math.max(c.top, c.bottom-d.height)
    ];
}

function setDragableElement() {
    //console.log(getDragBox());
    $("#draggable").draggable({
        containment: getDragBox()
    });
}
setDragableElement();

/*

$(function() {
    //$(".name_area").css('width', $(".name_area").width() * current_zoom);
    //$(".name_area").css('height', $(".name_area").height() * current_zoom);
    $("#draggable").draggable();
} );
*/

$("#zoom-in").click(function() {
    if (current_zoom <= max_zoom){
        current_zoom *= 2.0;
        $(".namesHolder").css({transform: 'scale(' + current_zoom +')'});
        setDragableElement();
    }
});

$("#zoom-out").click(function() {
    if (current_zoom > min_zoom){
        current_zoom /= 2.0;
        $(".namesHolder").css({transform: 'scale(' + current_zoom +')'}); 
        setDragableElement();
    }
});

/** zoom buttons **/
function zoomIn(contactid){
    var x = $("#" + contactid).position().left + '%';
    var y = $("#" + contactid).position().top + '%';
    if (current_zoom <= max_zoom){
        current_zoom *= 2.0;
        alert(current_zoom);
        $(".namesHolder").css({transform: 'scale(' + current_zoom +')', transformOrigin: x, y}); 
    }
};

function zoomOut(contactid){  
    var x = $("#" + contactid).position().left + '%';
    var y = $("#" + contactid).position().top + '%';
    if (current_zoom > min_zoom){
        current_zoom /= 2.0; 
        $(".namesHolder").css({transform: 'scale(' + current_zoom +')', transformOrigin: x, y});      
    }
};


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

/*
// calc % difference between center coord (x,y) and name div (x,y)
function calcOffset(currentID) {
    var x = $("#" + currentID).position().left;
    var y = $("#" + currentID).position().top;
    
    var percentLeft = x/$(".name_area").width() * 100;
    var percentTop = y/$(".name_area").height() * 100;
   
    var xDiff = 50 - percentLeft;
    var yDiff = 50 - percentTop;
    
    return [xDiff, yDiff];
}
*/

// translate name to center 
function translateName(contactid) {
    //$(".namesHolder").css({transform: 'translate('+ offset[0]+'%,'+ offset[1]+'%)'});
    $("#" + contactid).css('box-shadow', 'inset 0 0 5em #49250e');
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
            contactid = "contact_"+$(this).attr("id").replace("res_", "");
            $("#zoom-out").click(zoomOut(contactid));
            $("#zoom-in").click(zoomIn(contactid));
            removeBorder();                 
            translateName(contactid);
        });
                    
    } else if (searchResults.length === 1) {
        contactid = "contact_" + searchResultsID[0];
        $("#zoom-out").click(zoomOut(contactid));
        $("#zoom-in").click(zoomIn(contactid));
        removeBorder();           
        translateName(contactid);
        
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
