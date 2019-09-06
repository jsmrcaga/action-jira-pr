const context = require('actions-context');
const handlers = require('./lib/handlers');

const { GITHUB_ACTION } = context.env;
let event = context.json;

if(GITHUB_ACTION !== 'pull_request') {
	console.log(`[JIRA Action][Pull Request] Action (${GITHUB_ACTION}) is not pull request, ignoring`);
	console.log(`Event received:\n`, event);
	return process.exit(0);
}

if(!handlers[event.action]) {
	console.log(`[JIRA Action][Pull Request] No handler for event ${event.action}`);
	return process.exit(0);
}

return handlers[event.action]({ event, env });
