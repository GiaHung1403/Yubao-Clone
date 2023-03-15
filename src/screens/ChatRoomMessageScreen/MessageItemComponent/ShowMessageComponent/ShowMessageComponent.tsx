import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Animated,
	Image,
	Text,
	TouchableOpacity,
	View,
	LayoutAnimation,
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

import PopoverTooltip, { getOut } from '../../PopoverItemComponent';
import { useNavigation } from '@react-navigation/native';
import shortnameToUnicode from '@utils/shortnameToUnicode';
import VideoPlayer from 'react-native-video-player';
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
	isMe : boolean;
	isImage : boolean;
	isLast : boolean;
	isFirst : boolean;
	rangeTimeSent : any;
	listUserReadMessage : any;
}

/* Format tin nhắn có tag ai đó */
const ShowMessageComponent = (props: IProps) => {
	const { colors } = useTheme();
	const {
		item,
		nextItem,
		prevItem,
		index,
		typeRoom,
		onPressAvatar,
		onPressMessageContent,
		onPressReactionList,
		onPressReaction,
		onPressQuoteMessage,
		onPressDeleteMessage,
		onPressUpdateMessage,
		onPressCopy,
		onPressPin,
		isMe,
		isImage,
		isLast,
		isFirst,
		rangeTimeSent,
		listUserReadMessage,
	} = props;
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
				marginRight: index !== 0 && typeRoom === 'd' ? 20 : 4,
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
						style={{ backgroundColor: '#fff' }}
					/>
				</TouchableOpacity>
			) : (
				!isMe && <View style={{ width: 32 }} />
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

export default ShowMessageComponent;
