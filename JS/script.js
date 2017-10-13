var current_zoom = 1;
const MAXZOOM = 20;
const MINZOOM = 1;
const SCALEFACTOR = 5;
var contactid = null;
var counter = 0;

function ini() {
               
               $(".panzoom").css("visibility","hidden");
               $(".panzoom-elements").panzoom();
               $("a.panzoom-elements").panzoom({
               minScale: 0
               });

               $(".panzoom").panzoom({
                 /*$zoomIn: $("#zoom-in"),
                 $zoomOut: $("#zoom-out"),*/
                 contain: "invert",
                 minScale: 1
               }).panzoom("zoom");

               $(".panzoom").css("visibility","visible");
}

$(document).ready(function(){
    
    window.setTimeout("getAllNames()", 5);
    
    
    $("#zoom-in").click(function() {
                              
    if (contactid === null) {
        if (current_zoom < MAXZOOM){
            current_zoom *= SCALEFACTOR;
            $(".panzoom").css({transform: 'scale(' + current_zoom +')'});
            counter += 1;
        }
    } else {
        var x = $("#" + contactid).position().left;
        var y = $("#" + contactid).position().top;
        
        var percentX = x/($(".panzoom").width()* Math.pow(SCALEFACTOR, counter)) * 100;
        var percentY = y/($(".panzoom").height()* Math.pow(SCALEFACTOR, counter)) * 100;
        
        percentX = percentX + '%';
        percentY = percentY + '%';
        var origin = percentX + ' ' + percentY;
        
        if (current_zoom <= MAXZOOM){
            current_zoom *= SCALEFACTOR;
            $(".panzoom").css({transform: 'scale(' + current_zoom + ')', transformOrigin: ' ' + origin + ' '});
            counter += 1;
        }
    }

    });

    $("#zoom-out").click(function() {
        if (current_zoom > MINZOOM){
            current_zoom /= SCALEFACTOR;
            $(".panzoom").css({transform: 'scale(' + current_zoom +')'}); 
            counter -= 1;
        } 
    });
    
    // reset position of fin on another click and panning
    function resetPosition() {
        $(".panzoom").css('top', 0);
        $(".panzoom").css('left', 0);
        $(".panzoom").css({transform: 'scale(1)'});
        counter = 0;
    }


    $("#recenter").click(function () {
        resetPosition();
    });
    
    function removeBorder() {
        resetPosition();
        $(".name").css('box-shadow', 'none');
    }


    // add border to highlight name
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
        $(".name_area").append("<div class='namesScrollBar' id='accordion'></div>");
        $(".namesScrollBar").append("<div class='searchQuery'>Results for: " + searchTerm +"</div>");
        $(".namesScrollBar").append("<div><ul class='searchList'></ul></div>");
        
        for (var i = 0; i < searchResults.length - 1; i++) {
            $(".searchList").append("<a id='nameLink' href='#'><li class='listItem' \n\               id='res_"+searchResultsID[i]+"'>" + searchResults[i] + "</li></a>");
        }
        resetPosition();
        
        $('.listItem').on('click', function(){
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
    
    $.ajax({
    url: 'SelfieMessages.csv',
    dataType: 'text'
    }).done(loadImages);
    
    $('#lightSlider').lightSlider({
        item:4,
        loop:false,
        slideMove:2,
        easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        speed:600,
        responsive : [
            {
                breakpoint:800,
                settings: {
                    item:3,
                    slideMove:1,
                    slideMargin:6
                  }
            },
            {
                breakpoint:480,
                settings: {
                    item:2,
                    slideMove:1
                  }
            }
        ]
    }); 


});
      
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
                                             var ht = " ";     
                                             
                                             // create names on fin
                                             for(var i = 0; i < name_array.length; i++){
                                                            ht += "<div class='name' id='contact_"+ids_array[i]+"'>&nbsp;" + name_array[i] + ", &nbsp;</div>";
                                             }
                                             $(".finNames").append(ht);
                                             
                                             window.setTimeout("ini()", 5);
                                             
                   

                              }
               });
}
         
      
        
function loadImages(data) {
               const TOTALNUMSELFIES = 68;
               var allRows = data.split(/\r?\n|\r/);
   
   
               for (var i = 1; i <= TOTALNUMSELFIES; i++) {
                              
                              // var thumbnailContainer = "<a href=\"#img" + i + "\"><img id='selfie' src='images/Selfies/" + i + ".png' alt='selfie' /></a>";
                              
                              var prev = i - 1;
                              var next = (i + 1) % TOTALNUMSELFIES;
                              if (prev === 0) { prev = TOTALNUMSELFIES; }
                              
                              /* what the user sees after click */
                              $(".lightboxArea").append("<div id=\"img" + i + "\" class=\"lightbox\"></div>");
                              
                              /*previous button*/
                              $(".lightbox#img" + i + "").append("<a href=\"#img" + prev + "\" class='previous'>&lt;</a>");
                              
                              /* lightbox image */
                              $(".lightbox#img" + i + "").append("<a href=\"#_\"><img src=\"images/Selfies/" + i + ".png\" alt=\"selfie\" /></a>");
                              $(".lightbox#img" + i + "").append("<div class='selfieMessage'>" + allRows[i-1] + "</div> ");
               
                              /* exit button */
                              $(".lightbox#img" + i + "").append("<a href=\"#_\" class='exit'>&times;</a>");
                              
                              /* next button*/
                              $(".lightbox#img" + i + "").append("<a href=\"#img" + next + "\" class='next'>&gt;</a>");
               }
}
/*
$(function(){
               var scroller = $('#scroller div.innerScrollArea');
               var scrollerContent = scroller.children('ul');
               
               scrollerContent.children().clone().appendTo(scrollerContent);
               var curX = 0;
               
               scrollerContent.children().each(function(){
                              var $this = $(this);
                              $this.css('left', curX);
                              curX += $this.width();
               });
               
               var fullW = curX / 2;
               var viewportW = scroller.width();

               // Scrolling speed management
               var controller = {curSpeed:0, fullSpeed:1.5};
               var $controller = $(controller);
               
               var tweenToNewSpeed = function(newSpeed, duration)
               {
                              if (duration === undefined)
                                             duration = 600;
                              $controller.stop(true).animate({curSpeed:newSpeed}, duration);
               };

               // Pause on hover
               scroller.hover(function(){
                              tweenToNewSpeed(0);
               }, function(){
                              tweenToNewSpeed(controller.fullSpeed);
               });

               // Scrolling management; start the automatical scrolling
               var doScroll = function()
               {
                              var curX = scroller.scrollLeft();
                              var newX = curX + controller.curSpeed;
                              if (newX > fullW*2 - viewportW)
                                             newX -= fullW;
                              scroller.scrollLeft(newX);
               };
               setInterval(doScroll, 20);
               tweenToNewSpeed(controller.fullSpeed);
});
*/