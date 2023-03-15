import { StackActions, useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, InteractionManager, Text, View } from 'react-native';
import { Avatar, Button, Card, Switch, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	removeAllUserInvitedRC,
	removeUserInvitedRC,
} from '@actions/room_rc_action';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { createChannelRC } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import { ISpotlight, IUserLoginRC } from '@models/types';
import { getDomainAPIChat } from '@data/Constants';

export function ChatNewScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const listUserInvited: ISpotlight[] = useSelector(
		(state: any) => state.room_rc_reducer.listUserInvited,
	);
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [isPrivate, setPrivate] = useState(true);
	const [isReadOnly, setReadOnly] = useState(false);
	const [channelName, setChannelName] = useState('');
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(removeAllUserInvitedRC());
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressCreateChannel = async () => {
		if (!channelName) {
			Alert.alert('Alert', 'Please input Channel Name!');
			return;
		}
		if (listUserInvited.length < 1) {
			Alert.alert('Alert', 'Please add more member');
			return;
		}
		setLoading(true);
		try {
			const responseCreate: any = await createChannelRC({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				name: channelName,
				members: listUserInvited.map(user => user.username),
				readOnly: isReadOnly,
				isPrivate,
			});

			navigation.dispatch(StackActions.pop());
			dispatch(removeAllUserInvitedRC());
			navigation.navigate('ChatRoomMessageScreen', {
				room: Object.assign(responseCreate, { rid: responseCreate._id }),
				title: responseCreate.name,
				username: null,
			});
		} catch (error: any) {
			Alert.alert('Error', error);
			setLoading(false);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title="Create Channel" />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<Card style={{ margin: 8 }}>
						<View style={{ padding: 8 }}>
							<TextInput
								textAlign={'left'}
								mode="outlined"
								label="Channel Name"
								style={{ height: 40 }}
								value={channelName}
								autoCapitalize="none"
								onChangeText={(text: string) => setChannelName(text)}
							/>

							<View
								style={{
									marginTop: 16,
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<Text style={{ marginRight: 8, fontWeight: '600', flex: 1 }}>
									Private Channel
								</Text>
								<Switch
									value={isPrivate}
									onValueChange={() => setPrivate(value => !value)}
								/>
							</View>
							<View
								style={{
									marginTop: 8,
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<Text style={{ marginRight: 8, fontWeight: '600', flex: 1 }}>
									Read Only
								</Text>
								<Switch
									value={isReadOnly}
									onValueChange={() => setReadOnly(value => !value)}
								/>
							</View>
							<Button
								mode="contained"
								uppercase={false}
								loading={loading}
								disabled={loading}
								style={{ marginTop: 16 }}
								onPress={() => _onPressCreateChannel()}
							>
								Create
							</Button>
						</View>
					</Card>

					<Card style={{ margin: 8, flex: 1 }}>
						<View style={{ paddingTop: 8, flex: 1 }}>
							<View
								style={{
									flexDirection: 'row',
									paddingHorizontal: 8,
									alignItems: 'center',
								}}
							>
								<Text style={{ flex: 1, fontWeight: '600', fontSize: 15 }}>
									Invite
								</Text>
								<Button
									icon="plus"
									uppercase={false}
									onPress={() => navigation.navigate('ChatNewSelectUserScreen')}
								>
									Add
								</Button>
							</View>

							<FlatList
								style={{ paddingHorizontal: 8, paddingTop: 8 }}
								data={listUserInvited}
								keyExtractor={(_, index) => index.toString()}
								renderItem={({ item, index }) => (
									<Card style={{ marginBottom: 8 }}>
										<View
											style={{
												padding: 8,
												flexDirection: 'row',
												alignItems: 'center',
											}}
										>
											<Avatar.Image
												source={{
													uri: `${getDomainAPIChat()}/avatar/${
														item.username
													}?size=60&format=png`,
												}}
												size={40}
											/>
											<Text style={{ marginLeft: 8, flex: 1 }}>
												{item.name}
											</Text>
											<Icon
												as={Ionicons}
												name="close-outline"
												size={7}
												color={'#999'}
												onPress={() => dispatch(removeUserInvitedRC({ index }))}
											/>
										</View>
									</Card>
								)}
							/>
						</View>
					</Card>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
