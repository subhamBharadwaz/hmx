module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'airbnb-base',
		'plugin:prettier/recommended',
		'plugin:import/warnings',
		'plugin:import/typescript'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', 'prettier', 'import'],
	rules: {
		'import/extensions': 'off',
		'consistent-return': 'off',
		'no-console': 'off',
		'no-use-before-define': [
			'error',
			{
				functions: false,
				classes: true,
				variables: true
			}
		],
		'prettier/prettier': [
			'error',
			{
				endOfLine: 'auto'
			}
		]
	},
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts']
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json'
			}
		}
	}
};
