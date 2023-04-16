'use strict'
const serverlessPrettier = require('@serverless/eslint-config/prettier.config')
module.exports = {
	...serverlessPrettier,
	semi: false,
	tabWidth: 2,
	useTabs: false,
	trailingComma: 'all',
	bracketSpacing: true,
}
