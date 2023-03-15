import { Dimensions, Platform, StatusBar } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { hasNotch } from 'react-native-device-info';

const widthScreen = Dimensions.get('screen').width;

const styles = EStyleSheet.create({
	container: {
		zIndex: 2,

		'@media android': {
			minHeight: '60rem',
		},
	},

	imageSwiper: {
		width: '100%',
		height: hasNotch() ? '140rem' : '120rem',
	},

	containerWelcome: {
		position: 'absolute',
		top: 8,
		left: 12,
		paddingVertical: 20,
	},

	safeWelcome: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		flexWrap: 'wrap',
	},

	textWelcome: {
		color: '#fff',
		marginLeft: '13rem',
		'@media android': {
			fontWeight: 'bold',
		},

		'@media ios': {
			fontWeight: '600',
		},
	},

	containerNumberBadge: {
		backgroundColor: 'orange',
		width: '16rem',
		height: '16rem',
		borderRadius: '8rem',
		position: 'absolute',
		right: -4,
		top: -4,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 99,
	},

	textNumberBadge: {
		fontSize: 8,
		textAlign: 'center',
		color: '#fff',
	},

	containerMenuTop: {
		backgroundColor: '#f8f4f4',
		zIndex: 10,
	},

	containerLogoMenuTop: {
		position: 'absolute',
		alignSelf: 'center',
		bottom: -5,
		zIndex: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},

	cardLogoMenuTop: {
		width: 65,
		height: 65,
		borderRadius: 35,
	},

	containerImageLogo: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},

	logoMenuTop: {
		'@media android': {
			width: 40,
			height: 40,
		},

		'@media ios': {
			width: 50,
			height: 50,
		},
	},

	scrollMenuTop: {
		backgroundColor: '$primaryColor',
		zIndex: 1,
		width: '100%',
		height: 55,
	},

	containerItemMenuTop: {
		width: widthScreen / 5,
		alignSelf: 'center',
	},

	itemMenuTop: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	imageItemMenuTopNoLib: {
		tintColor: '#fff',
		width: 24,
		height: 24,
	},

	labelItemMenuTop: {
		color: '#fff',
		fontSize: 12,
	},
});

export default styles;
