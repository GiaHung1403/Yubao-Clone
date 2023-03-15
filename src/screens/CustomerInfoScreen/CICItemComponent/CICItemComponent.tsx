import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import I18n from '@i18n';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useRef } from 'react';
import { Alert, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { checkCIC, validateCIC_24H } from '@data/api';
import { ICustomer, IUserSystem } from '@models/types';
import { LocalizationContext } from '@context/LocalizationContext';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

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
	checkType?: boolean;
}
let toDay = new Date();

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

export default function CIC_ItemComponent(props: IProps) {
	const { dataItem, checkType } = props;
	const navigation: any = useNavigation();
	const I18n = useContext(LocalizationContext);
	const statusViewRef = useRef<View>(null);
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const isVN = I18n.locale === 'vi';
	const validate = () => {
		const regexTextvalue = /[A-Za-z]/;
		const regexName = /[\[\]\^\$\|\?\*\+\(\)\\~`\!@#%&+={}'""<>:]/;
		const regexID = /[\[\]\^\$\.\|\?\*\+\(\)\\~`\!@#%&_+={}'""<>:;, \/]/;
		const regexAddress = /[\[\]\^\$\|\?\*\\~\!@#%+={}'""<>:]/;
		if (
			dataItem?.cP_NM.match(regexTextvalue) === null ||
			dataItem?.cP_NM === null ||
			regexName.test(dataItem?.cP_NM.trim()) ||
			dataItem?.cP_NM.trim().length <= 2 ||
			dataItem?.cP_NM.trim() === dataItem?.addr_Vn.trim() ||
			dataItem?.cP_NM.trim() === ''
		) {
			return false;
		}

		const address = dataItem?.addr_En || dataItem?.addr_Vn;

		if (
			address.match(regexTextvalue) === null ||
			address === null ||
			regexAddress.test(address.trim()) ||
			address.trim() === ''
		) {
			return false;
		}

		if (
			dataItem?.idNo === null ||
			regexID.test(dataItem?.idNo.trim()) ||
			dataItem?.idNo.trim().length < 7 ||
			dataItem?.idNo.trim() === ''
		) {
			return false;
		}

		return true;
	};

	const validate_24H = async (fromDate, toDate, action, loaiSP) => {
		const result: any = await validateCIC_24H(
			dataItem?.type && dataItem?.type.length > 0
				? {
						msThue: '',
						dkkd: '',
						soCMT: dataItem?.idNo.trim(),
						fromDate,
						toDate,
						action,
						loaiSP,
				  }
				: {
						msThue: dataItem?.idNo.trim(),
						dkkd: dataItem?.idNo.trim(),
						soCMT: '',
						fromDate,
						toDate,
						action,
						loaiSP,
				  },
		);

		if (result?.result === 0) return true;
		else return false;
	};

	const getDateForValidate = () => {
		let toDate = new Date();
		let fromDate = new Date();
		toDate.setDate(10);
		fromDate.setDate(10);
		fromDate.setMonth(fromDate.getMonth() - 1);
		if (toDay >= toDate) {
			let temp = new Date(toDate);
			fromDate = temp;
			toDate.setMonth(toDay.getMonth() + 1);
		}
		return { fromDate, toDate };
	};

	const checkValidate = async item => {
		//Validate ký tự
		if (await !validate()) {
			Alert.alert('Invalid name !!!');
			return;
		}

		//Validate check trong 24h
		if (await validate_24H(toDay, toDay, 'CHECK_VALID_DAY', item)) {
			Alert.alert("Can't check again in 24h !!!");
			return;
		}

		//Validate check từ ngày 10 và 30 ngày
		let date = getDateForValidate();
		if (await validate_24H(date.fromDate, date.toDate, '', item)) {
			Alert.alert("Can't check again in 30 day !!!");
			return;
		}

		const address = dataItem.addr_En || dataItem.addr_Vn;

		if (dataItem?.type && dataItem?.type.length > 0) {
			await checkCIC({
				lesE_ID: dataItem?.lese_ID,
				loaiSP: item,
				tenKH: dataItem?.cP_NM,
				diaChi: address,
				msThue: '',
				dkkd: '',
				soCMT: dataItem?.idNo,
				User_ID: dataUserSystem.EMP_NO,
			});
		} else {
			await checkCIC({
				lesE_ID: dataItem?.lese_ID,
				loaiSP: item,
				tenKH: dataItem?.cP_NM,
				diaChi: address,
				msThue: dataItem?.idNo,
				dkkd: dataItem?.idNo,
				soCMT: '',
				User_ID: dataUserSystem.EMP_NO,
			});
		}
	};

	const _onPre_CheckCIC = async () => {
		if (checkType) {
			if (dataItem?.type && dataItem?.type.length > 0) {
				await checkValidate('S11A');
			} else {
				await checkValidate('S10A');
			}
			navigation.goBack();
		} else {
			if (dataItem?.type && dataItem?.type.length > 0) {
				await checkValidate('S11A');
				await checkValidate('R21');
			} else {
				await checkValidate('S10A');
				await checkValidate('R20');
			}
			navigation.goBack();
		}
	};

	const showConfirmDialog = () => {
		return Alert.alert(
			'Are your sure?',
			'Are you sure you want to check this CIC ???',
			[
				// The "Yes" button
				{
					text: 'Yes',
					onPress: () => {
						// Alert.alert(
						// 	'Alert',
						// 	'This is some error plese try again later, Thanks',
						// );
						_onPre_CheckCIC();
					},
				},
				// The "No" button
				// Does nothing but dismiss the dialog when tapped
				{
					text: 'No',
				},
			],
		);
	};


	return (
		<Card
			style={{
				marginBottom: 8,
				backgroundColor: '#fff',
				marginHorizontal: 8,
			}}
			onPress={showConfirmDialog}
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
					value: dataItem?.cP_NM, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}`
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
					value: dataItem?.tit_NM, // `${isVN ? (dataItem.LS_NM_V || dataItem.LS_NM) : (dataItem.LS_NM || dataItem.LS_NM_V)}`
					styleValue: {
						marginRight: 24,
						fontWeight: '600',
						color: colors.primary,
					},
					styleContainer: { marginBottom: 8 },
				})}

				{rowItemValue({
					icon: 'barcode-outline',
					iconColor: colors.primary,
					value: dataItem?.cP_ID,
					styleContainer: { marginBottom: 8 },
				})}

				{rowItemValue({
					icon: 'location-outline',
					iconColor: colors.primary,
					value:
						(isVN ? dataItem?.addr_Vn?.trim() : dataItem?.addr_En?.trim()) ||
						'No address yet',
					styleContainer: { marginBottom: 8 },
				})}

				<View style={{ flexDirection: 'row', marginBottom: 8 }}>
					{rowItemValue({
						icon: 'receipt-outline',
						iconColor: colors.primary,
						value: dataItem?.idNo,
						styleContainer: { flex: 1 },
					})}

					{dataItem?.kind === '1'
						? rowItemValue({
								icon: 'people-outline',
								isIconRight: true,
								iconColor: colors.primary,
								value: dataItem?.type,
								styleValue: { textAlign: 'right' },
						  })
						: null}
				</View>
			</View>
		</Card>
	);
}
