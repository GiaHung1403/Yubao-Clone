import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Icon } from 'native-base';

import React, {
	useEffect,
	useMemo,
	useRef,
	useState,
	useCallback,
	useImperativeHandle,
} from 'react';

import {
	Alert,
	Image,
	InteractionManager,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Animated,
	Dimensions,
	StatusBar,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker, {
	ImageOrVideo,
	Options,
} from 'react-native-image-crop-picker';
import { useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { clearUserTyping, setUserTyping } from '@actions/message_action';
import { getListRoomMemberRC, get_ListRequest } from '@actions/room_rc_action';
import ActionSheet from '@components/ActionSheet/ActionSheet';
import HeaderRoom from '@components/HeaderRoom';
import { getInfoUserRC, upLoadFileRC } from '@data/api';
import { getDomainAPIChat } from '@data/Constants';
import { RocketChat } from '@data/rocketchat';
import { Ionicons } from '@expo/vector-icons';
import {
	IMemberRoom,
	IMessage,
	IPinMessage,
	IRoom,
	IUserLoginRC,
} from '@models/types';
import { generateHash } from '@utils';
import openLink from '@utils/openLink';

import ImageViewerComponent from './ImageViewerComponent/ImageViewerComponent';
import MentionSelectComponent from './MentionSelectComponent/MentionSelectComponent';
import PinMessageComponent from './PinMessageComponent/';
import QuoteComponent from './QuoteComponent/QuoteComponent';
import RequestListComponent from './RequestListComponent';

import { useDimensions } from '@react-native-community/hooks';
import { NavigationState } from 'react-native-tab-view';
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import { hasNotch } from 'react-native-device-info';
import ListMessageComponent from './ListMessageComponent';
import EventEmitter from '@utils/events';
// import { useKeyboard } from '@react-native-community/hooks';
// import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';

import ChatInputView from './ChatInputView';
import EditMessageComponent from './EditMessageComponent';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TabEmojiComponent from './TabEmojiComponent';
import styles from './styles';

const IMG_TYPING = require('@assets/typing_animation.json');
interface IRouteParams {
	room: IRoom;
}

type Route = {
	key: string;
	icon: string;
	isNormalEmoji?: boolean;
};
type State = NavigationState<Route>;

let message: string = '';
let itemMessageSelected: IMessage;
let isEditMessage: boolean = false;
let isQuoteMessage: boolean = false;
let showTab = false;
let tabEmojiHeight = 340;

const libraryPickerConfig: Options = {
	multiple: true,
	compressVideoPreset: 'Passthrough',
	mediaType: 'any',
	forceJpg: true,
};

let listUserMention: any = [];
let listUserRequest: any = [];
const IC_NOTIFICATION = require('@assets/icons/ic_check_user.png');

export function ChatRoomMessageScreen(props: any) {
	const windowHeight = Dimensions.get('window').height;
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { width } = useDimensions().screen;
	// const keyboard = useKeyboard()

	const { colors } = useTheme();
	const inputMessageRef = useRef<any>();
	const buttonViewerRef = useRef<any>();
	const bottomSheetRef = useRef<any>();
	const imageViewerRef = useRef<any>();
	const listMessageRef = useRef<any>();

	// console.log('====================================');
	// console.log('Render chat room');
	// console.log('====================================');

	// const listUserRequestRef = useRef<any>();

	// const listRoomMemberRC: IMemberRoom[] = useSelector(
	// 	(state: any) => state.room_rc_reducer.listRoomMemberRC,
	// );

	const { room }: IRouteParams = props.route.params;
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const listRequest: any = useSelector(
		(state: any) => state.room_rc_reducer.listRequest,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [dataUser, setDataUser] = useState<any>();
	const tabHeight = new Animated.Value(
		windowHeight + tabEmojiHeight + (StatusBar?.currentHeight || 0),
	);

	// const [listRequest, setListRequest] = useState<any>([{}])

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
		return () => {
			dispatch(clearUserTyping());
		};
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		// (async function getDataRequest() {
		// 		const data: any = await getListRequests({
		// 			roomID: room.rid || room._id,
		// 			token: dataUserRC.authToken,
		// 			UserID: dataUserRC.userId,
		// 		});
		// 		 setListRequest(data);
		// 	// const data = await RocketChat.getListCustomEmoji();
		// 	// setListEmojiCustom(data.emojis);
		// })();

		(async function getData() {
			const username = room.t === 'd' ? room?.name : null;
			if (username) {
				const dataUserResponse: any = await getInfoUserRC({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					username,
				});
				setDataUser(dataUserResponse);
			}

			dispatch(
				getListRoomMemberRC({
					roomID: room.rid,
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					type: room.t,
				}),
			);

			dispatch(
				get_ListRequest({
					roomID: room.rid || room._id,
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
				}),
			);
		})();
	}, [doneLoadAnimated]);

	const setMessageValue = (value: string, text: string = '') => {
		inputMessageRef?.current.setNativeProps({ text: text || value });
		message = value;
		buttonViewerRef.current.onSetTyping(value);
	};

	const setItemMessageSelected = item => {
		itemMessageSelected = item;
	};

	const setEditMessage = value => {
		isEditMessage = value;
	};

	const setQuoteMessage = value => {
		isQuoteMessage = value;
	};

	const setListUserMention = value => {
		listUserMention.push(value);
	};

	const _onChangeTextMessage = (text: any) => {
		// const indexTag = text?.lastIndexOf('@');
		// if (room.t !== RoomType.DIRECT_CHAT && indexTag > -1) {
		// 	const textTag = text?.substring(indexTag + 1);
		// 	const listMemberFilter: any = listRoomMemberRC?.filter(member =>
		// 		member.name.includes(textTag),
		// 	);
		// 	EventEmitter.emit('showMention', { listRoomMember: listMemberFilter });
		// } else {
		// 	EventEmitter.emit('showMention', { listRoomMember: [] });
		// }
		// setMessageValue(text);
	};

	const _onPressMention = (member: IMemberRoom) => {
		let setMention = '';
		if (message.lastIndexOf('@') === message.length - 1) {
			var newStr = message.split('');
			newStr.splice(message.lastIndexOf('@'), 1, `@${member.name}`);
			setMention = newStr.join('');
		} else {
			setMention = message.replace(
				`@${message.substring(
					message.lastIndexOf('@') === message.length
						? message.lastIndexOf('@') - 1
						: message.lastIndexOf('@') + 1,
				)}`,
				`@${member.name}`,
			);
		}
		setMessageValue(`${setMention} `);
		// EventEmitter.emit('setMention', {
		// 	item: setMention,
		// 	mentionName: member.name,
		// });
		setListUserMention(member);
		//setListUserMention(listOld => [...listOld, member]);
	};

	/**
	 *  TODO: Gửi thêm phần mention,
	 *  làm cách nào để mention hiển thị trong input mà xoá 1 cái mà mất luôn???
	 */
	// const _onPressSentMessage = async () => {
	// 	if (isEditMessage) {
	// 		try {
	// 			await RocketChat.editMessage({
	// 				rid: room.rid,
	// 				messageId: itemMessageSelected?._id,
	// 				msg: message,
	// 			});
	// 			setMessageValue('');
	// 			// EventEmitter.emit('setMention', { item: '' });
	// 			setEditMessage(false);
	// 			return;
	// 		} catch (error: any) {
	// 			Alert.alert('Error', error.message);
	// 			setEditMessage(false);
	// 			return;
	// 		}
	// 	}
	// 	if (!message) {
	// 		return;
	// 	}

	// 	const listMention = listUserMention?.map(mention => ({
	// 		_id: mention._id,
	// 		name: mention.name,
	// 		username: mention.username,
	// 	}));

	// 	let temp = message;
	// 	listMention.forEach(item => {
	// 		temp = temp.replace(`@${item.name}`, `@${item.username}`);
	// 	});
	// 	setMessageValue(temp);

	// 	const objectParam = {
	// 		_id: generateHash(17),
	// 		rid: room.rid,
	// 		msg: temp,
	// 		mentions: listMention,
	// 	};

	// 	if (isQuoteMessage) {
	// 		Object.assign(objectParam, {
	// 			attachments: [
	// 				{
	// 					text: itemMessageSelected?.msg,
	// 					author_name: itemMessageSelected?.u.username,
	// 					author_icon: `${getDomainAPIChat()}/avatar/${
	// 						itemMessageSelected?.u.username
	// 					}`,
	// 					ts: itemMessageSelected?.ts,
	// 					attachments: [],
	// 					message_link: `http://125.212.249.189:3000/channel/${itemMessageSelected.rid}?msg=${itemMessageSelected._id}`,
	// 				},
	// 			],
	// 		});
	// 		setQuoteMessage(false);
	// 	}

	// 	try {
	// 		setMessageValue('');
	// 		EventEmitter.emit('setMention', { item: '' });
	// 		listMessageRef.current.updateListMessage(objectLocalText(objectParam));
	// 		await RocketChat.sendMessage(objectParam);
	// 		//setShowViewMentions(false);
	// 		EventEmitter.emit('showQuote', { item: false });
	// 	} catch (error) {
	// 		Alert.alert('Error', 'Cannot send message! Please try again!');
	// 	}
	// };

	const _onPressSentMessage = async item => {
		if (isEditMessage) {
			try {
				await RocketChat.editMessage({
					rid: room.rid || room._id,
					messageId: itemMessageSelected?._id,
					msg: item,
				});
				// setMessageValue('');
				EventEmitter.emit('showEdit', {
					value: true,
					itemMessageSelected: null,
				});
				setEditMessage(false);
				return;
			} catch (error: any) {
				Alert.alert('Error', error.message);
				setEditMessage(false);
				return;
			}
		}
		if (!item) {
			return;
		}

		const objectParam = {
			_id: generateHash(17),
			rid: room.rid || room._id,
			msg: item,
		};
		if (isQuoteMessage) {
			Object.assign(objectParam, {
				attachments: [
					{
						text: itemMessageSelected?.msg,
						author_name: itemMessageSelected?.u.username,
						author_icon: `${getDomainAPIChat()}/avatar/${
							itemMessageSelected?.u.username
						}?size=50&format=png`,
						ts: itemMessageSelected?.ts,
						attachments:
							itemMessageSelected?.msg === ''
								? itemMessageSelected?.attachments
								: [],
						message_link: `http://125.212.249.189:3000/channel/${itemMessageSelected.rid}?msg=${itemMessageSelected._id}`,
					},
				],
			});
			setQuoteMessage(false);
		}

		try {
			listMessageRef.current.updateListMessage(objectLocalText(objectParam));
			await RocketChat.sendMessage(objectParam);
			//setShowViewMentions(false);
			EventEmitter.emit('showQuote', { item: false });
		} catch (error) {
			Alert.alert('Error', 'Cannot send message! Please try again!');
		}
	};

	const objectLocalText = objectParam => {
		return {
			_id: objectParam._id,
			_updatedAt: new Date(),
			channels: [],
			md: [
				{
					type: 'PARAGRAPH',
					value: [{ type: 'PLAIN_TEXT', value: objectParam.msg }],
				},
			],
			mentions: [],
			msg: objectParam.msg,
			rid: objectParam.rid,
			ts: new Date(),
			u: {
				_id: dataUserRC.userId,
				name: dataUserRC.me.name,
				username: dataUserRC.me.username,
			},
			urls: [],
		};
	};

	const objectLocalImage = (file, rid) => {
		const fileName_Android = file?.path.substring(
			file.path.lastIndexOf('/') + 1,
		);

		return {
			_id: `local/${encodeURI(
				Platform.OS === 'ios'
					? file.filename
					: fileName_Android || 'fileMessage',
			)}`,
			_updatedAt: new Date(),
			attachments: [
				{
					image_dimensions: [],
					image_preview: '',
					image_size: 6534799,
					image_type: file.mime,
					image_url: file.path,
					title: encodeURI(
						Platform.OS === 'ios'
							? file.filename
							: fileName_Android || 'fileMessage',
					),
					title_link: file.path,
					title_link_download: true,
					ts: new Date(),
					type: 'file',
				},
			],
			channels: [],
			file: {
				_id: '',
				name: encodeURI(
					Platform.OS === 'ios'
						? file.filename
						: fileName_Android || 'fileMessage',
				),
				type: file.mime,
			},
			groupable: false,
			mentions: [],
			msg: '',
			rid: rid,
			ts: new Date(),
			u: {
				_id: dataUserRC.userId,
				name: dataUserRC.me.name,
				username: dataUserRC.me.username,
			},
			urls: [],
		};
	};

	// useEffect(() => {
	// 	const keyboardDidShowListener = Keyboard.addListener(
	// 		'keyboardDidShow',
	// 		() => {
	// 			setKeyboardVisible(true); // or some other action
	// 		},
	// 	);
	// 	const keyboardDidHideListener = Keyboard.addListener(
	// 		'keyboardDidHide',
	// 		() => {
	// 			setKeyboardVisible(false); // or some other action
	// 		},
	// 	);

	// 	return () => {
	// 		keyboardDidHideListener.remove();
	// 		keyboardDidShowListener.remove();
	// 	};
	// }, []);

	const useKeyboard = () => {
		let isKeyboardVisible: boolean = false;

		(() => {
			const keyboardDidShowListener = Keyboard.addListener(
				'keyboardDidShow',
				() => {
					isKeyboardVisible = true; // or some other action
				},
			);

			return () => {
				//   keyboardDidHideListener.remove();
				keyboardDidShowListener.remove();
			};
		})();
		return isKeyboardVisible;
	};

	const _onPressButtonEmoji = () => {
		Keyboard.dismiss();
		Animated.timing(tabHeight, {
			toValue: !showTab
				? windowHeight
				: windowHeight + 340 + (StatusBar.currentHeight || 0),
			duration: 200,
			useNativeDriver: false,
		}).start(() => {
			showTab = !showTab;
		});
		// if (isKeyboardVisible) {
		// 	offset.value = 0;
		// } else {
		// 	// emojiRef.current.onToggle();
		// 	if (offset.value === -330) {
		// 		offset.value = 0;
		// 	} else {
		// 		offset.value = -330;
		// 	}
		// }
	};

	const _onPressPickerImage = async () => {
		try {
			// The type can be video or photo, however the lib understands that it is just one of them.
			let attachments = (await ImagePicker.openPicker(
				libraryPickerConfig,
			)) as unknown as ImageOrVideo[];
			attachments.forEach(async item => {
				listMessageRef.current.updateListMessage(
					objectLocalImage(item, room.rid),
				);
			});

			attachments.forEach(async item => {
				const fileName_Android = item?.path.substring(
					item.path.lastIndexOf('/') + 1,
				);
				await upLoadFileRC(
					{
						token: dataUserRC.authToken,
						UserID: dataUserRC.userId,
						rid: room.rid,
						file: {
							uri: item?.path,
							type: item?.mime,
							name: encodeURI(
								Platform.OS === 'ios'
									? item?.filename
									: fileName_Android || 'fileMessage',
							),
						},
						description: '',
					},
					progress => {
						console.log(progress);
					},
				);
			});
		} catch (err) {
			console.log(err?.message + 'Upload file chat');
			//logEvent(events.ROOM_BOX_ACTION_LIBRARY_F);
			throw err;
		}

		// const options = {
		// 	mediaType: '',
		// };
		// try {
		// 	ImagePicker.launchImageLibrary(
		// 		options as ImagePicker.ImageLibraryOptions,
		// 		async response => {
		// 			if (response.assets) {
		// 				listMessageRef.current.updateListMessage(
		// 					objectLocalImage(response.assets[0], room.rid),
		// 				);
		// 				await upLoadFileRC(
		// 					{
		// 						token: dataUserRC.authToken,
		// 						UserID: dataUserRC.userId,
		// 						rid: room.rid,
		// 						file: {
		// 							uri: response.assets[0].uri,
		// 							type: response.assets[0].type,
		// 							name:
		// 								encodeURI(response.assets[0].fileName || '') ||
		// 								'fileMessage',
		// 						},
		// 						description: '',
		// 					},
		// 					progress => {
		// 						console.log(progress);
		// 					},
		// 				);
		// 			}
		// 		},
		// 	);
		// } catch (err) {
		// 	throw err;
		// }
	};

	const _onPressPickerFile = async () => {
		try {
			const results = await DocumentPicker.pickMultiple({
				type: [DocumentPicker.types.allFiles],
			});
			for (const response of results) {
				await upLoadFileRC(
					{
						token: dataUserRC.authToken,
						UserID: dataUserRC.userId,
						rid: room.rid,
						file: {
							uri: response.uri,
							type: response.type,
							name: encodeURI(response.name || '') || 'fileMessage',
						},
						description: '',
					},
					progress => {
						// console.log(progress);
					},
				);
			}
		} catch (err) {
			if (DocumentPicker.isCancel(err)) {
				// User cancelled the picker, exit any dialogs or menus and move on
			} else {
				throw err;
			}
		}
	};

	const _onFocusInputMessage = async () => {
		await RocketChat.readMessage({ rid: room.rid });
	};

	const _onPressVoiceCall = () => {
		navigation.navigate('ChatCallScreen', {
			isVideoCall: false,
			username: dataUserRC.me.username,
			roomID: room.rid,
		});
	};

	const _onPressVideoCall = () => {
		navigation.navigate('ChatCallScreen', {
			isVideoCall: true,
			username: dataUserRC.me.username,
			roomID: room.rid,
		});
	};

	const showListPeopleReaction = listData => {
		bottomSheetRef.current.showActionSheet({
			headerHeight: 36,
			customHeader: null,
			options: listData,
		});
	};

	// const _renderPeopleTyping = useMemo(() => {
	// 	if (listUserTyping.length === 0) {
	// 		return null;
	// 	}

	// 	const textTyping =
	// 		listUserTyping.length > 1
	// 			? listUserTyping.length === 2
	// 				? `${listUserTyping[0].username} and ${listUserTyping[1].username} is typing`
	// 				: `${listUserTyping.length + 1} people is typing`
	// 			: `${listUserTyping[0]?.username} is typing`;

	// 	return (
	// 		<View
	// 			style={{
	// 				flexDirection: 'row',
	// 				alignItems: 'center',
	// 				paddingHorizontal: 8,
	// 			}}
	// 		>
	// 			<Text style={{ color: '#555', fontSize: 12 }}>{textTyping}</Text>
	// 			<LottieView
	// 				source={IMG_TYPING}
	// 				autoPlay
	// 				loop
	// 				style={{ width: 35, height: 35 }}
	// 				resizeMode="contain"
	// 			/>
	// 		</View>
	// 	);
	// }, [listUserTyping]);

	const offset = useSharedValue(-330);

	const animatedStyles = useAnimatedStyle(() => {
		return {
			marginBottom: withTiming(offset.value, { duration: 50 }),
		};
	});

	const _renderImageView = useMemo(
		() => (
			<ImageViewerComponent
				ref={ref => {
					imageViewerRef.current = ref;
				}}
			/>
		),
		[],
	);

	// const _renderUserRequestView = useMemo(
	// 	() => (
	// 		<RequestListComponent
	// 			ref={ref => {
	// 				listUserRequestRef.current = ref;
	// 			}}
	// 		/>
	// 	),
	// 	[],
	// );

	return (
		<SafeAreaProvider>
			{/* Header */}
			<View
				style={{
					zIndex: 2,
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
				}}
			>
				<HeaderRoom
					title={room.fname || room.name}
					roomType={room.t}
					dataUser={dataUser}
					onPressTitle={() => {
						navigation.navigate('ChatRoomSettingScreen', {
							room,
						});
					}}
					rightComponent={() => (
						<View style={{ flexDirection: 'row' }}>
							{room.t === 'd' && (
								<TouchableOpacity
									onPress={_onPressVoiceCall}
									style={{ paddingRight: 12 }}
								>
									<Icon
										as={Ionicons}
										name={'call-outline'}
										size={7}
										color={'#fff'}
										// paddingRight={12}
									/>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								onPress={_onPressVideoCall}
								style={{ paddingRight: 12 }}
							>
								<Icon
									as={Ionicons}
									name={'videocam-outline'}
									size={7}
									color={'#fff'}
									// paddingRight={12}
								/>
							</TouchableOpacity>
							{/* && room?.roles[0] === 'owner' */}
							{room?.t !== 'd' && (
								<TouchableOpacity
									onPress={() =>
										EventEmitter.emit('showListUserRequest', { listRequest })
									}
								>
									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											justifyContent: 'center',
											flexWrap: 'wrap',
											paddingRight: 12,
										}}
									>
										{listRequest?.length > 0 ? (
											<View>
												<Image
													source={IC_NOTIFICATION}
													resizeMode="contain"
													style={[styles.imageItemMenuTopNoLib]}
												/>
												<View style={styles.containerNumberBadge}>
													<Text style={styles.textNumberBadge}>
														{/* {notificationUnreadP + notificationUnreadG} */}
														{listRequest?.length}
													</Text>
												</View>
											</View>
										) : (
											<View>
												<Image
													source={IC_NOTIFICATION}
													resizeMode="contain"
													style={[styles.imageItemMenuTopNoLib]}
												/>
											</View>
										)}
									</View>
								</TouchableOpacity>
							)}
							<TouchableOpacity
								onPress={() => {
									navigation.navigate('ChatRoomSettingScreen', {
										room,
									});
								}}
								style={{ paddingRight: 12 }}
							>
								<Icon
									as={Ionicons}
									name={'options-outline'}
									size={7}
									color={'#fff'}
									// paddingRight={8}
								/>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>
			{doneLoadAnimated ? (
				<Animated.View style={[{}, { height: tabHeight }]}>
					{/* <SafeAreaView /> */}
					<KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
						<View style={{ flex: 1, backgroundColor: '#fff' }}>
							<View style={{ flex: 1 }}>
								<View
									style={{
										position: 'absolute',
										zIndex: 2,
										flexDirection: 'row',
										top:
											Platform.OS === 'ios'
												? hasNotch()
													? 90
													: 70
												: 50 + (StatusBar.currentHeight || 0),
									}}
								>
									<PinMessageComponent room={room} />
								</View>

								<ListMessageComponent
									ref={ref => {
										listMessageRef.current = ref;
									}}
									room={room}
									setItemMessageSelected={setItemMessageSelected}
									setMessageValue={setMessageValue}
									setEditMessage={setEditMessage}
									setQuoteMessage={setQuoteMessage}
									showListPeopleReaction={showListPeopleReaction}
									imageViewerRef={imageViewerRef}
								/>
								{/* {_renderPeopleTyping} */}
								<View style={{ borderTopWidth: 1, borderTopColor: '#ddd' }}>
									{/* View mentions */}
									<MentionSelectComponent
										// listRoomMember={listRoomMemberFilter!}
										onPressItem={(member: IMemberRoom) =>
											_onPressMention(member)
										}
									/>

									{/* View Quote Message */}
									<QuoteComponent
										// listRoomMember={listRoomMemberRC}
										// itemMessageSelected={itemMessageSelected}
										onPressCancelQuote={() => {
											EventEmitter.emit('showQuote', { item: false });
											setQuoteMessage(false);
											setItemMessageSelected(undefined);
										}}
									/>
									{/* View Edit Message */}
									<EditMessageComponent
										// listRoomMember={listRoomMemberRC}
										// itemMessageSelected={itemMessageSelected}
										onPressCancelEdit={() => {
											EventEmitter.emit('showEdit', { value: false });
											setEditMessage(false);
											setItemMessageSelected(undefined);
										}}
									/>
									{/*
                                    {listAttachmentFile.length > 0 && (
                                    <View style={{ padding: 8, flexDirection: "row" }}>
                                        {listAttachmentFile.map((item, index) => (
                                        <Image
                                            key={index.toString()}
                                            source={{ uri: item }}
                                            resizeMode="cover"
                                            style={{
                                            width: 100,
                                            height: 100,
                                            marginRight: 8,
                                            borderRadius: 6,
                                            overflow: "hidden",
                                            }}
                                        />
                                        ))}
                                    </View>
                                    )} */}
									{/* {_renderInputView()} */}

									<ChatInputView
										onChangeTextMessage={_onChangeTextMessage}
										onPressSentMessage={_onPressSentMessage}
										onPressPickerImage={_onPressPickerImage}
										onPressPickerFile={_onPressPickerFile}
										onPressButtonEmoji={_onPressButtonEmoji}
									/>

									{/* <SafeAreaView /> */}
								</View>
							</View>
						</View>
					</KeyboardAvoidingView>
					<TabEmojiComponent
						listMessageRef={listMessageRef}
						room={room}
						tabHeight={tabEmojiHeight}
					/>
					<RequestListComponent
						roomId={room.rid || room._id}
						roomType={room.t}
						// ref={ref => {
						// 	listUserRequestRef.current = ref;
						// }}
					/>
				</Animated.View>
			) : (
				<LoadingFullScreen size={'large'} />
			)}
			{_renderImageView}
			<ActionSheet ref={bottomSheetRef} />
		</SafeAreaProvider>
	);
}
