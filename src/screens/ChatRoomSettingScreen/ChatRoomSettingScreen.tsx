import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	Image,
	InteractionManager,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Avatar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListFileRC } from '@actions/document_action';
import Header from '@components/Header';
import { DOMAIN_SERVER_CHAT, getDomainAPIChat } from '@data/Constants';
import { IFileRC, IMemberRoom, IRoom, IUserLoginRC } from '@models/types';
import ItemActionComponent from './ItemActionComponent';
import styles from './styles';
import { RocketChat } from '@data/rocketchat';
import EventEmitter from '@utils/events';

interface IHighLightFunction {
	id: string;
	label: string;
	icon: string;
	hidden?: boolean;
}

interface IFunctionAction {
	id: string;
	label: string;
	labelNumber?: string;
	icon: string;
	children?: any;
	description?: string;
	isNewSession?: boolean;
}

interface IRouteParams {
	room: IRoom;
}

let roomType = '';

export function ChatRoomSettingScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const { room }: IRouteParams = props.route.params;
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);
	const listFileRC: IFileRC[] = useSelector(
		(state: any) => state.document_reducer.listFileRC,
	);
	const listRoomMemberRC: IMemberRoom[] = useSelector(
		(state: any) => state.room_rc_reducer.listRoomMemberRC,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);

	const listHighLightFunction: IHighLightFunction[] = [
		{ id: 'searchMessage', label: 'Search\n messages', icon: 'search-outline' },
		{
			id: 'addMember',
			label: 'Add\n users',
			icon: 'person-add-outline',
			hidden: room.t === 'd',
		},
		{
			id: 'userInfo',
			label: 'User\n information',
			icon: 'person-outline',
			hidden: room.t !== 'd',
		},
		{
			id: 'changeBackground',
			label: 'Change\n background',
			icon: 'color-palette-outline',
		},
		{
			id: 'offNotification',
			label: 'Setting\n notification',
			icon: 'notifications-outline',
		},
	];

	const mediaItem = {
		id: 'media',
		label: 'Stored media',
		labelNumber:
			listFileRC.filter(file => file.type.includes('image') && file?.typeGroup)
				?.length === 0
				? ''
				: listFileRC
						.filter(file => file.type.includes('image') && file?.typeGroup)
						?.length.toString(),
		icon: 'images-outline',
		description: 'View shared photos, links and files',
		isNewSession: true,
		children: (
			<View style={{ flexDirection: 'row', marginTop: 20 }}>
				{listFileRC
					.filter(file => file.type.includes('image') && file?.typeGroup)
					.slice(0, 4)
					.map((item, index) => (
						<View
							key={index.toString()}
							style={{
								borderRadius: 4,
								marginRight: 5,
								overflow: 'hidden',
							}}
						>
							<Image
								source={{
									uri: `${DOMAIN_SERVER_CHAT}${item.path}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
								}}
								resizeMode="cover"
								style={{ width: 60, height: 60 }}
							/>
						</View>
					))}
				<View
					style={{
						borderRadius: 4,
						overflow: 'hidden',
						width: 60,
						height: 60,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#f5f5f5',
					}}
				>
					<Icon
						as={Ionicons}
						name="ellipsis-horizontal"
						size={7}
						color={colors.primary}
					/>
				</View>
			</View>
		),
	};

	const listFunctionGroupAction: IFunctionAction[] = [
		{
			id: 'information',
			label: 'Group information',
			icon: 'information-circle-outline',
			description: 'Setting more options for group',
			isNewSession: true,
		},
		mediaItem,
		// {
		//   id: 'pin',
		//   label: 'Pinned messages',
		//   icon: 'pin-outline',
		// },
		{
			id: 'members',
			label: 'View members',
			labelNumber: listRoomMemberRC.length.toString(),
			icon: 'people-outline',
			isNewSession: true,
		},
		{
			id: 'inviteLink',
			label: 'Group invite link',
			description: `yubao.chailease/channel/${room.fname}`,
			icon: 'link-outline',
		},
	];

	const listFunctionUserAction: IFunctionAction[] = [
		mediaItem,
		{
			id: 'pin',
			label: 'Pinned messages',
			icon: 'pin-outline',
		},
		{
			id: 'hideMessage',
			label: 'Hidden',
			icon: 'eye-off-outline',
			isNewSession: true,
		},
	];

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
			(async function getData() {
				const data: any = await RocketChat.getRoomInfo({ roomId: room.rid });
				roomType = data.room.t;
			})();
			dispatch(
				getListFileRC({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					type: room.t,
					roomId: room.rid,
				}),
			);
			// dispatch(
			//     getListRoomMemberRC({
			//         roomID: room.rid, token: dataUserRC.authToken, UserID: dataUserRC.userId, type: room.t,
			//     }),
			// );
		});
	}, []);

	const _onPressItem = (item: IFunctionAction) => {
		switch (item.id) {
			case 'members':
				navigation.navigate('ChatRoomMemberScreen', { room });
				break;
			case 'information':
				navigation.navigate('ChatRoomInfoScreen', { room });
				break;
			case 'inviteLink':
				navigation.navigate('ChatRoomShareScreen', { room });
				break;
			case 'media':
				navigation.navigate('ChatRoomStoredScreen', { room });
				break;

			default:
				break;
		}
	};

	const _onPressLeave = async () => {
		try {
			Alert.alert('Alert', 'Are you sure to leave this group?', [
				{ text: 'No' },
				{
					text: 'Yes',
					onPress: async () => {
						roomType === 'c'
							? await RocketChat.leaveRoom_Channels({
									roomId: room.rid || room._id,
							  })
							: await RocketChat.leaveRoom_Groups({
									roomId: room.rid || room._id,
							  });
						navigation.dispatch(StackActions.popToTop());
					},
					style: 'destructive',
				},
			]);
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Actions" />
			</View>

			{doneLoadAnimated && (
				<ScrollView style={{ flex: 1 }}>
					{/* View Avatar and Name */}
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							padding: 20,
							backgroundColor: '#fff',
						}}
					>
						<TouchableOpacity style={{ position: 'relative' }}>
							<Avatar.Image
								source={{
									uri: `${getDomainAPIChat()}/avatar/${
										room.t !== 'd' ? '@' : ''
									}${room.name}?size=120&format=png`,
								}}
								size={80}
							/>
							{room.t !== 'd' && (
								<View
									style={{
										width: 24,
										height: 24,
										borderRadius: 12,
										backgroundColor: '#f5f5f5',
										justifyContent: 'center',
										alignItems: 'center',
										position: 'absolute',
										bottom: -2,
										right: -2,
									}}
								>
									<Icon
										as={Ionicons}
										name="camera-reverse-outline"
										size={5}
										color={'#555'}
									/>
								</View>
							)}
						</TouchableOpacity>

						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								marginRight: -26,
								marginTop: 8,
							}}
						>
							<Text
								style={{
									fontSize: 18,
									fontWeight: '600',
									marginRight: 8,
									color: '#555',
								}}
							>
								{room.fname || room.name}
							</Text>

							<View
								style={{
									borderRadius: 30,
									backgroundColor: '#f5f5f5',
									width: 30,
									height: 30,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<Icon as={AntDesign} name="edit" size={18} color={'#555'} />
							</View>
						</View>
					</View>
					{/* View highlight function */}
					<View
						style={{
							flexDirection: 'row',
							paddingVertical: 20,
							paddingHorizontal: 20,
							backgroundColor: '#fff',
						}}
					>
						{listHighLightFunction.map((item, index) =>
							item.hidden ? null : (
								<TouchableOpacity
									key={index.toString()}
									style={{
										flex: 1,
										justifyContent: 'flex-start',
										alignItems: 'center',
										marginLeft: index === 0 ? 0 : 8,
									}}
									onPress={() => {
										if (item.id === 'addMember') {
											navigation.navigate('InvitesUserModal', {
												room: room,
											});
											// navigation.navigate('ChatRoomStoredScreen', { room });
										}
									}}
								>
									<View
										style={{
											borderRadius: 30,
											backgroundColor: '#f5f5f5',
											width: 35,
											height: 35,
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Icon
											as={Ionicons}
											name={item.icon}
											size={6}
											color={'#666'}
										/>
									</View>
									<Text
										style={{
											textAlign: 'center',
											marginTop: 4,
											color: '#555',
											fontSize: 12,
										}}
									>
										{item.label}
									</Text>
								</TouchableOpacity>
							),
						)}
					</View>

					{/* View Group Information */}
					{(room.t === 'd'
						? listFunctionUserAction
						: listFunctionGroupAction
					).map((action, index) => (
						<View
							key={index.toString()}
							style={{
								marginTop: action.isNewSession ? 8 : 0,
								backgroundColor: '#fff',
							}}
						>
							<ItemActionComponent
								label={action.label}
								labelNumber={action.labelNumber}
								description={action.description}
								icon={action.icon}
								children={action.children}
								isItemFirst={action.isNewSession}
								rightComponent={() => (
									<Icon
										as={Ionicons}
										name="chevron-forward-outline"
										size={18}
										color={'#888'}
									/>
								)}
								onPress={() => _onPressItem(action)}
							/>
						</View>
					))}

					<View
						style={{
							marginTop: 9,
							backgroundColor: '#fff',
						}}
					>
						<ItemActionComponent
							label={room.t === 'd' ? 'Block' : 'Leave group'}
							icon={room.t === 'd' ? 'hand-left-outline' : 'exit-outline'}
							isItemFirst={true}
							color="red"
							onPress={_onPressLeave}
						/>
					</View>
				</ScrollView>
			)}
		</View>
	);
}
