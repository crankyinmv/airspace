<?php
require 'class.gitClient.php';
$ref = $_REQUEST['ref'];
$output = gitClient::getCommitDetails($ref);
 
echo $output;
?>
