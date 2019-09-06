const jira = require('./jira');

const get_jira_tag = (pull_request) => {
	const issue_regex = /(<?ticket_key>[a-zA-Z]{2,4}-[0-9]{1,4})/gi;

	// Let's take a look in the PR title
	let jira_issue = issue_regex.exec(pull_request.title.toUpperCase());

	// Oopsy, maybe in the branch name ?
	if(!jira_issue) {
		jira_issue = issue_regex.exec(pull_request.head.ref.toUpperCase());
	}

	// So so sad
	if(!jira_issue) {
		console.warn('[JIRA Action][Pull Request] Pull request does not specify JIRA ticket in title');
		process.exit(0);
	}
};

const regex_escape = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const transition = (pull_request, transition_name) => {
	transition_name = regex_escape(transition_name);

	let jira_issue = get_jira_tag(pull_request);

	if(!jira_issue) {
		console.warn('[JIRA Action][Pull Request] Pull request does not specify JIRA ticket in title');
		process.exit(0);
	}

	// Reassign to ticket key
	jira_issue = jira_issue.ticket_key.toUpperCase();

	// Pull request was merged
	jira.get_transitions({ key: jira_issue }).then(({ transitions }) => {
		let transition = transitions.find(trans => {
			let r = new RegExp(transition_name, 'gi');
			return r.test(trans.name);
		});

		if(!transition) {
			console.warn(`[JIRA Action][Pull Request] Transition like "${transition_name}" not found for ${jira_issue}`);
			return process.exit(1);
		}

		return jira.do_transition({ key: jira_issue, transition });
	}).then(({ response, status }) => {
		// check result and exit with corresponding code
		if(status !== 204) {
			console.warn(`[JIRA Action][Pull Request] An unexpected error occurred on the jira api while performing the issue transition, please proceed manually`);
			return process.exit(1);
		}

		return process.exit(0);
	}).catch(e => {
		console.warn(`[JIRA Action][Pull Request] An unexpected error occurred while performing the issue transition, please proceed manually`);

		if(e.response) {
			console.warn(`[JIRA Action][Pull Request] Received status: ${e.status}\nResponse: ${e.response}`);
		} else {
			console.error(e);
		}

		return process.exit(1);
	});
};

module.exports = transition;
