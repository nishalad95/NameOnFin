<?php

	$path = "images/Selfies";
	
	if($handle = opendir($path)){
		
		while(($file = readdir($handle) !== false)){
			
			if($file == '.' || $file = '..'){
				
				continue;
			}
			
			echo $file;
		}
		
		closedir($handle);
	}
?>