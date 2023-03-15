
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { IMessage} from '@models/types';
import { useNavigation } from '@react-navigation/native';
import { Avatar, useTheme } from 'react-native-paper';
import { convertUnixTimeNotification, convertUnixTimeWithHours } from '@utils';
import {getDomainAPIChat } from '@data/Constants';

interface IProps {
	item: IMessage;
	nameUser: any;
	isJoined: boolean;
	isJoinedTeam: boolean;
	isLeft: boolean;
	isChangePrivacy: boolean;
	isChangeTopic: boolean;
	isUserAdd: boolean;
	listRoomMemberRC: any;
	isUserRemove: boolean;
	isUserPin: boolean;
	isChangeUserRole: boolean;
	isChangeRoomName: boolean;
	isCallStart: boolean;
	isNewDay: any;
	isAddTeam : boolean;
}

const TextNoticeEvent = (props: IProps) => {
	const {
		item,
		nameUser,
		isJoined,
		isJoinedTeam,
		isLeft,
		isChangePrivacy,
		isChangeTopic,
		isUserAdd,
		listRoomMemberRC,
		isUserRemove,
		isUserPin,
		isChangeUserRole,
		isChangeRoomName,
		isCallStart,
		isNewDay,
		isAddTeam,
	} = props;
    const { colors } = useTheme();
    const navigation: any = useNavigation();

    const textNoticeEvent = () =>{
        if (isJoined) {
					return (
						<Text>
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{nameUser}
							</Text>{' '}
							has joined the room.
						</Text>
					);
				}
				if (isJoinedTeam) {
					return (
						<Text>
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{nameUser}
							</Text>{' '}
							has joined the team.
						</Text>
					);
				}

				if (isLeft) {
					return (
						<Text>
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{nameUser}
							</Text>{' '}
							has left the room.
						</Text>
					);
				}

				if (isChangePrivacy) {
					return (
						<Text>
							Room type changed to:{' '}
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{item.msg}
							</Text>{' '}
							by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}

				if (isChangeTopic) {
					return (
						<Text>
							Room topic changed to:{' '}
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{item.msg}
							</Text>{' '}
							by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}

				if (isUserAdd) {
					let name = listRoomMemberRC.filter(value => {
						return value.username === item?.msg;
					});

					return (
						<Text>
							<Text
								style={{ color: '#2c82c9', fontWeight: '600' }}
								onPress={() =>
									// navigation.navigate('UserInfoScreen', {
									// 	userID: item.msg,
									// })
									null
								}
							>
								{name[0]?.name}
							</Text>{' '}
							added by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}

				if (isAddTeam) {
					let name = listRoomMemberRC.filter(value => {
						return value.username === item?.msg;
					});

					return (
						<Text>
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>{' '}
							added{' '}
							<Text
								style={{ color: '#2c82c9', fontWeight: '600' }}
								onPress={() =>
									// navigation.navigate('UserInfoScreen', {
									// 	userID: item.msg,
									// })
									null
								}
							>
								{name[0]?.name}
							</Text>{' '}
							to this Team{' '}
						</Text>
					);
				}


				if (isUserRemove) {
					return (
						<Text>
							<Text
								style={{ color: '#2c82c9', fontWeight: '600' }}
								onPress={() =>
									// navigation.navigate('UserInfoScreen', {
									// 	userID: item.msg,
									// })
									null
								}
							>
								{item.msg}
							</Text>{' '}
							removed by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}

				if (isUserPin) {
					let name = listRoomMemberRC.filter(value => {
						return value.username === item?.msg;
					});

					return (
						<Text>
							{/* <Icon
							as={SimpleLineIcons}
							name={'pin'}
							size={5}
							color={colors.error}
							style={{}}
						/>{'  '} */}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>{' '}
							has pin a message
						</Text>
					);
				}

				if (isChangeUserRole) {
					return (
						<Text>
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{item.msg}
							</Text>{' '}
							set {item.role} by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}

				if (isChangeRoomName) {
					return (
						<Text>
							Room name changed to:{' '}
							<Text style={{ color: '#2c82c9', fontWeight: '600' }}>
								{item.msg}
							</Text>{' '}
							by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}

				if (isCallStart) {
					return (
						<Text>
							Call started by{' '}
							<Text style={{ color: colors.primary, fontWeight: '600' }}>
								{nameUser}
							</Text>
						</Text>
					);
				}
    }

			return (
				<View>
					{isNewDay && (
						<View style={{ alignItems: 'center', marginVertical: 8 }}>
							<Text style={{ fontSize: 12, color: '#555' }}>
								{
									convertUnixTimeNotification(
										new Date(item.ts).getTime() / 1000,
									).time
								}
							</Text>
						</View>
					)}

					<TouchableOpacity
						onPress={() => null}
						style={{
							flexDirection: 'row',
							// backgroundColor: "#ddd",
							// borderRadius: 20,m
							padding: 8,
							alignSelf: 'center',
							marginHorizontal: 20,
							marginBottom: 8,
						}}
					>
						<Avatar.Image
							source={{
								uri: `${getDomainAPIChat()}/avatar/${
									item.msg
								}?size=60&format=png`,
							}}
							size={16}
							style={{ backgroundColor: '#fff', marginRight: 8 }}
						/>
						<Text
							style={{
								flexWrap: 'wrap',
								fontSize: 12,
								color: '#3e3e3e',
							}}
						>
							{textNoticeEvent()} - {' '}
							{convertUnixTimeWithHours(new Date(item.ts).getTime() / 1000)}
						</Text>
					</TouchableOpacity>
				</View>
			);

};



export default TextNoticeEvent;
