const { expect } = require('chai');

const clear_require_debug = (env = {}) => {
	// reload debug module
	delete require.cache[require.resolve('../lib/debug')];
	// reload env
	delete require.cache[require.resolve('actions-context')];

	for(let k in env) {
		process.env[k] = env[k];
	}
	
	const debug = require('../lib/debug');
	return debug;
};

describe('Debugger', () => {
	it('Does not debug (no env)', () => {
		const debug = clear_require_debug();
		let ret = debug('plep');

		expect(ret).to.be.eql(false);
	});

	it('Does not debug (different envs)', () => {
		let debug = clear_require_debug({
			INPUT_DEBUG: 0
		});
		let ret = debug('plep');
		expect(ret).to.be.eql(false);

		debug = clear_require_debug({
			INPUT_DEBUG: 'false'
		});
		ret = debug('plep');
		expect(ret).to.be.eql(false);

		debug = clear_require_debug({
			INPUT_DEBUG: '0'
		});
		ret = debug('plep');
		expect(ret).to.be.eql(false);
	});

	it('Debugs correctly', () => {
		const debug = clear_require_debug({
			INPUT_DEBUG: 'true'
		});

		let ret = debug('plep');
		expect(ret).to.be.eql(undefined);
	});
});
