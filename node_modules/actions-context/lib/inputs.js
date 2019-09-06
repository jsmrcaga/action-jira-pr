const inputs = {};

const keys = Object.keys(process.env);

for(let key of keys) {
	if(/^INPUT_/.test(key)) {
		inputs[key] = process.env[key];
	}
}

module.exports = inputs;
