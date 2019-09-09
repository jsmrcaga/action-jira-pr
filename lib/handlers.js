const fishingrod = require('fishingrod');
const transition = require('./transition');

const handlers = {};

const new_pr = ({ event, env }) => {
	const { pull_request } = event;
	if(pull_request.closed_at) {
		console.log(`[JIRA Action][Pull Request] Event ${event.action} triggered but pull request closed.`);
		process.exit(0);
	}

	return transition(pull_request, 'code review').then(() => {
		process.exit(0);
	});
};

handlers['opened'] = new_pr;
handlers['synchronize'] = new_pr;
handlers['edited'] = new_pr;

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
