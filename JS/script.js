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
                $(".finNames").append("<div class='name' id='name"+i+"'>" + name_array[i] + ", &nbsp</div>");
                }
            }
        });
    }

getAllNames();
    

/** jquery draggable **/
$( function() {
    $( "#draggable" ).draggable();
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
	
		// This is the search results.. Here is the best bet for generating the panel.
		searchResults = names.NAME;
                
                if (searchResults.length > 1) {
                    $(".name_area").append("<div class='namesScrollBar' id='scrollBarStyle'></div>");
                    $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
                    $(".namesScrollBar").append("<ul class='searchList'>");
                    for (var i = 0; i < searchResults.length - 1; i++) {
                        $(".searchList").append("<a id='nameLink' href='#'><li class='listBorder'>" + searchResults[i] + "</li></a>");
                    }    
                } else if (searchResults.length === 1) {
                    //go straight to the name in the canvas
                } else {
                    alert("No results found");
                }
                
             
                
                /**
                // finSVG panning
                var img_ele = null, x_cursor = 0, y_cursor = 0, x_img_ele = 0, y_img_ele = 0;
                
                function start_drag() {
                    img_ele = this;
                    console.log('inside start_drag var img_ele set to : ' + this);
                    x_img_ele = window.event.clientX - document.getElementById('finIMG').offsetLeft;
                    y_img_ele = window.event.clientY - document.getElementById('finIMG').offsetTop;
                    console.log('start_drag : ' + 'x_img_ele:', x_img_ele, 'y_img_ele:', y_img_ele);
                }

                function stop_drag() {
                    console.log('stop drag');
                    img_ele = null;
                }

                function while_drag() {
                    console.log('while_drag: ', window.event);
                    var x_cursor = window.event.clientX;
                    var y_cursor = window.event.clientY;
                    if (img_ele !== null) {
                        img_ele.style.left = (x_cursor - x_img_ele) + 'px';
                        img_ele.style.top = ( window.event.clientY - y_img_ele) + 'px';
    
                        console.log('while_drag: ','x_cursor', x_cursor, 'x_img_ele', x_img_ele, 'y_cursor', y_cursor, 'y_img_ele', y_img_ele,'Image left and top', img_ele.style.left+' - '+img_ele.style.top);
                    }
                }

                $("#finIMG").on('mousedown', start_drag);
                $(".FinSVG").on('mousemove', while_drag);
                $(".FinSVG").on('mouseup', stop_drag);
                **/
	
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
