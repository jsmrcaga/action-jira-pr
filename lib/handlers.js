const fishingrod = require('fishingrod');
const transition = require('./transition');

const handlers = {}:

handlers['opened'] = ({ event, env }) => {
	const { pull_request } = event;
	return transition(pull_request, 'code review').then(() => {
		process.exit(0);
	});
};

handlers['closed'] = ({ event, env }) => {
	// don't forget to check for _merged_
	const { pull_request } = event;
	if(!pull_request.merged) {
		return process.exit(0);
	}

	return transition(pull_request, 'qa').then(() => {
		process.exit(0);
	});
};

module.exports = handlers;
