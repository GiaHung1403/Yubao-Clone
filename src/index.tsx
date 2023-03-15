import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { Component, useEffect, useRef, useState } from 'react';
import { AppState, Platform, Text, TextInput } from 'react-native';
import codePush from 'react-native-code-push';
import EStyleSheet from 'react-native-extended-stylesheet';
import PushNotification from 'react-native-push-notification';
import {
	initialWindowMetrics,
	SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import { LocalizationContext } from '@context/LocalizationContext';
import { PreferencesContext } from '@context/PreferencesContext';
import { ILocalization } from '@models/types';
import { rem } from '@utils';
import BannerNotification from './components/BannerNotification';
import Toast from './components/Toast';
import Colors from './config/Color';
import PaperProvider from './config/PaperProvider';
import Navigator from './config/route';
import AsyncStorage from './data/local/AsyncStorage';
import I18n from './i18n';
import store from './store';
import EventEmitter from './utils/events';
import { FAB } from 'react-native-paper';
// import ModalProcess from 'react-native-modal-progress-bar';
// import { ProgressBar } from 'react-native-paper';
import ModalProgressComponent from './components/ModalProgressComponent';

EStyleSheet.build({
	$primaryColor: Colors.main, // EBA2A9
	$lightBlue: '#47bdcc',
	$primaryBlue: '#3E88C7',
	$grayE5: '#e5e5e5',
	$borderColor: '#ccc',
	$gray: '#696969',
	$white: '#FFFFFF',
	$green: '#a9db70',
	$black: '#48484a',
	$red: '#C72F31',
	$yellow: '#c7942e',
	$yellow1: '#d6d465',
	$pink: '#ED7581',
	$black70: 'rgba(52, 52, 52, 0.4)',
	$label: '#B1B1B1',
	$rem: rem,
	$smallText: 8 * rem,
	$normalText: 10 * rem,
	$largeText: 10.5 * rem,
});

const theme =
	EStyleSheet.value('$primaryColor') === 'light' ? Colors.main : Colors.main;

export default function Index(props: any) {
	const appState = useRef(AppState.currentState);

	const [Ischange, setChange] = useState(false);
	const [newColor, setNewColor] = useState('#9b59b6'); //  33ccc7
	const [newTheme, setNewTheme] = useState(undefined);
	const [newHeader, setNewHeader] = useState(undefined);
	const setShowModal = useRef<any>();

	const [percent, setPercent] = useState<number>(0);
	// const [isShowModal, setShowModal] = useState<boolean>(false);

	const toggleTheme = item => {
		Colors.main = item?.color;
		setChange(true);
		// changeColor(item.Color);
		setNewColor(item?.color);
		setNewTheme(item?.theme);
		setNewHeader(item?.header);
		EStyleSheet.clearCache();
		EStyleSheet.build({
			$primaryColor: item?.color, // EBA2A9
			$lightBlue: '#47bdcc',
			$primaryBlue: '#3E88C7',
			$grayE5: '#e5e5e5',
			$borderColor: '#ccc',
			$gray: '#696969',
			$white: '#FFFFFF',
			$green: '#a9db70',
			$black: '#48484a',
			$red: '#C72F31',
			$yellow: '#c7942e',
			$yellow1: '#d6d465',
			$pink: '#ED7581',
			$black70: 'rgba(52, 52, 52, 0.4)',
			$label: '#B1B1B1',
			$rem: rem,
			$smallText: 8 * rem,
			$normalText: 10 * rem,
			$largeText: 10.5 * rem,
		});
	};

	useEffect(() => {
		if (Ischange) {
			setChange(false);
		}
	}, [Ischange]);

	// Change theme function
	// const toggleTheme = React.useCallback(() => {
	//   return setIsThemeDark(!isThemeDark);
	// }, [isThemeDark]);

	const preferences = React.useMemo(
		() => ({
			toggleTheme,
			newColor,
			newTheme,
			newHeader,
			isTheme: false,
		}),
		[toggleTheme, newColor, newTheme, newHeader],
	);

	useEffect(() => {
		(async () => {
			// @ts-ignore
			if (Text?.defaultProps == null) Text.defaultProps = {};
			// @ts-ignore
			if (TextInput?.defaultProps == null) TextInput.defaultProps = {};

			// @ts-ignore
			Text.defaultProps.allowFontScaling = false;
			// @ts-ignore
			TextInput.defaultProps.allowFontScaling = false;
			const main = await AsyncStorage.getColor();
			if (main) {
				toggleTheme(main);
			}
		})();
	}, []);

	const [locale, setLocale] = React.useState('en');
	const localizationContext: ILocalization = React.useMemo(
		() => ({
			t: (scope, options) => I18n.t(scope, { locale, ...options }),
			locale,
			setLocale,
		}),
		[locale],
	);

	useEffect(() => {
		if (Platform.OS === 'android') {
			checkUpdateVersion();
		}
		const subscription = AppState.addEventListener('change', nextAppState => {
			if (
				appState.current.match(/inactive|background/) &&
				nextAppState === 'active'
			) {
				checkUpdateVersion();
			}

			appState.current = nextAppState;
		});

		return () => {
			subscription.remove();
		};
	}, []);

	useEffect(() => {
		// registerAppWithFCM();
		requestUserPermission().then();
		(async function setLanguageFirst() {
			const language = await AsyncStorage.getLanguage();

			setLocale(language);
		})();

		PushNotification.configure({
			// (optional) Called when Token is generated (iOS and Android)
			onRegister(token) {
				if (__DEV__) {
					// console.log('TOKEN:', token);
				}
			},

			// (required) Called when a remote or local notification is opened or received
			onNotification(notification) {
				// process the notification
				// required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
				notification.finish(PushNotificationIOS.FetchResult.NoData);
			},

			// ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
			senderID: '364882864100',

			// IOS ONLY (optional): default: all - Permissions to register.
			permissions: {
				alert: true,
				badge: true,
				sound: true,
			},
			popInitialNotification: true,
			requestPermissions: true,
		});

		messaging().subscribeToTopic('global').then();
		messaging().setBackgroundMessageHandler(async remoteMessage => {
			/*FIXME: Android not show popup*/
			PushNotification.localNotification(
				Platform.OS === 'ios' ? remoteMessage : remoteMessage.data,
			);
		});
		// firebaseFunction.trackingLog({
		//   event: EventTracking.OPEN_APP,
		//   screen: {
		//     class: "Index",
		//     name: "Index",
		//   },
		// });
	}, []);

	const checkUpdateVersion = () => {
		codePush
			.sync(
				{
					updateDialog: {
						appendReleaseDescription: true,
						// title: 'Update cho bố',
					},
					// installMode: codePush.InstallMode.IMMEDIATE,
					installMode: codePush.InstallMode.IMMEDIATE,
				},
				status => {
					switch (status) {
						case codePush.SyncStatus.DOWNLOADING_PACKAGE:
							setShowModal.current.showModal(true);
							break;
						case codePush.SyncStatus.CHECKING_FOR_UPDATE:
							break;

						case codePush.SyncStatus.UPDATE_INSTALLED:
							console.log('update thanfh cong ');
							break;
					}
				},
				({ receivedBytes, totalBytes }) => {
					/* Update download modal progress */
					setPercent(Math.round((receivedBytes / totalBytes) * 100));
				},
			)
			.then();
	};

	const registerAppWithFCM = async () => {
		await messaging().registerDeviceForRemoteMessages();
	};

	const requestUserPermission = async () => {
		await messaging().requestPermission();
	};

	// EventEmitter.addEventListener("getTheme", ( item ) => {
	//   toggleTheme(item);
	// });

	const theme = extendTheme({
		components: {
			Select: {
				baseStyle: {},
				defaultProps: { size: 'lg' },
				variants: {},
				sizes: {
					xl: { fontSize: 14 },
					lg: { fontSize: 14 },
					md: { fontSize: 14 },
					sm: { fontSize: 14 },
				},
			},
		},
	});

	//if (Ischange) return null;

	return (
		<PreferencesContext.Provider value={preferences}>
			<Provider store={store}>
				<NativeBaseProvider theme={theme}>
					<PaperProvider>
						<SafeAreaProvider initialMetrics={initialWindowMetrics}>
							<LocalizationContext.Provider value={localizationContext}>
								<BannerNotification />
								<Toast />
								<Navigator />
								<ModalProgressComponent
									ref={ref => {
										setShowModal.current = ref;
									}}
									// isVisible={isShowModal}
									percent={percent}
									backdropColor={'rgba(0,0,0,0.5)'}
									backgroundColorModal={'rgba(0,0,0,0.5)'}
									title={'Yubao is downloading ...'}
									// subTitle={`Please don't turn off the device !!!`}
									styleTitle={{
										alignSelf: 'flex-start',
										fontSize: 15,
										color: 'white',
									}}
								/>
							</LocalizationContext.Provider>
						</SafeAreaProvider>
					</PaperProvider>
				</NativeBaseProvider>
			</Provider>
		</PreferencesContext.Provider>
	);
}
