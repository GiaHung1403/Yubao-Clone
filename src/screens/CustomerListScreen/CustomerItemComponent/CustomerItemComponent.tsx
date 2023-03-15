import Color from '@config/Color';
import { getCustomerPayment } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import I18n from '@i18n';
import { ICustomer } from '@models/types';
import { Icon } from 'native-base';
import React, { useEffect, useRef } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';

interface IPropRowCustomerItem {
	icon: string;
	isIconRight?: boolean;
	value: string;
	styleValue?: TextStyle;
	styleContainer?: ViewStyle;
	iconColor?: string;
}

interface IProps {
	dataItem: ICustomer;
	onPressItem: () => void;
}

const rowItemValue = ({
	icon,
	iconColor,
	isIconRight,
	value,
	styleValue,
	styleContainer,
}: IPropRowCustomerItem) => (
	<View
		style={[
			{
				justifyContent: isIconRight ? 'flex-end' : 'flex-start',
				flexDirection: 'row',
				alignItems: 'center',
				flex: 1,
			},
			styleContainer,
		]}
	>
		{isIconRight || !icon ? null : (
			<Icon
				as={Ionicons}
				name={icon}
				size={6}
				color={iconColor}
				marginRight={4}
			/>
		)}
		<Text style={[styleValue, { flex: 1 }]}>{value}</Text>
		{isIconRight && icon ? (
			<Icon
				as={Ionicons}
				name={icon}
				size={6}
				color={iconColor}
				marginLeft={4}
			/>
		) : null}
	</View>
);

export default function CustomerItemComponent(props: IProps) {
	const { dataItem, onPressItem } = props;
	const statusViewRef = useRef<View>(null);
	const { colors } = useTheme();

	const checkID = () => {
		if (dataItem.TAX_CODE?.trim() || dataItem.TAX_CODE?.trim() === null) {
			return dataItem.REG_ID;
		} else {
			return dataItem.TAX_CODE;
		}
	};
	const isVN = I18n.locale === 'vi';

	useEffect(() => {
		(async function getDataPayment() {
			if (dataItem.OB) {
				const dataPayment: any = await getCustomerPayment({
					User_ID: dataItem.TAX_CODE?.trim() || dataItem?.REG_ID,
					Password: '',
				});
				statusViewRef.current?.setNativeProps({
					style: {
						backgroundColor: dataPayment.length > 0 ? 'red' : Color.approved,
					},
				});
			}
		})();
	}, []);

	return (
		<Card
			style={{
				marginBottom: 8,
				backgroundColor:
					dataItem.CHECK_LESEID === 1 || dataItem.OB ? '#fff' : '#dedede',
			}}
			onPress={onPressItem}
		>
			<View
				style={{
					padding: 8,
					flex: 1,
				}}
			>
				{dataItem.CHECK_LESEID === 0 && dataItem.OB && (
					<View style={{ position: 'absolute', top: 8, right: 8 }}>
						<Icon
							as={Ionicons}
							name={'lock-closed-outline'}
							size={4}
							color={dataItem.OB ? colors.primary : Color.approved}
						/>
					</View>
				)}

				{dataItem.OB && (
					<View
						ref={statusViewRef}
						style={{
							width: 10,
							height: 10,
							borderRadius: 5,
							backgroundColor: '#dedede',
							marginBottom: 8,
						}}
					/>
				)}

				{rowItemValue({
					icon: '',
					iconColor: dataItem.OB ? colors.primary : '#2c82c9',
					value: dataItem.LS_NM_V, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}`
					styleValue: {
						marginRight: 24,
						fontWeight: '600',
						color: dataItem.OB ? colors.primary : '#2c82c9',
					},
					styleContainer: { marginBottom: 8 },
				})}

				{rowItemValue({
					icon: '',
					iconColor: dataItem.OB ? colors.primary : '#2c82c9',
					value: dataItem.LS_NM, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}`
					styleValue: {
						marginRight: 24,
						fontWeight: '600',
						color: dataItem.OB ? colors.primary : '#2c82c9',
					},
					styleContainer: { marginBottom: 8 },
				})}

				{rowItemValue({
					icon: 'barcode-outline',
					iconColor: dataItem.OB ? colors.primary : '#2c82c9',
					value: dataItem.LESE_ID.toString(),
					styleContainer: { marginBottom: 8 },
				})}

				{rowItemValue({
					icon: 'location-outline',
					iconColor: dataItem.OB ? colors.primary : '#2c82c9',
					value:
						(isVN ? dataItem?.ADDR_V : dataItem?.ADDR?.trim()) ||
						'No address yet',
					styleContainer: { marginBottom: 8 },
				})}

				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					{rowItemValue({
						icon: 'receipt-outline',
						iconColor: dataItem.OB ? colors.primary : '#2c82c9',
						value:
							dataItem.TAX_CODE?.trim() == '' ||
							dataItem.TAX_CODE?.trim() == null
								? dataItem?.REG_ID
								: dataItem?.TAX_CODE,
						styleContainer: { flex: 1 },
					})}

					{rowItemValue({
						icon: 'person-circle-outline',
						isIconRight: true,
						iconColor: dataItem.OB ? colors.primary : '#2c82c9',
						value: dataItem.OP_EMP_NM,
						styleValue: { textAlign: 'right' },
					})}
				</View>

				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					{rowItemValue({
						icon: 'people-outline',
						iconColor: dataItem.OB ? colors.primary : '#2c82c9',
						value: dataItem.TEAM_LEADER,
						styleContainer: { flex: 3 },
					})}

					{rowItemValue({
						icon: 'logo-apple-appstore',
						isIconRight: true,
						iconColor: dataItem.LOGIN_APP ? colors.primary : '#999',
						value: dataItem.LOGIN_APP ? `Installed App` : 'Not install app',
						styleContainer: { flex: 2 },
						styleValue: { textAlign: 'right' },
					})}
				</View>
			</View>
		</Card>
	);
}
