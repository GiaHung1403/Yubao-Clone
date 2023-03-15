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

import { Avatar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { convertUnixTimeNotification, convertUnixTimeWithHours } from '@utils';
import styles from './styles';
import { Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import moment from 'moment';
import AvatarBorder from '@components/AvatarBorder/AvatarBorder';
import { IContact, IUserSystem } from '@models/types';
import ImageAutoSize from '@components/ImageAutoSize/ImageAutoSize';
interface IProps {
	// item: IMessage;
	// nextItem: IMessage;
	// prevItem: IMessage;
	// index: number;
	// typeRoom: string;
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

function MessageItemComponent(props: any) {
	const { colors } = useTheme();
	const { listMessage, nextMessage, userName } = props;
	const isMe = listMessage?.From === '2' ? true : false;
	const isFirst = listMessage?.From !== nextMessage?.From;
	const dispatch = useDispatch();
	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	/* Tính thời gian của tin nhắn trước tin nhắn này */
	const timeSentItem =
		new Date(listMessage?.createAt.toDate()).getTime() / 1000;
	const timeSentNextItem = nextMessage
		? new Date(nextMessage?.createAt.toDate()).getTime() / 1000
		: new Date().getTime() / 1000;
	const rangeTimeSent = timeSentItem - timeSentNextItem;
	const LOGO = require('@assets/logo.png');
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const isAttachment = listMessage?.attachments != undefined;

	const showMessage = () => {
		if (listMessage?.Text.includes('_cardID')) {
			const userID = listMessage?.Text.split('_')[0];
			const cardInfo: IContact[] = listContact?.filter(
				item => item.emp_no === userID,
			);

			return (
				<View
					style={{
						flexDirection: 'row',
						marginHorizontal: 8,
						flex: 1,
						alignSelf: isMe ? 'flex-end' : 'flex-start',
						alignItems: isMe ? 'flex-end' : 'flex-start',
						maxWidth: '80%',
						marginRight: 10,
					}}
				>
					{/* Hiển thị avatar */}
					{!isMe && (isFirst || rangeTimeSent >= 3600 || rangeTimeSent < 0) ? (
						<View style={{ marginRight: 5 }}>
							<AvatarBorder
								// username={isSearching ? data.username : data.name}
								username={userName}
								size={30}
							/>
						</View>
					) : (
						!isMe && <View style={{ width: 40 }} />
					)}
					<View
						style={{
							flexWrap: 'wrap',
						}}
					>
						<View
							style={{
								position: 'relative',
								top: 0,
								left: 0,
								backgroundColor: '#ddd',
								borderRadius: 15,
								padding: 10,
							}}
						>
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									flexDirection: 'row',
								}}
							>
								<Avatar.Image
									source={LOGO}
									size={40}
									style={{
										backgroundColor: '#ddd',
										marginRight: 10,
										alignSelf: 'center',
									}}
								/>
								<View>
									<Text>Name : {cardInfo[0].emp_nm}</Text>
									<Text>Phone Number : {cardInfo[0].cellphone} </Text>
									<Text>Email : {cardInfo[0].email} </Text>
								</View>
							</View>

							<Text
								style={{
									fontSize: 11,
									color: '#666',
								}}
							>
								{convertUnixTimeWithHours(
									new Date(listMessage?.createAt.toDate()).getTime() / 1000,
								)}
							</Text>
						</View>
					</View>
				</View>
			);
		}

		if (isAttachment && listMessage?.attachments?.type.includes('image')) {
			return (
				<View
					style={{
						flexDirection: 'row',
						marginHorizontal: 8,
						flex: 1,
						alignSelf: isMe ? 'flex-end' : 'flex-start',
						alignItems: isMe ? 'flex-end' : 'flex-start',
						maxWidth: '80%',
						marginRight: 10,
					}}
				>
					{/* Hiển thị avatar */}
					{!isMe && (isFirst || rangeTimeSent >= 3600 || rangeTimeSent < 0) ? (
						<View style={{ marginRight: 5 }}>
							<AvatarBorder
								// username={isSearching ? data.username : data.name}
								username={userName}
								size={30}
							/>
						</View>
					) : (
						!isMe && <View style={{ width: 37 }} />
					)}
					<ImageAutoSize
						uri={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQuGWSCWOiJq7iY1SlBncD8PTe9cjqcOyUeQ&usqp=CAU`}
						isMe={isMe}
					/>
				</View>
			);
		}

		if (isAttachment && listMessage?.attachments.type.includes('pdf')) {
			return (
				<View
					style={{
						flexDirection: 'row',
						marginHorizontal: 8,
						flex: 1,
						alignSelf: isMe ? 'flex-end' : 'flex-start',
						alignItems: isMe ? 'flex-end' : 'flex-start',
						maxWidth: '80%',
						marginRight: 10,
					}}
				>
					{/* Hiển thị avatar */}
					{!isMe && (isFirst || rangeTimeSent >= 3600 || rangeTimeSent < 0) ? (
						<View style={{ marginRight: 5 }}>
							<AvatarBorder
								// username={isSearching ? data.username : data.name}
								username={userName}
								size={30}
							/>
						</View>
					) : (
						!isMe && <View style={{ width: 37 }} />
					)}
					<View
						style={{
							flexWrap: 'wrap',
						}}
					>
						<View
							style={{
								position: 'relative',
								top: 0,
								left: 0,
								backgroundColor: '#ddd',
								borderRadius: 15,
								padding: 10,
							}}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Image
									source={{
										uri: 'https://img.icons8.com/bubbles/344/pdf-2.png',
									}}
									resizeMode="contain"
									style={{ width: 50, height: 50 }}
								/>
								<View style={{ maxWidth: '90%', marginLeft: 8 }}>
									<Text
										style={{
											color: colors.primary,
										}}
									>
										{listMessage.attachments?.fileName.trim()}
									</Text>
								</View>
							</View>
							<Text
								style={{
									fontSize: 11,
									color: '#666',
								}}
							>
								{convertUnixTimeWithHours(
									new Date(listMessage?.createAt.toDate()).getTime() / 1000,
								)}
							</Text>
						</View>
					</View>
				</View>
			);
		}

		return (
			<View
				style={{
					flexDirection: 'row',
					marginHorizontal: 8,
					flex: 1,
					alignSelf: isMe ? 'flex-end' : 'flex-start',
					alignItems: isMe ? 'flex-end' : 'flex-start',
					maxWidth: '80%',
					marginRight: 10,
				}}
			>
				{/* Hiển thị avatar */}
				{!isMe && (isFirst || rangeTimeSent >= 3600 || rangeTimeSent < 0) ? (
					<View style={{ marginRight: 5 }}>
						<AvatarBorder
							// username={isSearching ? data.username : data.name}
							username={userName}
							size={30}
						/>
					</View>
				) : (
					!isMe && <View style={{ width: 40 }} />
				)}
				<View
					style={{
						flexWrap: 'wrap',
					}}
				>
					<View
						style={{
							position: 'relative',
							top: 0,
							left: 0,
							backgroundColor: '#ddd',
							borderRadius: 15,
							padding: 10,
						}}
					>
						<Text>{listMessage?.Text}</Text>
						<Text
							style={{
								fontSize: 11,
								color: '#666',
							}}
						>
							{convertUnixTimeWithHours(
								new Date(listMessage?.createAt.toDate()).getTime() / 1000,
							)}
						</Text>
					</View>
				</View>
			</View>
		);
	};

	return (
		<View style={{ zIndex: 1, marginBottom: 8 }}>
			{/* Thời gian so với tin nhắn trước lâu hơn 1 tiếng thì hiển thị session phân biệt */}
			{rangeTimeSent >= 3600 || rangeTimeSent < 0 ? (
				<View style={{ alignItems: 'center', marginVertical: 8 }}>
					<Text style={{ fontSize: 12, color: '#555' }}>
						{/* {moment(listMessage?.createAt.seconds).format('hh:mm')} */}
						{
							convertUnixTimeNotification(
								new Date(listMessage?.createAt.toDate()).getTime() / 1000,
							).time
						}
					</Text>
				</View>
			) : null}
			{showMessage()}
		</View>
	);
}

export default MessageItemComponent;
