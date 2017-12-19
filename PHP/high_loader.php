<?php

// define variables and set to empty values
$key = "near";

if(isset($_REQUEST['key_'])){
	
	$key = $_REQUEST['key_'];
}

$con = mysqli_connect("localhost", "root", "", "Bloodhound");

if(mysqli_connect_errno()){
	
	echo "Failed to connect to database, server may be down :/";
	echo "Error code: " . mysqli_connect_error();
}

$data = array();

$table = "";



if($key == "near"){

	$table = "schools";

} else if ($key == "off") {

	$table = "enhanced";
}



$sql = "SELECT name, id, key_ FROM `$table`";
	
foreach($con->query($sql) as $row){
		
	array_push($data, $row);
}
	
echo json_encode($data);



mysqli_close($con);
?>
