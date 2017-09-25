// Preload all names on fin to view when browser loads
$(document).ready(function(){
    var namesIDMap = new Map();
    function getAllNames(){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://129.146.81.161/fin/?func_name=get_data",
            
            success: function(data){
                var names = JSON.stringify(data);
                var obj = $.parseJSON(names);
                var name_array = obj.NAME;
        
                // create names on fin
                for(var i = 0; i < name_array.length; i++){
                    $(".finNames").append("<div class='name' id='name"+ i +"'> &nbsp"
                            + name_array[i] + ", &nbsp</div>");
                    // add to namesIDMap
                    namesIDMap.set(name_array[i], i);
                }
                console.log(namesIDMap);
                console.log(name_array.length);
                console.log(namesIDMap.size);
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
        $(".namesHolder").css({transform: 'scale(.2)'}, 'top:0; left:0;'); 
    }
}



// calc % difference between center coord (x,y) and name div (x,y)
function calcOffset(currentID) {
    x = $("#name" + currentID).position().left;
    y = $("#name" + currentID).position().top;
    
    percentLeft = x/$(".name_area").width() * 100;
    percentTop = y/$(".name_area").height() * 100;
   
    xDiff = 50 - percentLeft;
    yDiff = 50 - percentTop;
    
    return [xDiff, yDiff];
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
    $(".namesHolder").css({transform: 'scale(1)' }); 
    
    searchResults = names.NAME;           
    var currentID;
                
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
            
            // reset position of fin on another click and panning
            reset();
            
            var selectedName = $(this).text();
            alert(selectedName);
            currentID = namesIDMap.get(selectedName);
            alert("name: "+ selectedName+ ", id: "+ currentID);
                        
            // calc difference between center coord (x,y) and name div (x,y)
            offset = calcOffset(currentID);
            console.log("(x,y)%: " +offset[0]+ ", " +offset[1]);
                        
            // translate name to center
            $(".namesHolder").css({transform: 'scale(5) translate('+ xDiff +'%,'+ yDiff +'%)'});
        });
                    
                    
    } else if (searchResults.length === 1) {
        // calc difference between center coord (x,y) and name div (x,y)
        currentID = namesIDMap.get(searchResults[0]);
        offset= calcOffset(currentID);
        console.log("(x,y)%: " +offset[0]+ ", " +offset[1]);
                    
        // translate the name to center
        $(".namesHolder").css({transform: 'scale(5) translate('+ xDiff +'%,'+ yDiff +'%)'});
                    
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
