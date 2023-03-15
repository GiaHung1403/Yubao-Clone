import LottieView from 'lottie-react-native';
import React, { useContext } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import { LocalizationContext } from '@context/LocalizationContext';
import { convertUnixTimeSolid } from '@utils';
import styles from './styles';

const IMG_ARROW_RIGHT = require('@assets/arrow_right_animation.json');

interface IProps {
  onPressItem: any;
  item: any;
  stylesItem?: ViewStyle;
}

export default function ItemEDocComponent(props: IProps) {
  const { onPressItem, item, stylesItem } = props;
  const I18n = useContext(LocalizationContext);

  const textContractNo = I18n.t('contractNo');
  const textDocumentType = I18n.t('document_type');
  const textContractDate = I18n.t('contractDate');

  return (
    <TouchableOpacity
      onPress={() => onPressItem()}
      style={[styles.container, stylesItem]}
    >
      <View style={styles.circleLeft}/>
      <View style={styles.circleBottom}/>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
        <View style={styles.containerContentLeft}>
          {/* <Text style={styles.textContractNoValue}> {item.FILE_NAME}</Text> */}

          <Text style={[styles.textLabel, { marginTop: 8 }]}>
            {textContractNo}:
            <Text style={styles.textContractNoValue}> {item.APNO}</Text>
          </Text>
          <Text style={[styles.textLabel, { marginTop: 4 }]}>
            {textDocumentType}:<Text style={{}}> {item.DOC_NM_EN}</Text>
          </Text>
          <Text style={[styles.textLabel, { marginTop: 4 }]}>
            {textContractDate}:{' '}
            <Text style={{}}>
              {item.BAS_DATE
                ? `${convertUnixTimeSolid(
                  new Date(item.BAS_DATE).getTime() / 1000,
                )}`
                : ''}
            </Text>
          </Text>
        </View>
        <View
          style={{
            marginTop: 8,
            alignItems: 'flex-end',
            alignSelf: 'flex-end',
          }}
        >
          <LottieView
            source={IMG_ARROW_RIGHT}
            autoPlay
            loop
            style={{ width: 30, height: 24 }}
            resizeMode="contain"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
