import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useContext } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useDispatch } from 'react-redux';

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

export default function ItemInsuranceCompensation(props: IProps) {
  const { onPressItem, item, stylesItem } = props;
  const dispatch = useDispatch();
  const navigation: any = useNavigation();

  const I18n = useContext(LocalizationContext);
  const textContractNo = I18n.t('contractNo');
  const textBusinessStaff = I18n.t('businessStaff');
  const textLessee = I18n.t('lessee');
  const textReceiver = I18n.t('receiver');
  const textExpiredDay = I18n.t('expiredDay');
  const textPlateNo = I18n.t('plateNo');
  const textKind = I18n.t('kind');
  const textTotalAmount = I18n.t('totalAmount');
  const textPOADate = 'POA Date';

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
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <TouchableOpacity
      style={[styles.container, stylesItem]}
      onPress={() =>
        navigation.navigate('WebviewScreen', {
          url: item.Print,
          title: item.Contract_No,
        })
      }
    >
      <View style={styles.circleLeft}/>
      <View style={styles.circleBottom}/>
      <View style={styles.containerContentRight}>
        <Text style={styles.textLabel}>
          {textContractNo}:
          <Text style={styles.textContractNoValue}> {item?.Contract_No}</Text>
        </Text>
        <Text style={styles.textLabel}>
          {textTotalAmount}:
          <Text style={styles.textContractNoValue}> {item?.AMOUNT}</Text>
        </Text>
        <Text style={styles.textLabel}>
          {textReceiver}:
          <Text style={styles.textContractNoValue}> {item?.RECEIVER_NAME}</Text>
        </Text>

        <Text style={styles.textLabel}>
          {`${textPOADate}: ${convertUnixTimeSolid(
            new Date(item?.POA_DATE).getTime() / 1000,
          )}`}
        </Text>
        <Text style={styles.textLabel}>
          {`${textExpiredDay}: ${convertUnixTimeSolid(
            new Date(item?.EXP_DATE).getTime() / 1000,
          )}`}
        </Text>
        <Text
          style={styles.textLabel}
        >{`${textPlateNo}: ${item?.PLATE_NO}`}</Text>
        <Text
          style={styles.textLabel}
        >{`${textKind}: ${item?.KIND_NAME}`}</Text>
      </View>

      <View style={styles.containerViewTitle}>
        <View style={styles.lineLeft}/>
        <Text style={styles.titleCenter}>{textBusinessStaff}</Text>
        <View style={styles.lineRight}/>
      </View>

      <View style={styles.containerContentLeft}>
        <Text style={styles.textLabel}>{`${item?.CSO}`}</Text>
        <TouchableOpacity
          style={styles.containerRowLeft}
          onPress={() => _onPressEmailIcon(item?.Email_CSO?.trim())}
        >
          <Image
            source={IC_EMAIL}
            resizeMode="contain"
            style={styles.iconLeft}
          />
          <Text style={styles.textLabel}>{`${item?.Email_CSO?.trim()}`}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.containerRowLeft}
          onPress={() =>
            _onPressPhoneIcon(`${phoneNumberCompany},${item?.EXT_CSO}`)
          }
        >
          <Image
            source={IC_PHONE}
            resizeMode="contain"
            style={styles.iconLeft}
          />
          <Text
            style={styles.textLabel}
          >{`${displayPhoneNumberCompany}, ${item?.EXT_CSO}`}</Text>
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
