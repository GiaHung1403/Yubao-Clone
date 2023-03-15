import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Animated,
	Image,
	Text,
	TouchableOpacity,
	View,
	LayoutAnimation,
	Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Avatar, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import ImageAutoSize from '@components/ImageAutoSize';
import Markdown from '@components/Markdown';
import Color from '@config/Color';
import { getListReadMessageRC } from '@data/api';
import { DOMAIN_SERVER_CHAT, getDomainAPIChat } from '@data/Constants';
import { IMessage, IMemberRoom, IUserRC, IUserLoginRC } from '@models/types';
import { convertUnixTimeNotification, convertUnixTimeWithHours } from '@utils';
import styles from './styles';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import EventEmitter from '@utils/events';

import PopoverTooltip, { getOut } from '../PopoverItemComponent';
import { useNavigation } from '@react-navigation/native';
import shortnameToUnicode from '@utils/shortnameToUnicode';
import VideoPlayer from 'react-native-video-player';
import TextNoticeEvent from './TextNoticeEvent';
import RNUrlPreview from 'react-native-url-preview';
import { LinkPreview } from '@flyerhq/react-native-link-preview';
import ImageViewTransition from './ImageViewTransition';
interface IProps {
	item: IMessage;
	nextItem: IMessage;
	prevItem: IMessage;
	index: number;
	typeRoom: string;
	onLongPressMessageContent: () => void;
	onPressAvatar: () => void;
	onPressMessageContent: () => void;
	onPressReactionList: ({ reactions }) => void;
	onPressReaction: () => void;
	onPressQuoteMessage: () => void;
	onPressDeleteMessage: () => void;
	onPressUpdateMessage: () => void;
	onPressCopy: () => void;
	onPressPin: () => void;
}

/* Format tin nhắn có tag ai đó */
const formatLabel = (label, value: string, valueReplace?: string) => {
	if (!value) {
		return label;
	}
	return (
		<Text>
			{label.split(value).reduce((prev, current, i) => {
				if (!i) {
					return [current];
				}
				return prev.concat(
					<Text
						style={{ color: '#e67e22', fontWeight: '500' }}
						key={value + current}
					>
						{valueReplace || value}
					</Text>,
					current,
				);
			}, [])}
		</Text>
	);
};

function MessageItemComponent(props: IProps) {
	const { colors } = useTheme();
	const listRoomMemberRC: IMemberRoom[] = useSelector(
		(state: any) => state.room_rc_reducer.listRoomMemberRC,
	);
	const {
		item,
		nextItem,
		prevItem,
		index,
		typeRoom,
		onLongPressMessageContent,
		onPressAvatar,
		onPressMessageContent,
		onPressReactionList,
		onPressReaction,
		onPressQuoteMessage,
		onPressDeleteMessage,
		onPressUpdateMessage,
		onPressCopy,
		onPressPin,
	} = props;
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const [listUserReadMessage, setListUserReadMessage] = useState<any>([]);


	const scaleMessageContent = new Animated.Value(1);

	/* Tin nhắn này đã bị xoá */
	const isRemoved = item?.t === 'rm';
	if (isRemoved) return null;

	/* Tin nhắn này có phải do mình gửi không? */
	const isMe = item.u._id === dataUserRC.userId;

	/* Tính thời gian của tin nhắn trước tin nhắn này */
	const timeSentItem = new Date(item?.ts).getTime() / 1000;
	const timeSentNextItem = nextItem
		? new Date(nextItem?.ts).getTime() / 1000
		: new Date().getTime() / 1000;
	const rangeTimeSent = timeSentItem - timeSentNextItem;
	const isNewDay =
		new Date(item.ts).getDate() !== new Date(nextItem?.ts).getDate();

	/* Có phải tin nhắn đầu tiên của user không? Tin nhắn trước là của user khác */
	const isFirst = item.u._id !== nextItem?.u._id;
	/* Có phải tin nhắn cuối của user không? Tin nhắn sau là của user khác */
	const isLast = item.u._id !== prevItem?.u._id;
	/* Tin nhắn thông báo user tham gia */
	const isJoined = item?.t === 'uj';
	/* Tin nhắn thông báo user tham gia team */
	const isJoinedTeam = item?.t === 'ujt';
	/* Tin nhắn thông báo user thoát khỏi phòng */
	const isLeft = item?.t === 'ul';
	/* Tin nhắn thông báo thay đổi role của phòng */
	const isChangePrivacy = item?.t === 'room_changed_privacy';
	/* Tin nhắn thông báo thay đổi topic của phòng */
	const isChangeTopic = item?.t === 'room_changed_topic';
	/* Tin nhắn thông báo add user vào phòng */
	const isUserAdd = item?.t === 'au';
	/* Tin nhắn thông báo remove user khỏi phòng */
	const isUserRemove = item?.t === 'ru';

	/* Tin nhắn thông báo user đã pin tin nhắn */
	const isUserPin = item?.t === 'message_pinned';

	/* Tin nhắn thông change role user */
	const isChangeUserRole = item?.t === 'subscription-role-added';
	/* Tin nhắn thông báo đổi tên phòng */
	const isChangeRoomName = item?.t === 'r';
	/* Tin nhắn thông báo bắt đầu 1 cuộc trò chuyện */
	const isCallStart = item?.t === 'jitsi_call_started';
	/* Tin nhắn có phải là hình ảnh không? */
	const isImage =
		item.attachments && item.attachments[0]?.image_type?.includes('image');

	/* Tin nhắn có phải là hình ảnh đi cùng với description không? */
	const isImageWithDes = item.attachments && item.attachments[0]?.description;

	/* Tin nhắn có đính kèm hay không? */
	const isAttachment = item.attachments?.length > 0;

	/* Add user vào team  */
	const isAddTeam = item?.t === 'added-user-to-team';

	const options = {
		enableVibrateFallback: true,
		ignoreAndroidSystemSettings: false,
	};

	const navigation: any = useNavigation();
	/* Get list những ai đã đọc tin nhắn này */
	useEffect(() => {
		(async function getListReadMess() {
			if (index === 0 && item._id) {
				const data: any = await getListReadMessageRC({
					messageId: item._id,
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
				});

				const indexSelf = data.findIndex(
					itemUser => itemUser._id === dataUserRC.userId,
				);
				const indexUserOwner = data.findIndex(
					itemUser => itemUser._id === item.u._id,
				);

				if (indexSelf !== indexUserOwner) {
					data.splice(indexSelf, 1);
				}
				data.splice(indexUserOwner, 1);
				setListUserReadMessage(data);
			}
		})();
	}, []);

	/* Tin nhắn này của user nào gửi */
	const nameUser = item?.u?.name;

	/* View hiển thị cho tin nhắn thông báo người thăm gia/thoát phòng */
	if (
		isLeft ||
		isJoined ||
		isJoinedTeam ||
		isChangePrivacy ||
		isChangeTopic ||
		isUserAdd ||
		isUserRemove ||
		isUserPin ||
		isChangeRoomName ||
		isCallStart ||
		isChangeUserRole ||
		isAddTeam
	) {
		return (
			<TextNoticeEvent
				item={item}
				nameUser={nameUser}
				isJoined={isJoined}
				isJoinedTeam={isJoinedTeam}
				isLeft={isLeft}
				isChangePrivacy={isChangePrivacy}
				isChangeTopic={isChangeTopic}
				isUserAdd={isUserAdd}
				listRoomMemberRC={listRoomMemberRC}
				isUserRemove={isUserRemove}
				isUserPin={isUserPin}
				isChangeUserRole={isChangeUserRole}
				isChangeRoomName={isChangeRoomName}
				isCallStart={isCallStart}
				isNewDay={isNewDay}
				isAddTeam={isAddTeam}
			/>
		);
	}

	const renderTypeContentMessage = () => {
		if (isAttachment && item.attachments[0]?.title?.includes('pdf')) {
			return (
				<View>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Image
							source={{
								uri: 'https://img.icons8.com/bubbles/344/adobe-acrobat.png',
							}}
							resizeMode="contain"
							style={{ width: 50, height: 50 }}
						/>
						<View style={{ maxWidth: '70%', marginLeft: 8 }}>
							<Text
								style={{
									color: isMe ? '#fff' : colors.primary,
								}}
							>
								{item.attachments[0]?.title?.replace(/%20/g, ' ')}
							</Text>
						</View>
					</View>
					<Text style={{ color: isMe ? 'white' : 'black' }}>
						{item.attachments[0]?.description}
					</Text>
				</View>
			);
		}

		if (isAttachment && item.attachments[0]?.video_type === 'video/mp4') {
			return (
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<VideoPlayer
						video={{
							uri: `${DOMAIN_SERVER_CHAT}${item.attachments[0]?.title_link}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
						}}
						videoWidth={1600}
						videoHeight={1200}
						thumbnail={{ uri: 'https://i.picsum.photos/id/866/1600/900.jpg' }}
					/>
				</View>
			);
		}

		if (
			isAttachment &&
			item.attachments[0]?.type === 'file' &&
			!item.attachments[0].image_type
		) {
			return (
				<View style={{}}>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Image
							source={{
								uri: item.attachments[0]?.title.includes('docx')
									? 'https://img.icons8.com/bubbles/344/microsoft-word-2019.png'
									: 'https://img.icons8.com/bubbles/2x/microsoft-excel-2019.png',
							}}
							resizeMode="contain"
							style={{ width: 50, height: 50 }}
						/>
						<View style={{ maxWidth: '70%', marginLeft: 8 }}>
							<Text
								style={{
									color: isMe ? '#fff' : colors.primary,
								}}
							>
								{item.attachments[0]?.title?.replace(/%20/g, ' ')}
							</Text>
						</View>
					</View>
					<Text style={{ color: isMe ? 'white' : 'black' }}>
						{item.attachments[0]?.description}
					</Text>
				</View>
			);
		}

		if (
			isAttachment &&
			!item.attachments[0].title &&
			item.attachments[0].image_url
		) {
			return <ImageAutoSize uri={item.attachments[0].image_url} isMe={isMe} />;
		}

		switch (isAttachment && item.attachments[0]?.image_type) {
			case 'image/jpeg':
				return (
					<ImageAutoSize
						uri={
							item._id.includes('local')
								? item.attachments[0]?.image_url
								: `${DOMAIN_SERVER_CHAT}${item.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`
						}
						isMe={isMe}
					/>
				);
			case 'image/jpg':
				return (
					<ImageAutoSize
						uri={
							item._id.includes('local')
								? item.attachments[0]?.image_url
								: `${DOMAIN_SERVER_CHAT}${item.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`
						}
						isMe={isMe}
					/>
				);
			case 'image/png':
				return (
					<View>
						<ImageAutoSize
							uri={
								!item._id
									? item.attachments[0]?.image_url
									: `${DOMAIN_SERVER_CHAT}${item.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`
							}
							isMe={isMe}
						/>
						<Text style={{ color: isMe ? 'white' : 'black' }}>
							{item.attachments[0]?.description}
						</Text>
						{/* <ImageViewTransition/> */}
					</View>
				);
			case 'application/pdf':
				return (
					<View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={{ uri: 'https://img.icons8.com/bubbles/344/pdf-2.png' }}
								resizeMode="contain"
								style={{ width: 50, height: 50 }}
							/>
							<View style={{ maxWidth: '70%', marginLeft: 8 }}>
								<Text
									style={{
										color: isMe ? '#fff' : colors.primary,
									}}
								>
									{item.attachments[0]?.title?.replace(/%20/g, ' ')}
								</Text>
							</View>
						</View>
						<Text style={{ color: isMe ? 'white' : 'black' }}>
							{item.attachments[0]?.description}
						</Text>
					</View>
				);
			case 'text/plain':
				return (
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
						<Image
							source={{
								uri: 'https://img.icons8.com/bubbles/344/documents.png',
							}}
							resizeMode="contain"
							style={{ width: 50, height: 50 }}
						/>
						<View style={{ maxWidth: '70%', marginLeft: 8 }}>
							<Text
								style={{
									color: isMe ? '#fff' : colors.primary,
								}}
							>
								{item.attachments[0]?.title?.replace(/%20/g, ' ')}
							</Text>
						</View>
					</View>
				);

			default: {
				if (item.msg.includes('http') && !item.msg.includes('[ ]')) {
					return (
						<View style={{}}>
							<LinkPreview
								text={`${item.msg}`}
								renderText={() => {
									let temp;
									let join;
									if (item.msg.includes(' ')) {
										temp = item.msg.split(' ');
										const newTemp = temp.map(value => {
											if (value.includes('http'))
												return (
													<Text style={{ color: 'orange' }}>
														{(value + ' ').toString()}
													</Text>
												);
											else return (value + ' ').toString();
										});
										join = newTemp;
									} else {
										join = <Text style={{ color: 'orange' }}>{item.msg}</Text>;
									}
									return (
										<Text
											style={{
												...Platform.select({
													ios: {
														fontFamily: 'System',
														fontWeight: '400',
													},
													android: {
														includeFontPadding: false,
														fontFamily: 'sans-serif',
														fontWeight: 'normal',
													},
												}),
												color: 'white',
												fontSize: 14,
											}}
										>
											{join}
										</Text>
									);
								}}
							/>
						</View>
					);
				} else
					return (
						<Markdown
							msg={item.msg}
							md={item.md}
							// baseUrl={baseUrl}
							// getCustomEmoji={props.getCustomEmoji}
							enableMessageParser={true}
							username={item.u.username}
							isEdited={false}
							channels={item.channels}
							mentions={item.mentions}
							navToRoomInfo={id => {
								// navigation.navigate('UserInfoScreen', { userID: id });
								null;
							}}
							tmid={item.tmid}
							useRealName={true}
							theme={''}
							styles={{ color: isMe ? '#fff' : undefined }}
							// onLinkPress={onLinkPress}
						/>
					);
			}
		}
	};

	const chatBoxMessage = () => {
		return (
			<View>
				<Animated.View
					style={[
						{
							marginHorizontal: !isImageWithDes
								? isImage || (index === 0 && typeRoom === 'd' && isMe)
									? 0
									: 0
								: index === 0 && typeRoom === 'd' && isMe
								? 0
								: 8,

							minWidth: item.msg.includes('.') ? 250 : 60,
							backgroundColor: !isImageWithDes
								? isImage ||
								  (isAttachment &&
										item.attachments[0].image_url?.includes('tenor')) ||
								  (item.md &&
										item.md[0].type === 'BIG_EMOJI' &&
										item.msg.includes('_custom'))
									? '#fff'
									: isMe
									? colors.primary
									: '#ddd'
								: item.md &&
								  item.md[0].type === 'BIG_EMOJI' &&
								  item.msg.includes('_custom')
								? '#fff'
								: isMe
								? colors.primary
								: '#ddd',

							borderRadius: 8,
							transform: [
								{
									scale: scaleMessageContent,
								},
							],
						},
					]}
				>
					<View
						style={{
							padding: isImage
								? 0
								: isAttachment &&
								  item.attachments[0].image_url?.includes('tenor')
								? 0
								: 8,
						}}
					>
						{/* Hiển thị tên user gửi */}
						{!isMe && (isFirst || rangeTimeSent >= 3600 || rangeTimeSent < 0) && (
							<Text
								style={{
									marginBottom: 8,
									color: colors.primary,
									fontWeight: '600',
								}}
							>
								{nameUser}
							</Text>
						)}

						{isAttachment && item.attachments[0]?.text ? (
							<View
								style={{
									paddingVertical: 2,
									paddingHorizontal: 8,
									borderLeftColor: '#2c82c9',
									borderLeftWidth: 2,
									marginBottom: 8,
								}}
							>
								<Text
									style={{
										fontWeight: '500',
										color: isMe ? '#fff' : '#000',
										zIndex: 1,
									}}
								>
									{
										listRoomMemberRC.filter(value => {
											return (
												value.username === item.attachments[0]?.author_name
											);
										})[0]?.name
									}
								</Text>
								<Text style={{ color: isMe ? '#ddd' : '#555' }}>
									{formatLabel(
										item.attachments[0].text.replace('@', ''),
										item.attachments[0].text.replace('@', ''),
									)}
								</Text>
							</View>
						) : isAttachment && item.attachments[0]?.text === '' ? (
							<View
								style={{
									paddingVertical: 2,
									paddingHorizontal: 8,
									borderLeftColor: '#2c82c9',
									borderLeftWidth: 2,
									marginBottom: 8,
								}}
							>
								<Text
									style={{
										fontWeight: '500',
										color: isMe ? '#fff' : '#000',
										zIndex: 1,
									}}
								>
									{
										listRoomMemberRC.filter(value => {
											return (
												value.username === item.attachments[0]?.author_name
											);
										})[0]?.name
									}
								</Text>
								<View>
									<Image
										source={{
											uri: `${DOMAIN_SERVER_CHAT}${item?.attachments[0]?.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
										}}
										style={{ height: 150 }}
									/>
								</View>
							</View>
						) : null}
						{/* TODO: gom chung image vào attachments, show theo list 2 hình 1 hàng */}
						{renderTypeContentMessage()}
						{isLast && (
							<View
								style={{
									flexWrap: 'wrap',
								}}
							>
								<View
									style={{
										position:
											isImage ||
											(item.md &&
												item.md[0].type === 'BIG_EMOJI' &&
												item.msg.includes('_custom'))
												? 'absolute'
												: 'relative',
										top: 0,
										left: 0,
										backgroundColor:
											isImage ||
											(item.md &&
												item.md[0].type === 'BIG_EMOJI' &&
												item.msg.includes('_custom'))
												? '#ddd'
												: isMe
												? colors.primary
												: '#ddd',
										borderRadius: 20,
										paddingVertical: 4,
										paddingHorizontal:
											isImage ||
											(item.md &&
												item.md[0].type === 'BIG_EMOJI' &&
												item.msg.includes('_custom'))
												? 4
												: 0,
									}}
								>
									<Text
										style={{
											fontSize: 12,
											color: '#666',
										}}
									>
										{convertUnixTimeWithHours(
											new Date(item.ts).getTime() / 1000,
										)}
									</Text>
								</View>
							</View>
						)}
					</View>
				</Animated.View>
				{item.reactions && item.reactions.length !== 0 && (
					<TouchableOpacity
						style={{
							position: 'absolute',
							bottom: isImage ? -12 : -20,
							right: 16,
							backgroundColor: Color.background,
							borderRadius: 12,
						}}
						onPress={() => onPressReactionList({ reactions: item.reactions })}
					>
						<View
							style={{ flexDirection: 'row', padding: 4, alignItems: 'center' }}
						>
							{Object.keys(item.reactions)
								.slice(0, 3)
								.map((reaction, indexReaction) => {
									if (reaction.includes('custom')) {
										const temp = reaction.split(':');
										const newEmoji = temp[1] + '.png';
										return (
											<View key={indexReaction.toString()}>
												<Image
													source={{
														uri: `${DOMAIN_SERVER_CHAT}/emoji-custom/${newEmoji}`,
													}}
													style={{ width: 24, height: 24 }}
												/>
											</View>
										);
									} else {
										return (
											<View key={indexReaction.toString()}>
												<Text style={{}}>{shortnameToUnicode(reaction)}</Text>
											</View>
										);
									}
								})}
							{Object.keys(item.reactions).length > 3 && (
								<Text
									style={{
										color: '#fff',
										fontSize: 12,
										marginLeft: 2,
										fontWeight: '500',
									}}
								>
									{Object.keys(item.reactions).length}
								</Text>
							)}
						</View>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const showMessage = () => {
		return (
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 8,
					marginBottom: item.reactions
						? isImage
							? 16
							: 24
						: isLast
						? isImage
							? 28
							: 8
						: 2,
					flex: 1,
					alignSelf: isMe ? 'flex-end' : 'flex-start',
					alignItems: isMe ? 'flex-end' : 'flex-start',
					maxWidth: '80%',
					marginRight: index !== 0 && typeRoom === 'd' ? 22 : 4,
				}}
			>
				{/* Hiển thị avatar */}
				{!isMe && (isFirst || rangeTimeSent >= 3600 || rangeTimeSent < 0) ? (
					<TouchableOpacity onPress={onPressAvatar}>
						<Avatar.Image
							source={{
								uri: `${getDomainAPIChat()}/avatar/${
									item.u.username
								}?size=60&format=png`,
							}}
							size={32}
							style={{ backgroundColor: '#fff', marginRight: 4 }}
						/>
					</TouchableOpacity>
				) : (
					!isMe && <View style={{ width: 32, marginRight: 4 }} />
				)}
				<PopoverTooltip
					onPress={() => {
						onPressMessageContent();
					}}
					onPressPin={onPressPin}
					onPressCopy={onPressCopy}
					onPressDeleteMessage={onPressDeleteMessage}
					onPressQuoteMessage={onPressQuoteMessage}
					onPressUpdateMessage={onPressUpdateMessage}
					messageGetEmoji={item}
					buttonComponent={chatBoxMessage()}
					items={onPressReaction}
					animationType="spring"
					labelContainerStyle={{
						backgroundColor: 'transparent',
						width: 120,
						alignItems: 'center',
					}}
					buttonComponentExpandRatio={1.1} // ratio of button component expansion after tooltip poped up
					timingConfig={{ duration: 250 }}
					opacityChangeDuration={250}
				/>
				{/* Hiển thị user đã xem tin nhắn chưa (chat 2 người) */}
				{index === 0 && typeRoom === 'd' && isMe && (
					<>
						{listUserReadMessage.length > 0 ? (
							<FastImage
								source={{
									uri: `${DOMAIN_SERVER_CHAT}/avatar/${listUserReadMessage[0]?.username}?size=60&format=png`,
								}}
								style={{
									backgroundColor: '#fff',
									width: 16,
									height: 16,
									marginLeft: 4,
									borderRadius: 8,
								}}
								resizeMode="contain"
							/>
						) : (
							<Icon
								as={Ionicons}
								name="checkmark-circle"
								size={4}
								color={colors.primary}
							/>
							// <View
							//   style={{
							//     width: 16,
							//     height: 16,
							//     borderRadius: 8,
							//     borderWidth: 2,
							//     marginLeft: 4,
							//     borderColor: colors.primary,
							//   }}
							// />
						)}
					</>
				)}
			</View>
		);
	};

	return (
		<View style={{ zIndex: 1, marginBottom: index === 0 ? 8 : 0 }}>
			{/* Thời gian so với tin nhắn trước lâu hơn 1 tiếng thì hiển thị session phân biệt */}
			{(rangeTimeSent >= 3600 || rangeTimeSent < 0) && (
				<View style={{ alignItems: 'center', marginVertical: 8 }}>
					<Text style={{ fontSize: 12, color: '#555' }}>
						{
							convertUnixTimeNotification(new Date(item.ts).getTime() / 1000)
								.time
						}
					</Text>
				</View>
			)}
			{showMessage()}
			{/* Hiển thị list user đã xem tin nhắn (Room nhiều người) */}
			{index === 0 && typeRoom !== 'd' && (
				<View
					style={{
						flexDirection: 'row',
						alignSelf: 'flex-end',
						paddingBottom: 16,
						paddingHorizontal: 8,
					}}
				>
					{listUserReadMessage.length > 10 && (
						<View
							style={{
								backgroundColor: '#ddd',
								borderRadius: 12,
								marginRight: 4,
							}}
						>
							<Text
								style={{
									color: '#555',
									fontSize: 12,
									paddingHorizontal: 6,
									paddingVertical: 2,
								}}
							>
								{`+${listUserReadMessage.length - 10}`}
							</Text>
						</View>
					)}

					{listUserReadMessage.slice(0, 9).map((user, indexUser) => (
						<Avatar.Image
							key={indexUser.toString()}
							source={{
								uri: `${DOMAIN_SERVER_CHAT}/avatar/${user?.username}?size=60&format=png`,
							}}
							size={16}
							style={{ backgroundColor: '#fff', marginRight: 4 }}
						/>
					))}
				</View>
			)}
		</View>
	);
}

export default MessageItemComponent;
