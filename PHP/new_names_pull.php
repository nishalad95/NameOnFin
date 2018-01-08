<?php

$con = mysqli_connect("localhost", "root", "", "bloodhound");

if(mysqli_connect_errno()) {

	echo "Failed to connect to database, server may be down";
	echo "Error code: " . mysqli_connect_error();
}


$sql = "SELECT `name` FROM `fin_names_near` LIMIT 200";

$data = array();

foreach($con->query($sql) as $row) {

	if (json_encode($row) != NULL) {
		array_push($data, json_encode($row));
	}
}


$data = implode(",", $data);
echo "[".$data."]";

mysqli_close($con);

?>
