import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import I18n from '@i18n';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Alert, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { ICustomer } from '@models/types';
import { LocalizationContext } from '@context/LocalizationContext';
import { useNavigation } from '@react-navigation/native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

interface IPropRowCustomerItem {
	icon: string;
	isIconRight?: boolean;
	value: string;
	styleValue?: TextStyle;
	styleContainer?: ViewStyle;
	iconColor?: string;
}

interface IProps {
	dataItem: any;
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

export default function CIC_Item_History_Component(props: IProps) {
	const { dataItem, onPressItem } = props;
	const I18n = useContext(LocalizationContext);
	const statusViewRef = useRef<View>(null);
	const { colors } = useTheme();
	const navigation: any = useNavigation();
	const isVN = I18n.locale === 'vi';


	const convertHtmlToPDF = async () => {
		let options = {
			html: dataItem?.cicHtmlResult
						.replace(/\\n/g, ' ')
						.replace(/\\\"/g, '"'),
			fileName: 'CIC Report',
			directory: 'Documents',
		};
		let file = await RNHTMLtoPDF.convert(options);
		 navigation.navigate('DocumentPDFViewScreen', {
				urlPDF: file.filePath,
				isShowButton: false,
			});
	};

	return (
		<Card
			style={{
				marginBottom: 8,
				backgroundColor: '#fff',
				marginHorizontal: 8,
			}}
			// onPress={() => {
			// 	navigation.navigate('WebviewScreen', {
			// 		url: dataItem?.cicHtmlResult
			// 			.replace(/\\n/g, ' ')
			// 			.replace(/\\\"/g, '"'),
			// 		title: 'CIC Report',
			// 		isHTML: true,
			// 	});
			// }}
			onPress={()=>{
				convertHtmlToPDF();
			}}
		>
			<View
				style={{
					padding: 8,
					flex: 1,
				}}
			>
				{dataItem.CHECK_LESEID === 0 && (
					<View style={{ position: 'absolute', top: 8, right: 8 }}>
						<Icon
							as={Ionicons}
							name={'lock-closed-outline'}
							size={6}
							color={dataItem.OB === 1 ? colors.primary : Color.approved}
						/>
					</View>
				)}

				{dataItem.OB === 1 && (
					<View
						ref={statusViewRef}
						style={{
							width: 10,
							height: 10,
							borderRadius: 5,
							backgroundColor: '#dedede',
							marginLeft: 8,
							position: 'absolute',
							top: 8,
							right: 8,
						}}
					/>
				)}

				{rowItemValue({
					icon: '',
					iconColor: colors.primary,
					value: dataItem?.ls_nm, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}`
					styleValue: {
						marginRight: 24,
						fontWeight: '600',
						color: colors.primary,
					},
					styleContainer: { marginBottom: 8 },
				})}

				{rowItemValue({
					icon: '',
					iconColor: colors.primary,
					value: `${dataItem?.ciC_Type} - ${dataItem?.ciC_Type_Nm}`, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}`
					styleValue: {
						marginRight: 24,
						fontWeight: '600',
						color: colors.primary,
					},
					styleContainer: { marginBottom: 8 },
				})}

				{/* <View style={{ flexDirection: 'row', marginBottom: 8 }}>
					{rowItemValue({
						icon: '',
						iconColor: colors.primary,
						value: dataItem?.ciC_Type_Nm,
						styleValue: {
							marginRight: 24,
							fontWeight: '600',
							color: colors.primary,
						},
						styleContainer: { flex: 1 },
					})}

					{rowItemValue({
						icon: '',
						isIconRight: true,
						iconColor: colors.primary,
						value: dataItem?.ciC_Type,
						styleValue: { textAlign: 'right' },
					})}
				</View> */}

				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					{rowItemValue({
						icon: 'barcode-outline',
						iconColor: colors.primary,
						value: dataItem?.id,
						styleContainer: { flex: 1 },
					})}

					{rowItemValue({
						icon: 'calendar-outline',
						isIconRight: true,
						iconColor: colors.primary,
						value: dataItem?.subDate,
						styleValue: { textAlign: 'right' },
					})}
				</View>

				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					{rowItemValue({
						icon: 'receipt-outline',
						iconColor: colors.primary,
						value: dataItem?.tax_Code,
						styleContainer: { flex: 1 },
					})}

					{rowItemValue({
						icon: 'checkmark-circle-outline',
						isIconRight: true,
						iconColor: dataItem?.cfm_YN ? colors.primary : colors.disabled,
						value: '',
						styleValue: { textAlign: 'right' },
					})}
				</View>

				{rowItemValue({
					icon: 'list-outline',
					iconColor: colors.primary,
					value: dataItem?.status_Name, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}
					styleContainer: { flex: 1 },
				})}
			</View>
		</Card>
	);
}
