<?php

// define variables and set to empty values
$term = "Ian Glover";

$terms = explode(" ", $term);

$sql_builder = "";

foreach($terms as $item){
	
	$sql_builder .= " OR `name` LIKE '%".$item."%'";
}

if(isset($_POST['term'])){
	
	$term = $_POST['term'];
}

$con = mysqli_connect("localhost", "root", "", "Bloodhound");

if(mysqli_connect_errno()){
	
	echo "Failed to connect to database, server may be down :/";
	echo "Error code: " . mysqli_connect_error();
}

$sql = "(SELECT `name`, `id`, `key_` FROM `schools` WHERE `name` LIKE '%$term%'".$sql_builder.") 
		UNION 
		(SELECT `name`, `id`, `key_` FROM `fin_names_near` WHERE `name` LIKE '%$term%'".$sql_builder." LIMIT 50)
		UNION
		(SELECT `name`, `id`, `key_` FROM `fin_names_off` WHERE `name` LIKE '%$term%'".$sql_builder." LIMIT 50)
		UNION
		(SELECT `name`, `id`, `key_` FROM `enhanced` WHERE `name` LIKE '%$term%'".$sql_builder.")";

$data = array();

// Gets school data.
foreach($con->query($sql) as $row){
	
	array_push($data, $row);
}

echo json_encode($data);

mysqli_close($con);
?>