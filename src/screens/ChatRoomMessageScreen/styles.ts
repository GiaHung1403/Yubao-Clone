import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
	app: {
		...EStyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#c2ffd2',
	},
	content: {
		padding: 16,
		backgroundColor: 'pink',
		borderRadius: 8,
	},
	arrow: {
		borderTopColor: 'pink',
	},
	background: {
		backgroundColor: 'rgba(0, 0, 255, 0.5)',
	},

	imageItemMenuTopNoLib: {
		tintColor: '#fff',
		width: 30,
		height: 30,
		bottom: 3,
	},
	containerNumberBadge: {
		backgroundColor: 'orange',
		width: '16rem',
		height: '16rem',
		borderRadius: '8rem',
		position: 'absolute',
		right: -5,
		top: -5,
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 99,
	},
	textNumberBadge: {
		fontSize: 8,
		textAlign: 'center',
		color: '#fff',
	},
});

export default styles;
