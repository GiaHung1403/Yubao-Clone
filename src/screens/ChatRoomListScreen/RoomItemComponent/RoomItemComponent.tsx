import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Avatar, Card, DefaultTheme, useTheme } from 'react-native-paper';

import Color from '@config/Color';
import { getStatusUserRC } from '@data/api';
import { FontAwesome5 } from '@expo/vector-icons';
import { ISubscriptionsRC, IUserLoginRC } from '@models/types';
import { convertUnixTimeSolid } from '@utils';
import AvatarBorder from '@components/AvatarBorder/AvatarBorder';
import shortnameToUnicode from '@utils/shortnameToUnicode';
import moment from 'moment';

interface IProps {
	data: ISubscriptionsRC | any;
	onPress: () => void;
	dataUserRC: IUserLoginRC;
	isSearching: string | boolean;
	onSwipeLeft: () => void;
	onSwipeRight: () => void;
}

const isUnreadMessage = data =>
	(data?.unread > 0 || data?.tunread?.length > 0 || data?.alert) &&
	!data.hideUnreadStatus;

function RoomItemComponent(props: IProps) {
	const refSwipe = useRef<any>();
	const { data, onPress, dataUserRC, isSearching, onSwipeLeft, onSwipeRight } =
		props;
	const [status, setStatus] = useState('');
	const { colors } = useTheme();

	useEffect(() => {
		if (data?.t === 'd') {
			(async function getListRoom() {
				const statusData: any = await getStatusUserRC({
					UserID: dataUserRC?.userId,
					token: dataUserRC?.authToken,
					username: data?.name,
				});

				setStatus(statusData);
			})();
		}
	}, []);

	const userName =
		data?.lastMessage?.u?.username === dataUserRC?.me?.username
			? 'You:'
			: data?.t === 'd'
			? ''
			: `${data?.lastMessage?.u?.name}:`;

	const getColorStatus = () => {
		switch (status) {
			case 'offline':
				return '#cbced1';
			case 'online':
				return '#2ecc71';
			default:
				return '#cbced1';
		}
	};

	const _onSwipeLeft = () => {
		refSwipe?.current.close();
		setTimeout(() => {
			onSwipeLeft();
		}, 200);
	};

	const _onSwipeRight = () => {
		refSwipe?.current.close();
		setTimeout(() => {
			onSwipeRight();
		}, 200);
	};

	/* TODO: fix type ISubscription */
	return (
		<Swipeable
			ref={(ref: any) => {
				refSwipe.current = ref;
			}}
			onSwipeableLeftOpen={() => _onSwipeLeft()}
			onSwipeableRightOpen={() => _onSwipeRight()}
			renderLeftActions={() => (
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'flex-start',
						flex: 1,
						backgroundColor: isUnreadMessage(data)
							? Color.approved
							: Color.waiting,
					}}
				>
					<Text
						style={{
							color: '#fff',
							fontWeight: '500',
							width: 150,
							textAlign: 'center',
							textAlignVertical: 'center',
						}}
					>
						{isUnreadMessage(data) ? 'Mark as read' : 'Mark as unread'}
					</Text>
				</View>
			)}
			renderRightActions={() => (
				<View
					style={{
						justifyContent: 'center',
						alignItems: 'flex-end',
						flex: 1,
						backgroundColor: 'red',
					}}
				>
					<Text
						style={{
							color: '#fff',
							fontWeight: '500',
							width: 150,
							textAlign: 'center',
							textAlignVertical: 'center',
						}}
					>
						Delete
					</Text>
				</View>
			)}
		>
			<Card elevation={1} onPress={() => onPress()}>
				<View
					style={{
						flexDirection: 'row',
						paddingHorizontal: 8,
						paddingVertical: 6,
						backgroundColor: isUnreadMessage(data)
							? DefaultTheme.colors.background
							: '#fff',
						alignItems: 'center',
					}}
				>
					<AvatarBorder
						username={isSearching ? data.fname || data.username : data.name}
						// username={ data.name}
						size={50}
					/>

					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							margin: 8,
						}}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							{data.t === undefined || data.t === 'd' ? (
								<View
									style={{
										width: 10,
										height: 10,
										borderRadius: 5,
										backgroundColor: getColorStatus(),
										marginRight: 8,
									}}
								/>
							) : data.t === 'c' ? (
								<Icon
									as={FontAwesome5}
									name={'hashtag'}
									size={3}
									color={'#cbced1'}
									marginRight={1}
								/>
							) : (
								<Icon
									as={FontAwesome5}
									name={'lock'}
									size={3}
									color={'#cbced1'}
									marginRight={1}
								/>
							)}
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<Text
									style={{ fontWeight: '600', fontSize: 15 }}
									numberOfLines={1}
								>
									{data.fname || data.name || data.username}
								</Text>
								<Text style={{ flex: 1, color: colors.primary }}>
									{data.name === 'cloud_bot' ? ' 50%' : null}
								</Text>
							</View>

							{
								<Text
									style={{
										fontSize: 12,
										color: isUnreadMessage(data) ? colors.primary : '#3e3e3e',
										fontWeight: isUnreadMessage(data) ? '600' : 'normal',
									}}
								>
									{/* {convertUnixTimeSolid(
										new Date(data._updatedAt).getTime() / 1000,
									)} */}

									{moment(data.roomUpdatedAt).format('DD/MM/YYYY')}
									{/* {moment(data._updatedAt).format('DD/MM/YYYY')} */}
								</Text>
							}
						</View>

						<View style={{ flexDirection: 'row', marginTop: 8 }}>
							<Text style={{ color: '#3e3e3e', flex: 1 }} numberOfLines={1}>
								{data.lastMessage
									? data?.lastMessage?.attachments?.length === 0
										? !data.lastMessage?.msg
											? 'No Message'
											: `${userName} ${shortnameToUnicode(
													data.lastMessage.msg.includes('custom:')
														? '[Sticker]'
														: data.lastMessage.msg,
											  )}`
										: `${userName} sent an attachment`
									: 'No Message'}
							</Text>
							{data?.unread > 0 && (
								<View
									style={{
										borderRadius: 10,
										backgroundColor: colors.primary,
										width: 20,
										height: 20,
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<Text style={{ fontSize: 12, color: '#fff' }}>
										{data?.unread}
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>
			</Card>
		</Swipeable>
	);
}

export default React.memo(RoomItemComponent);
