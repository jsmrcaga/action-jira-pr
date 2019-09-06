const { expect } = require('chai');

describe('Env test', () => {
	it('Should load an empty env', () => {
		const env = require('../lib/env');

		for(let variable in env.GITHUB_VARS) {
			expect(env[variable]).to.be.undefined;
		}
	});

	it('Should load a single var', () => {
		// delete cache to ensure fresh reload
		delete require.cache[require.resolve('../lib/env')];

		const home = '/my/super/home';
		process.env.HOME = home;
		const env = require('../lib/env');

		expect(env['HOME']).to.be.eql(home);
	});
});
