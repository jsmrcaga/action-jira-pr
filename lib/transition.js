const jira = require('./jira');

const TAG = '[JIRA Action][Pull Request]';

const get_jira_tag = (pull_request) => {
	const issue_regex = /(?<ticket_key>[a-zA-Z]{2,4}-[0-9]{1,4})/gi;

	// Let's take a look in the PR title
	let jira_issue = issue_regex.exec(pull_request.title.toUpperCase());

	// Oopsy, maybe in the branch name ?
	if(!jira_issue) {
		jira_issue = issue_regex.exec(pull_request.head.ref.toUpperCase());
	}

	// So so sad
	if(!jira_issue) {
		console.warn(`${TAG} Pull request does not specify JIRA ticket in title or branch`);
		console.warn(`${TAG} Title: ${pull_request.title}`);
		console.warn(`${TAG} Ref: ${pull_request.head.ref}`);
		process.exit(0);
	}

	return jira_issue.groups.ticket_key.toUpperCase();
};

const regex_escape = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const transition = (pull_request, transition_name) => {
	transition_name = regex_escape(transition_name);

	let jira_issue = get_jira_tag(pull_request);

	// Pull request was merged
	return jira.get_transitions({ key: jira_issue }).then(({ response: { transitions } }) => {
		let transition = transitions.find(trans => {
			let r = new RegExp(transition_name, 'gi');
			return r.test(trans.name);
		});

		if(!transition) {
			console.warn(`${TAG} Transition like "${transition_name}" not found for ${jira_issue}`);
			return process.exit(1);
		}

		return jira.do_transition({ key: jira_issue, transition: transition.id });
	}).then(({ response, status }) => {
		// check result and exit with corresponding code
		if(status !== 204) {
			console.warn(`${TAG} An unexpected error occurred on the jira api while performing the issue transition, please proceed manually`);
			return process.exit(1);
		}

		return process.exit(0);
	}).catch(e => {
		console.warn(`${TAG} An unexpected error occurred while performing the issue transition, please proceed manually`);

		if(e.response) {
			console.warn(`${TAG} Received status: ${e.status}\nResponse: ${e.response}`);
		} else {
			console.error(e);
		}

		return process.exit(1);
	});
};

module.exports = transition;
