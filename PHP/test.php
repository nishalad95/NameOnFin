<?php

	$path = "../images/Selfies";
	
	if(is_dir($path)){
		
		if($dh = opendir($path)){
			
			while(($file = readdir($dh)) !== false){
				
				if($file != "." && $file !=".." && $file != "controls.png"){
					
					// echo $file . "<br>";
					$id = (explode(".", $file))[0];
					
					echo "<li><a href='#img".$id."'><img src='".$path."/".$file."' id='selfie'></a></li>";
					
					// echo $id . "<br>";
				}
			}
		}
	}
?>