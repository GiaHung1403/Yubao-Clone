import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { rem } from '@utils';
import styles from './styles';

const IC_BACK = require('@assets/icons/ic_back.png');

interface IProps {
  style?: any;
  title?: any;
  hiddenBack?: any;
  backgroundColor?: any;
  color?: any;
  rightComponent?: any;
  onPressTitle?: () => void;
  labelButton?: any;
  roomType?: any;
  dataUser?: any;
}

export default function HeaderBack(props: IProps) {
  const navigation: any = useNavigation();
  const {
    style,
    title,
    hiddenBack,
    backgroundColor,
    color,
    rightComponent,
    labelButton,
    roomType,
    dataUser,
    onPressTitle,
  } = props;

  const textTimeUpdate = () => {
    if (roomType !== 'd') {
      return `Xem thông tin chi tiết`;
    }
    if (dataUser?.status === 'online') {
      return 'Đang hoạt động';
    }
    if (!dataUser?.lastLogin) {
      return 'Not login';
    }
    const timeUpdate = new Date(dataUser?.lastLogin).getTime() / 1000;
    const timeNow = new Date().getTime() / 1000;

    const rangeTime = timeNow - timeUpdate;

    if (rangeTime < 3600) {
      return `Hoạt động ${(rangeTime / 60).toFixed(0)} phút trước`;
    }

    if (rangeTime < 86400) {
      return `Hoạt động ${(rangeTime / 60 / 60).toFixed(0)} tiếng trước`;
    }
    if (rangeTime < 2592000) {
      return `Hoạt động ${(rangeTime / 60 / 60 / 24).toFixed(0)} ngày trước`;
    }
    return `Hoạt động ${(rangeTime / 60 / 60 / 24 / 30).toFixed(
      0,
    )} tháng trước`;
  };

  const _onPressButtonBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[
        styles.containerBackgroundBack,
        { backgroundColor: backgroundColor || styles.$primaryColorApp },
      ]}
    >
      <View style={[styles.containerBack, style]}>
        <TouchableOpacity
          onPress={_onPressButtonBack}
          style={styles.buttonBack}
          disabled={hiddenBack}
        >
          {hiddenBack ? null : (
            <Image
              source={IC_BACK}
              resizeMode="contain"
              style={[styles.iconButtonBack, { tintColor: color || '#fff' }]}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            marginHorizontal: 16,
            paddingRight: rightComponent ? 50 : 0,
            flex: 1,
          }}
          onPress={onPressTitle}
        >
          <Text
            style={{
              color: color || '#fff',
              fontWeight: 'bold',
              fontSize: 15 * rem,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Text
            style={{
              color: color || '#fff',
              fontSize: 12,
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            {textTimeUpdate()}
          </Text>
        </TouchableOpacity>

        {rightComponent()}
      </View>
    </SafeAreaView>
  );
}
