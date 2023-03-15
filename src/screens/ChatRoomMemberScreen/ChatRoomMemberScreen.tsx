import { getDomainAPIChat } from '@data/Constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Avatar, Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListContact } from '@actions/contact_action';
import Header from '@components/Header/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { createDirectMessage, getSpotlight } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import {
	IContact,
	IMemberRoom,
	IRoom,
	ISpotlight,
	IUserSystem,
} from '@models/types';
import styles from './styles';

interface IRouteParams {
	room: IRoom;
}

interface IRoomRCReducer {
	listRoomMemberRC: IMemberRoom[];
	loading: boolean;
}

let listSpotlight: ISpotlight[] = [];

export function ChatRoomMemberScreen(props: any) {
	const navigation = useNavigation<StackNavigationProp<any>>();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);
	const { listRoomMemberRC }: IRoomRCReducer = useSelector(
		(state: any) => state.room_rc_reducer,
	);

	const [firstQuery, setFirstQuery] = useState('');
	const [listMemberSearch, setListMemberSearch] = useState<IMemberRoom[]>([]);

	const I18n = React.useContext(LocalizationContext);
	const textContactList = 'Room Member List';
	const textSearch = 'Search Employee Name';

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					query: firstQuery,
					Dept_Code: '0',
					Branch: '-1',
					subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
				}),
			);

			listSpotlight = (await getSpotlight({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				query: '',
			})) as ISpotlight[];
		});
	}, []);

	useEffect(() => {
		if (firstQuery === '') {
			setListMemberSearch(listRoomMemberRC);
		}

		const listSearch = listRoomMemberRC.filter(member =>
			member.name.toLowerCase().includes(firstQuery.toLowerCase()),
		);
		setListMemberSearch(listSearch);
		return;
	}, [firstQuery]);

	const _onPressMessageIcon = async member => {
		try {
			if (!member?.rid) {
				const roomResponse: any = await createDirectMessage({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					usernameStaff: member?.username,
				});

				navigation.push('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse, {
						name: member?.username,
						fname: member?.name,
					}),
				});
				return;
			}

			navigation.push('ChatRoomMessageScreen', { room: member });
		} catch (error) {
			Alert.alert(
				'Alert',
				'User not existed on database chat! Please contact IT for support!',
			);
		}
	};

	const _onPressItem = (item: IMemberRoom) => {
		// navigation.navigate('UserInfoScreen', { userID: item.username });
	};

	return (
		<View style={styles.container}>
			<View style={styles.containerHeader}>
				<Header title={textContactList} />
			</View>

			<Searchbar
				textAlign={'left'}
				placeholder={textSearch}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{ zIndex: 2, marginHorizontal: 8, marginTop: 8 }}
				inputStyle={{ fontSize: 14 }}
			/>

			<View style={{ flex: 1, paddingHorizontal: 8 }}>
				<FlatList
					style={{ flex: 1 }}
					keyboardShouldPersistTaps="handled"
					data={listMemberSearch?.sort((a, b) => (a.name > b.name ? 1 : -1))}
					keyExtractor={(item, index) => index.toString()}
					extraData={listMemberSearch}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => (
						<Card style={{ marginTop: 8 }} onPress={() => _onPressItem(item)}>
							<View
								style={{
									paddingVertical: 16,
									paddingHorizontal: 8,
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
									size={50}
								/>
								<View style={{ flex: 1, marginLeft: 8 }}>
									<Text
										style={{
											color: colors.primary,
											fontWeight: '600',
										}}
									>
										{item.name}
									</Text>
								</View>

								<Icon
									as={Ionicons}
									name="call-outline"
									color={colors.primary}
									size={7}
									marginRight={8}
									onPress={() => null}
								/>
								<Icon
									as={Ionicons}
									name="chatbubble-ellipses-outline"
									color={colors.primary}
									size={7}
									onPress={() => _onPressMessageIcon(item)}
								/>
							</View>
						</Card>
					)}
				/>
			</View>
		</View>
	);
}
