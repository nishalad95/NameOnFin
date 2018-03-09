<?php

ini_set('max_execution_time', 50000);

$con = mysqli_connect("localhost", "root", "", "bloodhound");

$table_names = array("fin_names_near");

$remaining_names = array();

$prev_coord = null;
$next_coord = null;
$prev_name = null;



foreach($table_names as $table){

	echo "table name: " . $table . "<br>";
	$empty_coord = "SELECT * FROM `".$table."` WHERE `coord` = ''";


	//foreach($con->query($empty_coord) as $row){
	if($result = mysqli_query($con, $empty_coord)) {
		while($row = $result -> fetch_assoc()) {
		$current_id = $row["id"];
		$prev_id = $current_id - 1;
		$next_id = $current_id + 1;
		echo "prev_id: " . $prev_id . ", next_id: " . $next_id . "<br>";	


		$prev_row = "SELECT * FROM `".$table."` WHERE `id` = '".$prev_id."' ";
		$next_row = "SELECT * FROM `".$table."` WHERE `id` = '".$next_id."' ";

		//foreach($con->query($prev_row) as $prev) {
		if ($result2 = mysqli_query($con, $prev_row)) {
			while($prev = $result2 -> fetch_assoc()) {
				$prev_coord = $prev["coord"];	
				$prev_name = $prev["name"];
				echo "prev name: " . $prev_name . ", prev coord tuple " . $prev_coord . "<br>";
			}
		}


		//foreach($con->query($next_row) as $next) {
		if ($result3 = mysqli_query($con, $next_row)) {
			while($next = $result3 -> fetch_assoc()) {
				$next_coord = $next["coord"];	
				echo "next coord tuple " . $next_coord . "<br>";
			}
		}

		if ($prev_coord != "" && $next_coord != "") {
			echo "here <br>";
			$prev_coord = explode(",", $prev_coord);
			$next_coord = explode(",", $next_coord);

			if (abs($prev_coord[1] - $next_coord[1]) <= 4 && abs($prev_coord[0] - $next_coord[0]) <= 300) {
				
				$new_x = round(($prev_coord[0] + $next_coord[0]) / 2, 0);
				$new_y = round(($prev_coord[1] + $next_coord[1]) / 2, 0);
				echo "name: " . $row["name"] . ", new x: " . $new_x . ", new y: " . $new_y . "<hr>";	
				array_push($remaining_names, [$prev_name, $row["name"]]);
				
				$tuple = $new_x . ", " . $new_y;
				$update = "UPDATE `".$table."` SET `coord` = '".$tuple."' WHERE `id` = '".$current_id."'";

				if (mysqli_query($con, $update)) {
					echo "succesfully updated row: " . $row["name"];
				} else {
					echo mysqli_error($con);
				}

			}
		
		}


		}
	}


}

foreach($remaining_names as $rn) {
	echo "prev name: " . $rn[0] . ", next name: " . $rn[1] . "<br>";
}


echo "<br> Number of names updated: " . count($remaining_names) . "<br>";

echo "done";

mysqli_close($con);

?>
