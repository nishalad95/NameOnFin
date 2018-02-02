<?php
/**
 * This script is used to remove any special characters in the names in the database to 
 * only show alpha-numeric characters and hence render properly in html
 */

ini_set('max_execution_time', 50000);

$con = mysqli_connect("localhost", "root", "", "bloodhound_old");

$table_names = array("fin_names_off", "fin_names_near", "schools", "enhanced");


foreach($table_names as $table){

	$sql = "(SELECT * FROM `$table`)"; 
	$regex = "/[^a-zA-Z0-9À-ÖØ-öø-ÿ\.\-\s]+/i";
	
	$query = mysqli_query($con, $sql);

	while($row=mysqli_fetch_assoc($query) ) {
		
		$id = $row["id"];
		$name = $row["name"];

		echo "Before: " .$name;
		
		$newstring = "";
		if (is_string($name)){
	
			$name = utf8_encode($name);
			$newstring = preg_replace($regex, "", $name);

		}
	
		echo ", After: " .$newstring. "<br>";
		$update_sql = "UPDATE `$table` SET `name` = '$newstring' WHERE `id` = '$id'";
		$result = mysqli_query($con, $update_sql);
	} 

}

echo "done";

mysqli_close($con);

?>
