import EStyleSheet from "react-native-extended-stylesheet";

const styles = EStyleSheet.create({
	labelCustomerInsurance: {
		textAlign: 'center',
		marginTop: 8,
		'@media android': {
			fontWeight: '700',
		},

		'@media ios': {
			fontWeight: '600',
		},
	},
});

export default styles;
