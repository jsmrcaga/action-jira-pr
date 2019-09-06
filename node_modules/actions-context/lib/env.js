// @see https://help.github.com/en/articles/virtual-environments-for-github-actions#environment-variables
const GITHUB_VARS = [
	'HOME',
	'GITHUB_WORKFLOW',
	'GITHUB_ACTION',
	'GITHUB_ACTOR',
	'GITHUB_REPOSITORY',
	'GITHUB_EVENT_NAME',
	'GITHUB_EVENT_PATH',
	'GITHUB_WORKSPACE',
	'GITHUB_SHA',
	'GITHUB_REF',
	'GITHUB_HEAD_REF',
	'GITHUB_BASE_REF'
];

const env = {};

for(let variable of GITHUB_VARS) {
	env[variable] = process.env[variable];
}

env.GITHUB_VARS = GITHUB_VARS;

module.exports = env;
