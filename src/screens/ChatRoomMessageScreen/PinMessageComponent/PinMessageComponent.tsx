import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Avatar, Card, useTheme } from 'react-native-paper';
// @ts-ignore
import Animated, {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from 'react-native-reanimated';

import Color from '@config/Color';
import openLink from '@utils/openLink';
import styles from './styles';
import { Ionicons } from '@expo/vector-icons';
import { IPinMessage } from '@models/types';
import { RocketChat } from '@data/rocketchat';
import { getDomainAPIChat } from '@data/Constants';

export default function PinMessageComponent(props: any) {
	const { room } = props;

	const offset = useSharedValue(-100);
	const [isShow, setShow] = useState<boolean>(false);
	const { colors } = useTheme();
	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: withSpring(offset.value) }],
		};
	});

	const [listPinMessage, setListPinMessage] = useState<IPinMessage[]>([]);

	useEffect(() => {
		(async () => {
			await RocketChat.readMessage({ rid: room.rid });
			const pinMessage = await RocketChat.getPinMessage({
				roomId: room.rid,
			});
			setListPinMessage(pinMessage.messages);
		})();
	}, []);

	if (listPinMessage.length === 0) return null;

	return (
		<View style={{ padding: 8, flex: 1 }}>
			<Card elevation={2} style={{ marginBottom: 8, zIndex: 2 }}>
				<View
					style={{
						padding: 8,
						flexDirection: 'row',
						alignItems: 'center',
						flex: 1,
					}}
				>
					<Icon
						as={Ionicons}
						name={'chatbubble-ellipses-outline'}
						size={7}
						color={colors.primary}
						paddingRight={8}
					/>

					<TouchableOpacity
						style={{ flex: 1 }}
						onPress={() =>
							openLink(
								`https://yubao.chailease.com.vn:8081${listPinMessage[0].attachments[0].title_link}`,
							)
						}
					>
						<Text style={{ flex: 1 }}>
							{listPinMessage[0].attachments
								? listPinMessage[0].attachments[0].title
								: listPinMessage[0].msg}
						</Text>
						<Text style={{ fontSize: 11, color: '#777', marginTop: 4 }}>
							Tin nhắn của {listPinMessage[0].u.name}
						</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							paddingLeft: 8,
							borderLeftWidth: 1,
							borderLeftColor: '#ddd',
							marginLeft: 8,
						}}
						onPress={() => {
							if (offset.value === 0) {
								offset.value = -100;
								setTimeout(() => {
									setShow(oldStatus => !oldStatus);
								}, 300);
							} else {
								setShow(oldStatus => !oldStatus);
								offset.value = 0;
							}
						}}
					>
						<Icon
							as={Ionicons}
							name={
								isShow
									? 'chevron-up-circle-outline'
									: 'chevron-down-circle-outline'
							}
							size={8}
							color={'#999'}
						/>
					</TouchableOpacity>
				</View>
			</Card>

			{isShow && (
				<Animated.View style={[animatedStyles]}>
					<Card
						elevation={2}
						style={{ marginBottom: 8, zIndex: 2, flexDirection: 'row' }}
					>
						{listPinMessage
							.slice(
								1,
								listPinMessage.length > 1
									? listPinMessage.length
									: listPinMessage.length - 1,
							)
							.map(item => {
								return (
									<View>
										<View
											style={{
												height: 1,
												flex: 1,
												backgroundColor: '#e5e5e5',
												marginHorizontal: 8,
											}}
										/>
										<View
											style={{
												padding: 8,
												flexDirection: 'row',
												alignItems: 'center',
												flex: 1,
											}}
										>
											<Icon
												as={Ionicons}
												name={'chatbubble-ellipses-outline'}
												size={7}
												color={colors.primary}
												paddingRight={8}
											/>
											<TouchableOpacity
												style={{ flex: 1 }}
												onPress={() => {
													if (!item.md) {
														openLink(
															`http://yubao.chailease.com.vn${item.attachments[0].title_link}`,
														);
														return;
													}

													if (item.msg.includes('http')) {
														openLink(item.urls[0].url);
														return;
													}
												}}
											>
												<Text style={{ flex: 1 }}>
													{item.attachments
														? item.attachments[0]?.title
														: item.msg}
												</Text>
												<Text
													style={{ fontSize: 11, color: '#777', marginTop: 4 }}
												>
													Tin nhắn của {item.u.name}
												</Text>
											</TouchableOpacity>
										</View>
									</View>
								);
							})}
					</Card>
				</Animated.View>
			)}
		</View>
	);
}
