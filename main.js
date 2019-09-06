const context = require('actions-context');
const handlers = require('./lib/handlers');

const { GITHUB_ACTION } = context.env;

if(GITHUB_ACTION !== 'pull_request') {
	return process.exit(0);
}

let event = context.json;

if(!handlers[event.action]) {
	console.log(`[JIRA Action][Pull Request] No handler for event ${event.action}`);
	return process.exit(0);
}

return handlers[event.action]({ event, env });
