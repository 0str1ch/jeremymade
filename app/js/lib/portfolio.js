// Add a class on click... maybe use for something interesting, like a dark/light mode?

function hasClass(element, clientHover) {
	var regExp = new RegExp('(\\s|^)' + clientHover + '(\\s|$)');
	// !! coerces the condition to a boolean result
	return !!element.className.match(regExp);
}
 
function addClass(element, clientHover) {
	if (element.classList) {
		element.classList.add(clientHover);
	}
	else if (!hasClass(element, clientHover)){
		element.className += " " + clientHover;
	}
}
 
function removeClass(element, clientHover) {
	if (element.classList) {
		element.classList.remove(clientHover);
	}
	else if (hasClass(element, clientHover)) {
		// Here, it's still necessary to write a regular expression object, so we can use the "replace" function below
		var regExp = new RegExp('(\\s|^)' + clientHover + '(\\s|$)');
		element.className.replace(regExp, ' ');
	}
}

