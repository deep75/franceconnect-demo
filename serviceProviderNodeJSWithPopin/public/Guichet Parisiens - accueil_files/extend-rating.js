
function displayId(baliseId) {
	if (document.getElementById && document.getElementById(baliseId) != null) {
		document.getElementById(baliseId).style.visibility = 'visible';
		document.getElementById(baliseId).style.display = 'block';
	}
}

function hideId(baliseId) {
	if (document.getElementById && document.getElementById(baliseId) != null) {
		document.getElementById(baliseId).style.visibility = 'hidden';
		document.getElementById(baliseId).style.display = 'none';
	}
}

function getElementById(id) {
	if (document.getElementById)
		return document.getElementById(id);
	if (document.all)
		return eval("document.all." + id);
	return null;
}

function display(id, value) {
	var panel = getElementById(id);
	panel.style.display = value;
}

function doDisplay(id) {
	displayId("div" + id);
}
function hide(id) {
	hideId("div" + id);

}

function doCheckboxEffect(isChecked, id) {
	if (isChecked) {
		doDisplay(id);

	} else {
		hide(id);
	}
}
$(document).ready( function() {
	$(".resource-vote-star-rating-javascript-disable").hide();
	$(".resource-vote-star-rating").show();

});

$( function() {
	$('.star-rating').rating( {
		callback : function(value, link) {
			// 'this' is the hidden form element holding the current value
			// 'value' is the value selected
			// 'element' points to the link element that received the click.
			// To submit the form automatically:
			this.form.voteValue.value = value;
			if (value != '') {
				this.form.submit();
			}
		}
	});
});
