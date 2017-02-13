#JQuery File Uploader
JQuery responsive chunk uploader plugin, that enables you to drag and drop files, including ajax upload and progress bar.

### Features
1- Responsive multi-file uploader
2- Easily filter the file type allowed
3- Server side aware jQuery plugin
4- CSS3 smooth and modem effects
5- More than 15 different options for flexibility
6- Progress bar, preview file support
7- Can be embedded inside forms. Can generate dynamic inputs with your desired upload-id values.
8- Drag n drop feature, plus many more
9- Support deletion

#HOW CAN DROPLY FIT INTO YOUR PHP PROJECT ?

Droply provides a simple backend PHP processing class that enable you to integrate this plugin to any PHP framework easily.

# Setup & Usage

Basic Javascript/Jquery knowledge is necesary to use this plugin: how to set parameters, callbacks, etc.

Dual licensed under the MIT and GPL licenses.
Created by Abdulrhman Elbuni. [Contact Me](mailto:developer@itechflare.com) for more info or anything you want :)

##Demo
Droply in Action: http://www.itechflare.com/droply/

Detailed Documentation: http://www.itechflare.com/droply/docs/

##API
````javascript
$("#company-files").droply(options);
````
This way you can initialize the plugin. Check the documentation and read more about options [options](http://www.itechflare.com/droply/docs/).

##Markup
This is the simple html markup.
````html
<div id="company-files"></div>
````
Even if you test all this in different browsers I recommend to add some kind of link to a basic uploader, this is still a new feature on several platforms.

##Changelog

###Update Version: 1.0
- Initial release (Read docs for more detailed information)

###Update Vesrion: 1.2
- Add disablePostProgressAnimation option to disable progress animation after upload is been completed.
- Add timestamp to files before saving to avoid file replacement.
- Increase performance.

###Update Version: 1.3
- Minor bugs for iOS devices support.
- Refining CSS file
- Emulate hover effect for mobile devices
- Fixing the delete functionality after adding timestamp to saved files
- Stop progress bar animation once the uploading finishes is been enabled by default.

###Update Version: 1.4
- Added three new options
debug: Enable debugging will allow the plugin to print out log inside targetOutput element.
limitNumberofFiles: Limit how many files should be uploaded on each single session.
targetOutput: Define where the plugin log should be printed
- Fix concurrent upload problem by adding a random string to the stored file name.
- Fix tolower issue for extensions and MIME's
- Increase performance and adding other bug fixes.
- Fixed iOS 7&8 problem during uploading
- Update documentation.

###Update version 1.4.2:
- Made the styling be more robust and reliable accross browsers.
- Fixed archive styling

###Update version 1.4.3:

- Added label section right below the drag-n-drop box
- Added label and label color options to the plugin
- Simplify allow/disallow file types mechanism
- Updated stylesheet and server side process file

###Update version 1.5:
- Added preview button to enable verifying the file user has uploaded.
- Added 'dragDrop' option to allow using regular upload button instead of the dragDrop featured box.
- Filename format option in PHP file

###Update version 1.5.6: (Nov 9th, 2014)
- Added loading extra effect to indicate that the image still processing
- Added info-icon button for mobile users, so they can check if there was any error retrieved from the server.
- Enhance plugin responsivity for mobile and tablet use

###Update version 1.6.0: (Sep 15th, 2015)
- Added two new themes (Simplex, and super-simplex)
- Integrate the themes and successfully assured its responsiveness
- Embed all of the changes inside "style.css"
- Added new configuration called "theme"
