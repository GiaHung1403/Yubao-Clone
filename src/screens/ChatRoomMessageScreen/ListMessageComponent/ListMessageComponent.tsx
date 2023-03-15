import Clipboard from '@react-native-community/clipboard';
import { getListRoomMessageRC } from '@data/api';
import { RocketChat } from '@data/rocketchat';
import { IMemberRoom, IMessage, IUserLoginRC } from '@models/types';
import React, {
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Alert, FlatList, Platform, View, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import WrapMessageItemComponent from '../WrapMessageItemComponent';
import Example from '../WrapMessageItemComponent/Swipe';
import { setUserTyping } from '@actions/message_action';
import EventEmitter from '@utils/events';
import { hasNotch } from 'react-native-device-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { getListRoomMemberRC } from '@actions/room_rc_action';

import { insertRequests } from '@data/api/api_room_chat_request';

const convertUsername = (username: string) => {
	const indexDot = username.indexOf('.');
	if (indexDot === -1) {
		return username;
	}
	return username.slice(0, indexDot);
};

const HEADER_HEIGHT = 200;

function ListMessageComponent(props: any, ref: any) {
	const {
		room,
		setItemMessageSelected,
		setMessageValue,
		setEditMessage,
		setQuoteMessage,
		showListPeopleReaction,
		imageViewerRef,
	} = props;
	const dispatch = useDispatch();
	const navigation: any = useNavigation();

	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const listRoomMemberRC: IMemberRoom[] = useSelector(
		(state: any) => state.room_rc_reducer.listRoomMemberRC,
	);

	const [listMessage, setListMessage] = useState<IMessage[]>([]);

	useImperativeHandle(ref, () => ({
		updateListMessage: messageItem => {
			setListMessage(updateListMessage(messageItem, listMessage));
		},
	}));

	// const sendRequest = async () => {
	// 	try {
	// 		const data = await insertRequests({
	// 			roomID: room._id,
	// 			token: dataUserRC.authToken,
	// 			UserID: dataUserRC.userId,
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// };

	useEffect(() => {
		(async function getListMessage() {
			try {
				const listMessageData: any = await getListRoomMessageRC({
					roomID: room.rid || room?._id,
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					type: room.t,
					// count: 5,
				});
				dispatch(
					getListRoomMemberRC({
						roomID: room.rid || room?._id,
						token: dataUserRC.authToken,
						UserID: dataUserRC.userId,
						type: room.t,
					}),
				);
				setListMessage(listMessageData);
			} catch (error: any) {
				// Alert.alert('Alert', error.message);
			}
		})();
	}, []);

	useEffect(() => {
		/* Check listMessage có tồn tại chưa, chưa thì không chạy listener vì lý do bất đồng bộ */
		if (listMessage?.length === 0) return;
		const promises = RocketChat.subscribeRoom({ roomID: room.rid || room._id });

		const notifyRoomListener = RocketChat.onStreamData({
			event: 'stream-notify-room',
			callback: handleNotifyRoomReceived,
		});

		const messageReceivedListener = RocketChat.onStreamData({
			event: 'stream-room-messages',
			callback: handleMessageReceived,
		});

		return () => {
			if (promises) {
				try {
					promises.then(subscriptions => {
						subscriptions.forEach(sub => sub?.unsubscribe());
					});
				} catch (e: any) {
					// do nothing
				}
			}
			removeListener(notifyRoomListener).then();
			removeListener(messageReceivedListener).then();
		};
	}, [listMessage]);

	const handleNotifyRoomReceived = response => {
		if (response.msg === 'changed') {
			const objectData = {
				username: response?.fields?.args[0],
				isTyping: response?.fields?.args[1],
			};

			dispatch(setUserTyping({ user: objectData }));
			return;
		}
	};

	const handleMessageReceived = response => {
		if (response.msg === 'changed') {
			const messageChanged: any = response.fields.args[0];
			messageChanged.ts = response.fields.args[0].ts;
			setListMessage(updateListMessage(messageChanged, listMessage));
			return;
		}
	};

	const updateListMessage = (messageResponse, messages) => {
		const listMessageData: any[] = [].concat(messages);
		const messNew = Object.assign(messageResponse, {
			ts: messageResponse.ts.$date || messageResponse.ts,
		});
		// const indexMessageExisted = listMessageData.findIndex(
		// 	mess =>
		// 		mess._id === messageResponse._id ||
		// 		mess._id?.split('local')[1] === messageResponse.attachments[0].title,
		// );

		const indexMessageExisted = listMessageData.findIndex(mess => {
			if (mess._id === messageResponse._id) {
				return true;
			} else if (mess._id === '') return true;
			else if (mess._id.includes('local')) {
				if (
					mess._id.split('local/')[1] === messageResponse.attachments[0].title
				)
					return true;
			}
			return false;
		});

		if (indexMessageExisted > -1) {
			if (messageResponse.t === 'rm') {
				listMessageData.splice(indexMessageExisted, 1);
				return [...listMessageData];
			}
			listMessageData[indexMessageExisted] = messNew;
			return [...listMessageData];
		}
		return [messNew, ...listMessageData];
	};

	const removeListener = async promise => {
		if (promise) {
			try {
				const listener = await promise;
				listener.stop();
			} catch (e: any) {
				// do nothing
			}
		}
	};

	const _onPressDeleteMessage = item => {
		try {
			Alert.alert('Alert', 'Are you sure delete this message?', [
				{ text: 'No' },
				{
					text: 'Delete',
					onPress: async () => {
						await RocketChat.deleteMessage({
							messageId: item?._id,
							rid: room.rid,
						});
					},
					style: 'destructive',
				},
			]);
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	const _onSwipeLeft = item => {
		//setItemMessageSelected(item);
		_onPressQuoteMessage(item);
		console.log('====================================');
		console.log(item);
		console.log('====================================');
	};

	const _onPressQuoteMessage = item => {
		console.log(item);

		setItemMessageSelected(item);
		setQuoteMessage(true);
		EventEmitter.emit('showQuote', {
			value: true,
			itemMessageSelected: item,
		});
	};

	const _onPressCopy = async item => {
		await Clipboard.setString(item!.msg);
	};

	// const _onPressUpdateMessage = item => {
	// 	setItemMessageSelected(item);
	// 	setMessageValue(item!.msg);
	// 	EventEmitter.emit('setMention', { item: item!.msg });
	// 	setEditMessage(true);
	// };

	const _onPressUpdateMessage = item => {
		setItemMessageSelected(item);
		EventEmitter.emit('showEdit', {
			value: true,
			itemMessageSelected: item,
		});
		setEditMessage(true);
	};

	const _onPressReactionList = ({ reactions }) => {
		const convertReactions = Object.keys(reactions).map(reaction => ({
			reaction,
			usernames: reactions[reaction].usernames.map((username: string) =>
				convertUsername(username),
			),
			name: reactions[reaction].usernames.map(
				item => listRoomMemberRC.find(member => member.username === item)?.name,
			),
		}));

		const listConvertReactions: any = Object.entries(
			convertReactions.reduce((r, a) => {
				if (a.usernames.length > 1) {
					a.usernames.forEach((item, index) => {
						const newObject = { ...a };

						r[item] = [
							...(r[item] || []),
							Object.assign(newObject, {
								usernames: [newObject.usernames],
								name: newObject.name[index],
							}),
						];
					});
				} else {
					r[a.usernames] = [...(r[a.usernames] || []), a];
				}
				return r;
			}, {}),
		).map((item: any, index: number) => {
			return {
				username: item[0],
				name: item[1][0].name,
				reactions: item[1].reduce((a, b) => a + b.reaction + ' ', ''),
			};
		});
		showListPeopleReaction(listConvertReactions);
	};

	const _onPressReaction = ({ emoji, itemMessageSelected }) => {
		setTimeout(() => {
			RocketChat.setReaction({
				emoji,
				messageId: itemMessageSelected?._id,
			}).then();
		}, 200);
	};

	const _onPressPin = ({ itemMessageSelected }) => {
		setTimeout(() => {
			RocketChat.pinMessage({
				messageId: itemMessageSelected?._id,
				pinned: false,
			}).then();
		}, 200);
	};

	const renderItem = ({ item, index }) => {
		return (
			<WrapMessageItemComponent
				item={item}
				index={index}
				room={room}
				prevItem={listMessage[index - 1]}
				nextItem={listMessage[index + 1]}
				onSwipeLeft={_onSwipeLeft}
				setItemMessageSelected={setItemMessageSelected}
				onPressReactionList={_onPressReactionList}
				onPressReaction={_onPressReaction}
				onPressQuoteMessage={_onPressQuoteMessage}
				onPressDeleteMessage={_onPressDeleteMessage}
				onPressUpdateMessage={_onPressUpdateMessage}
				onPressCopy={_onPressCopy}
				onPressPin={_onPressPin}
				imageViewerRef={imageViewerRef}
			/>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<FlatList
				style={{ flex: 1, marginTop: hasNotch() ? 100 : 75 }}
				data={listMessage}
				extraData={listMessage}
				inverted
				showsVerticalScrollIndicator={false}
				keyExtractor={(item, index) => item._id}
				removeClippedSubviews={Platform.OS === 'ios'}
				initialNumToRender={5}
				onEndReachedThreshold={0.5}
				maxToRenderPerBatch={5}
				windowSize={11}
				// keyboardShouldPersistTaps={'handled'}
				ListHeaderComponent={() => <View style={{ height: 4 }} />}
				renderItem={renderItem}
				// keyboardShouldPersistTaps="handled"
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="none"
			/>
		</View>
	);
}

export default React.forwardRef(ListMessageComponent);
