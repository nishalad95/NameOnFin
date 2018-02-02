<?php

// define variables and set to empty values
$term = "";

if(isset($_REQUEST['term'])){
	
	$term = $_REQUEST['term'];
}


$con = mysqli_connect("localhost", "root", "", "bloodhound");

if(mysqli_connect_errno()){
	
	echo "Failed to connect to database, server may be down";
	echo "Error code: " . mysqli_connect_error();
}


$sql = "(SELECT `name`, `id`, `key_`, `coord` FROM `schools` WHERE `name` LIKE '%$term%' OR `email` LIKE '%$term%' LIMIT 20)
		UNION 
		(SELECT `name`, `id`, `key_`, `coord` FROM `fin_names_near` WHERE `name` LIKE '%$term%' OR `email` LIKE '%$term%'  LIMIT 100)
		UNION
		(SELECT `name`, `id`, `key_`, `coord` FROM `fin_names_off` WHERE `name` LIKE '%$term%' OR `email` LIKE '%$term%' LIMIT 100)
		UNION
		(SELECT `name`, `id`, `key_`, `coord` FROM `enhanced` WHERE `name` LIKE '%$term%' OR `email` LIKE '%$term%' LIMIT 20)";

$data = array();

foreach($con->query($sql) as $row){
	
	if (json_encode($row) != NULL) {	
		array_push($data, json_encode($row));
	}
}

$data = implode(",", $data);
echo "[".$data."]";

mysqli_close($con);



?>


