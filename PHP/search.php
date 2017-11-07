<?php

// define variables and set to empty values
$term = "";

if(isset($_REQUEST['term'])){
	
	$term = $_REQUEST['term'];
}


$con = mysqli_connect("localhost", "root", "", "Bloodhound");

if(mysqli_connect_errno()){
	
	echo "Failed to connect to database, server may be down :/";
	echo "Error code: " . mysqli_connect_error();
}

$sql = "(SELECT `name`, `id`, `key_` FROM `schools` WHERE `name` LIKE '%".$term."%' OR `email` LIKE '%".$term."%' LIMIT 20) 
		UNION 
		(SELECT `name`, `id`, `key_` FROM `fin_names_near` WHERE `name` LIKE '%".$term."%' OR `email` LIKE '%".$term."%'  LIMIT 80)
		UNION
		(SELECT `name`, `id`, `key_` FROM `fin_names_off` WHERE `name` LIKE '%".$term."%' OR `email` LIKE '%".$term."%' LIMIT 80)
		UNION
		(SELECT `name`, `id`, `key_` FROM `enhanced` WHERE `name` LIKE '%".$term."%' OR `email` LIKE '%".$term."%' LIMIT 20)";

$data = array();

// Gets school data.
foreach($con->query($sql) as $row){
	
	array_push($data, $row);
}

echo json_encode($data);

mysqli_close($con);
?>
