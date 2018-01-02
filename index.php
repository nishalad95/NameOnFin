<!DOCTYPE html>

<html>
    <head>
        <title>Bloodhound on the Fin</title>
        <meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=0.8">
	<link rel="stylesheet" href="leaflet/leaflet/leaflet.css"/>
        <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
        <link rel="stylesheet" type="text/css" href="CSS/style.css?ver=1.1" />
        <link rel="stylesheet" type="text/css" href="CSS/lightslider.css?ver=1.1" />
        <link rel="icon" href="images/favicon.png" type="image/x-icon"/>

	<script src="leaflet/leaflet/leaflet.js" ></script>
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script type="text/javascript" src="JS/lightslider.js"></script>
        <script type="text/javascript" src="JS/script.js?a=1"></script>

        <style>
	   .item ul{
                list-style: none outside none;
		padding-left: 0;
                margin: 0;
	   }
	   .demo .item{ 
		margin-bottom: 60px; 
	   }
	   .content-slider li{
		text-align: center;
                list-style: none;
	   }
	   .scroller{ 
		width: 100%; 
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

	});
    </script>
    </head>

    <body>
        <div class="container">
            <img id="backgroundImage" src="images/BloodhoundPosterBackground.jpg" alt="Background"/>

            <!-- Top search bar -->
            <div class="searchBar">
                <div class="logo">
                    <a href="http://www.bloodhoundssc.com/" target="_blank">
                    <img id="logo" src="images/Bloodhound_Logo.png" alt="Bloodhound logo" title="Bloodhound SSC">
                    </a>
                </div>
                <div class="hashtag">
                    <a href="index.php"><img id="hashtag" src="images/Bloodhound on the fin title.png" alt="Bloodhound on the Fin" title="Bloodhound on the Fin"/></a>
                </div>
                <div class="searchInput">
                    <div class="inputText">
                        <form action="#" method="post" id="search_names" autocomplete="off">
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

		<ul id="tab">
        		<li><a href="#">New Names</a></li>
		</ul>

                <div class="name_area">
                   <img id="overlay" src="images/BloodhoundPosterOverlay2.png" alt="Bloodhound Fin"/>
                   <img id="greeting" src="images/Greeting.png" alt="Thank you for being part of our story"/>


                    <!-- Names on the Fin -->
                    <div id="dragArea">
				<div id="mapid"></div>
                    </div>


		    <!-- Scrolling Panel -->
                    <!-- Buttons -->
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
				<?php
					// This will auto-load all selfie images located in the 'selfies' folder. No need for static typing now!
					$path = "images/Selfies";
								
					if(is_dir($path)){
									
						if($dh = opendir($path)){
										
							while(($file = readdir($dh)) !== false){
											
								if($file != "." && $file !=".." && $file != "controls.png"){
												
									$id = (explode(".", $file))[0];
												
									echo "<li><a href='#img".$id."'><img src='".$path."/".$file."' id='selfie'></a></li>";
								}
							}
						}
					}
				?>
                        </ul>
			</div>
			<div class="lightboxArea"></div>
                    </div>
                </div>

                </div>
            </div>
    </body>
</html>
