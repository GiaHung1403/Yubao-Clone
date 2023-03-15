import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	FlatList,
	InteractionManager,
	Keyboard,
	RefreshControl,
	SafeAreaView,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Card, FAB, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { DataProvider } from 'recyclerlistview';

import { setDataUserRC, setDataUserSystem } from '@actions/auth_action';
import { getListRoomRC, setRoomChange } from '@actions/room_rc_action';
import Header from '@components/Header';
import Color from '@config/Color';
import AsyncStorage from '@data/local/AsyncStorage';
import { RocketChat } from '@data/rocketchat';
import {
	ICustomer,
	IRoom,
	ISubscriptionsRC,
	IUserLoginRC,
	IUserSystem,
} from '@models/types';
import RoomItemComponent from './RoomItemComponent';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import firestore from '@react-native-firebase/firestore';
import { getListContact } from '@actions/contact_action';

interface IRoomReducer {
	listRoom: ISubscriptionsRC[];
	loading: boolean;
}
interface IRouteParams {
	customerSelected: ICustomer;
}

const { width } = Dimensions.get('window');

const dataProvider = new DataProvider((r1, r2) => {
	return r1.rid !== r2.rid;
});

let streamListener: any;
let promises: any;
let listMessage: any;
let result: boolean = false;

export function ChatSupportScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	// const { customerID, customerName } = props.route.params;
	const { customerSelected }: IRouteParams = props.route.params;
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const { listRoom, loading }: IRoomReducer = useSelector(
		(state: any) => state.room_rc_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [isGlobalDomain, setIsGlobalDomain] = useState<boolean>(false);
	const [listChatMessage, setListChatMessage] = useState<any>([]);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			let dataQuestion = await firestore()
				.collection('Chat_Support')
				.onSnapshot(questSnapshot => {
					const temp: any = [];
					questSnapshot.forEach(item => {
						const ID = item.data()?.ID.split('_');
						if (ID[1] === dataUserSystem.EMP_NO) {
							if (!checkSeenMessage(item.data().listMessage)) {
								temp.push({ data: item.data(), key: item.id, haveSeen: false });
							} else {
								temp.push({ data: item.data(), key: item.id, haveSeen: true });
							}
						}
					});
					listMessage = temp;
					setListChatMessage(temp);
				});
			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: '0',
					Branch: '-1',
					subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
				}),
			);

			setDoneLoadAnimated(true);
		});
		// setDoneLoadAnimated(true);
	}, []);

	useEffect(() => {
		if (firstQuery !== '') {
			const temp = listChatMessage.filter(item =>
				item?.data?.ID.includes(firstQuery),
			);
			setListChatMessage(temp);
		} else {
			setListChatMessage(listMessage);
		}
	}, [firstQuery]);

	useEffect(() => {
		if (customerSelected !== undefined) {
			if (
				!checkExistRoom(
					`${customerSelected?.tax_code.trim()}_${dataUserSystem.EMP_NO}`,
				)
			) {
				(async () => {
					try {
						await firestore()
							.collection('Chat_Support')
							.add({
								ID: `${customerSelected?.tax_code.trim()}_${
									dataUserSystem.EMP_NO
								}`,
								Support_Name: dataUserSystem?.EMP_NM,
								User_Name: customerSelected?.ls_nm,
								Link_Image: '',
								createAt: firestore.Timestamp.now(),
								listMessage: [],
							});
					} catch (error: any) {
						Alert.alert('Error', error.message);
					}
				})();
			} else {
				Alert.alert('Alert', 'The room chat have exits', [{ text: 'Ok' }]);
			}
		}
	}, [customerSelected]);

	const checkExistRoom = item => {
		for (let i = 0; i < listChatMessage.length; i++) {
			if (listChatMessage[i].data.ID === item) return true;
		}
		return result;
	};

	const checkSeenMessage = message => {
		if (
			message[message.length - 1]?.From === '1' &&
			message[message.length - 1]?.seen === false
		)
			return false;
		return true;
	};

	//get message that has't seen
	// useEffect(()=>{
	// 	// InteractionManager.runAfterInteractions(async () => {
	// 	// 	let dataQuestion = await firestore()
	// 	// 		.collection('Chat_Support')
	// 	// 		.onSnapshot(questSnapshot => {
	// 	// 			const temp: any = [];
	// 	// 			questSnapshot.forEach(item => {
	// 	// 				console.log(item.data().listMessage)
	// 	// 			});
	// 	// 		});
	// 	// });
	// },[listChatMessage])

	const _onPressRoomItem = async item => {
		Keyboard.dismiss();
		navigation.navigate('ChatSupportRoomScreen', {
			room: item,
			// titleName :
		});
	};

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

			<Searchbar
				value={firstQuery}
				textAlign={'left'}
				placeholder="Search by TaxCode"
				style={{ marginHorizontal: 8, marginTop: 8, zIndex: 2 }}
				inputStyle={{ fontSize: 16 }}
				placeholderTextColor="#999"
				iconColor="#999"
				onChangeText={(text: string) => setFirstQuery(text)}
			/>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						style={{ flex: 1, paddingTop: 8 }}
						data={listChatMessage}
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
						renderItem={({ item, index }) => (
							<RoomItemComponent
								data={item?.data}
								dataUserRC={dataUserRC}
								// isSearching={
								// 	isSearching ||
								// 	(departmentSelected && departmentSelected?.C_NO !== '0')
								// }
								haveSeen={item?.haveSeen}
								onPress={() => _onPressRoomItem(item?.key)}
								onSwipeLeft={() => _onSwipeLeftRoomItem(item)}
								onSwipeRight={() => _onSwipeRightRoomItem(item)}
							/>
						)}
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
			) : (
				<LoadingFullScreen />
			)}
			<SafeAreaView
				style={{ position: 'absolute', margin: 20, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					// onPress={() => navigation.navigate('CustomerListScreen', {kind : 'newChat'})}
					onPress={() =>
						navigation.navigate('ChooseCustomerModal', {
							idCustomerExisted: '',
							screenBack: 'ChatSupportScreen',
						})
					}
				/>
			</SafeAreaView>
		</View>
	);
}
