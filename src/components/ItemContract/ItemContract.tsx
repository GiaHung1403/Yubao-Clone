import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import { LocalizationContext } from '@context/LocalizationContext';
import { getContractAssets } from '@data/api';
import { convertUnixTimeSolid, formatVND } from '@utils';

import styles from './styles';
import TextInfoRow from '@components/TextInfoRow';
import { callPhoneDefault } from '@utils/callPhone';
import { phoneNumberCompany } from '@data/Constants';
import { Card } from 'react-native-paper';
import { IContract } from '@models/types';

const IMG_ARROW_RIGHT = require('@assets/arrow_right_animation.json');

interface IProps {
	onPressItem: any;
	item: IContract;
	stylesItem?: ViewStyle;
	taxCode: string;
}

export default function ItemContract(props: IProps) {
	const { onPressItem, item, stylesItem, taxCode } = props;
	const [listAssets, setListDataAssets] = useState<any>(null);

	const I18n = useContext(LocalizationContext);
	const textDept = I18n.t('outstandingAmount');
	const textRemain = I18n.t('remainAmount');
	const textExpiredDay = I18n.t('expiredDay');
	const textTenor = I18n.t('tenor');
	const textInterestRate = I18n.t('interestRate');
	const textContactPerson = I18n.t('contactPerson');
	const textPressToCall = I18n.t('press_to_call');

	useEffect(() => {
		(async function getData() {
			const listData: any = await getContractAssets({
				User_ID: taxCode,
				Password: taxCode,
				APNO: item.apno,
			});

			setListDataAssets(listData);
		})();
	}, []);

	if (item.current_Outbal === 0) {
		return null;
	}

	return (
		<Card
			elevation={2}
			onPress={() => onPressItem(listAssets)}
			style={[styles.container, stylesItem]}
		>
			<View style={styles.circleLeft} />
			<View style={styles.circleBottom} />
			<View
				style={{ flexDirection: 'row', marginBottom: 4, marginHorizontal: 8 }}
			>
				<TextInfoRow
					icon={'barcode-outline'}
					iconColor={'#fff'}
					value={item.apno.toString()}
					styleValue={{ fontWeight: '600', color: '#f1c40f' }}
				/>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text
						style={{
							fontWeight: '500',
							color: '#f1c40f',
						}}
					>
						{I18n.locale === 'vi' ? item.status_VN : item.status_EN}
					</Text>
					<View
						style={{
							width: 10,
							height: 10,
							borderRadius: 6,
							backgroundColor: '#f1c40f',
							marginLeft: 4,
						}}
					/>
				</View>
			</View>

			<View
				style={{ flexDirection: 'row', marginHorizontal: 8, marginBottom: 4 }}
			>
				<TextInfoRow
					icon={'cash-outline'}
					iconColor={'#fff'}
					value={`${item.aprv_amt} ${item.cur_c}`}
					styleValue={{ color: '#fff', flex: 1 }}
					containerStyle={{ marginRight: 8 }}
				/>

				<TextInfoRow
					icon={'timer-outline'}
					iconColor={'#fff'}
					isIconRight
					value={`${convertUnixTimeSolid(
						new Date(item.sign_Date1).getTime() / 1000,
					)}`}
					styleValue={{ color: '#fff' }}
				/>
			</View>

			<TextInfoRow
				icon={'hourglass-outline'}
				iconColor={'#fff'}
				label={`${textTenor}: `}
				styleLabel={{ flex: 0, color: '#fff' }}
				value={item.tenor}
				styleValue={{ color: '#fff' }}
				containerStyle={{ marginHorizontal: 8, flex: 2, marginBottom: 4 }}
			/>

			<TextInfoRow
				icon={'pulse-outline'}
				iconColor={'#fff'}
				label={`${textInterestRate}: `}
				styleLabel={{ flex: 0, color: '#fff' }}
				value={`${item.interest_Rate}%`}
				styleValue={{ color: '#fff' }}
				containerStyle={{ marginHorizontal: 8, flex: 2, marginBottom: 4 }}
			/>

			<TextInfoRow
				icon={'cash-outline'}
				iconColor={'#fff'}
				label={`${textDept}: `}
				styleLabel={{ flex: 0, color: '#fff' }}
				value={`${formatVND(parseInt(item.current_Outbal.toString(), 10))} ${item.cur_c}`}
				styleValue={{ color: '#fff' }}
				containerStyle={{ marginHorizontal: 8, flex: 2, marginBottom: 4 }}
			/>

			<TextInfoRow
				icon={'cash-outline'}
				iconColor={'#fff'}
				label={`${textRemain}: `}
				styleLabel={{ flex: 0, color: '#fff' }}
				value={`${formatVND(parseInt(item?.REMAIN_FIN_AMT, 10))} ${item.cur_c}`}
				styleValue={{ color: '#fff' }}
				containerStyle={{ marginHorizontal: 8, flex: 2, marginBottom: 4 }}
			/>

			<TextInfoRow
				icon={'timer-outline'}
				iconColor={'#fff'}
				label={`${textExpiredDay}: `}
				styleLabel={{ flex: 0, color: '#fff' }}
				value={item?.EXP_DATE}
				styleValue={{ color: '#fff' }}
				containerStyle={{ marginHorizontal: 8, flex: 2, marginBottom: 4 }}
			/>

			<View style={styles.containerViewTitle}>
				<View style={styles.lineLeft} />
				<Text style={styles.titleCenter}>{textContactPerson}</Text>
				<View style={styles.lineRight} />
			</View>

			<TouchableOpacity
				onPress={() => callPhoneDefault(`${phoneNumberCompany},${item.ext}`)}
				style={{ marginHorizontal: 8 }}
			>
				<TextInfoRow
					icon={'call-outline'}
					iconColor={'#fff'}
					value={`${item.mk_Emp_NM} (${textPressToCall})`}
					styleValue={{ color: '#fff', flex: 1 }}
				/>
			</TouchableOpacity>

			<View style={{ alignItems: 'flex-end' }}>
				<LottieView
					source={IMG_ARROW_RIGHT}
					autoPlay
					loop
					style={{ width: 30, height: 18 }}
					resizeMode="contain"
				/>
			</View>
		</Card>
	);
}
