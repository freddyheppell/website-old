function showProjects(value, animation) {
	// Fade out the entire section
	$(".projects").hide();

	// Show all projects
	$(".project").show();

	if (value != "NONE") {
		// Hide all projects not in the correct tag
		$(".project").not('[data-tags*="' + value +'"]').hide();
	}
	if (animation) {
		$(".projects").fadeIn();
	} else {
		$(".projects").show();
	}
}

function setHashValue(value) {
	if (value == "NONE") {
		value = ""
	}

	window.location.hash = value;
}

$( document ).ready(function() {

	var select = $("#projects_select");
	select.change(function() {
		var value = select.val();
		setHashValue(value);

		showProjects(value, true);
	});

	if(window.location.hash) {
	  // A value has already been specified in the url
	  // Remove the hash character
	  hashString = window.location.hash.replace('#', '');
	  showProjects(hashString, false)

	  select.val(hashString);
	}
});
