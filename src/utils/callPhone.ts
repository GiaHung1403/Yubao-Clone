import { Alert, Linking, Platform } from 'react-native';

export const callPhoneDefault = (numberPhone: string) => {
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
