<?php
/*
* jQuery droply Plugin; v2015SEP15
* https://www.itechflare.com/
* Copyright (c) 2015-2017 iTechFlare; Licensed: GPL + MIT
* Version : v1.7.1
* Developer: (mindsquare)
*/

include 'droply-processor.php';
  
// If you want to send & recieve extra information from the backend, use 'droplyPostDataExt' event
// Check custom.js to know how you can send extra information
if(isset($_POST['droplyPostDataExt']))
{
  //Use $_POST['droplyPostDataExt']['name'];
  //Use $_POST['droplyPostDataExt']['age'];
  //Use $_POST['droplyPostDataExt']['cat'];
}

$configuration = array(
  'uploadFileDestinationURL' => 'upload-folder', // From server side, define the uploads folder url 
  'maxFileSize' => 1024 * 1024 * 10, // Max 10MB
  'fileNameFormat' => 'prefix', // By given a string here, you will allow all of the filename to be formated as 'fileNameFormat-time-xxx.ext', where xxx are random generated numbers
  'emailNotification' => false, // Enable if you want to recieve emails {You need to use session if you want to disable multiple notifications}
  'adminToEmail' => 'test@test.com',
  'emailSubject' => 'New file has been uploaded',
);

// Initial allowed extensions, you can add-in as many as you want
$allowedExts 	= array( 
      "gif", 
      "jPeg", 
      "jpg", 
      "png", 
      "avi", 
      "mp3", 
      "wav", 
      "mp4",
      "pdf",
      "dOc", 
      "docX", 
      "txt",
      "zip", 
      "rar"
  );

$droply = new Droply_Processor($configuration, $allowedExts);

$droply->process_upload();

?>