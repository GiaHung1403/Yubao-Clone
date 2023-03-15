import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import I18n from '@i18n';
import { Icon } from 'native-base';
import React, { useEffect, useRef } from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { IContractTimeline } from '@models/types';
import AvatarBorder from '@components/AvatarBorder/AvatarBorder';

interface IPropRowCustomerItem {
	icon: string;
	isIconRight?: boolean;
	value: string;
	styleValue?: TextStyle;
	styleContainer?: ViewStyle;
	iconColor?: string;
}

interface IProps {
	dataItem: IContractTimeline;
	onPressItem: () => void;
	step: number;
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

export default function ContractTimeLineComponent(props: IProps) {
	const { dataItem, onPressItem, step } = props;
	const statusViewRef = useRef<View>(null);
	const { colors } = useTheme();

	const isVN = I18n.locale === 'vi';

	return (
		<Card
			style={{
				marginBottom: 8,
				// backgroundColor:
				// 	dataItem.CHECK_LESEID === 1 || dataItem.OB === 0 ? '#fff' : '#dedede',
				marginHorizontal: 8,
				overflow: 'hidden',
			}}
			onPress={onPressItem}
		>
			<View
				style={{
					flex: 1,
					backgroundColor: 'transparent',
					flexDirection: 'row',
				}}
			>
				<View
					style={{
						flex: 1,
						backgroundColor: ['Step 9', 'Step 4'].includes(dataItem.prg_step)
							? `${Color.main}60`
							: "#66666630",
					}}
				>
					<View style={{ flex: 1, alignItems: 'center', padding: 5 }}>
						<AvatarBorder
							username={dataItem.mk_emp_no}
							// username={ data.name}
							size={30}
						/>
						<Text
							style={{
								textAlign: 'center',
								// color: 'red',
								fontSize: 12,
							}}
						>
							{dataItem.mk_emp_nm}
						</Text>
					</View>

					<View
						style={{
							flex: 1,
							alignItems: 'flex-end',
							flexDirection: 'row',
							marginBottom: 5,
						}}
					>
						<Text
							style={{
								flex: 1,
								textAlign: 'center',
								color: Color.main,
								fontWeight: '600',
								fontSize: 13,
							}}
						>
							{dataItem.prg_step}
						</Text>
					</View>
				</View>
				<View style={{ flex: 3, padding: 8 }}>
					{rowItemValue({
						icon: '',
						iconColor: colors.primary,
						value: dataItem.ls_nm,
						styleValue: {
							marginRight: 24,
							fontWeight: '600',
							color: colors.primary,
						},
						styleContainer: { marginBottom: 8 },
					})}

					<View style={{ flexDirection: 'row', marginBottom: 8 }}>
						{rowItemValue({
							icon: 'barcode-outline',
							iconColor: colors.primary,
							value: dataItem.apno.toString(),
						})}

						{rowItemValue({
							icon: 'receipt-outline',
							isIconRight: true,
							iconColor: colors.primary,
							value: dataItem.cnid.toString(),
							styleContainer: {},
							styleValue: { textAlign: 'right' },
						})}
					</View>

					<View style={{ flexDirection: 'row' }}>
						{rowItemValue({
							icon: 'people-outline',
							iconColor: colors.primary,
							value: dataItem.sub_team,
							// styleContainer: {paddingTop  : 5},
						})}
						{/* {rowItemValue({
								icon: 'receipt-outline',
								isIconRight: true,
								iconColor: colors.primary,
								value: dataItem.mk_emp_nm.toString(),
								// styleContainer: {flex : 2},
								styleValue: { textAlign: 'right' },
							})} */}
					</View>
				</View>
			</View>
		</Card>
	);
}
