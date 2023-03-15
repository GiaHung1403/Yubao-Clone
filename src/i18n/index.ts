import I18n from 'react-native-i18n';

import AsyncStorage from '@data/local/AsyncStorage';
import en from './en';
import vi from './vi';

async function getLanguage() {
  return await AsyncStorage.getLanguage();
}

I18n.fallbacks = true;
I18n.translations = {
  en,
  vi,
};

getLanguage().then(language => I18n.locale = language);

export const setLocale = locale => {
  I18n.locale = locale;
};

export function t(scope: any, option?: any) {
  return I18n.t(scope, option);
}

export default I18n;
