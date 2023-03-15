import EStyleSheet from 'react-native-extended-stylesheet';
import { Colors } from 'react-native-paper';

const styles = EStyleSheet.create({
	buttonApprove: {
		backgroundColor: Colors.blue700,
		marginTop: 20,
	},
	buttonReject: {
		backgroundColor: Colors.red500,
	},
	containerButton: {
		marginTop: 16,
		justifyContent: 'center',
	},
});
export default styles;
