<?php
define("REPOSITORY_URL", 'https://api.github.com/repos/torvalds/linux/commits');
define("REPOSITORY_DETAIL_URL", 'https://api.github.com/repos/torvalds/linux/commits/089cf7f6ecb266b6a4164919a2e69bd2f938374a');
define("UA_NAME", 'Sample-Airspace-App');
define("REPOSITORY_TOTAL_URL", 'https://api.github.com/repos/torvalds/linux/stats/contributors');


class gitClient
{
	private static function initCurl()
	{
		$headers = array("Accept: application/vnd.github.v3+json"); 
       
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
		curl_setopt($ch, CURLOPT_USERAGENT, UA_NAME);
		curl_setopt($ch, CURLOPT_HTTPGET, 1);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

		return $ch;
	}

	public static function getCommits()
	{
		$ch = gitclient::initCurl();
		curl_setopt($ch, CURLOPT_URL, REPOSITORY_URL);
		$output = curl_exec($ch); 
		curl_close($ch);

		return $output;
	}

	public static function getCommitDetails($ref)
	{
		$ch = gitClient::initCurl();
		curl_setopt($ch, CURLOPT_URL, REPOSITORY_URL."/$ref");
		$output = curl_exec($ch); 
		curl_close($ch);

		return $output;
	}

	public static function getCommitTotal()
	{
		/* This is done by adding the contributions of each committer.  This time we'll do it server side. */

		/* Retrieves a JSON string of all the users, total user commits, and weeklky activity of each. */
		$ch = gitClient::initCurl();
		curl_setopt($ch, CURLOPT_URL, REPOSITORY_TOTAL_URL);
		$output = curl_exec($ch); 
		curl_close($ch);

		/* Add just the "total" fields to get the overall total. */
		$activity = json_decode($output);
		$total = 0;
		foreach($activity as $a)
		{
		        $total += intval($a->{'total'});
		}

		return '{"total":"'.$total.'"}';
	}
}
?>
