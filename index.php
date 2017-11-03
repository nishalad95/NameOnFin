<?php

$con = mysqli_connect("localhost", "root", "", "Bloodhound");

if(mysqli_connect_errno()){
	
	echo "Failed to connect to database, server may be down :/";
	echo "Error code: " . mysqli_connect_error();
}

$schools = "SELECT name, id, key_ FROM schools";
$names_near = "SELECT name, id, key_ FROM fin_names_near";

$school_result = mysqli_query($con, $schools);
$name_result = mysqli_query($con, $names_near);
	
?>
<!DOCTYPE html>

<html>
    <head>
        <title>Bloodhound on the Fin</title>
        <meta charset="UTF-8">
	      <meta name="viewport" content="width=device-width, initial-scale=0.8">
        <!--<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">-->
        <link rel="stylesheet" type="text/css" href="CSS/style.css?ver=1.1" />
        <link rel="stylesheet" type="text/css" href="CSS/lightslider.css?ver=1.1" />
        <link rel="shortcut icon" href="#" />
        <link rel="icon" href="favicon.png" type="image/x-icon"/>

        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script type="text/javascript" src="JS/panzoom.js"></script>
        <script type="text/javascript" src="JS/lightslider.js"></script>
        <script type="text/javascript" src="JS/script.js?a=1"></script>
    	   <script type="text/javascript" src="JS/jquery.zoomooz.min.js"></script>

        <style>
    	     .item ul{
                  list-style: none outside none;
		              padding-left: 0;
                  margin: 0;
	         }
           .demo .item{ margin-bottom: 60px; }
		       .content-slider li{
		              text-align: center;
                  list-style: none;
		       }
		       .scroller{ width: 100%; }
           .no-js #loader { display: none; }
           .js #loader { display: block; position: absolute; left: 100px; top: 0; }
          .se-pre-con {
	                position: fixed;
	                left: 0px;
	                top: 0px;
	                width: 100%;
	                height: 100%;
	                z-index: 9999;
	                opacity: 0.9;
	                 background: url(images/loader-64x/Preloader_3.gif) center no-repeat #fff;
          }

    </style>
    <script>
    	 $(document).ready(function() {
			$("#content-slider").lightSlider({
                loop:true,
                keyPress:true
            });
            $('#image-gallery').lightSlider({
                gallery:true,
                item:1,
                thumbItem:9,
                slideMargin: 0,
                speed:500,
                auto:true,
                loop:true,
                onSliderLoad: function() {
                    $('#image-gallery').removeClass('cS-hidden');
                }
            });
/*window.addEventListener(orientationEvent, function() {
   $(".se-pre-con").show();
   window.location.href = window.location.href.toString();
}, false);*/

		});
    </script>
    </head>

    <body>
      <div class="se-pre-con"></div>
      <!--<div id="warning-message">
        this website is only viewable in landscape mode, please rotate
      </div>-->
        <div class="container">
            <img id="backgroundImage" src="images/BloodhoundPosterBackground.jpg" alt="Background"/>

            <!-- Top search bar -->
            <div class="searchBar">
                <div class="logo">
                    <a href="http://www.bloodhoundssc.com/">
                    <img id="logo" src="images/Bloodhound_Logo.png" alt="Bloodhound logo" title="Bloodhound SSC">
                    </a>
                </div>
                <div class="hashtag">
                    <a href="index.html"><img id="hashtag" src="images/Bloodhound on the fin title.png" alt="Bloodhound on the Fin" title="Bloodhound on the Fin"/></a>
                </div>
                <div class="searchInput">
                    <div class="inputText">
                        <form action="#" method="post" id="search_names">
                            <input id="inputValue" type="text" name="name" placeholder="Keyword, Name, Email" maxlength="100" required>
                            <div class="searchButton">
                                <div class="Static">
                                    <input type="image" id="searchStatic" src='images/Static2.png' onmouseover="this.src='images/Hover2.png';" onmouseout="this.src='images/Static2.png';" onclick="this.src='images/Active2.png';" alt="Search"/>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Main content -->
            <div class="box">
                <div class="name_area">
                   <img id="overlay" src="images/BloodhoundPosterOverlay2.png" alt="Bloodhound Fin"/>
                   <img id="greeting" src="images/Greeting.png" alt="Thank you for being part of our story"/>

                    <!-- Names on the Fin -->
                    <div id="dragArea">
						<div class="panzoom" id="draggable">

						   <img src="images/FinVector2.png" id="left-image" alt="Fin vector"/>
						   <img src="images/FinVector2.png" id="right-image" alt="Fin vector"/>
						   
							<div class="finNames_">
								<div class="p_high">
								</div>

								<div class="p_low">
								</div>
							</div>
						</div>
                    </div>
                    <!-- Scrolling Panel -->
                    <!-- zoom buttons -->
                    <div class="wrapper">
                        <div id="zoom-in">
							<img id="zoom-in" src="images/ZoomIn.png" alt="+" title="Zoom in"/>
						</div>
                        <div id="zoom-out">
							<img id="zoom-out" src="images/ZoomOut.png" alt="-" title="Zoom out"/>
						</div>
                        <div id="recenter">
							<img id="Recenter" src="images/recenter.png" alt="*" title="Recenter"/>
						</div>
						<div id="flip">
							<img id="Flip" src="images/flip.png" alt="<->" title="Flip"/>
						</div>
                    </div>
                </div>
            </div>

            <!-- Selfie gallery -->
            <div class="BottomBar">
                <img id="selfieText" src="images/SupersonicSelfies.png" alt="Supersonic Selfies!"/>
                <div class="photoBanner">

                    <div id="scroller" style='height: 100%; margin: 0 auto;'>
                        <div class="item">
                            <ul id="content-slider" class="content-slider">
                                <li><a href="#img1"><img src="images/Selfies/1.png" id="selfie"></a></li>
                                <li><a href="#img2"><img src="images/Selfies/2.png" id="selfie"/></a></li>
                                <li><a href="#img3"><img src="images/Selfies/3.png" id="selfie"/></a></li>
                                <li><a href="#img4"><img src="images/Selfies/4.png" id="selfie"/></a></li>
                                <li><a href="#img5"><img src="images/Selfies/5.png" id="selfie"/></a></li>
                                <li><a href="#img6"><img src="images/Selfies/6.png" id="selfie"/></a></li>
                                <li><a href="#img7"><img src="images/Selfies/7.png" id="selfie"/></a></li>
                                <li><a href="#img8"><img src="images/Selfies/8.png" id="selfie"/></a></li>
                                <li><a href="#img9"><img src="images/Selfies/9.png" id="selfie"/></a></li>
                                <li><a href="#img10"><img src="images/Selfies/10.png" id="selfie"/></a></li>
                                <li><a href="#img11"><img src="images/Selfies/11.png" id="selfie"/></a></li>
                                <li><a href="#img12"><img src="images/Selfies/12.png" id="selfie"/></a></li>
                                <li><a href="#img13"><img src="images/Selfies/13.png" id="selfie"/></a></li>
                                <li><a href="#img14"><img src="images/Selfies/14.png" id="selfie"/></a></li>
                                <li><a href="#img15"><img src="images/Selfies/15.png" id="selfie"/></a></li>
                                <li><a href="#img16"><img src="images/Selfies/16.png" id="selfie"/></a></li>
                                <li><a href="#img17"><img src="images/Selfies/17.png" id="selfie"/></a></li>
                                <li><a href="#img18"><img src="images/Selfies/18.png" id="selfie"/></a></li>
                                <li><a href="#img19"><img src="images/Selfies/19.png" id="selfie"/></a></li>
                                <li><a href="#img20"><img src="images/Selfies/20.png" id="selfie"/></a></li>
                                <li><a href="#img21"><img src="images/Selfies/21.png" id="selfie"/></a></li>
                                <li><a href="#img22"><img src="images/Selfies/22.png" id="selfie"/></a></li>
                                <li><a href="#img23"><img src="images/Selfies/23.png" id="selfie"/></a></li>
                                <li><a href="#img24"><img src="images/Selfies/24.png" id="selfie"/></a></li>
                                <li><a href="#img25"><img src="images/Selfies/25.png" id="selfie"/></a></li>
                                <li><a href="#img26"><img src="images/Selfies/26.png" id="selfie"/></a></li>
                                <li><a href="#img27"><img src="images/Selfies/27.png" id="selfie"/></a></li>
                                <li><a href="#img28"><img src="images/Selfies/28.png" id="selfie"/></a></li>
                                <li><a href="#img29"><img src="images/Selfies/29.png" id="selfie"/></a></li>
                                <li><a href="#img30"><img src="images/Selfies/30.png" id="selfie"/></a></li>
                                <li><a href="#img31"><img src="images/Selfies/31.png" id="selfie"/></a></li>
                                <li><a href="#img32"><img src="images/Selfies/32.png" id="selfie"/></a></li>
                                <li><a href="#img33"><img src="images/Selfies/33.png" id="selfie"/></a></li>
                                <li><a href="#img34"><img src="images/Selfies/34.png" id="selfie"/></a></li>
                                <li><a href="#img35"><img src="images/Selfies/35.png" id="selfie"/></a></li>
                                <li><a href="#img36"><img src="images/Selfies/36.png" id="selfie"/></a></li>
                                <li><a href="#img37"><img src="images/Selfies/37.png" id="selfie"/></a></li>
                                <li><a href="#img38"><img src="images/Selfies/38.png" id="selfie"/></a></li>
                                <li><a href="#img39"><img src="images/Selfies/39.png" id="selfie"/></a></li>
                                <li><a href="#img40"><img src="images/Selfies/40.png" id="selfie"/></a></li>
                                <li><a href="#img41"><img src="images/Selfies/41.png" id="selfie"/></a></li>
                                <li><a href="#img42"><img src="images/Selfies/42.png" id="selfie"/></a></li>
                                <li><a href="#img43"><img src="images/Selfies/43.png" id="selfie"/></a></li>
                                <li><a href="#img44"><img src="images/Selfies/44.png" id="selfie"/></a></li>
                                <li><a href="#img45"><img src="images/Selfies/45.png" id="selfie"/></a></li>
                                <li><a href="#img46"><img src="images/Selfies/46.png" id="selfie"/></a></li>
                                <li><a href="#img47"><img src="images/Selfies/47.png" id="selfie"/></a></li>
                                <li><a href="#img48"><img src="images/Selfies/48.png" id="selfie"/></a></li>
                                <li><a href="#img49"><img src="images/Selfies/49.png" id="selfie"/></a></li>
                                <li><a href="#img50"><img src="images/Selfies/50.png" id="selfie"/></a></li>
                                <li><a href="#img51"><img src="images/Selfies/51.png" id="selfie"/></a></li>
                                <li><a href="#img52"><img src="images/Selfies/52.png" id="selfie"/></a></li>
                                <li><a href="#img53"><img src="images/Selfies/53.png" id="selfie"/></a></li>
                                <li><a href="#img54"><img src="images/Selfies/54.png" id="selfie"/></a></li>
                                <li><a href="#img55"><img src="images/Selfies/55.png" id="selfie"/></a></li>
                                <li><a href="#img56"><img src="images/Selfies/56.png" id="selfie"/></a></li>
                                <li><a href="#img57"><img src="images/Selfies/57.png" id="selfie"/></a></li>
                                <li><a href="#img58"><img src="images/Selfies/58.png" id="selfie"/></a></li>
                                <li><a href="#img59"><img src="images/Selfies/59.png" id="selfie"/></a></li>
                                <li><a href="#img60"><img src="images/Selfies/60.png" id="selfie"/></a></li>
                                <li><a href="#img61"><img src="images/Selfies/61.png" id="selfie"/></a></li>
                                <li><a href="#img62"><img src="images/Selfies/62.png" id="selfie"/></a></li>
                                <li><a href="#img63"><img src="images/Selfies/63.png" id="selfie"/></a></li>
                                <li><a href="#img64"><img src="images/Selfies/64.png" id="selfie"/></a></li>
                                <li><a href="#img65"><img src="images/Selfies/65.png" id="selfie"/></a></li>
                                <li><a href="#img66"><img src="images/Selfies/66.png" id="selfie"/></a></li>
                                <li><a href="#img67"><img src="images/Selfies/67.png" id="selfie"/></a></li>
                                <li><a href="#img68"><img src="images/Selfies/68.png" id="selfie"/></a></li>
                        </ul>
                        </div>
                    <div class="lightboxArea"><!-- Lightbox Photos --></div>
                    </div>
                </div>

                </div>
            </div>
    </body>
</html>
