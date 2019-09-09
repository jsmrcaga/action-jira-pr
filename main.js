const debug = require('./lib/debug');
const context = require('actions-context');

const { GITHUB_EVENT_NAME } = context.env;
let event = context.json;

if(GITHUB_EVENT_NAME !== 'pull_request') {
	console.log(`[JIRA Action][Pull Request] Action (${GITHUB_EVENT_NAME}) is not pull request, ignoring`);
	debug(`Event name:\n`, GITHUB_EVENT_NAME);
	return process.exit(0);
}

const handlers = require('./lib/handlers');

if(!handlers[event.action]) {
	console.log(`[JIRA Action][Pull Request] No handler for event ${event.action}`);
	debug(`Event received:\n`, event);
	return process.exit(0);
}

const { env } = context;

return handlers[event.action]({ event, env });
