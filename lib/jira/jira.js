const QueryString = require('querystring');
const fishingrod = require('fishingrod');
const { inputs: { INPUT_JIRA_USERNAME, INPUT_JIRA_TOKEN, INPUT_JIRA_HOSTNAME } } = require('actions-context');

class Jira {
	// Useful for testing purposes
	constructor({ username, token, hostname }) {
		this.username = username || INPUT_JIRA_USERNAME;
		this.token = token || INPUT_JIRA_TOKEN;
		this.hostname = hostname || INPUT_JIRA_HOSTNAME;

		if(!this.username || !this.token || !this.hostname) {
			throw new Error(`Jira: username, token and hostname are required`);
		}
	}

	basicAuth() {
		return Buffer.from(`${this.username}:${this.token}`).toString('base64');
	}

	request({ method='GET', path, query=null, data, headers={} }) {
		if(query) {
			path += `?${QueryString.stringify(query)}`
		}

		headers['Authorization'] = `Basic ${this.basicAuth()}`;

		if(data) {
			headers['Content-Type'] = 'application/json; charset=utf-8'
		}

		return fishingrod.fish({
			https: true,
			method,
			host: this.hostname,
			path,
			data,
			headers
		}).then(({ response, status }) => {
			if(status < 200 || status > 299) {
				let error = new Error(`[RequestError] Could not request JIRA (${status})`);
				error.response = response;
				error.status = status;
				throw error;
			}

			return { response, status };
		});
	}

	do_transition({ key, transition }) {
		return this.request({
			method: 'POST',
			path: `/rest/api/2/issue/${key}/transitions`,
			data: {
				transition: {
					id: transition
				}
			}
		});
	}

	get_transitions({ key }) {
		return this.request({
			path: `/rest/api/2/issue/${key}/transitions`
		});
	}
}

module.exports = Jira;
