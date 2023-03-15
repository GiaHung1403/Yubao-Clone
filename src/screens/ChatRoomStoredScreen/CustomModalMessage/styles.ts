import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
	modalContainer: {
		alignItems: 'center',
		position: 'absolute',
		height: '100%',
		width: '100%',
	},

	modalView: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		top: 100,
		width: '85%',
		height: 50,
		backgroundColor: 'black',
		borderRadius: 8,
	},

	textStyle: {
		color: 'white',
		textAlign: 'center',
		fontSize: 24,
		marginLeft: 20,
	},
});
export default styles;