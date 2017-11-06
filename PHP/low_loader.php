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

if($key == "near"){
	
	$data = array();
	
	// Gets near side priority data.
	
	$sql = "SELECT name, id, key_ FROM fin_names_near";
	
	$near_result = mysqli_query($con, $sql);

	if(mysqli_num_rows($near_result) > 0){

		while($row = mysqli_fetch_assoc($near_result)){
				
			if(!mb_check_encoding($row['name'], 'UTF-8')){
				
				array_push($data, convert_to_utf8($row));
			}
			else{
				
				array_push($data, $row);
			}
		}
	}
											
	echo json_encode($data);
	
}
else if($key == "off"){
	
	$data = array();
	
	// Gets the off side high priority data.
	
	$sql = "SELECT name, id, key_ FROM fin_names_off";
	
	$off_result = mysqli_query($con, $sql);

	if(mysqli_num_rows($off_result) > 0){

		while($row = mysqli_fetch_assoc($off_result)){
									
			if(!mb_check_encoding($row['name'], 'UTF-8')){
				
				array_push($data, convert_to_utf8($row));
			}
			else{
				
				array_push($data, $row);
			}
		}
	}
	
	echo json_encode($data);
}

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