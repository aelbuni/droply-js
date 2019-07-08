# ( JQuery / Javascript ) Multi File Uploader
Droply is a responsive jQuery based plugin, that simplifies the developers task to setup a multi/single file uploader component. It is highly configurable and easy to install. This plugin comes with a configurable server side PHP script that should be clear enough for developers to customize. It is important to know that there is a list of permitted file (MIME) types, which can be configured conjuctively on both server/client side to filter out any type of harmful or undesired file types.

## (Contribution) Do you want to help improving this tool

Droply needs more developers to contribute to get the plugin to the next level. Please check the roadmap, and contact me if you are interested to be part of the team.

## Documentation :fist:
Detailed Documentation: http://www.itechflare.com/droply/docs/

## Demo :sparkles:
Droply in Action: http://www.itechflare.com/droply/

### Current Features
- Responsive multi-file uploader
- Easily filter the file type allowed
- Server side aware jQuery plugin
- CSS3 smooth and modem effects
- More than 15 different options for flexibility
- Progress bar, preview file support
- Can be embedded inside forms. Can generate dynamic inputs with your desired upload-id values.
- Drag and drop files (and even folders in Chrome and Opera) straight from your desktop.
- Support deletion
- Droply has an integrated friendly mobile user interface, which allow users to upload files from their mobiles. Work beautifully for:
  - iOS
  - Android
- Upload the wrong file? Droply can delete what your mistaken file.
- Limit your users to a specific file type, size limit, number of files, image dimensions, or write your own custom validator.

# Roadmap

- (1.6.1) 
  - Convert to native Javascript plugin (Remove jQuery Dependency)
- (1.6.1.1) 
  - Queuing file uploads and include flexible trottling mechanism (config) for the number of concurrent uploads the plugins can execute.
- TBD
## How can Droply fit into your PHP Project ?

Droply provides a simple backend PHP processing class that enable you to integrate this plugin to any PHP framework easily.

# Setup & Usage

Basic Javascript/Jquery knowledge is necesary to use this plugin: how to set parameters, callbacks, etc.

Dual licensed under the MIT and GPL licenses.
Created by Abdulrhman Elbuni.

## API

````javascript
$("#company-files").droply(options);

$("#company-files").droply(
        {
            chunkUpload: true,
            limitNumberofFiles:10,              // Limit the number of total uploaded file per session
            debug:false,                        // Enable/Disable debug for tracking error
            targetOutput:'.output',             // Print the output of the debug into a specific target HTML element
            allowedFileSize: 1024 * 1024 * 10, 
            disableRemovingItems:true,          // Disable removing upload items from the list
            delay:5000,                         // Define a hide delay of each upload element if it is set to be hidden
            multi:true,                         // Enable multi-file select/upload
            dragDrop:true,
            theme: 'simplex',                   // You can select 3 different themes 'default', 'simplex' and 'super-simplex'
            url: "processMultipleUploads.php",  // URL on where the files should be submitted
            dataType: "json",                   // Define AJAX dataType
            type: "post",                       // Define post type "GET/POST" (POST Recommended)
            backgroundColor:'',
            label:'Allowed file types are gif, jpg, png, avi, mp3, wav, mp4, doc, docx, pdf, txt, zip and rar',
            labelColor:'rgb(90, 90, 90)',
            logoColor:'rgb(150, 155, 255)',     // Change the color of the logo
            textColor:'#DADADA',                // Change the color of border line and text
            borderColor:'#DADADA',
            disablePostProgressAnimation: false,
            progressBarColor: 'red',            // Change the color of the progress-bar {red, orange, and green}
            action:'itech_droply_submission',   // Pass a custom JSON object to the server side along the files
            successfulUpload: droply.successfulUpload,  // Event handler for successful file upload
            failedUpload: droply.failedUpload,          // Event for unsuccessful file upload
            fileDeleted: droply.fileDeleted             // Event triggers when file is deleted from the front-end
            dropBox:{
              title:'Drop files here', 
              height:100, 
              fontSize:26
            },
            required:"false", // Force the uploader to be required as a field inside a form
            stableUploadLbl: 'Everything going well so far!',
            deleteConfirmLbl:'Are you sure you want to delete the file?',
            maxUploadSize: 1024*1024*16,        // Define your server (max_post_size/upload_max_filesize), so the plugin can optimize chunk uploading process using this parameter
        });
````

This way you can initialize the plugin. Check the documentation and read more about options [options](http://www.itechflare.com/droply/docs/).

## Markup
This is the simple html markup.
````html
<div id="company-files"></div>
````

Even if you test all this in different browsers I recommend to add some kind of link to a basic uploader, this is still a new feature on several platforms.

## Look and feel
[<div style="text-align:center"><img src="https://github.com/aelbuni/Droply/blob/master/sample-images/sample-usage-gallery-uploader.jpg"></div>](https://www.itechflare.com/droply/)
[<div style="text-align:center"><img src="https://github.com/aelbuni/Droply/blob/master/sample-images/screenshot.jpg"></div>](https://www.itechflare.com/droply/)

## Changelog

### Update Version: 1.0
- Initial release (Read docs for more detailed information)

### Update Vesrion: 1.2
- Add disablePostProgressAnimation option to disable progress animation after upload is been completed.
- Add timestamp to files before saving to avoid file replacement.
- Increase performance.

### Update Version: 1.3
- Minor bugs for iOS devices support.
- Refining CSS file
- Emulate hover effect for mobile devices
- Fixing the delete functionality after adding timestamp to saved files
- Stop progress bar animation once the uploading finishes is been enabled by default.

### Update Version: 1.4
- Added three new options
debug: Enable debugging will allow the plugin to print out log inside targetOutput element.
limitNumberofFiles: Limit how many files should be uploaded on each single session.
targetOutput: Define where the plugin log should be printed
- Fix concurrent upload problem by adding a random string to the stored file name.
- Fix tolower issue for extensions and MIME's
- Increase performance and adding other bug fixes.
- Fixed iOS 7&8 problem during uploading
- Update documentation.

### Update version 1.4.2:
- Made the styling be more robust and reliable accross browsers.
- Fixed archive styling

### Update version 1.4.3:

- Added label section right below the drag-n-drop box
- Added label and label color options to the plugin
- Simplify allow/disallow file types mechanism
- Updated stylesheet and server side process file

### Update version 1.5:
- Added preview button to enable verifying the file user has uploaded.
- Added 'dragDrop' option to allow using regular upload button instead of the dragDrop featured box.
- Filename format option in PHP file

### Update version 1.5.6:
- Added loading extra effect to indicate that the image still processing
- Added info-icon button for mobile users, so they can check if there was any error retrieved from the server.
- Enhance plugin responsivity for mobile and tablet use

### Update version 1.6.0:
- Added two new themes (Simplex, and super-simplex)
- Integrate the themes and successfully assured its responsiveness
- Embed all of the changes inside "style.css"
- Added new configuration called "theme"

### Update version 1.6.0.1:
- Change any and all cases where the JSON response uses a text boolean to accept true booleans as well

### Update version 1.6.0.2
- Change to add new option hideIcons which will hide all icons other than status of upload

### Update version v1.6.0.3
- New Option 'uploadsFinished' which will fire when all uploads have completed. fails or succeeded. 



