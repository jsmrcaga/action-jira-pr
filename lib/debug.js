const { inputs: { INPUT_DEBUG } } = require('actions-context');

const debug = (...args) => {
	const falsy = ['false', 0, '0'];
	if(!INPUT_DEBUG || falsy.includes(INPUT_DEBUG)) {
		return false;
	}

	return console.log(...args);
};

module.exports = debug;
