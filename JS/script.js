//var current_zoom = 1;
const MAXZOOM = 30;
const MINZOOM = 1;
const SCALEFACTOR = 3;
var contactid = null;
var counter = 0;

var current_view = "near";

var currentZoom = 0;

function setup_slider()
{
	$('#lightSlider').lightSlider({
        item:4,
        loop:false,
        slideMove:1,
        //easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
        responsive : [{
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

}
$(document).ready(function(){

	// Default sides of the fin to load.
	loadHighData(current_view);
	loadLowData(current_view);
	
	var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
		return p.toString() === "[object SafariRemoteNotification]";
	})(!window['safari'] || safari.pushNotification);

	if (isSafari) {
        alert('We have detected you are not using a supported browser. Please move to either Google Chrome or Mozilla Firefox.');
				document.write("<style>body { display:none }</style>");
  			window.location.replace("time-out.html");
    }

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
		
		changeView("no");
	});	

	
  	$("#zoom-in").on("click", function() {
		
	$(".se-pre-con").show();
			
		currentZoom += 0.05;
		settings = {
			// zoomed size relative to the container element
			// 0.0-1.0
			targetsize: currentZoom,
			// scale content to screen based on their size
			// "width"|"height"|"both"
			scalemode: "both",
			// animation duration
			duration: 1,
			// easing of animation, similar to css transition params
			// "linear"|"ease"|"ease-in"|"ease-out"|"ease-in-out"|[p1,p2,p3,p4]
			// [p1,p2,p3,p4] refer to cubic-bezier curve params
			easing: null,
			// use browser native animation in webkit, provides faster and nicer
			// animations but on some older machines, the content that is zoomed
			// may show up as pixelated.
			nativeanimation: false,
			// root element to zoom relative to
			// (this element needs to be positioned)
			root: $(".panzoom"),//#dragArea"),
			// show debug points in element corners. helps
			// at debugging when zoomooz positioning fails
			debug: false,
			// this function is called with the element that is zoomed to in this
			// when animation ends
			animationendcallback: null,
			// this specifies, that clicking an element that is zoomed to zooms
			// back out
			closeclick: false
		}
		if (contactid == null){
			
			$(".panzoom").zoomTo(settings);
		}
		else{
			
			$("#" + contactid).zoomTo(settings);
		}
		$(".se-pre-con").hide();
    });

	$("#zoom-out").on("click", function() {
		$(".se-pre-con").show();

		currentZoom -= 0.05;
		if (currentZoom < 0 || currentZoom == 0)
		{
			searched = false;
			resetPosition();
			currentZoom = 0;
		        //$(".se-pre-con").hide();
			return;
		}
		settings = {
			// zoomed size relative to the container element
			// 0.0-1.0
			targetsize: currentZoom,
			// scale content to screen based on their size
			// "width"|"height"|"both"
			scalemode: "both",
			// animation duration
			duration: 1,
			// easing of animation, similar to css transition params
			// "linear"|"ease"|"ease-in"|"ease-out"|"ease-in-out"|[p1,p2,p3,p4]
			// [p1,p2,p3,p4] refer to cubic-bezier curve params
			easing: null,
			// use browser native animation in webkit, provides faster and nicer
			// animations but on some older machines, the content that is zoomed
			// may show up as pixelated.
			nativeanimation: false,
			// root element to zoom relative to
			// (this element needs to be positioned)
			root: $(".panzoom"),//#dragArea"),
			// show debug points in element corners. helps
			// at debugging when zoomooz positioning fails
			debug: false,
			// this function is called with the element that is zoomed to in this
			// when animation ends
			animationendcallback: null,
			// this specifies, that clicking an element that is zoomed to zooms
			// back out
			closeclick: false
		}
		// settings can be set for both the zoomTo and zoomTarget calls:
		
		
		if(contactid != null){
			
			$("#" + contactid).zoomTo(settings);
		}
		else if (contactid == null){
			
			$(".panzoom").zoomTo(settings);
		}

		$(".se-pre-con").hide();
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
					$(".namesScrollBar").append("<div class='searchQuery'>Results for:" + searchTerm + "</div>");
					$(".namesScrollBar").append("<div><ul class='searchList'></ul></div>");
					
					for(var i = 0; i < count; i++){
						
						var id = data[i].id;
						var name = data[i].name;
						var key = data[i].key_;
				
						$(".searchList").append("<a id='nameLink' href='#'><li class='listItem' id='res_" + key + id + "'>" + name + "</li></a>");
					}
				}
				else if(count == 1){
					
					contactid = "contact_" + data[0].key_ + data[0].id;
					
					//alert(contactid);
					removeBorder();
					createBorder(contactid);
					$("#zoom-in").click();
				}
				else{
					
					alert("Sorry, no results were found.");
				}
				
				resetPosition();

				$('.listItem').on('click', function(){
					
					// We get this far...
					resetPosition();
					
					counter = 0;
					currentZoom = 0;
					contactid = "contact_" + $(this).attr("id").replace("res_", "");
					
					var pre_key = contactid.split("_");
					var key = pre_key[1].slice(0, 2);
					
					removeBorder();

					// 
					changeView(key);
					
					// alert(contactid);
					contSearch(contactid);
				});
	
			}
		});
		
	$(".se-pre-con").hide();
  });
  
	function changeView(key){
		
		if(key == "nn" || key == "sc"){
			
			// We know that these keys belong to the 'near' side view.
			
			if(current_view == "near"){
				
				// Dont do anything, the selected name belongs to the current view.
				//alert("Currently on the correct view");
			}
			else{
				
				// The current view is 'off' so we need to switch back to 'near'.
				
				current_view = "near";
				
				//alert("Switching to near side view");
				
								
				$('.panzoom').css("background-image", "url(images/FinVector2.png)");
				$('#left-image').css("shape-outside", "polygon(0% 0%, 0% 75%, 73% 0%)");
				$('#right-image').css("shape-outside", "polygon(100% 0%, 78% 100%, 100% 100%)");
				
				$(".se-pre-con").show();
				
				// Call load high data.
				loadHighData(current_view);
				
				// Load low level data.
				loadLowData(current_view);
				
				$(".se-pre-con").hide();
			}
		}
		else{
			
			// We know that these names belong to the 'off' side view.
			
			if(current_view == "off"){
				
				// Dont do anything, the selected name belongs to the current view.
				//alert("Currently on the correct view");
			}
			else{
				
				// The current view is 'near' so we need to switch back to 'off'.
				
				current_view = "off";
				//alert("Switching to off side view");
				
				// Now data has been loaded up, we can set the layout.
				$('.panzoom').css("background-image", "url(images/FinVector2Inverted.png)");
				$('#left-image').css("shape-outside", "polygon(0% 0%, 15% 100%, 0% 100%)");
				$('#right-image').css("shape-outside", "polygon(25% 0%, 100% 0%, 99% 80%)");
				
				$(".se-pre-con").show();
				
				// Call load high data.
				loadHighData(current_view);
				
				// Load low level data.
				loadLowData(current_view);
				
				$(".se-pre-con").hide();
			}
		}
	}

});

function loadLowData(current_view){
	
	$.ajax({
		url: "PHP/low_loader.php?key_=" + current_view,
		type: "POST",
		dataType: "json",
		
		success: function(low_data){
			
			var count = low_data.length

			// Before we add the new p_high data, we must clear out the old stuff.
			$(".p_low").empty();
				
			if(count > 1){
				
				for(var i = 0; i < count; i++){

					var id = low_data[i].id;
					var name = low_data[i].name;
					var key = low_data[i].key_;

					// Here is where we replace the big names on the page!
					
					$(".p_low").append("<div class='name zzoomTarget' id='contact_" + key + "" + id + "'>" + name + "</div>&nbsp;");
				}
			}
		}
	});
}
function loadHighData(current_view){
	
	$.ajax({
		url: "PHP/high_loader.php?key_=" + current_view,
		type: "POST",
		dataType: "json",
		
		success: function(high_data){
			
			var count = high_data.length

			// Before we add the new p_high data, we must clear out the old stuff.
			$(".p_high").empty();
				
			if(count > 1){
			
				for(var i = 0; i < count; i++){

					var id = high_data[i].id;
					var name = high_data[i].name;
					var key = high_data[i].key_;

					// Here is where we replace the big names on the page!
					
					$(".p_high").append("<div class='name zzoomTarget' id='contact_" + key + "" + id + "'>" + name + "</div>&nbsp;");
				}
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
		/*$zoomIn: $("#zoom-in"),
		$zoomOut: $("#zoom-out"),*/
		contain: "invert",
		minScale: 1
	}).panzoom("zoom");

	$(".panzoom").css("visibility","visible");
	$(".se-pre-con").hide("slow");
}



// reset position of fin on another click and panning
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


// add border to highlight name
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

	success: function(data) {
	  
		var names = JSON.stringify(data);
		var obj = $.parseJSON(names);
		var name_array = obj.NAME;
		var ids_array = obj.ID;
		names_html = " ";

		// create names on fin
		for(var i = 0; i < name_array.length; i++){
			
			names_html += "<div class='name zzoomTarget' id='contact_"+ids_array[i]+"'>&nbsp;" + name_array[i] + ", &nbsp;</div>";
		}

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
