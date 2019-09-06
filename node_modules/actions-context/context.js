const environment = require('./lib/env');
const webhook_data = require('./lib/hook');
const inputs = require('./lib/inputs');

// Multiple exports to ensure devs are happy
module.exports = {
	env: environment,
	environment,
	webhook_data,
	json: webhook_data,
	data: webhook_data,
	inputs
};
