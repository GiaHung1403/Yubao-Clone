import CameraRoll from '@react-native-community/cameraroll';
import * as FileSystem from 'expo-file-system';
import { Icon } from 'native-base';
import React, { useEffect, useImperativeHandle, useState } from 'react';
import {
	Alert,
	FlatList,
	PermissionsAndroid,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Color from '@config/Color';

import EventEmitter from '@utils/events';
import { DOMAIN_SERVER_CHAT, getDomainAPIChat } from '@data/Constants';

import { Avatar, Card, Modal, useTheme } from 'react-native-paper';
import { Ionicons, Feather } from '@expo/vector-icons';

import {
	api_getListUserRequest,
	deleteRequests,
	getListRequests,
} from '@data/api';
import { useNavigation } from '@react-navigation/native';
import { RocketChat } from '@data/rocketchat';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import { IUserLoginRC } from '@models/types';
import { useDispatch, useSelector } from 'react-redux';
import { get_ListRequest, getListRoomMemberRC } from '@actions/room_rc_action';

export default function RequestListComponent(props: any, ref: any) {
	const navigation: any = useNavigation();
	const [visible, setVisible] = useState<boolean>(false);
	const { roomId, roomType } = props;
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const listRequest: any = useSelector(
		(state: any) => state.room_rc_reducer.listRequest,
	);
	const dispatch = useDispatch();
	const { colors } = useTheme();

	useEffect(() => {
		EventEmitter.addEventListener('showListUserRequest', item => {
			showModal();
		});
		EventEmitter.addEventListener('hideListUserRequest', () => {
			hideModal();
		});

		return () => {
			EventEmitter.removeListener('showListUserRequest');
			EventEmitter.removeListener('hideListUserRequest');
		};
	}, []);

	// useEffect(() => {
	// 	// const data : any = await api_getListUserRequest({roomId : 'ahihi'})
	// 	(async function getData() {
	// 		const getData: any = await getListRequests({
	// 			roomID: roomId,
	// 			UserID: dataUserRC.userId,
	// 			token: dataUserRC.authToken,
	// 		});
	// 		setListUserRequest(getData);
	// 		// const data = await RocketChat.getListCustomEmoji();
	// 		// setListEmojiCustom(data.emojis);
	// 	})();
	// }, []);

	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);

	const _onPress_Yes = async user => {
		deleteRequests({
			roomID: roomId,
			UserID: dataUserRC.userId,
			token: dataUserRC.authToken,
			UserID_Delete: user,
		});
		await RocketChat.invite_Groups({ roomId: roomId, list_userId: [user] });
		dispatch(
			getListRoomMemberRC({
				roomID: roomId,
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				type: roomType,
			}),
		);
		dispatch(
			get_ListRequest({
				roomID: roomId,
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
			}),
		);
	};

	const _onPress_No = async user => {
		const data = deleteRequests({
			roomID: roomId,
			UserID: dataUserRC.userId,
			token: dataUserRC.authToken,
			UserID_Delete: user,
		});

		dispatch(
			get_ListRequest({
				roomID: roomId,
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
			}),
		);
	};

	return (
		<Modal
			visible={visible}
			onDismiss={hideModal}
			contentContainerStyle={{ padding: 20, margin: 20 }}
		>
			<Card elevation={2} style={{}}>
				<View style={{ padding: 8, maxHeight: 400 }}>
					<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
						<Text
							style={{
								flex: 1,
								textAlign: 'center',
								fontSize: 15,
								fontWeight: '600',
								color: '#666',
							}}
						>
							List user want to join room
						</Text>
						<TouchableOpacity
							style={{ paddingHorizontal: 1 }}
							onPress={() =>
								dispatch(
									get_ListRequest({
										roomID: roomId,
										token: dataUserRC.authToken,
										UserID: dataUserRC.userId,
									}),
								)
							}
						>
							<Icon
								as={Ionicons}
								name={'refresh-outline'}
								size={7}
								color={Color.main}
							/>
						</TouchableOpacity>
					</View>

					<Text style={{ fontSize: 13, color: '#666' }}>
						{`*Note: \n - When accept user can see all information in this room chat!!!`}
					</Text>

					{/* List Request */}
					<FlatList
						style={{}}
						showsVerticalScrollIndicator={false}
						data={listRequest}
						keyExtractor={(_, index) => index.toString()}
						renderItem={({ item, index }) => (
							<Card
								key={index.toString()}
								style={{ borderRadius: 8, margin: 8, flexDirection: 'row' }}
								elevation={2}
							>
								<View style={{ flexDirection: 'row' }}>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											padding: 10,
											flex: 1,
											alignItems: 'center',
										}}
										onPress={() => {
											// navigation.navigate('UserInfoScreen', {
											// 	userID: item?.userData[0].username,
											// });
											null
										}}
									>
										<Avatar.Image
											source={{
												uri: `${getDomainAPIChat()}/avatar/${
													item?.userData[0].username
												}?size=60&format=png`,
											}}
											size={40}
											style={{ backgroundColor: '#fff', marginRight: 4 }}
										/>
										<View
											style={{ marginLeft: 8, justifyContent: 'space-between' }}
										>
											<Text
												style={{
													fontWeight: '600',
												}}
											>
												{item.userData[0].name}
											</Text>
											{/* <Text
												style={{
													fontSize: 12,

													color: '#666',
												}}
											>
												{item.DEP}
											</Text> */}
										</View>
									</TouchableOpacity>
									<View
										style={{
											marginTop: 8,
											justifyContent: 'flex-end',
											flexDirection: 'row',
										}}
									>
										<TouchableOpacity
											style={{ paddingHorizontal: 10, paddingVertical: 5 }}
											onPress={() => _onPress_Yes(item?.userData[0]._id)}
										>
											<Icon
												as={Ionicons}
												name={'checkmark-outline'}
												size={7}
												color={Color.approved}
											/>
										</TouchableOpacity>
										<TouchableOpacity
											style={{ paddingHorizontal: 10, paddingVertical: 5 }}
											onPress={() => _onPress_No(item?.userData[0]._id)}
										>
											<Icon
												as={Ionicons}
												name={'close-outline'}
												size={7}
												color={Color.reject}
											/>
										</TouchableOpacity>
									</View>
								</View>
							</Card>
						)}
					/>
				</View>
			</Card>
		</Modal>
	);
}
