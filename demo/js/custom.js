jQuery(document).ready(function(){
	
    function addExtraPostParameters()
    {
      // Create your scalar dictionary
      var postData = {name:'myName', age:21, cat:'user'};
      
      // You can also read information from your frontend like this
        // var postData = {name:jQuery('#nameTextInputField').val(), age: jQuery('#ageTextInputField').val()};

      // Return it to be injected with File upload requests. Go to processMultipleUploads.php and uncomment line (15) to acquire these parameters
      return postData;
    }

	jQuery("#mas").droply(
		{
			multi:true,
			logoColor: 'white',
			textColor: 'white',
            labelColor: 'white',
			borderColor: 'white',
            backgroundIcon: 'images/icon-droply.png',
            injectPostData: addExtraPostParameters() // Send extra information using 
		}
	);
	
	// Initialize colorPicker
	var box = jQuery('#colorPicker');
    box.tinycolorpicker();
	
	var picker = jQuery('#colorPicker').data("plugin_tinycolorpicker");
    picker.setColor("#B50A0A");
	
	//open the lateral panel
	jQuery('.cd-btn').on('click', function(event){
		event.preventDefault();
		jQuery('.cd-panel').addClass('is-visible');
	});
	//close the lateral panel
	jQuery('.cd-panel').on('click', function(event){
		if( jQuery(event.target).is('.cd-panel') || jQuery(event.target).is('.cd-panel-close') ) { 
			jQuery('.cd-panel').removeClass('is-visible');
			event.preventDefault();
		}
	});
}
);

function ApplyOption()
{
	var theme = 'default';
	var picker = jQuery('#colorPicker').data("plugin_tinycolorpicker");
    var color = picker.colorHex;
	
	jQuery('.cd-panel').removeClass('is-visible');
	
	if(jQuery('#radio1-1').is(':checked')) {
		theme = 'default';
	}else if(jQuery('#radio1-2').is(':checked')) {
		theme = 'simplex';
	}else if(jQuery('#radio1-3').is(':checked')){
		theme = 'super-simplex';
	}

	jQuery("#mas").empty();
	
	jQuery("#mas").droply(
	{
		multi:true,
		logoColor: 'white',
		textColor: 'white',
        labelColor: 'white',
		borderColor: 'white',
        backgroundIcon: 'images/icon-droply.png',
		theme: theme,
		backgroundColor: color
	});
}
