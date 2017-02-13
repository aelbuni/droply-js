<?php
/*
* jQuery droply Plugin; v2015SEP15
* http://www.itechflare.com/
* Copyright (c) 2015-2016 iTechFlare; Licensed: Commercial
* Version : v1.7.1
* Developer: (mindsquare)
*/


class Droply_Processor
{
  // Change this list to allow more files to be uploaded
  private $configuration;
  private $chunkEnabled;
  
  public function __construct($configration = array(), $allowedExtensions = array('gif', 'jpg', 'png'))
  {
     // Initialize configuration
     $this->configuration = array(
        'uploadFileDestinationURL' => 'uploads/', // From server side, define the uploads folder url 
        'maxFileSize' => 1024 * 1024 * 10, // Max 10MB
        'fileNameFormat' => '', // By given a string here, you will allow all of the filename to be formated as 'fileNameFormat-time-xxx.ext', where xxx are random generated numbers
        'emailNotification' => false, // Enable if you want to recieve emails {You need to use session if you want to disable multiple notifications}
        'adminToEmail' => 'test@test.com',
        'emailSubject' => 'New file has been uploaded',
    );
    
    // Update configuration with user configuration
    $this->configuration = array_merge($this->configuration, $configration);
    
    // Force adding seperator at the end of the path
    $path = rtrim($this->configuration['uploadFileDestinationURL'], '/') . '/';
    $this->configuration['uploadFileDestinationURL'] = $path; 
    
    $this->allowedExts = $allowedExtensions;
    $this->chunkEnabled = true;
    
    $this->verify_upload_folder();
  }
  
  public function __header()
  {
    // Make sure file is not cached (as it happens for example on iOS devices)
    header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");
  }
  
  public function add_extension($ext_list)
  {
    array_merge($this->allowedExts, $ext_list);
  }
  
  public function process_upload()
  {
    // Call header
    $this->__header();
    $json = array();
    
    // Sanitize the whole input
    $_REQUEST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);
    
    $chunk_enabled = isset($_REQUEST['chunk-upload'])?$_REQUEST['chunk-upload']:"false";
    
    // Check if it was a delete command
    if(isset($_REQUEST['command']) && $_REQUEST['command']=='delete')
    {
      if(isset($_REQUEST['droplyfn'])){
        $filename = base64_decode($_REQUEST['droplyfn']);
        $this->delete_file($filename);
      }else{
        $json['error'] = "File not found";
        $json['status'] = 'false';

        echo json_encode($json);
        die();
      }
    }
    
    // Check if chunk upload is enabled ?
    if($chunk_enabled == "false"){
        $this->chunkEnabled = false;
        $filename = $this->filter_filename($_FILES['SelectedFile']['name']);
        $temp = explode(".", $_FILES['SelectedFile']['name']);
    }else{
        $this->chunkEnabled = true;
        $filename = $this->filter_filename($_REQUEST['file-name']);
        $temp = explode(".", $filename);
    }
    
    // Check extension validity
    $allowedE = $this->check_extension_validity($temp);
    $allowedS = $this->check_file_size();
    
    if(!$this->chunkEnabled)
    {
      // Regular upload
      $json = $this->handle_regular_upload($allowedE, $allowedS);
    }else{
      // Chunk upload
      $json = $this->handle_chunk_upload($allowedE, $allowedS);
    }
    
    // Finished processing
    $this->finished_processing($json);
  }
  
  function filter_filename($filename)
  {
    $filename = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $filename);
    // Remove any runs of periods (thanks falstro!)
    $filename = mb_ereg_replace("([\.]{2,})", '', $filename);
    
    return $filename;
  }
  
  function check_extension_validity($temp)
  {
    // Enforce extensions to be converted into lower case
    $this->allowedExts = array_map('strtolower', $this->allowedExts);

    // Business Logic
    $extension = end($temp);
    $allowedE = false;

    $json = array();
    $json['status'] = 'false';

    $extension = strtolower($extension);
    $extension = trim($extension, " ");

    // Check extension
    if(in_array($extension, $this->allowedExts)){
        $allowedE = true;
    }
    else
    {
		if($this->chunkEnabled)
			$json['error'] = $_REQUEST["file-type"].": Invalid file type!";
		else
			$json['error'] = $_FILES["SelectedFile"]["type"].": Invalid file type!";
			
        echo json_encode($json);
        die();
    }
    
    return true;
  }
  
  function handle_chunk_upload($allowedE, $allowedS)
  {
    $json = array();
    $json['status'] = 'false';

    $fileIndex = '';
    // Handle chunk upload scheme
	// Get a file name
	if (isset($_REQUEST["file-name"])) {
		$fileName = $this->filter_filename($_REQUEST["file-name"]);
	}else{
		$json['msg'] = 'Invalid request.';
		echo json_encode($json);
		die();
	}
	
    if (isset($_REQUEST["fileIndx"])) {
		$fileIndex = intval($_REQUEST["fileIndx"]);
	}
    
	$filename = pathinfo($fileName,PATHINFO_FILENAME);
	$extension = pathinfo($fileName,PATHINFO_EXTENSION);

	$filePath = $this->configuration['uploadFileDestinationURL'] . $fileName;
		
	// Get chunk number, along with chunk total number (chunks)
	$chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
	$chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;
	
	// Open temp file
	if (!$out = @fopen("{$filePath}.{$fileIndex}.part", $chunks ? "ab" : "wb")) {
		$json['msg'] = 'Failed to open output stream.';
		echo json_encode($json);
		die();
	}

	if (!empty($_FILES)) {
		if ($_FILES["file"]["error"] || !is_uploaded_file($_FILES["file"]["tmp_name"])) {
			$json['msg'] = 'Failed to move uploaded file.';
			echo json_encode($json);
			die();
		}

		// Read binary input stream and append it to temp file
		if (!$in = @fopen($_FILES["file"]["tmp_name"], "rb")) {
			$json['msg'] = 'Failed to open input stream.';
			echo json_encode($json);
			die();
		}
	} else {	
		if (!$in = @fopen("php://input", "rb")) {	
			$json['msg'] = 'Failed to open input stream.';
			echo json_encode($json);
			die();
		}
	}

	while ($buff = fread($in, 4096)) {
		fwrite($out, $buff);
	}

	@fclose($out);
	@fclose($in);

	// Check if file has been uploaded
	if (!$chunks || $chunk == $chunks) {
		
		// ********* Sending Notification Email ***************
		  if($this->configuration['emailNotification'])
		  {
			$this->send_email_notification();
		  }
		// ****************************************************
		
		// Changing filename
		  if($this->configuration['fileNameFormat'] == '')
			$newname = $filename . "-". time() . '-' .rand(10,1000)."." . $extension;  
		  else
			$newname = $this->configuration['fileNameFormat'] . "-". time() . '-' .rand(10,1000)."." . $extension;  
		
		// Update the name to a new name to avoid overwriting files
		$filePath2 = $this->configuration['uploadFileDestinationURL'] . $newname;
		
		// Strip the temp .part suffix off 
		rename("{$filePath}.{$fileIndex}.part", $filePath2);
		
		$json['status'] = 'true';
		$json['msg'] = $fileName.' Has been successfully uploaded!';
		$json['newFileName'] = $newname;
		$json['fullPath'] = $filePath2;
	}
    
    if (is_array($json)) {
      $json['status'] = 'true'; 
    }else{
      $json = array(
        'status' => 'true'
      );
    }
    echo json_encode($json);
    die();
  }
  
  function send_email_notification()
  {
    $msg = "New file has been uploaded\nStorage location: ".$this->configuration['uploadFileDestinationURL'];
    // send email
    try{
      mail($this->configuration['adminToEmail'], $this->configuration['emailSubject'],$msg);
    }catch(Exception $exp) {
      error_log('Droply: Email notification failed');
    }
  }
  
  function handle_regular_upload($allowedE, $allowedS)
  {
    $json = array();
    $json['status'] = 'false';

    // Handle normal upload schemes
    if( $allowedE && $allowedS)
    {
      if ($_FILES["SelectedFile"]["error"] > 0) {
        $json['msg'] = "Return Code: " . $_FILES["SelectedFile"]["error"];
      } else {
        if (!file_exists($this->configuration['uploadFileDestinationURL'] . time()."-".$_FILES["SelectedFile"]["name"] )) {
          $filename = pathinfo($_FILES["SelectedFile"]["name"],PATHINFO_FILENAME);
          $extension = pathinfo($_FILES["SelectedFile"]["name"],PATHINFO_EXTENSION);
          
          // Changing filename
          if($this->configuration['fileNameFormat'] == '')
          $newname = $filename . "-". time() . '-' .rand(10,1000)."." . $extension;  
          else
          $newname = $this->configuration['fileNameFormat'] . "-". time() . '-' .rand(10,1000)."." . $extension;  
          
          move_uploaded_file($_FILES["SelectedFile"]["tmp_name"], $this->configuration['uploadFileDestinationURL'] . $newname);
          
          // ********* Sending Notification Email ***************
          if($this->configuration['emailNotification'])
          {
          $this->send_email_notification();
          }
          // ****************************************************
          
          $json['status'] = 'true';
          $json['msg'] = $_FILES["SelectedFile"]["name"].' Has been successfully uploaded!';
          $json['newFileName'] = $newname;
          $json['fullPath'] = $this->configuration['uploadFileDestinationURL'] . $newname;
        }else{
          $json['msg'] = 'File already exist!';
          echo json_encode($json);
          die();
        }
      }
    }
    
    return $json;
  }
  
  public function verify_upload_folder()
  {
    $currentPath = rtrim(getcwd(), '/') . '/';
    $path = $currentPath.($this->configuration['uploadFileDestinationURL']);
    $path = rtrim($path, '/') . '/';

    // Create uploads folder if doesn't exist
    if (!file_exists($path)) {
        mkdir($path, 0766, true);
        touch($path.'index.php');
    }
  }
  
  function check_file_size()
  {
    $allowedS = false;
	
	if($this->chunkEnabled)
      $fileSize = intval($_REQUEST['file-size']);
	else
      $fileSize = intval($_FILES["SelectedFile"]["size"]);

    // Check file size limit
    if($fileSize < $this->configuration['maxFileSize'])
    {
        $allowedS = true;
    }else{
        $json['status'] = 'false';
        $json['error'] = "File size has exceeded the limit (".$this->configuration['maxFileSize'].")!";

        echo json_encode($json);
        die();
    }
    
    return true;
  }
  
  function finished_processing($json)
  {
    // Print out results
    echo json_encode($json);
    die();
  }
  
  function delete_file_by_name($fileName)
  {
    // Please handle deletion safely, as this part could be exploited by hackers

  } 
  
  function delete_file($filename)
  {
    $filename = $this->filter_filename($filename);

    // Handle file deletion here
    $this->delete_file_by_name($filename);

    echo $filename.' Has been deleted!';
    die();
  }

}