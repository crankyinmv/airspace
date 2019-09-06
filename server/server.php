<?php
require 'class.gitClient.php';

$output = gitClient::getCommits();
echo $output;
?>
