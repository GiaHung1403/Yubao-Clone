import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	InteractionManager,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	RefreshControl,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Card, FAB, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DataProvider, LayoutProvider } from 'recyclerlistview';

import { setDataUserRC, setDataUserSystem } from '@actions/auth_action';
import { getListRoomRC, setRoomChange } from '@actions/room_rc_action';
import { getAllUserRC } from '@actions/user_action';
import Header from '@components/Header';
import Color from '@config/Color';
import {
	createDirectMessage,
	getSpotlight,
	searchUserAndRoom,
} from '@data/api';
import AsyncStorage from '@data/local/AsyncStorage';
import { RocketChat } from '@data/rocketchat';
import {
	IContact,
	IDepartment,
	IRoom,
	ISortRoom,
	ISubscriptionsRC,
	IUserLoginRC,
} from '@models/types';
import EventEmitter from '@utils/events';
import RoomItemComponent from './RoomItemComponent';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { setDepartmentSelected } from '@actions/contact_action';
import { insertRequests } from '@data/api/api_room_chat_request';

interface IRoomReducer {
	listRoom: ISubscriptionsRC[];
	loading: boolean;
}

interface IContactReducer {
	listContact: IContact[];
	listContactFilter: IContact[];
	loading: boolean;
	departmentSelected: IDepartment;
}

const { width } = Dimensions.get('window');

const dataProvider = new DataProvider((r1, r2) => {
	return r1.rid !== r2.rid;
});

let streamListener: any;
let promises: any;

export function ChatRoomListScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const { listRoom, loading }: IRoomReducer = useSelector(
		(state: any) => state.room_rc_reducer,
	);
	const { listContactFilter, departmentSelected }: IContactReducer =
		useSelector((state: any) => state.contact_reducer);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [isGlobalDomain, setIsGlobalDomain] = useState<boolean>(false);
	const [listAllSpotlight, setListAllSpotlight] = useState<any>([]);
	const [sortOptionSelected, setSortOptionSelected] = useState<ISortRoom>();

	// const [listSearchUser, setListSearchUser] = useState()
	const [listSearchRoom, setListSearchRoom] = useState<any>([{}]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (doneLoadAnimated) {
			if (listRoom?.length === 0) {
				dispatch(getListRoomRC());
			}

			dispatch(
				getAllUserRC({
					UserID: dataUserRC?.userId,
					token: dataUserRC?.authToken,
				}),
			);

			(async function getDataSpotlightAndUser() {
				const credentials: any = await Keychain.getGenericPassword();
				setIsGlobalDomain(credentials.username.length >= 10);

				const mergerSpotlight: any = await getSpotlight({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					query: '',
					count: 10,
				});

				await searchUserAndRoom({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					query: '',
					count: 10,
				});

				const objectSortOption: any = await AsyncStorage.getSortRoom();
				setSortOptionSelected(objectSortOption);
				setListAllSpotlight(mergerSpotlight);
			})();
			EventEmitter.addEventListener('sortRoomEvent', data => {
				setSortOptionSelected(data.sortOptionSelected);
			});
		}
		return () => {
			EventEmitter.removeListener('sortRoomEvent');
		};
	}, [doneLoadAnimated]);

	// useEffect(() => {
	// 	(async function search() {
	// 		const mergerSpotlight: any = await getSpotlight({
	// 			token: dataUserRC.authToken,
	// 			UserID: dataUserRC.userId,
	// 			query: firstQuery,
	// 			count: 10,
	// 		});
	// 		// const getAll: any = await getAll_Room({
	// 		// 	token: dataUserRC.authToken,
	// 		// 	UserID: dataUserRC.userId,
	// 		// 	query: '',
	// 		// 	count: 10,
	// 		// });

	// 		setListAllSpotlight(mergerSpotlight);
	// 		// try {
	// 		// 	const testData: any = await RocketChat.searchDirectory({
	// 		// 		text: firstQuery,
	// 		// 		type: 'user',
	// 		// 	});
	// 		// 	const testData2: any = await RocketChat.searchRoomAdmin({
	// 		// 		text: firstQuery,
	// 		// 	});
	// 		// 	setListAllSpotlight(testData2?.rooms);
	// 		// 	// setListAllSpotlight(testData2);
	// 		// } catch (error) {
	// 		// }
	// 	})();
	// }, [firstQuery, listAllSpotlight]);

	useEffect(() => {
		(async function search() {
			// const mergerSpotlight: any = await getSpotlight({
			// 	token: dataUserRC.authToken,
			// 	UserID: dataUserRC.userId,
			// 	query: firstQuery,
			// 	count: 10,
			// });

			try {
				const testData: any = await RocketChat.searchDirectory({
					text: firstQuery,
					type: 'users',
				});
				// console.log(testData?.result);
				setListAllSpotlight(testData?.result);

				const testData2: any = await RocketChat.searchRoomAdmin({
					text: firstQuery,
				});

				// const Data: any = await getListSearch({
				// 	filter: firstQuery,
				// });
				// setListAllSpotlight(testData2?.rooms);
				// const convertLisTData = testData2.rooms.filter(item => item.t === 'p');
				const convertLisTData = testData2.rooms;
				setListSearchRoom(convertLisTData);
			} catch (error) {
				console.log({ error });
			}
		})();
	}, [firstQuery]);

	// useEffect(()=> {
	// 	// const convertLisTData = listSearchRoom.filter(item => item.t === 'p');
	// 	console.log(listSearchRoom);
	// },[listSearchRoom]);

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getListData();
			streamListener = RocketChat.onStreamData({
				event: 'stream-notify-user',
				callback: data => handleNotifyRoomReceived(data),
			});

			promises = RocketChat.subscribeNotifyUser().catch(e =>
				Alert.alert('Error', e.message),
			);
		});

		return () => {
			stopEventListener();
			unsubscribe;
			dispatch(
				setDepartmentSelected({
					departmentSelected: undefined,
				}),
			);
		};
	}, [navigation]);

	const stopEventListener = () => {
		if (promises) {
			try {
				promises.then(subscriptions => {
					subscriptions.forEach(sub => sub?.unsubscribe());
				});
			} catch (e: any) {
				// do nothing
			}
		}
		if (streamListener) {
			streamListener.then(removeListener);
			streamListener = false;
		}
	};

	const removeListener = listener => listener.stop();

	const handleNotifyRoomReceived = response => {
		// here you receive messages from server //notice the event name is: 'stream-room-messages'
		if (
			response.msg === 'changed' &&
			response.collection === 'stream-notify-user'
		) {
			const roomChanged: any = response?.fields?.args;

			if (!roomChanged || roomChanged[0] !== 'updated') {
				return null;
			}

			dispatch(setRoomChange({ room: roomChanged[1] }));
			return;
		}
	};

	const sendRequest = async room => {
		try {
			const data = await insertRequests({
				roomID: room._id,
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
			});
		} catch (e) {
			console.log(e);
		}
	};

	const _onPressRoomItem = async item => {
		Keyboard.dismiss();
		try {
			const data: any = await RocketChat.getRoomInfo({ roomId: item._id });
			// console.log('====================================');
			// console.log('ahhi');
			// console.log('====================================');
			// navigation.navigate('ChatRoomMessageScreen', { room: item });
		} catch (error: any) {
			if (error.data.error === 'not-allowed') {
				Alert.alert(
					'Alert',
					"You don't have permission to in this room!!!\n Do you want to join this room?",
					[
						{ text: 'Cancel', onPress: () => null },
						{
							text: 'Yes',
							onPress: async () => {
								sendRequest(item);
							},
						},
					],
				);
			}
		}

		try {
			if (!item.rid && item.t === 'p') {
				// navigation.navigate('ChatRoomMessageScreen', { room: item });
				return;
			}

			if (!item.rid && item.t === 'c') {
				const roomResponse = await RocketChat.joinRoom({
					roomId: item._id,
					joinCode: null,
				});
				stopEventListener();
				navigation.navigate('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse.channel, {
						rid: roomResponse.channel._id,
					}),
				});
				return;
			}

			if (!item.rid) {
				const roomResponse: any = await createDirectMessage({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					usernameStaff: item.username,
				});
				stopEventListener();
				navigation.navigate('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse, {
						name: item.username,
						fname: item.name,
					}),
				});
				return;
			}
			stopEventListener();
			navigation.navigate('ChatRoomMessageScreen', { room: item });
		} catch (error) {
			Alert.alert('Alert', 'Something wrong! Please try again!');
		}
	};

	// const _onPressRoomItem_Search = async item => {
	// 	Keyboard.dismiss();
	// 	try {
	// 		if (!item.rid && item.t === 'c') {
	// 			const roomResponse = await RocketChat.joinRoom({
	// 				roomId: item._id,
	// 				joinCode: null,
	// 			});
	// 			stopEventListener();
	// 			navigation.navigate('ChatRoomMessageScreen', {
	// 				room: Object.assign(roomResponse.channel, {
	// 					rid: roomResponse.channel._id,
	// 				}),
	// 			});
	// 			return;
	// 		}

	// 		if (!item.rid) {
	// 			const roomResponse: any = await createDirectMessage({
	// 				token: dataUserRC.authToken,
	// 				UserID: dataUserRC.userId,
	// 				usernameStaff: item.username,
	// 			});
	// 			stopEventListener();
	// 			navigation.navigate('ChatRoomMessageScreen', {
	// 				room: Object.assign(roomResponse, {
	// 					name: item.username,
	// 					fname: item.name,
	// 				}),
	// 			});
	// 			return;
	// 		}
	// 		stopEventListener();
	// 		navigation.navigate('ChatRoomMessageScreen', { room: item });
	// 	} catch (error) {
	// 		// Alert.alert('Alert', 'Something wrong! Please try again!');
	// 		// Alert.alert('Alert', "You don't permission to  !");
	// 		Alert.alert('Alert', 'Are you sure to join this room', [
	// 			{ text: 'Cancel' },
	// 			{
	// 				text: 'Yes',
	// 				// onPress: async () => {
	// 				// 	const deviceToken = await AsyncStorage.getDeviceTokenRC();
	// 				// 	try {
	// 				// 		await RocketChat.removePushToken({ token: deviceToken });
	// 				// 	} catch (e: any) {
	// 				// 		Alert.alert('Error', e.message);
	// 				// 	}
	// 				// 	await Keychain.setGenericPassword('', '');
	// 				// 	navigation.goBack();
	// 				// 	setTimeout(() => {
	// 				// 		AsyncStorage.logOut();
	// 				// 		Keychain.setGenericPassword('', '');
	// 				// 		dispatch(setDataUserSystem({ dataUser: [null] }));
	// 				// 		dispatch(setDataUserRC({ dataUser: null }));
	// 				// 	}, 1000);
	// 				// },
	// 			},
	// 		]);
	// 	}
	// };

	const _onSwipeLeftRoomItem = async (room: IRoom) => {
		if (isUnreadMessage(room)) {
			await RocketChat.readMessage({ rid: room.rid });
			return;
		}
		await RocketChat.unReadMessage({ rid: room.rid });
	};

	const _onSwipeRightRoomItem = async (room: IRoom) => {
		Alert.alert('Alert', 'Are you sure you want to delete this room?', [
			{ text: 'No', onPress: () => null, style: 'cancel' },
			{
				text: 'Yes',
				onPress: async () => {
					await RocketChat.closeRoom({ roomType: room.t, roomId: room.rid });
				},
				style: 'destructive',
			},
		]);
	};

	const getListData = () => {
		dispatch(getListRoomRC());
	};

	const onRefresh = async () => {
		getListData();
	};

	const isSearching = firstQuery !== '';

	const isUnreadMessage = room =>
		(room.unread > 0 || room.tunread?.length > 0 || room.alert) &&
		!room.hideUnreadStatus;

	const sortListRoom = () => {
		let listSortRoom: ISubscriptionsRC[] = [...listRoom];

		if (sortOptionSelected?.sortOptionSelected === 'activity') {
			listSortRoom = listSortRoom.sort((a, b) =>
				a.lastMessage?.ts < b.lastMessage?.ts ? 1 : -1,
			);
		}

		if (sortOptionSelected?.sortOptionSelected === 'alphabetic') {
			listSortRoom = listSortRoom.sort((a, b) =>
				(a.fname || a.name).charAt(0).toLowerCase() <
				(b.fname || b.name).charAt(0).toLowerCase()
					? -1
					: 1,
			);
		}

		if (sortOptionSelected?.groupOptionSelected?.isUnreadOnTop) {
			const listUnread = listSortRoom.filter(room => isUnreadMessage(room));
			const listRead = listSortRoom.filter(room => !isUnreadMessage(room));
			listSortRoom = [...listUnread, ...listRead];
		}

		const cloudRoomIndex = listSortRoom.findIndex(
			roomItem => roomItem.fname === 'My Cloud',
		);
		const cloudRoom = listSortRoom[cloudRoomIndex];

		if (cloudRoomIndex > 0) {
			const data = listSortRoom.splice(cloudRoomIndex, 1);
			listSortRoom.unshift(cloudRoom);
		}

		return listSortRoom.filter(item => item.open);
	};

	const _layoutProvider = new LayoutProvider(
		i => {
			return 'ROOM';
		},
		(type, dim) => {
			switch (type) {
				case 'ROOM':
					dim.width = width;
					dim.height = 70;
					break;
				default:
					dim.width = width;
					dim.height = 0;
			}
		},
	);


	const listData =
		departmentSelected && departmentSelected?.C_NO !== '0'
			? listContactFilter.map(item => ({
					name: item.emp_nm,
					outside: true,
					status: 'online',
					statusText: '',
					username: item.emp_no,
			  }))
			: isSearching
			? listAllSpotlight
			: sortListRoom();

	const _onPressButtonLogout = () => {
		Alert.alert('Alert', 'Are you sure??', [
			{ text: 'Cancel' },
			{
				text: 'OK',
				onPress: async () => {
					const deviceToken = await AsyncStorage.getDeviceTokenRC();
					try {
						await RocketChat.removePushToken({ token: deviceToken });
					} catch (e: any) {
						Alert.alert('Error', e.message);
					}
					await Keychain.setGenericPassword('', '');
					navigation.goBack();
					setTimeout(() => {
						AsyncStorage.logOut();
						Keychain.setGenericPassword('', '');
						dispatch(setDataUserSystem({ dataUser: [null] }));
						dispatch(setDataUserRC({ dataUser: null }));
					}, 1000);
				},
			},
		]);
	};

	const itemView = ({ item, index }) => {
		return (
			<View>
				<RoomItemComponent
					data={item}
					dataUserRC={dataUserRC}
					isSearching={
						isSearching ||
						(departmentSelected && departmentSelected?.C_NO !== '0')
					}
					onPress={() => {
						_onPressRoomItem(item);
					}}
					onSwipeLeft={() => _onSwipeLeftRoomItem(item)}
					onSwipeRight={() => _onSwipeRightRoomItem(item)}
				/>
			</View>
		);
	};

	const listChat = () => {
		return (
			<View style={{ flex: 1 }}>
				<FlatList
					style={{ flex: 1, paddingTop: 8 }}
					data={listData}
					keyExtractor={(_, index) => index.toString()}
					refreshControl={
						<RefreshControl
							tintColor={colors.primary}
							colors={[colors.primary, Color.waiting, Color.approved]}
							refreshing={loading}
							onRefresh={onRefresh}
						/>
					}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => itemView({ item, index })}
				/>
				{/* <RecyclerListView
						rowRenderer={(type, data, index, extendedState) => (
							<RoomItemComponent
								data={data}
								dataUserRC={dataUserRC}
								isSearching={isSearching}
								onPress={() => _onPressRoomItem(data)}
								onSwipeLeft={() => _onSwipeLeftRoomItem(data)}
								onSwipeRight={() => _onSwipeRightRoomItem(data)}
							/>
						)}
						dataProvider={dataProvider.cloneWithRows(listData)}
						layoutProvider={_layoutProvider}
						renderFooter={() => <SafeAreaView style={{ height: 20 }} />}
						scrollViewProps={{
							refreshControl: (
								<RefreshControl
									tintColor={colors.primary}
									colors={[colors.primary, Color.waiting, Color.approved]}
									refreshing={loading}
									onRefresh={onRefresh}
								/>
							),
						}}
						style={{ paddingTop: 8 }}
					/> */}
			</View>
		);
	};

	const listRoomSeacrch = () => {
		return (
			<View style={{ flex: 1 }}>
				<Text
					style={{
						marginTop: 10,
						fontWeight: '600',
						padding: 5,
						fontSize: 15,
						paddingLeft: 12,
						backgroundColor: '#E0E0E0',
					}}
				>
					Users
				</Text>
				<FlatList
					style={{ flex: 1, paddingTop: 8, paddingBottom: 8, maxHeight: 300 }}
					data={listData}
					keyExtractor={(_, index) => index.toString()}
					refreshControl={
						<RefreshControl
							tintColor={colors.primary}
							colors={[colors.primary, Color.waiting, Color.approved]}
							refreshing={loading}
							onRefresh={onRefresh}
						/>
					}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => itemView({ item, index })}
				/>
				<Text
					style={{
						fontWeight: '600',
						padding: 5,
						fontSize: 15,
						paddingLeft: 12,
						// borderWidth : 10,
						backgroundColor: '#E0E0E0',
					}}
				>
					Room
				</Text>
				<FlatList
					style={{ flex: 1, paddingTop: 8 }}
					data={listSearchRoom}
					keyExtractor={(_, index) => index.toString()}
					refreshControl={
						<RefreshControl
							tintColor={colors.primary}
							colors={[colors.primary, Color.waiting, Color.approved]}
							refreshing={loading}
							onRefresh={onRefresh}
						/>
					}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => itemView({ item, index })}
					// renderItem={({ item, index }) => {return (<View style={{flex : 1}}><Text>{item?.rooms.name}</Text></View>)}}
				/>
			</View>
		);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<View style={{ zIndex: 2 }}>
				<Header
					title="Messages"
					hiddenBack={isGlobalDomain}
					isShowButton={isGlobalDomain}
					labelButton={'Logout'}
					onPressButton={_onPressButtonLogout}
				/>
			</View>

			<Card style={{ marginTop: 8, marginHorizontal: 8 }} elevation={3}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						paddingHorizontal: 8,
						paddingVertical: 12,
						alignItems: 'center',
					}}
					onPress={() =>
						navigation.navigate('FilterContactModal', { query: firstQuery })
					}
				>
					<Text style={{ flex: 1, color: '#666' }}>
						{departmentSelected
							? departmentSelected.STND_C_NM
							: 'Choose department'}
					</Text>
					<Icon
						as={Ionicons}
						name="chevron-down-outline"
						size={6}
						color={'#666'}
					/>
				</TouchableOpacity>
			</Card>

			<Searchbar
				value={firstQuery}
				textAlign={'left'}
				placeholder="Search"
				style={{ marginHorizontal: 8, marginTop: 8, zIndex: 2 }}
				inputStyle={{ fontSize: 16 }}
				placeholderTextColor="#999"
				iconColor="#999"
				onChangeText={(text: string) => setFirstQuery(text)}
			/>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
			>
				{doneLoadAnimated &&
				(listData?.length > 0 || listSearchRoom.length > 0) &&
				sortOptionSelected ? (
					!isSearching ? (
						<View style={{ flex: 1 }}>{listChat()}</View>
					) : (
						<View style={{ flex: 1 }}>{listRoomSeacrch()}</View>
					)
				) : (
					<LoadingFullScreen />
				)}
			</KeyboardAvoidingView>
			<FABActionListRoom listAllSpotlight={listAllSpotlight} />
		</View>
	);
}

const FABActionListRoom = props => {
	const navigation: any = useNavigation();
	const { listAllSpotlight } = props;
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onStateChange = ({ open }) => setIsOpen(open);

	const _onPressNewMessage = () => {
		navigation.navigate('ChatNewScreen', {
			listAllSpotlight,
		});
	};

	return (
		<FAB.Group
			visible={true}
			open={isOpen}
			icon={isOpen ? 'close' : 'menu'}
			actions={[
				{
					icon: 'plus',
					label: 'Create Room',
					onPress: () => _onPressNewMessage(),
				},
				{
					icon: 'sort',
					label: 'Sort',
					onPress: () => navigation.navigate('SortRoomModal'),
				},
			]}
			onStateChange={onStateChange}
		/>
	);
};
