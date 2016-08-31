// ./constants.js

// Charts
export default const LINE_CHART = 1;
export default const PIE_CHART = 2;
export default const BAR_CHART = 3;

export default const toType = function(obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}