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

	$table = "fin_names_near";

} else if ($key == "off") {

	$table = "fin_names_off";
}



$sql = "SELECT name, id, key_ FROM `$table`";
	
foreach($con->query($sql) as $row){
		
	array_push($data, convert_to_utf8($row));
}
	
echo json_encode($data);

mysqli_close($con);



/**
* This function will ocnvert any non utf-8 encoded data into utf-8.
*/
function convert_to_utf8($data){
	
    if (is_string($data)){
		
        return utf8_encode($data);
	}
    if (!is_array($data)){
		
        return $data;
	}
	
    $ret = array();
	
    foreach ($data as $i => $d){
		
        $ret[$i] = convert_to_utf8($d);
	}
    return $ret;
}



?>



