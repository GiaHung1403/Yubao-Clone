module.exports = {
	presets: ['module:metro-react-native-babel-preset'],
	plugins: [
		[
			require.resolve('babel-plugin-module-resolver'),
			{
				cwd: 'babelrc',
				root: ['./src'],
				extensions: ['.ts', '.tsx', '.js', '.ios.js', '.android.js'],
				alias: {
					'@actions': './src/actions',
					'@assets': './src/assets',
					'@components': './src/components',
					'@data': './src/data',
					'@models': './src/models',
					'@utils': './src/utils',
					'@i18n': './src/i18n',
					'@context': './src/context',
					'@config': './src/config',
					'@screens': './src/screens',
					'@reducers': './src/reducers',
					'@epics': './src/epics',
					'@hooks': './src/hooks',
				},
			},
		],
		'jest-hoist',
		['@babel/plugin-proposal-decorators', { legacy: true }],
		[
			'react-native-reanimated/plugin',
			{
				globals: ['__scanFaces', '__labelImage', '__scanCodes'],
			},
		],
	],
};
