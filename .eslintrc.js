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
		'plugin:import/typescript',
		'plugin:security/recommended'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 13,
		sourceType: 'module'
	},
	plugins: ['@typescript-eslint', 'prettier', 'import', 'security'],
	rules: {
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': ['error'],
		'import/extensions': 'off',
		'consistent-return': 'off',
		'no-console': 'off',
		'no-underscore-dangle': 'off',
		'no-param-reassign': 'off',
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
