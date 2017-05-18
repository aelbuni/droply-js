<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0;">
	<meta charset="UTF-8">

	<link href='http://fonts.googleapis.com/css?family=Droid+Sans:400,700|Droid+Serif' rel='stylesheet' type='text/css'>

	<link rel="stylesheet" type="text/css" href="css/reset.css"> <!-- CSS reset -->
	<link rel="stylesheet" type="text/css" href="css/tinycolorpicker.css">
	<link rel="stylesheet"type="text/css" href="css/side-panel.css"> <!-- Resource style -->
	<link rel="stylesheet" type="text/css" href="css/style.css">
  	
	<title>Droply.js - Minimal PHP file upload script | iTechFlare</title>
	<meta name="description" content="Droply.js is a minimal PHP plugin that provide a professional & highly customizable multi file uploader.">

	<style>
		body
		{
			font-family: 'Droid', sans-serif;
		}
		a, div.price a:visited,div.droply-docs a:visited {
			color:white;
			text-decoration:none;
		}
		div.price 
		{
			background:rgba(255,255,255,0.2);
			padding:10px;
            padding-top:20px;
			position:absolute;
			right:200px;
			top:-10px;
			float:left;
			color:white;
			border-radius:5px;
            width:100px;
		} 
        
        img.plugin-logo{
          margin-top:30px;
        }
        
        div.droply-filedrag 
        {
          background-color: rgb(55, 118, 185);
        }
        
		div.droply-docs 
		{
			background:rgba(255,255,255,0.2);
			padding:10px;
			position:absolute;
			left:200px;
			top:0;
			color:white;
			border-radius:5px;
		} 
		div.price:hover
		{
			background:rgba(255,255,255,0.4);
			font-weight:bold;
		} 
		div.droply-docs:hover
		{
			background:rgba(255,255,255,0.4);
			font-weight:bold;
		} 
		div.output {
			font-family: sans-serif;
			font-size: 12px;
			max-width:300px;
			position: absolute;
			left: 51px;
			top: 364px;
		}
		div.output:before
		{
			content:'Debug : ';
			font-size:20px;
			color:red;
		}
	</style>
	
</head>
<body style="background-image:url('images/bg.jpg');background-size:cover">

	<center>

		<main class="cd-main-content">
			<!-- your main content here -->
			
			<a class="cd-btn"><img src="images/settings.png"></a>
			
				<div>
					<div class="droply-docs">
					<a target="_blank" href="http://www.itechflare.com/droply/docs/">Documentation</a>
					</div>
					<div class="price"> <a target="_blank" href="https://www.itechflare.com">iTechFlare</a></div>
				</div>
				<img class="plugin-logo" src="images/logo.png"><br/><br/>

				<div class="output"></div>
				<!-- put your arfaly container anywhere -->
				<div id="mas"></div>
		</main>
	 
		<div class="cd-panel from-right">
			<header class="cd-panel-header">
				<h1>Modify settings and click apply</h1>
				<a href="#0" class="cd-panel-close">Close</a>
			</header>
		 
			<div class="cd-panel-container">
				<div class="cd-panel-content">
					<div>
						<h1 style="font-weight:bold;color:black;font-size:20px">Switch the style</h1>
						<br>
						<div id='wrapper' style="width:50px;">
							<!-- Radio one -->
							<input type='radio' id='radio1-1' checked='checked' name='radio'>
							<label for='radio1-1'>Z</label> <span style="color:black">Default</span><br><br>
							<!-- Radio two -->
							<input type='radio' id='radio1-2' name='radio'>
							<label for='radio1-2'>b</label> <span style="color:black">Simplex</span><br><br>
							<!-- Radio three -->
							<input type='radio' id='radio1-3' name='radio'>
							<label for='radio1-3'>4</label> <span style="color:black">Super Simplex</span><br><br>
						</div>
						
						<h1 style="font-weight:bold;color:black;font-size:20px">Change upload item's background color</h1>
						
						<div id='wrapper' style="width:50px;">
							<div id="colorPicker">
								<a class="color"><div class="colorInner"></div></a>
								<div class="track"></div>
								<ul class="dropdown"><li></li></ul>
								<input type="hidden" class="colorInput"/>
							</div>
						</div>
						
						<a class='superBtn' onClick="ApplyOption()">Apply options</a>
					</div>
				</div> <!-- cd-panel-content -->
			</div> <!-- cd-panel-container -->
		</div> <!-- cd-panel -->
	
	</center>
	
	<script language="javascript" type="text/javascript" src="js/jquery-1.11.1.min.js" ></script>
	<script language="javascript" type="text/javascript" src="js/modernizr.js" ></script>
	<script language="javascript" type="text/javascript" src="js/jquery.tinycolorpicker.js" ></script>
	<script language="javascript" type="text/javascript" src="js/droply.js" ></script>
	<script language="javascript" type="text/javascript" src="js/custom.js" ></script>
</body>
</html>
