import LottieView from 'lottie-react-native';
import React, { useContext } from 'react';
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
import { convertUnixTimeSolid } from '@utils';
import styles from './styles';

const IC_EMAIL = require('@assets/icons/ic_email.png');
const IC_PHONE = require('@assets/icons/ic_phone.png');
const IMG_ARROW_RIGHT = require('@assets/arrow_right_animation.json');

interface IProps {
  onPressItem: any;
  item: any;
  stylesItem?: ViewStyle;
}

export default function ItemInvoices(props: IProps) {
  const { onPressItem, item, stylesItem } = props;
  const I18n = useContext(LocalizationContext);

  const textTotalPayment = I18n.t('totalPayment');
  const textInvoiceNo = I18n.t('invoiceNo');
  const textContractNo = I18n.t('contractNo');
  const textContactPerson = I18n.t('contactPerson');
  const textContractDate = I18n.t('contractDate');

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

  const _onPressEmailIcon = (email: string) => {
    Linking.openURL(`mailto:${email}`).then();
  };

  return (
    <TouchableOpacity
      onPress={() => onPressItem()}
      style={[styles.container, stylesItem]}
    >
      <View style={styles.circleLeft}/>
      <View style={styles.circleBottom}/>
      <View style={styles.containerContentRight}>
        <Text style={styles.textLabel}>
          {textInvoiceNo}:
          <Text style={styles.textContractNoValue}> {item.INV_NO}</Text>
        </Text>
        <Text style={styles.textLabel}>
          {textContractNo}:
          <Text style={styles.textContractNoValue}> {item.DB_APNO}</Text>
        </Text>
        {/* <Text style={styles.textLabel}>{`${textTotalPayment}: ${formatVND(
          item.w_ttl_amt,
        )} VND`}</Text> */}
        <Text style={styles.textLabel}>
          {`${textContractDate}: ${convertUnixTimeSolid(
            new Date(item.INV_DATE).getTime() / 1000,
          )}`}
        </Text>
      </View>

      <View style={styles.containerViewTitle}>
        <View style={styles.lineLeft}/>
        <Text style={styles.titleCenter}>{textContactPerson}</Text>
        <View style={styles.lineRight}/>
      </View>

      <View style={styles.containerContentLeft}>
        <Text style={styles.textLabel}>{`${item.INV_EMP_NM}`}</Text>
        <TouchableOpacity
          style={styles.containerRowLeft}
          onPress={() => _onPressEmailIcon(item.INV_EMP_EMAIL.trim())}
        >
          <Image
            source={IC_EMAIL}
            resizeMode="contain"
            style={styles.iconLeft}
          />
          <Text style={styles.textLabel}>{`${item.INV_EMP_EMAIL?.trim()}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.containerRowLeft}
          onPress={() =>
            _onPressPhoneIcon(`${phoneNumberCompany},${item.INV_EMP_EXT}`)
          }
        >
          <Image
            source={IC_PHONE}
            resizeMode="contain"
            style={styles.iconLeft}
          />
          <Text
            style={styles.textLabel}
          >{`${displayPhoneNumberCompany}, ${item.INV_EMP_EXT}`}</Text>
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
