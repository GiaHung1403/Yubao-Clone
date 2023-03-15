import LottieView from 'lottie-react-native';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	Image,
	Linking,
	Platform,
	Text,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';

import { LocalizationContext } from '@context/LocalizationContext';
import { phoneNumberCompany } from '@data/Constants';
import { convertUnixTimeSolid, formatVND } from '@utils';
import styles from './styles';
import { getCustomerPayment } from '@data/api';
import { ICustomerPayment, IPaymentNotice } from '@models/types';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');
const IMG_ARROW_RIGHT = require('@assets/arrow_right_animation.json');

interface IProps {
	onPressItem: any;
	item: IPaymentNotice;
	stylesItem?: ViewStyle;
	taxCode: string;
}


export default function ItemNotice(props: IProps) {
	const { onPressItem, item, stylesItem, taxCode } = props;
	const I18n = useContext(LocalizationContext);

	const [itemPayment, setItemPayment] = useState<ICustomerPayment>();

	const textTotalPayment = I18n.t('totalPayment2');
	const textNoticeNo = I18n.t('noticeNo');
	const textContactPerson = I18n.t('contactPerson');
	const textDueDate = I18n.t('dueDate');

	useEffect(() => {
		(async function getDataPayment() {
			const dataPayment: any = await getCustomerPayment({
				User_ID: taxCode,
				Password: '',
			});

			const payment = dataPayment.find(itemP => itemP.NOTE_NO === item.note_no);
			setItemPayment(payment);
		})();
	}, []);

	const _onPressPhoneIcon = (numberPhone: string) => {
		let phoneNumber = '';

		if (Platform.OS === 'android') {
			phoneNumber = `tel:${numberPhone}`;
		} else {
			phoneNumber = `telprompt:${numberPhone}`;
		}

		Linking.canOpenURL(phoneNumber)
			.then(supported => {
				if (supported) {
					return Linking.openURL(phoneNumber)
						.then(data => null)
						.catch(err => {
							throw err;
						});
				}
			})
			.catch(err => Alert.alert('Thông báo', err.message));
	};

	return (
		<TouchableOpacity
			onPress={() => onPressItem()}
			style={[styles.container, stylesItem]}
		>
			<View style={styles.circleLeft} />
			<View style={styles.circleBottom} />
			<View style={styles.containerContentRight}>
				<Text style={styles.textLabel}>
					{textNoticeNo}:
					<Text style={styles.textContractNoValue}> {item.note_no}</Text>
				</Text>
				<Text style={styles.textLabel}>{`${textTotalPayment}: ${formatVND(
					item?.ttl_pay,
				)} ${item.cur_c}`}</Text>
				<Text style={styles.textLabel}>{`Receipt Amount: ${formatVND(
					item?.ttl_pay - (itemPayment?.U_AMT || 0),
				)} ${item.cur_c}`}</Text>
				<Text style={styles.textLabel}>{`Remaining Amount: ${formatVND(
					itemPayment?.U_AMT,
				)} ${item.cur_c}`}</Text>
				<Text style={styles.textLabel}>
					{`${textDueDate}: ${convertUnixTimeSolid(
						new Date(item.pay_date).getTime() / 1000,
					)}`}
				</Text>
			</View>

			<View style={styles.containerViewTitle}>
				<View style={styles.lineLeft} />
				<Text style={styles.titleCenter}>{textContactPerson}</Text>
				<View style={styles.lineRight} />
			</View>

			<View style={styles.containerContentLeft}>
				<TouchableOpacity
					onPress={() =>
						_onPressPhoneIcon(`${phoneNumberCompany},${item.ext_1}`)
					}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingVertical: 4,
					}}
				>
					<Image
						source={IC_PHONE}
						resizeMode="contain"
						style={{ width: 20, height: 20, marginRight: 8 }}
					/>
					<Text
						style={styles.textLabel}
					>{`${item.contact_1} - Ext: ${item.ext_1}`}</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() =>
						_onPressPhoneIcon(`${phoneNumberCompany},${item.ext_2}`)
					}
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						paddingVertical: 4,
					}}
				>
					<Image
						source={IC_PHONE}
						resizeMode="contain"
						style={{ width: 20, height: 20, marginRight: 8 }}
					/>
					<Text
						style={styles.textLabel}
					>{`${item.contact_2} - Ext: ${item.ext_2}`}</Text>
				</TouchableOpacity>

				{/* <TouchableOpacity
          style={styles.containerRowLeft}
          onPress={() => _onPressPhoneIcon(item.CELLPHONE)}
        >
          <Image
            source={IC_PHONE}
            resizeMode="contain"
            style={styles.iconLeft}
          />
          <Text style={styles.textLabel}>{`${item.CELLPHONE}`}</Text>
        </TouchableOpacity> */}
			</View>

			<View style={{ position: 'absolute', bottom: 8, right: 0 }}>
				<LottieView
					source={IMG_ARROW_RIGHT}
					autoPlay
					loop
					style={{ width: 30, height: 24 }}
					resizeMode="contain"
				/>
			</View>
		</TouchableOpacity>
	);
}
