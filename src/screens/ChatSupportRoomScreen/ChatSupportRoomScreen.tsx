import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';

import React, { useEffect, useRef, useState } from 'react';

import {
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	TouchableOpacity,
	View,
	Animated,
	Keyboard,
	Easing,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
// import * as ImagePicker from 'react-native-image-picker';

// import ImagePicker, {
// 	Image,
// 	ImageOrVideo,
// 	Options,
// } from 'react-native-image-crop-picker';
import { Card, Menu, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import HeaderRoom from '@components/HeaderRoom';

import { FontAwesome, Ionicons, SimpleLineIcons } from '@expo/vector-icons';

// import {
// 	NavigationState,
// 	SceneMap,
// 	SceneRendererProps,
// 	TabBar,
// 	TabView,
// } from 'react-native-tab-view';
import {
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from 'react-native-reanimated';
import LoadingFullScreen from '@components/LoadingFullScreen';
import ListMessageComponent from './ListMessageComponent/ListMessageComponent';
import ChatInputComponent from './ChatInputComponent/ChatInputComponent';
import firestore from '@react-native-firebase/firestore';
import { IContact } from '@models/types';
import TabEmojiComponent from './TabEmojiComponent/TabEmojiComponent';

const IMG_TYPING = require('@assets/typing_animation.json');
// interface IRouteParams {
// 	room: IRoom;
// }

let showTab = false;
type Route = {
	key: string;
	icon: string;
	isNormalEmoji?: boolean;
};
let roomID = '';

export function ChatSupportRoomScreen(props: any) {
	const navigation: any = useNavigation();
	// const dispatch = useDispatch();
	// const { width } = useDimensions().screen;
	// const keyboard = useKeyboard()
	const tabHeight = new Animated.Value(1260);

	const { colors } = useTheme();
	const inputMessageRef = useRef<any>();
	const buttonViewerRef = useRef<any>();
	const bottomSheetRef = useRef<any>();
	const imageViewerRef = useRef<any>();
	const listMessageRef = useRef<any>();

	const { room, titleName }: any = props.route.params;

	const [routes] = React.useState([
		{ key: 'emoji', icon: 'smile', isNormalEmoji: true },
		{ key: 'kawaii', icon: 'smile_kawaii_custom' },
		{ key: 'freemojis', icon: 'ok_hand_2_freemojis_custom' },
		{ key: 'team', icon: 'drink_beer_team_custom' },
		{ key: 'zoo', icon: 'yay_zoo_custom' },
	]);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	// const [listUserMention, setListUserMention] = useState<IMemberRoom[]>([]);
	// const [isShowViewMentions, setShowViewMentions] = useState<boolean>(false);
	// const [isQuoteMessage, setQuoteMessage] = useState<boolean>(false);
	const [listAttachmentFile, setListAttachmentFile] = useState<any[]>([]);
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const [images, setImages] = useState([]);
	const [listMessage, setListMessage] = useState<any>();
	const [listContactSelectedConvert, setListContactSelectedConvert] = useState<
		IContact[]
	>([]);
	const { listContactPersonSelected } = props.route.params;
	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			let dataQuestion = await firestore()
				.collection('Chat_Support')
				.doc(room)
				.onSnapshot(questSnapshot => {
					roomID = room;
					setListMessage(questSnapshot?.data());
				});
			setDoneLoadAnimated(true);
		});
	}, []);

	//Update have seen message async
	useEffect(() => {
		if (listMessage?.listMessage.length > 0) {
			const temp = [...listMessage?.listMessage];
			for (let i = 0; i < listMessage?.listMessage.length; i++) {
				if (
					listMessage?.listMessage[i]?.From === '1' &&
					!listMessage?.listMessage[i]?.seen
				) {
					temp[i] = { ...temp[i], seen: true };
				} else break;
			}
			// setSeenMessage(temp);
		}
	}, [listMessage?.listMessage.length > 0]);

	const setSendMessage = async () => {
		const temp = [...listMessage?.listMessage.reverse()];
		temp.push({
			From: '2',
			Text: `${listContactPersonSelected[0]}_cardID`,
			createAt: firestore.Timestamp.now(),
			seen: false,
		});
		try {
			// await firestore().collection('Chat_Support').doc(roomID).set({
			// 	ID: listMessage?.ID,
			// 	User_Name: listMessage?.User_Name,
			// 	Support_Name : listMessage?.Support_Name,
			// 	Link_Image: listMessage?.Link_Image,
			// 	createAt: listMessage?.createAt,
			// 	listMessage: temp,
			// });
			await firestore().collection('Chat_Support').doc(roomID).update({
				listMessage: temp,
			});
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	// const useKeyboard = () => {
	// 	let isKeyboardVisible: boolean = false;

	// 	(() => {
	// 		const keyboardDidShowListener = Keyboard.addListener(
	// 			'keyboardDidShow',
	// 			() => {
	// 				isKeyboardVisible = true; // or some other action
	// 			},
	// 		);

	// 		return () => {
	// 			//   keyboardDidHideListener.remove();
	// 			keyboardDidShowListener.remove();
	// 		};
	// 	})();
	// 	return isKeyboardVisible;
	// };

	const _onPressOpenContactPersonModal = () => {
		const convertListContactSelected = listContactSelectedConvert?.map(
			item => item?.emp_no,
		);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			deptCode: '0',
			screenBack: 'ChatSupportRoomScreen',
		});
	};

	const _onPressButtonEmoji = () => {
		Keyboard.dismiss();
		Animated.timing(tabHeight, {
			toValue: !showTab ? 900 : 1260,
			duration: 200,
			useNativeDriver: false,
			// easing: Easing.linear,
		}).start(() => {
			showTab = !showTab;
		});
	};

	useEffect(() => {
		if (listContactPersonSelected) {
			const listConvert: IContact[] = listContactPersonSelected?.map(
				contactPersonID => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === contactPersonID,
					);
				},
			) as IContact[];
			setListContactSelectedConvert(listConvert.filter(item => item));
		}
		if (listContactPersonSelected) {
			Alert.alert('Alert', 'Are you sure you want to forward this message?', [
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: () => {
						setSendMessage();
					},
					style: 'destructive',
				},
			]);
		}
	}, [listContactPersonSelected]);

	return (
		<View style={{ flex: 1 }}>
			{/* Header */}
			<View
				style={{ zIndex: 2, position: 'absolute', top: 0, left: 0, right: 0 }}
			>
				<HeaderRoom
					title={'Chailease Support'}
					// roomType={room.t}
					// dataUser={dataUser}
					onPressTitle={() => {}}
					rightComponent={() => (
						<View style={{ flexDirection: 'row' }}>
							<TouchableOpacity onPress={() => {}}>
								<Icon
									as={Ionicons}
									name={'call-outline'}
									size={7}
									color={'#fff'}
									paddingRight={12}
								/>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => _onPressOpenContactPersonModal()}
							>
								<Icon
									as={Ionicons}
									name={'arrow-redo-outline'}
									size={7}
									color={'#fff'}
									paddingRight={12}
								/>
							</TouchableOpacity>
						</View>
					)}
				/>
			</View>

			{doneLoadAnimated ? (
				<Animated.View style={[{height : tabHeight }]}>
					<SafeAreaView />
					<KeyboardAvoidingView
						behavior={Platform.OS === 'ios' ? 'padding' : undefined}
						style={{ flex: 1 }}
					>
						<View style={{ flex: 1, backgroundColor: '#fff' }}>
							<View style={{ flex: 1 }}>
								<ListMessageComponent
									listMessage={listMessage?.listMessage}
									userName={listMessage?.User_Name}
								/>
								{/* {_renderPeopleTyping} */}
								<View style={{ borderTopWidth: 1, borderTopColor: '#ddd' }}>
									<ChatInputComponent
										inputMessageRef={inputMessageRef}
										listMessage={listMessage}
										key_id={roomID}
										onPressButtonEmoji={_onPressButtonEmoji}
									/>

									{/* <SafeAreaView /> */}
								</View>
							</View>
						</View>
					</KeyboardAvoidingView>
					<TabEmojiComponent
						listMessageRef={listMessageRef}
						// room={room}
						tabHeight={tabHeight}
					/>
				</Animated.View>
			) : (
				<LoadingFullScreen />
			)}

			{/* {_renderImageView}
			<ActionSheet ref={bottomSheetRef} /> */}
		</View>
	);
}
