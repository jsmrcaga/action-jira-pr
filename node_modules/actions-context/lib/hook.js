const path = require('path');
const env = require('./env');

let json = {};

const event_path = env['GITHUB_EVENT_PATH'];

if(event_path) {
	const resolved_path = path.resolve(process.cwd(), event_path);

	try {
		json = require(resolved_path);
	} catch(e) {
		// to be extra safe */
		console.warn(`[actions-context] Could not read hook data from: ${resolved_path}\n`);
	}
}

module.exports = json;
