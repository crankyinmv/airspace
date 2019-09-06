<?php
require 'class.gitClient.php';

$output = gitClient::getCommitTotal();
echo $output;
?>
