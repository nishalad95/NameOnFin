// Preload all names on fin to view when browser loads
$(document).ready(function(){
    var current_zoom = 1;
    const MAXZOOM = 2;
    const MINZOOM = 1;
    const SCALEFACTOR = 2;
    var contactid = null;
    var counter = 0;
    
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
                    $(".finNames").append("<div class='name' id='contact_"+ids_array[i]+"'> &nbsp;"
                            + name_array[i] + ", &nbsp;</div>");
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
    var x1 = c.right - d.width;
    var y1 = c.bottom - d.height;
    
    return [
        x1,
        y1,
        c.left,
        c.top
    ];
}

function setDragableElement() {
    console.log(getDragBox());
    $("#draggable").draggable({
        containment: getDragBox()
    });
}
setDragableElement();


$("#zoom-in").click(function() {
    if (contactid === null) {
        if (current_zoom <= MAXZOOM){
            current_zoom *= SCALEFACTOR;
            $(".namesHolder").css({transform: 'scale(' + current_zoom +')'});
            setDragableElement();
            counter += 1;
        }
    } else {
        var x = $("#" + contactid).position().left;
        var y = $("#" + contactid).position().top;
        
        var percentX = x/($(".namesHolder").width()* Math.pow(SCALEFACTOR, counter)) * 100;
        var percentY = y/($(".namesHolder").height()* Math.pow(SCALEFACTOR, counter)) * 100;
        
        percentX = percentX + '%';
        percentY = percentY + '%';
        var origin = percentX + ' ' + percentY;
        
        if (current_zoom <= MAXZOOM){
            current_zoom *= SCALEFACTOR;
            alert(origin);
            $(".namesHolder").css({transform: 'scale(' + current_zoom + ')', transformOrigin: ' ' + origin + ' '});
            setDragableElement();
            counter += 1;
        }
    }

});

$("#zoom-out").click(function() {
        if (current_zoom > MINZOOM){
            current_zoom /= SCALEFACTOR;
            $(".namesHolder").css({transform: 'scale(' + current_zoom +')'}); 
            setDragableElement();
            counter -= 1;
        } 
});



// reset position of fin on another click and panning
function resetPosition() {
    $(".namesHolder").css('top', 0);
    $(".namesHolder").css('left', 0);
    $(".namesHolder").css({transform: 'scale(1)'});
}

function removeBorder() {
        resetPosition();
        $(".name").css('box-shadow', 'none');
}


// translate name to center 
function createBorder(contactid) {
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
    current_zoom = 1;
    counter = 0;
                
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

    resetPosition();
    
    searchResults = names.NAME;           
    searchResultsID = names.ID;           
    
    if (searchResults.length > 1) {
        // create names panel
        $(".name_area").append("<div class='namesScrollBar' id='panel'></div>");
        $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
        $(".namesScrollBar").append("<ul class='searchList'>");
        
        for (var i = 0; i < searchResults.length - 1; i++) {
            $(".searchList").append("<a id='nameLink' href='#'><li class='listBorder' \n\
                    id='res_"+searchResultsID[i]+"'>" + searchResults[i] + "</li></a>");
        }
        resetPosition();
        
        $('.listBorder').on('click', function(){
            resetPosition();
            current_zoom = 1;
            counter = 0;
            contactid = "contact_"+$(this).attr("id").replace("res_", "");
            removeBorder();                 
            createBorder(contactid);
        });
                    
    } else if (searchResults.length === 1) {
        contactid = "contact_" + searchResultsID[0];
        removeBorder();           
        createBorder(contactid);
        
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