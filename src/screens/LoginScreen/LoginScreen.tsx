import NetInfo from '@react-native-community/netinfo';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	Image,
	InteractionManager,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Notifications, Registered } from 'react-native-notifications';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { loginRocketChat, loginSystem } from '@actions/auth_action';
import { getSettingPublicRC } from '@actions/setting_action';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInputIconComponent from '@components/TextInputIconComponent';
import { getDomainAPIChat, setDomainAPIChat } from '@data/Constants';
import AsyncStorage from '@data/local/AsyncStorage';
import { RocketChat } from '@data/rocketchat';
import * as I18n from '@i18n';
import { DomainChat } from '@models/DomainChatEnum';
import { IUserLoginRC, IUserSystem } from '@models/types';
import { checkBiometryAuth, isBiometrySupported } from '@utils/BiometryAuth';
import { formatUsernameChat } from '@utils/formatText';
import * as KeychainUtil from '@utils/KeyChainUtils';
import styles from './styles';

const IC_FINGERPRINT = require('@assets/icons/ic_fingerprint.png');
const IC_FACE_ID = require('@assets/icons/ic_face_id.png');
const LOGO = require('@assets/logo.png');

interface IProps {
	navigation: any;
}

interface IAuthReducer {
	dataUserSystem: IUserSystem;
	dataUserRC: IUserLoginRC;
	error: boolean;
	message: string;
}

export function LoginScreen(props: IProps) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { dataUserSystem, dataUserRC, error, message }: IAuthReducer =
		useSelector((state: any) => state.auth_reducer);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [loading, setLoading] = useState(false);
	const [loadingSignUp, setLoadingSignUp] = useState(false);
	const [biometryType, setBiometryType] = useState<string>('');

	const textLoginWith = I18n.t('loginWithAccount');
	const textNotLogin = I18n.t('notLogin');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			NetInfo.fetch('wifi').then(state => {
				console.log({ state });

				console.log('Connection type', state.type);
				console.log('Is connected?', state.isConnected);
			});
			try {
				const credentials: any = await KeychainUtil.getGenericPassword();
				/**
				 * Check first time login
				 */
				const isFirstTimeUsing = await AsyncStorage.getIsFirstTimeUsing();
				if (isFirstTimeUsing) {
					AsyncStorage.setIsFirstTimeUsing(false).then();
				}

				dispatch(getSettingPublicRC());
				await RocketChat.initSDK();
				await RocketChat.sdkConnect();

				const type = (await isBiometrySupported()) as string;
				setBiometryType(type);
				setDoneLoadAnimated(true);

				if (credentials?.username && credentials?.username !== '_pfo') {
					setUsername(credentials?.username);
					setLoading(true);
					if (credentials?.username.length >= 10) {
						const userTokenRC: any = await AsyncStorage.getUserTokenRC();
						await setDomainChat({ domain: DomainChat.GLOBAL });
						await messaging().subscribeToTopic(
							`user_${dataUserSystem?.EMP_NO}`,
						);

						// Login rocket chat
						if (userTokenRC) {
							dispatch(
								loginRocketChat({
									resume: userTokenRC,
								}),
							);
							return;
						}

						dispatch(
							loginRocketChat({
								username: credentials?.username,
								password: credentials?.password,
							}),
						);
					} else {
						if (type) {
							await _onPressLoginFinger();
						} else {
							setLoading(false);
						}
						// else {
						//   dispatch(loginSystem({ User_ID: credentials?.username, Password: credentials?.password }));
						// }
					}
				}
			} catch (e: any) {
				setLoading(false);
				setDoneLoadAnimated(true);
				Alert.alert('Error', 'Cannot connect to server!');
			}
		});
	}, []);

	useEffect(() => {
		(async function checkLoginRC() {
			if (dataUserRC) {
				try {
					// Request permissions on iOS, refresh token on Android
					Notifications.registerRemoteNotifications();

					Notifications.events().registerRemoteNotificationsRegistered(
						(event: Registered) => {
							AsyncStorage.setDeviceTokenRC(event.deviceToken);
							RocketChat.registerPushToken({ token: event.deviceToken });
						},
					);
				} catch (error: any) {
					Alert.alert('Error', error.messages);
				}
				if (username && password) {
					await KeychainUtil.setGenericPassword({ username, password });
				}

				setPassword('');
				navigation.navigate(username.length < 10 ? 'HomeStack' : 'ChatStack');
			}
			setLoading(false);
		})();
	}, [dataUserRC]);

	useEffect(() => {
		(async function checkLoginSystem() {
			const userTokenRC: any = await AsyncStorage.getUserTokenRC();
			if (dataUserSystem) {
				try {
					await messaging().subscribeToTopic(`user_${dataUserSystem?.EMP_NO}`);
				} catch (e: any) {
					Alert.alert('Error', e.message);
					setLoading(false);
				}

				// Login rocket chat
				if (userTokenRC) {
					dispatch(
						loginRocketChat({
							resume: userTokenRC,
						}),
					);
					return;
				}
				dispatch(
					loginRocketChat({
						username: dataUserSystem.EMP_NO,
						password,
					}),
				);
			}
		})();
	}, [dataUserSystem]);

	useEffect(() => {
		(async function checkDataUser() {
			if (error) {
				KeychainUtil.setGenericPassword({ username: '', password: '' }).then();
				AsyncStorage.clearAllDataUser().then();
				if (message.includes('Unauthorized') && dataUserSystem) {
					const responseCheckUser: any = await RocketChat.checkUserExisted({
						username: dataUserSystem.EMP_NO,
					});
					const responseCheckUserFormatOld: any =
						await RocketChat.checkUserExisted({
							username: formatUsernameChat({ dataUserSystem }),
						});

					const isUserExisted =
						responseCheckUser.isUserExisted ||
						responseCheckUserFormatOld.isUserExisted;
					const dataCheck =
						responseCheckUser.data || responseCheckUserFormatOld.data;

					if (isUserExisted) {
						syncPassWithSystem({ userId: dataCheck._id }).then();
						return;
					}
					registerUserChatNew().then();
				} else {
					Alert.alert('Alert', message);
					setLoading(false);
				}
			}
		})();
	}, [error, message]);

	const syncPassWithSystem = async ({ userId }) => {
		try {
			await RocketChat.syncPass({
				userId,
				username: dataUserSystem.EMP_NO,
				password,
			});

			dispatch(
				loginRocketChat({
					username: dataUserSystem.EMP_NO,
					password,
				}),
			);
		} catch (e: any) {
			Alert.alert('Alert', e.data.error);
			setLoading(false);
		}
	};

	const registerUserChatNew = async () => {
		try {
			await RocketChat.register({
				name: `${dataUserSystem.FST_NM} ${dataUserSystem.LST_NM}`,
				email: dataUserSystem.EMAIL,
				pass: password,
				username: dataUserSystem.EMP_NO,
			});

			dispatch(
				loginRocketChat({
					username: dataUserSystem.EMP_NO,
					password,
				}),
			);
		} catch (e: any) {
			Alert.alert('Alert', e.data.error);
			setLoading(false);
		}
	};

	const setDomainChat = async ({ domain }) => {
		if (getDomainAPIChat() !== domain) {
			setDomainAPIChat({ domain });
			RocketChat.sdkDisconnect().then();
			await RocketChat.initSDK();
			await RocketChat.sdkConnect();
		}
	};

	const _onPressLogin = async ({ user, pass }) => {
		setLoading(true);
		Keyboard.dismiss();
		if (user.length >= 10) {
			await setDomainChat({ domain: DomainChat.GLOBAL });
			dispatch(
				loginRocketChat({
					username: user,
					password: pass,
				}),
			);
		} else {
			await setDomainChat({ domain: DomainChat.CHAILEASE });
			console.log('====================================');
			console.log('Loginnnnnnnn');
			console.log('====================================');
			dispatch(loginSystem({ User_ID: user, Password: pass }));
		}
	};

	const _onPressLoginFinger = async () => {
		const credentials: any = await KeychainUtil.getGenericPassword();
		if (credentials?.username) {
			try {
				await checkBiometryAuth({
					reason: `${textLoginWith} ${credentials?.username}`,
				});
				setUsername(credentials?.username);
				setPassword(credentials?.password);

				await _onPressLogin({
					user: credentials?.username,
					pass: credentials?.password,
				});
			} catch (err: any) {
				Alert.alert('Notice', err);
				setLoading(false);
			}
		} else {
			setLoading(false);
			return Alert.alert('Notice', textNotLogin);
		}
	};

	const _onPressSignUp = async () => {
		setLoadingSignUp(true);
		try {
			await setDomainChat({ domain: DomainChat.GLOBAL });
			navigation.navigate('SignUpScreen');
		} catch (e: any) {
			Alert.alert('Alert', 'Disconnected! Please connect wifi or 4G/5G!');
		}
		setLoadingSignUp(false);
	};

	return doneLoadAnimated ? (
		<TouchableWithoutFeedback
			style={{ flex: 1 }}
			onPress={() => Keyboard.dismiss()}
		>
			<View style={{ flex: 1 }}>
				<StatusBar
					barStyle="dark-content"
					translucent
					backgroundColor="transparent"
				/>
				<KeyboardAvoidingView
					style={styles.container}
					behavior={Platform.OS === 'android' ? undefined : 'padding'}
				>
					<View style={styles.containerForm}>
						<Image source={LOGO} resizeMode="contain" style={styles.logo} />

						<View style={styles.containerHeader}>
							<Text style={styles.textNameCompany}>Chailease</Text>

							<Text style={styles.textSubTitleHeader}>
								Login with account system or account global
							</Text>
						</View>

						<TextInputIconComponent
							placeholder={I18n.t('username')}
							value={username}
							iconLeft="person-circle-outline"
							keyboardType="default"
							autoCapitalize="none"
							onChangeText={(text: string) => setUsername(text)}
						/>
						<TextInputIconComponent
							placeholder={I18n.t('password')}
							value={password}
							iconLeft="lock-closed"
							iconRight={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
							secureTextEntry={secureTextEntry}
							autoCapitalize="none"
							onChangeText={(text: string) => setPassword(text)}
							onPressIconRight={() =>
								setSecureTextEntry(oldStatus => !oldStatus)
							}
						/>

						<TouchableOpacity
							style={styles.containerButtonForgotPass}
							onPress={() => Alert.alert('Notice', 'Coming soon!')}
						>
							<Text
								style={[styles.labelButtonForgotPass, { fontStyle: 'italic' }]}
							>
								{`${I18n.t('forgotPass')}?`}
							</Text>
						</TouchableOpacity>

						{/** View Button Login */}
						<View style={styles.containerButtonLogin}>
							<Button
								mode="contained"
								dark
								loading={loading}
								style={{ flex: 1 }}
								uppercase={false}
								onPress={() =>
									_onPressLogin({ user: username, pass: password })
								}
							>
								{loading ? 'loading' : 'Login'}
							</Button>
							<TouchableOpacity
								style={styles.buttonLoginFingerprint}
								onPress={() => _onPressLoginFinger()}
							>
								<Image
									source={
										biometryType === 'FaceID' ? IC_FACE_ID : IC_FINGERPRINT
									}
									resizeMode="contain"
									style={styles.iconFingerprint}
								/>
							</TouchableOpacity>
						</View>
					</View>
				</KeyboardAvoidingView>
				{Platform.OS === 'ios' && (
					<SafeAreaView
						style={{
							position: 'absolute',
							bottom: 20,
							right: 0,
							left: 0,
						}}
					>
						<TouchableOpacity
							style={{
								width: '100%',
								alignItems: 'center',
								paddingVertical: 8,
							}}
							onPress={_onPressSignUp}
						>
							{loadingSignUp && <ActivityIndicator />}
							<Text style={{ color: '#888' }}>Don't have a account?</Text>
							<Text style={{ color: '#2c82c9', marginTop: 4 }}>SignUp</Text>
						</TouchableOpacity>
					</SafeAreaView>
				)}
			</View>
		</TouchableWithoutFeedback>
	) : (
		<LoadingFullScreen />
	);
}
