import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Linking,
	Platform,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import CodePush from 'react-native-code-push';
import ImagePicker from 'react-native-image-crop-picker';
import * as Keychain from 'react-native-keychain';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import AvatarBorder from '@components/AvatarBorder';
import Header from '@components/Header';
import { getListContact } from '@data/api';
import { RocketChat } from '@data/rocketchat';
import { Ionicons } from '@expo/vector-icons';
import { IContact, ISpotlight, IUserSystem } from '@models/types';
import CallPhoneOptionModal from '@screens/ContactScreen/CallPhoneOptionModal';
import { useNavigation } from '@react-navigation/native';
import { createDirectMessage, getSpotlight } from '@data/api';
import AsyncStorage from '@data/local/AsyncStorage';
import { setDataUserRC, setDataUserSystem } from '@actions/auth_action';
import ImageViewerCustom from '@components/ImageViewerCustom';
import { getDomainAPIChat } from '@data/Constants';

interface IRouteParams {
	userID: string;
	room: ISpotlight;
}

let listSpotlight: ISpotlight[] = [];

export function UserInfoScreen(props: any) {
	const dispatch = useDispatch();
	const modalContactRef = useRef<any>();
	const fileUploadRef = useRef<any>();
	const { colors } = useTheme();
	const { userID, room }: IRouteParams = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const navigation: any = useNavigation();
	const [user, setUser] = useState<IContact>();
	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			const responseContactList: any = await getListContact({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: '',
				Dept_Code: '0',
				Branch: '-1',
				subteam: undefined,
			});

			const userFind = responseContactList.find(
				(item: IContact) => item.emp_no === userID,
			);
			listSpotlight = (await getSpotlight({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				query: '',
			})) as ISpotlight[];
			setUser(userFind);
		});
	}, []);

	const _onPressEmailIcon = (email?: string) => {
		Linking.openURL(`mailto:${email}`)
			.then()
			.catch(err => Alert.alert('Thông báo', err.message));
	};

	const _onPressUpdateAvatar = async () => {
		const options = {
			cropping: true,
			compressImageQuality: 0.8,
			freeStyleCropEnabled: true,
			cropperAvoidEmptySpaceAroundImage: false,
			cropperChooseText: 'Choose',
			cropperCancelText: 'Cancel',
			includeBase64: true,
			useFrontCamera: true,
			cropperCircleOverlay: true,
		};
		const response: any = await ImagePicker.openPicker(options);

		try {
			const avatar = {
				url: response.path,
				data: `data:image/jpeg;base64,${response.data}`,
				service: 'upload',
			};

			await RocketChat.setAvatarFromService(avatar);

			Alert.alert(
				'Alert',
				'You need to reopen the app to see your avatar change!',
				[
					{ text: 'OK', onPress: () => null },
					{ text: 'Reopen', onPress: () => CodePush.restartApp() },
				],
			);
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	const findRoomChatName = contact => {
		return listSpotlight.find(room => {
			return (
				room.username ===
				`${contact.emp_no}.${contact.emp_nm
					.replace(/ /g, '.')
					.substr(
						0,
						contact.emp_nm.indexOf('(') > -1
							? contact.emp_nm.indexOf('(') - 1
							: undefined,
					)}`
			);
		})!!;
	};

	const _onPressMessageIcon = async (contact?: IContact) => {
		const roomChat: ISpotlight = findRoomChatName(contact);

		try {
			if (!roomChat?.rid) {
				const roomResponse: any = await createDirectMessage({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					usernameStaff: roomChat?.username || contact?.emp_no,
				});

				navigation.push('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse, {
						name: roomChat?.username || contact?.emp_nm,
						fname: roomChat?.name,
					}),
				});
				return;
			}

			navigation.push('ChatRoomMessageScreen', { room: roomChat });
		} catch (error) {
			Alert.alert(
				'Alert',
				'User not existed on database chat! Please contact IT for support!',
			);
		}
	};

	const onPressDelete = () => {
		// Alert.alert('Alert', 'Do you want to delete this account?', [
		// 	{ text: 'Cancel' },
		// 	{
		// 		text: 'Yes',
		// 		onPress: async () => {
		// 			navigation.goBack();
		// 		},
		// 	},
		// ]);

		Alert.alert('Alert', 'Do you want to delete this account??', [
			{ text: 'Cancel' },
			{
				text: 'OK',
				onPress: async () => {
					const deviceToken = await AsyncStorage.getDeviceTokenRC();
					try {
						// FIXME: check why logout show err "You've been logged out by the server. Please log in again."
						await RocketChat.removePushToken({ token: deviceToken });
						await RocketChat.logout({});
					} catch (e: any) {
						Alert.alert('Error', e.message);
					}

					await AsyncStorage.logOut();
					dispatch(setDataUserSystem({ dataUser: [null] }));
					dispatch(setDataUserRC({ dataUser: null }));
				},
			},
		]);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header title="User Info" />
			</View>

			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
			>
				<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
					<View style={{ alignItems: 'center', padding: 20 }}>
						<View>
							<TouchableOpacity
								onPress={() => {
									fileUploadRef.current.onShowViewer(
										[
											{
												url: `${getDomainAPIChat()}/avatar/${
													user?.emp_no
												}?size=${500}&format=png`,
											},
										],
										0,
									);
								}}
							>
								<AvatarBorder username={user?.emp_no} size={70} />
							</TouchableOpacity>

							{userID === dataUserSystem.EMP_NO && (
								<TouchableOpacity
									style={{
										width: 24,
										height: 24,
										borderRadius: 12,
										backgroundColor: '#f5f5f5',
										justifyContent: 'center',
										alignItems: 'center',
										position: 'absolute',
										bottom: -2,
										right: -2,
									}}
									onPress={_onPressUpdateAvatar}
								>
									<Icon
										as={Ionicons}
										name="camera-reverse-outline"
										size={5}
										color={'#555'}
									/>
								</TouchableOpacity>
							)}
						</View>

						<Text style={{ marginTop: 20, fontSize: 16, fontWeight: '600' }}>
							{user?.emp_nm}
						</Text>
					</View>

					{userID !== dataUserSystem.EMP_NO && (
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								marginVertical: 20,
							}}
						>
							<TouchableOpacity
								style={{ marginRight: 40, alignItems: 'center' }}
								onPress={() =>
									modalContactRef.current.onShowModal({
										contactItem: user,
										room,
									})
								}
							>
								<View
									style={{
										padding: 8,
										borderRadius: 20,
										backgroundColor: '#f5f5f5',
										marginBottom: 8,
									}}
								>
									<Icon
										as={Ionicons}
										name="call-outline"
										size={7}
										color={colors.primary}
									/>
								</View>
								<Text>Call Phone</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ alignItems: 'center', marginRight: 40 }}
								onPress={() => _onPressMessageIcon(user)}
							>
								<View
									style={{
										padding: 8,
										borderRadius: 20,
										backgroundColor: '#f5f5f5',
										marginBottom: 8,
									}}
								>
									<Icon
										as={Ionicons}
										name="chatbubble-ellipses-outline"
										size={7}
										color={colors.primary}
									/>
								</View>
								<Text>Sent message</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{ alignItems: 'center' }}
								onPress={() => _onPressEmailIcon(user?.email)}
							>
								<View
									style={{
										padding: 8,
										borderRadius: 20,
										backgroundColor: '#f5f5f5',
										marginBottom: 8,
									}}
								>
									<Icon
										as={Ionicons}
										name="mail-outline"
										size={7}
										color={colors.primary}
									/>
								</View>
								<Text>Sent mail</Text>
							</TouchableOpacity>
						</View>
					)}

					{/* TODO: disable text input and add function copy when press */}
					<View style={{ padding: 8, flex: 1 }}>
						<TextInput
							mode="outlined"
							label="Branch"
							value={user?.branch_nm || ''}
							placeholder="Branch"
							style={{ marginBottom: 16, height: 40 }}
						/>
						<TextInput
							mode="outlined"
							label="Department"
							value={user?.div_nm}
							placeholder="Department"
							style={{ marginBottom: 16, height: 40 }}
						/>
						<TextInput
							mode="outlined"
							label="Position"
							value={user?.tit_nm}
							placeholder="Position"
							style={{ marginBottom: 16, height: 40 }}
						/>

						<View style={{ flexDirection: 'row', marginBottom: 16 }}>
							<TextInput
								mode="outlined"
								label="EXT"
								value={user?.ext}
								placeholder="EXT"
								style={{ height: 40, marginRight: 8, flex: 1 }}
							/>
							<TextInput
								textAlign={'left'}
								mode="outlined"
								label="Email"
								value={user?.email}
								placeholder="Email"
								style={{ height: 40, flex: 2 }}
							/>
						</View>

						<View style={{ flexDirection: 'row', marginBottom: 16 }}>
							<TextInput
								mode="outlined"
								label="Employ No."
								value={user?.emp_no}
								placeholder="EXT"
								style={{ height: 40, marginRight: 8, flex: 1 }}
							/>
							<TextInput
								mode="outlined"
								label="Phone"
								value={
									user?.dept_code === '9999' ? 'Not available' : user?.cellphone
								}
								placeholder="Phone"
								style={{ height: 40, flex: 2 }}
							/>
						</View>
						{(dataUserSystem?.EMP_NO === '00678' ||
							dataUserSystem?.EMP_NO === '00965') && (
							<TextInput
								mode="outlined"
								label="Birthday"
								value={user?.birthday}
								placeholder="Birthday"
								style={{ height: 40 }}
							/>
						)}

						<View
							style={{
								flexDirection: 'row',
								marginTop: 20,
							}}
						>
							{dataUserSystem.EMP_NO === userID && (
								<Button
									mode="contained"
									style={{ flex: 1, backgroundColor: 'red' }}
									uppercase={false}
									labelStyle={{ color: 'black' }}
									onPress={() => onPressDelete()}
								>
									Delete Account
								</Button>
							)}
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<View>
				<ImageViewerCustom
					ref={ref => {
						fileUploadRef.current = ref;
					}}
				/>
			</View>
			<CallPhoneOptionModal ref={modalContactRef} />
		</View>
	);
}
