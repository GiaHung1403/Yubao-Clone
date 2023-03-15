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
import {
  displayPhoneNumberCompany,
  phoneNumberCompany,
} from '@data/Constants';
import { convertUnixTimeSolid, formatVND } from '@utils';
import styles from './styles';
import api_get_insurance_assets from '@data/api/api_get_insurance_assets';
import TextInfoRow from '@components/TextInfoRow';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');
const IMG_ARROW_RIGHT = require('@assets/arrow_right_animation.json');

interface IProps {
  onPressItem: any;
  item: any;
  stylesItem?: ViewStyle;
  taxCode: string;
}

export default function ItemInsurance(props: IProps) {
  const { onPressItem, item, stylesItem, taxCode } = props;
  const I18n = useContext(LocalizationContext);
  const [listAssets, setListDataAssets] = useState<any>(null);

  const textInsuranceAmount = I18n.t('insuranceAmount');
  const textEndDate = I18n.t('insuranceDate');
  const textExpiredDay = I18n.t('expiredDay');
  const textInsuranceNo = I18n.t('insuranceNo');
  const textInsuranceCode = I18n.t('insuranceCode');
  const textContractNo = I18n.t('contractNo');
  const textInsuranceCompany = I18n.t('insuranceCompany');
  const textBusinessStaff = I18n.t('contactPerson');
  const textInsuranceContact = I18n.t('hotlineInsuranceContact');

  useEffect(() => {
    (async function getData() {
      const listData: any = await api_get_insurance_assets({
        User_ID: taxCode.trim(),
        Password: taxCode.trim(),
        INSR_APNO: item.INSR_APNO,
      });

      setListDataAssets(listData);
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
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber)
            .then((data) => null)
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => Alert.alert('Thông báo', err.message));
  };

  const _onPressEmailIcon = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  return (
		<TouchableOpacity
			onPress={() => onPressItem(listAssets)}
			style={[styles.container, stylesItem]}
		>
			<View style={styles.circleLeft} />
			<View style={styles.circleBottom} />
			<View style={styles.containerContentRight}>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'barcode-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>
						{textInsuranceCode}:
						<Text style={styles.textContractNoValue}> {item.INSR_APNO}</Text>
					</Text>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'barcode-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>
						{textInsuranceNo}:
						<Text style={styles.textContractNoValue}> {item.INSR_NO}</Text>
					</Text>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'barcode-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>
						{textContractNo}:
						<Text style={styles.textContractNoValue}> {item.APNO}</Text>
					</Text>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'business-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>
						{textInsuranceCompany}:
						<Text style={styles.textContractNoValue}> {item.INSR_CODE}</Text>
					</Text>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'today-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>
						{`${textEndDate}: ${convertUnixTimeSolid(
							new Date(item.INSR_DATE).getTime() / 1000,
						)}`}
					</Text>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'today-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>
						{`${textExpiredDay}: ${convertUnixTimeSolid(
							new Date(item.INSR_MTRT).getTime() / 1000,
						)}`}
					</Text>
				</View>

				<View style={{ flex: 1, flexDirection: 'row' }}>
					<Icon
						as={Ionicons}
						name={'cash-outline'}
						size={6}
						color={'#fff'}
						marginRight={2}
						style={{ marginVertical: 4 }}
					/>
					<Text style={styles.textLabel}>{`${formatVND(
						item.INSR_AMT,
					)} ${item.CUR_C}`}</Text>
				</View>
			</View>

			<View style={styles.containerViewTitle}>
				<View style={styles.lineLeft} />
				<Text style={styles.titleCenter}>{textBusinessStaff}</Text>
				<View style={styles.lineRight} />
			</View>

			<View style={styles.containerContentLeft}>
				<Text style={styles.textLabel}>{`${item.CONTACT_NM}`}</Text>
				<TouchableOpacity
					style={styles.containerRowLeft}
					onPress={() => _onPressEmailIcon(item.EMAIL.trim())}
				>
					<Image
						source={IC_EMAIL}
						resizeMode="contain"
						style={styles.iconLeft}
					/>
					<Text style={styles.textLabel}>{`${item.EMAIL.trim()}`}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.containerRowLeft}
					onPress={() => _onPressPhoneIcon(`${phoneNumberCompany},${item.EXT}`)}
				>
					<Image
						source={IC_PHONE}
						resizeMode="contain"
						style={styles.iconLeft}
					/>
					<Text
						style={styles.textLabel}
					>{`${displayPhoneNumberCompany}, ${item.EXT}`}</Text>
				</TouchableOpacity>
			</View>

			<View style={[styles.containerViewTitle, { marginVertical: 8 }]}>
				<View style={styles.lineLeft} />
				<Text style={styles.titleCenter}>{textInsuranceContact}</Text>
				<View style={styles.lineRight} />
			</View>

			<View style={styles.containerContentLeft}>
				<TouchableOpacity
					style={styles.containerRowLeft}
					disabled={!item.HOTLINE}
					onPress={() => _onPressPhoneIcon(`${item.HOTLINE}`)}
				>
					<Image
						source={IC_PHONE}
						resizeMode="contain"
						style={styles.iconLeft}
					/>
					<Text style={styles.textLabel}>{`${
						item.HOTLINE || 'Not available'
					}`}</Text>
				</TouchableOpacity>
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
