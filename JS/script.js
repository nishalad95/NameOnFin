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

	// Bind the click event to the body
	$("#backgroundImage").on('click', function(e) {
	
		if (e.pageX <= 25 && e.pageY <= 25) {
			alert("This site was developed by Nisha Lad & Chris Wing :-)");
		}
	});


	// Pre-load all names on near side
	loadData(current_view, "high");
	loadData(current_view, "low");
	
	// Pre-laod all names on off side
	loadData("off", "high");
	loadData("off", "low");
	
	// Only show one side at a time
	$(".off").hide();
	
	/*
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
		return p.toString() === "[object SafariRemoteNotification]";
	})(!window['safari'] || safari.pushNotification);

	if (isSafari) {
        alert('We have detected you are not using a supported browser. Please move to either Google Chrome or Mozilla Firefox.');
			document.write("<style>body { display:none }</style>");
  			window.location.replace("time-out.html");
    	}
	*/


    window.setTimeout("getAllNames()", 5);

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
			changeView("no");
			resetPosition();
		} else{
			changeView("nn");
			resetPosition();
		}
	});	

	
  	$("#zoom-in").on("click", function() {
		
		$(".se-pre-con").show();
		currentZoom += 0.15;
		
		settings = {
			targetsize: currentZoom,
			// scale content to screen based on their size
			// "width"|"height"|"both"
			scalemode: "both",
			duration: 1,
			easing: null,
			nativeanimation: false,
			// root element to zoom relative to
			root: $(".panzoom"),
			debug: false,
			animationendcallback: null,
			closeclick: false
		}

		if (contactid == null){
			$(".panzoom").zoomTo(settings);
		} else{
			$("#" + contactid).zoomTo(settings);
		}

		$(".se-pre-con").hide();

    	});

	$("#zoom-out").on("click", function() {
		
		//$(".se-pre-con").show();
		currentZoom -= 0.05;

		if (currentZoom < 0 || currentZoom == 0){
			
			searched = false;
			resetPosition();
			currentZoom = 0;
			return;
		}
		
		settings = {
			targetsize: currentZoom,
			// scale content to screen based on their size
			// "width"|"height"|"both"
			scalemode: "both",
			duration: 1,
			easing: null,
			nativeanimation: false,
			root: $(".panzoom"),//#dragArea"),
			debug: false,
			animationendcallback: null,
			closeclick: false
		}
		
		if(contactid != null){
			$("#" + contactid).zoomTo(settings);
		} else if (contactid == null){
			$(".panzoom").zoomTo(settings);
		}

		// $(".se-pre-con").hide();
    	});



  	$("#recenter").click(function () {
	  
		$(".se-pre-con").show();
		currentZoom = 0;
		searched = false;
		resetPosition();
		currentZoom = 0;
		$(".se-pre-con").hide();

  	});
  


  $("#search_names").submit(function(e){
	  
	$(".se-pre-con").show();
	
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
		
	$(".se-pre-con").hide();

  });
  


	function changeView(key){
		
		if(key == "nn" || key == "sc"){
			
			// 'near' side names
			if(current_view != "near"){
								
				current_view = "near";
				
				$('.panzoom').css("background-image", "url(images/FinVector2.png)");
				$('#left-image').css("shape-outside", "polygon(0% 0%, 0% 75%, 73% 0%)");
				$('#right-image').css("shape-outside", "polygon(100% 0%, 78% 100%, 100% 100%)");
							
				$(".off").hide();
				$(".near").show();
			}

		} else{
			
			// 'off' side names
			if(current_view != "off"){
				
				current_view = "off";
				
				$('.panzoom').css("background-image", "url(images/FinVector2Inverted.png)");
				$('#left-image').css("shape-outside", "polygon(0% 0%, 25% 100%, 0% 100%)");
				$('#right-image').css("shape-outside", "polygon(25% 0%, 100% 0%, 99% 80%)");
				
				$(".near").hide();
				$(".off").show();				
			}
		}
	}

});




function loadData(current_view, level){
	
	$.ajax({
		url: "PHP/" + level + "_loader.php?key_=" + current_view,
		type: "POST",
		dataType: "json",
		
		success: function(data){
			
			var count = data.length

			if(count > 1){
				
				sBuilder = "";
				for(var i = 0; i < count; i++){

					var id = data[i].id;
					var name = data[i].name;
					var key = data[i].key_;

					// Here is where we replace the big names on the page.					
					sBuilder += "<div class='name zzoomTarget' id='contact_" + key + "" + id + "'>" + name + "</div>&nbsp;";
				}

				// whitespace div addition for cross-browser compatibility
				var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
				if (!isChrome) {

					if (level == "high") {
						var offsetLeft, offsetRight, incLeft, incRight;
						var whitespace = "";

						if (current_view == "near") {
							
							offsetLeft = 38;
							offsetRight = 0;
							incLeft = -0.65;
							incRight = 0.15;
						
						} else {
						
							offsetLeft = 0;
							offsetRight = 38;
							incLeft = 0.15;
							incRight = -0.65;
						
						}

						for (var j = 0; j < 100; j++) {
							
							whitespace += "<div class='whitespaceLeft' style='width:" + offsetLeft + "%;'></div>";
							whitespace += "<div class='whitespaceRight' style='width:" + offsetRight + "%;'></div>";
							offsetLeft += incLeft;
							offsetRight += incRight;

						}
						$("." + current_view + " .p_" + level).append(whitespace);
					}

				}

				$("." + current_view + " .p_" + level).append(sBuilder);
	


			}
		}
	});
}



function init() {
	
	$(".finNames").html(names_html);

	$(".panzoom").css("visibility","hidden");
	$(".panzoom-elements").panzoom();
	
	$("a.panzoom-elements").panzoom({
		minScale: 0
	});

	$(".panzoom").panzoom({

	contain: "invert",
		minScale: 1
	}).panzoom("zoom");

	$(".panzoom").css("visibility","visible");
	$(".se-pre-con").hide("slow");
}



function resetPosition() {
	
	$(".panzoom").css('top', 0);
	$(".panzoom").css('left', 0);
	$(".panzoom").css({transform: 'scale(1)'});
	counter = 0;
}



function removeBorder() {
	
	resetPosition();
	$(".name").css('box-shadow', 'none');
}



function createBorder(contactid) {
	$("#" + contactid).css('box-shadow', 'inset 0 0 5em #49250e');
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



var names_html = "";

function getAllNames(){

$.ajax({
	
	type: "GET",
	dataType: "json",
	async: true,
	url: "http://129.146.81.161/fin/?func_name=get_data",

	success: function() {

		window.setTimeout("init()", 5);
	}
});
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
