var contactid = null;
var counter = 0;

var current_view = "near";
var currentZoom = 0;

function setup_slider() {
	$('#lightSlider').lightSlider({
        item:4,
        loop:false,
        slideMove:1,
        responsive : [{	breakpoint:800,
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

}



$(document).ready(function () {


	$("#backgroundImage").on('click', function(e) {
	
		if (e.pageX <= 25 && e.pageY <= 25) {
			alert("This site was developed by Nisha Lad & Chris Wing :-)");
		}
	});

	// hide the off side 
	$(".off").hide();



    window.setTimeout("init()", 5);


    $.ajax({	
		url: 'SelfieMessages.csv',
		dataType: 'text',
		async: true,
		success: function (e){
			loadImages(e);
		}
    });


    window.setTimeout("setup_slider()", 5);
				
	
    $("#Flip").on("click", function(){
		
	if(current_view == "near"){
	

	} else{


	}
    });	


    
    $("#recenter").click(function () {
	  
		currentZoom = 0;
		searched = false;
		resetPosition();
		currentZoom = 0;

    });
  



    $("#search_names").submit(function(e){
	  
	// show fin and names when a name is searched
	e.preventDefault();
	$("#overlay").hide();
	$("#greeting").hide();
	$(".namesScrollBar").remove();
	$(".wrapper").show();
	searched = true;
	current_zoom = 1;
	counter = 0;
	
	var data = $("#search_names").serializeArray().reduce(function(obj, item){
		   obj[item.name] = item.value;
		   return obj;
	}, {});


	var searchTerm = data["name"];
	
		$.ajax({
			
			url: "PHP/search.php?term=" + searchTerm,
			type: "POST",
			asyn: false,
			dataType: "json",
			success: function(data){
				
				var count = data.length
				
				if(count > 1){
					
					// create names panel
					$(".name_area").append("<div class='namesScrollBar' id='accordion'></div>");
					$(".namesScrollBar").append("<div class='searchQuery' id='titleHeader'> Showing Results For: " + searchTerm + "</div>" +
						"<div><ul class='searchList'></ul></div>");
					
					var sBuilder = "";
					for(var i = 0; i < count; i++){
						
						var id = data[i].id;
						var name = data[i].name;
						var key = data[i].key_;
						
						sBuilder += "<a id='nameLink' href='#'><li class='listItem' id='res_" + key + id + "'>" + name + "</li></a>";
					}
					
					$(".searchList").append(sBuilder);
				
					var state = $("#accordion").accordion({
						collapsible: true,
						autoHeight: true,
						heightStyle: "content",
						refresh: true,
						icons: {"header": "ui-icon-circle-plus", "activeHeader": "ui-icon-circle-minus"}
					});
					$("#accordion").accordion("option", state);


				} else if(count == 1){
					
					contactid = "contact_" + data[0].key_ + data[0].id;
					
					var key = data[0].key_;
					
					removeBorder();
					changeView(key);
					contSearch(contactid);
				} else{
					
					alert("Sorry, no results were found.");
				}
				
				resetPosition();

				$('.listItem').on('click', function(){
					
					resetPosition();
					
					counter = 0;
					currentZoom = 0;
					contactid = "contact_" + $(this).attr("id").replace("res_", "");
					
					var pre_key = contactid.split("_");
					var key = pre_key[1].slice(0, 2);
					
					removeBorder();
					
					changeView(key);
					contSearch(contactid);
				});
	
			}
		});
		

    });
  



});




function init() {
	

}



function resetPosition() {
	
}



function removeBorder() {
	
}



function createBorder(contactid) {

}



var searched = false;

function contSearch(contactid){
			
	if (searched){
		counter = 1;
		createBorder(contactid);
		$("#zoom-in").click();
		searched = true;
	}
}





function loadImages(data) {
	
	const TOTALNUMSELFIES = 68;
	var allRows = data.split(/\r?\n|\r/);

	for (var i = 1; i <= TOTALNUMSELFIES; i++) {
		
		var prev = i - 1;
		var next = (i + 1) % TOTALNUMSELFIES;
		if (prev === 0) { prev = TOTALNUMSELFIES; }

		/* what the user sees after click */
		$(".lightboxArea").append("<div id=\"imgSupersonicSelfie" + i + "\" class=\"lightbox\"></div>");

		/*previous button, image, message, exit button, next button */
		$(".lightbox#imgSupersonicSelfie" + i + "").append("<a href=\"#imgSupersonicSelfie" + prev + "\" class='previous'>&lt;</a>" + 
			"<a href=\"#_\"><img src=\"images/Selfies/SupersonicSelfie" + i + ".png\" alt=\"selfie\" /></a>" + 
			"<div class='selfieMessage'>" + allRows[i-1] + "</div> " +
			"<a href=\"#_\" class='exit'>&times;</a>" +
			"<a href=\"#imgSupersonicSelfie" + next + "\" class='next'>&gt;</a>");
	}
}
