<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Task_2</title>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyA4YR8loJtUaiviLc-WxnBsSH9Znt9TNEY"></script>
<script src="initMap.js"></script>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
	<div id = "main">
    	<div id = "address" class="controls">
        	<div class="text">Enter your address</div>
            <div class = "form">
        		<form>
            		<input type="text" name="address_string" id="address_string" />
            		<input type="button" name="submit_address" id="submit_address" value="Find me" onClick = "setLocationByAddress()"/>
        		</form>
            </div>
        </div>
        <div id = "map_container">

        </div>
        <div id = "controls" class="controls">
        	<div class="text">Description</div>
            <div class="form">
          		<form>
            		<input type="text" name="description" id="description" />
                    <input type="button" name="get_req" id="get_req" value="Get ATMs from server" onClick = "getReq()"/>
          		</form>
            </div>
        </div>
</div>
</body>
</html>

