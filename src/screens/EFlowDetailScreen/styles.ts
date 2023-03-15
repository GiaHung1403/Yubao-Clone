import Color from '@config/Color';
import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},

	containerHeader: {
		zIndex: 2,
	},

	/* ============================== style body session ========================= */

	containerBody: {
		flex: 1,
	},

	containerFormInput: {
		padding: 8,
	},

	textInputOpinion: {
		height: 60,
	},

	containerButton: {
		flexDirection: 'row',
		marginTop: 16,
		justifyContent: 'center',
	},

	buttonApprove: {
		flex: 1,
		backgroundColor: Color.approved,
	},

	buttonReject: {
		flex: 1,
		backgroundColor: Color.reject,
		marginRight: 8,
	},
});

export default styles;
