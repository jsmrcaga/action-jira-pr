const { expect } = require('chai');

const Jira = require('../lib/jira/jira');

describe('Jira client tests', () => {
	const key = 'PRO-1391';
	const username = 'test-username';
	const token = 'token';
	const hostname = 'host.na.me';
	const jira = new Jira({ username, token, hostname });

	it('Shoud generate a basic auth base64 header', () => {
		let auth = jira.basicAuth();
		expect(auth).to.be.eql(Buffer.from(`${username}:${token}`).toString('base64'));
	});

	// it('Should initialize a jira client and get transitions for a given key', done => {
	// 	jira.get_transitions({ key }).then(({ response, status }) => {
	// 		console.log(response);
	// 		done();
	// 	}).catch(e => done(e));
	// });

	// it('Should transition a jira issue from code review to in progress', done => {
	// 	jira.do_transition({ key, transition: '21' }).then(({ response }) => {
	// 		console.log(response);
	// 		done();
	// 	}).catch(e => done(e));
	// });
});
