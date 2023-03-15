import { flexbox } from 'native-base/lib/typescript/theme/styled-system';
import EStyleSheet from 'react-native-extended-stylesheet';
import Colors from '../../config/Color';

const styles = EStyleSheet.create({
	container: {
		flex: 1,
	},

	containerBodyScroll: {
		flex: 1,
	},

	containerCardPeriod: {
		marginHorizontal: 8,
		marginTop: 8,
	},

	viewInsideCardPeriod: {
		padding: 8,
	},

	containerChooseDate: {
		flexDirection: 'row',
		flex: 1,
	},

	buttonChooseDate: {
		flex: 1,
	},

	labelButtonChooseDate: {
		fontWeight: '600',
		color: '#555',
		marginBottom: 8,
	},

	contentButtonChooseDate: {
		flexDirection: 'row',
		alignItems: 'center',
		borderWidth: 0.5,
		borderColor: '#666',
		padding: 8,
		borderRadius: 4,
		height: 43,
	},

	iconButtonChooseDate: {
		color: '$primaryColor',
		fontSize: 24,
		marginRight: 8,
	},

	valueButtonChooseDate: {
		fontWeight: '600',
		color: '#555',

	},
});

export default styles;
