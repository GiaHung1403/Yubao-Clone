import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Button } from 'react-native-paper';

import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInputIconComponent from '@components/TextInputIconComponent';
import { RocketChat } from '@data/rocketchat';
import * as I18n from '@i18n';
import styles from './styles';

const LOGO = require('@assets/logo.png');

export function SignUpScreen(props: any) {
	const navigation: any = useNavigation();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [secureTextEntry, setSecureTextEntry] = useState(true);
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState<string>('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressSignUp = async () => {
		if (username.length < 10) {
			Alert.alert('Alert', 'The username must be at least 10 characters!');
			return;
		}
		setLoading(true);
		try {
			await RocketChat.register({ name, email, username, pass: password });
			setLoading(false);
			Alert.alert(
				'Alert',
				'You have successfully created an account! The verify email will be sent to your email!',
				[{ text: 'OK', onPress: () => navigation.goBack() }],
			);
		} catch (e: any) {
			setLoading(false);
			Alert.alert('Error', e.data.error);
		}
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
					<ScrollView style={styles.containerForm}>
						<Image source={LOGO} resizeMode="contain" style={styles.logo} />

						<View style={styles.containerHeader}>
							<Text style={styles.textNameCompany}>Chailease</Text>

							<Text style={styles.textSubTitleHeader}>
								Signup a account global
							</Text>
						</View>

						<TextInputIconComponent
							placeholder={I18n.t('name')}
							value={name}
							iconLeft="person-circle-outline"
							keyboardType="default"
							autoCapitalize="words"
							onChangeText={(text: string) => setName(text)}
						/>
						<TextInputIconComponent
							placeholder={I18n.t('username')}
							value={username}
							iconLeft="at-circle"
							keyboardType="default"
							autoCapitalize="none"
							onChangeText={(text: string) => setUsername(text)}
						/>
						<TextInputIconComponent
							placeholder={'Email'}
							value={email}
							iconLeft="mail"
							keyboardType="email-address"
							autoCapitalize="none"
							onChangeText={(text: string) => setEmail(text)}
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

						{/** View Button Login */}
						<Button
							mode="contained"
							loading={loading}
							uppercase={false}
							style={{ marginTop: 16 }}
							onPress={_onPressSignUp}
						>
							{loading ? 'loading' : 'SignUp'}
						</Button>
					</ScrollView>

					<SafeAreaView
						style={{ position: 'absolute', bottom: 20, right: 0, left: 0 }}
					>
						<TouchableOpacity
							style={{
								width: '100%',
								alignItems: 'center',
								paddingVertical: 8,
							}}
							onPress={() => navigation.goBack()}
						>
							<Text style={{ color: '#888' }}>Do you have an account?</Text>
							<Text style={{ color: '#2c82c9', marginTop: 4 }}>Login</Text>
						</TouchableOpacity>
					</SafeAreaView>
				</KeyboardAvoidingView>
			</View>
		</TouchableWithoutFeedback>
	) : (
		<LoadingFullScreen />
	);
}
