$(document).ready(function() 
{
	var getTotalCommits = function()
	{
		$.ajax(
		{
			url: 'server/total.php', 
			success: function(result)
			{
				var total = JSON.parse(result);
				$('#total').html(total.total+' commits in repository');
			}
		});
	}


	var getCommitDetails = function(commitLocation, commitRef)
	{
		$.ajax(
		{
			url: "server/subgrid.php?ref="+commitRef, 
			success: function(result)
			{
				var allDetails, someDetails={}, detailArea;

				/* Pop open the details. */
				detailArea = commitLocation.find('.details');
				detailArea.addClass('showMe');

				allDetails = JSON.parse(result);
				someDetails.commit_id = allDetails.node_id;
				someDetails.message = allDetails.commit.message;
				someDetails.org_url = allDetails.committer ? allDetails.committer.organizations_url : '';
				someDetails.repo_url = allDetails.committer ? allDetails.committer.repos_url : '';
				someDetails.avatar_url = allDetails.committer ? allDetails.committer.avatar_url : 'img/default.png';
				someDetails.profile_url = allDetails.committer ? allDetails.committer.html_url : allDetails.html_url;
				
				detailArea.find('.avatar_url').attr('src', someDetails.avatar_url);
				detailArea.find('.profile_url').attr('href', someDetails.profile_url);
				detailArea.find('.org_url').attr('href', someDetails.org_url);
				detailArea.find('.repo_url').attr('href', someDetails.repo_url);
				detailArea.find('.org_url').html(someDetails.org_url);
				detailArea.find('.repo_url').html(someDetails.repo_url);
				detailArea.find('.commit_id').html(someDetails.commit_id);
				detailArea.find('.message').html(someDetails.message);
			}
		});
	}

	/* Handler for the "details" buttons. */
	$('#commits').on( 'click', 'button', function(e)
	{
		var article, id;

		e.preventDefault();

		/* Find the id from the sibling "id" element in the same commit record.  Kinda clunky - sorry. */
		article = e.currentTarget.closest('article');
		id = $(article).find('.id').html();

		/* Retrieve the subgrid. */
		$(article).find('button').attr('disabled', true);
		getCommitDetails($(article), id);
	});

	/* Retrieve the list of commits from GIT. Tempted to make ths an IIFE but still might want to keep it available to click  handlers. */
	var getCommits = function()
	{
		$.ajax(
		{
			url: "server/server.php", 
			success: function(result)
			{
				/* Create a JS object array that's a simplified version of the github JSON. */
				var commits, simplified = [];
				commits = JSON.parse(result);
				commits.forEach(function(e)
				{
					var sc =
					{
						id: e.commit.url.substring(e.commit.url.lastIndexOf('/')+1),
						name: e.commit.committer.name,
						email: e.commit.committer.email,
						avatar_url: e.committer ? e.committer.avatar_url : 'img/default.png',
						html_url: e.html_url,
						datecreated: e.commit.committer.date,
						user_url: e.committer ? e.committer.html_url : e.html_url
					};
					simplified.push(sc);
				});

				/* Clear the commits section + add header. */
				$('#commits').empty();
				let commitHeader = $('#template-commit-header').html();
				$('#commits').append(commitHeader);

				/* Add the commits. */
				simplified.forEach(function(e, index)
				{
					var commitDisplay = $('#template-commit').html();
          				var search = '#commits article:nth-child('+(index+2)+') .';

					$('#commits').append(commitDisplay);
					$(search+'id').html(e.id);
					$(search+'name').html(e.name);
					$(search+'email').html(e.email);
					$(search+'user_url').attr('href', e.user_url);
				          $(search+'user_url').html(e.user_url);
					$(search+'datecreated').html(e.datecreated);
				});

			}
		});
	}

	getCommits();
	getTotalCommits();
});
