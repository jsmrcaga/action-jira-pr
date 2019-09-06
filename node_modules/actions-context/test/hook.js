const { expect } = require('chai');

describe('Hook tests', () => {
	beforeEach(() => {
		// Ensure fresh reload for every module each run
		delete require.cache[require.resolve('../lib/hook')];
		delete require.cache[require.resolve('../lib/env')];
	});

	it('Should load empty hook data', () => {
		const hook = require('../lib/hook');
		expect(hook).to.be.eql({});
	});

	it('Should fail loading data and return empty', () => {
		process.env['GITHUB_EVENT_PATH'] = './chicken.json';
		const hook = require('../lib/hook');
		expect(hook).to.be.eql({});
	});

	it('Should load data and return not empty result', () => {
		process.env['GITHUB_EVENT_PATH'] = './test/hook.json';
		const hook = require('../lib/hook');
		expect(hook).to.be.eql({ test: 25 });
	});
});
