import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import Header from '@components/Header';
import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';

interface IPropsItemFunction {
	styles?: ViewStyle;
	icon?: string;
	label: string;
	onPress?: () => void;
}

function ItemFunctionInsuranceComponent({
	styles,
	icon,
	label,
	onPress,
}: IPropsItemFunction) {
	return (
		<TouchableOpacity
			style={[
				{
					paddingVertical: 16,
					paddingHorizontal: 8,
					backgroundColor: '#fff',
				},
				styles,
			]}
			onPress={onPress}
		>
			<View style={{ flexDirection: 'row', alignItems: 'center' }}>
				<Icon as={Ionicons} name={icon} color={Color.main} size={7} />
				<Text style={{ marginLeft: 8, flex: 1 }}>{label}</Text>
				<Icon
					as={Ionicons}
					name="chevron-forward-outline"
					color={Color.draft}
					size={5}
				/>
			</View>
		</TouchableOpacity>
	);
}

export function InsuranceSupportDetailScreen(props: any) {
	const navigation: any = useNavigation();

	const { ins_apNo, notice_no, apno, isIndividual } = props.route.params;

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Insurance Support Detail'} />
			</View>

			<View style={{ flex: 1 }}>
				{notice_no ? (
					<ItemFunctionInsuranceComponent
						label="Payment Notice"
						icon="alarm-outline"
						onPress={() =>
							navigation.navigate('WebviewScreen', {
								url: `https://coreapi.chailease.com.vn/Pdf/external-domain-pdf?&Key_ID=export/INSR_PMT/${notice_no}.pdf`,
							})
						}
					/>
				) : null}

				<ItemFunctionInsuranceComponent
					label="Compensation"
					icon="mail-unread-outline"
					styles={{ marginVertical: 8 }}
					onPress={() =>
						navigation.navigate('InsuranceCompensationModal', { apno })
					}
				/>

				{!isIndividual && (
					<ItemFunctionInsuranceComponent
						label="Asset Information"
						icon="car-outline"
						onPress={() =>
							navigation.navigate('InsuranceAssetModal', { ins_apNo })
						}
					/>
				)}
			</View>
		</View>
	);
}
