import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListContact } from '@actions/contact_action';
import { getAllUserRC } from '@actions/user_action';
import AvatarBorder from '@components/AvatarBorder';
import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { createDirectMessage, getSpotlight } from '@data/api';
import { IContact, IDepartment, ISpotlight, IUserSystem } from '@models/types';
import CallPhoneOptionModal from './CallPhoneOptionModal';
import styles from './styles';
interface IContactReducer {
	listContact: IContact[];
	loading: boolean;
	departmentSelected: IDepartment;
}

export function ContactScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const modalContactRef = useRef<any>();
	const { colors } = useTheme();
	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { listContact, loading, departmentSelected }: IContactReducer =
		useSelector((state: any) => state.contact_reducer);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState('');

	const I18n = React.useContext(LocalizationContext);
	const textContactList = 'Contact List';
	const textSearch = 'Search Employee Name';

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getAllUserRC({
					UserID: dataUserRC.userId,
					token: dataUserRC.authToken,
				}),
			);

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		const delayDebounceFn = setTimeout(() => {
			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: firstQuery,
					Dept_Code:
						departmentSelected?.ST_C === 'Department'
							? departmentSelected?.C_NO
							: '0',
					Branch: '-1',
					subteam:
						departmentSelected?.ST_C === 'Department'
							? ''
							: departmentSelected?.C_NO,
				}),
			);
		}, 100);

		return () => clearTimeout(delayDebounceFn);
	}, [firstQuery, doneLoadAnimated, departmentSelected]);

	const findRoomChatName = async (contact: IContact) => {
		const data = (await getSpotlight({
			token: dataUserRC.authToken,
			UserID: dataUserRC.userId,
			query: contact.emp_no,
		})) as ISpotlight[];
		return data[0];
	};

	const _onPressMessageIcon = async (contact: IContact) => {
		const roomChat: ISpotlight = await findRoomChatName(contact);

		try {
			if (!roomChat?.rid) {
				const roomResponse: any = await createDirectMessage({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					usernameStaff: roomChat?.username || contact.emp_no,
				});

				navigation.navigate('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse, {
						name: roomChat?.username || contact.emp_no,
						fname: roomChat?.name || contact.emp_nm,
					}),
				});
				return;
			}

			navigation.navigate('ChatRoomMessageScreen', { room: roomChat });
		} catch (error) {
			Alert.alert(
				'Alert',
				'User not existed on database chat! Please contact IT for support!',
			);
		}
	};

	const checkRoomChatExisted = async (contact: IContact) => {
		const roomChat: ISpotlight = await findRoomChatName(contact);

		if (!roomChat) {
			return {};
		}

		if (!roomChat.rid) {
			const roomResponse: any = await createDirectMessage({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				usernameStaff: roomChat?.username,
			});
			return Object.assign(roomResponse, {
				name: roomChat.username,
				fname: roomChat.name,
			});
		} else {
			return roomChat;
		}
	};

	const onRefresh = async () => {
		dispatch(
			getListContact({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: firstQuery,
				Dept_Code:
					departmentSelected?.ST_C === 'Department'
						? departmentSelected?.C_NO
						: '0',
				Branch: '-1',
				subteam:
					departmentSelected?.ST_C === 'Department'
						? ''
						: departmentSelected?.C_NO,
			}),
		);
	};

	const _onPressItem = async (item: IContact) => {
		if (
			['00678', '00965'].includes(dataUserSystem.EMP_NO) ||
			['07', '08', '09', '10'].includes(dataUserSystem.TIT)
		) {
			navigation.navigate('UserInfoScreen', {
				userID: item.emp_no,
				// room: await checkRoomChatExisted(item),
			});
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.containerHeader}>
				<Header title={textContactList} />
			</View>

			<Card style={{ marginTop: 8, marginHorizontal: 8 }} elevation={4}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						paddingHorizontal: 8,
						paddingVertical: 12,
						alignItems: 'center',
					}}
					onPress={() =>
						navigation.navigate('FilterContactModal', { query: firstQuery })
					}
				>
					<Text style={{ flex: 1, color: '#666' }}>
						{departmentSelected
							? departmentSelected.STND_C_NM
							: 'Choose department'}
					</Text>
					<Icon
						as={Ionicons}
						name="chevron-down-outline"
						size={7}
						color={'#666'}
					/>
				</TouchableOpacity>
			</Card>

			<Searchbar
				textAlign={'left'}
				placeholder={textSearch}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{ zIndex: 2, marginHorizontal: 8, marginTop: 8 }}
				inputStyle={{ fontSize: 14 }}
			/>

			{doneLoadAnimated && (
				<View style={{ flex: 1 }}>
					<FlatList
						style={styles.containerList}
						keyboardShouldPersistTaps="handled"
						data={listContact}
						keyExtractor={(item, index) => index.toString()}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={onRefresh}
							/>
						}
						extraData={listContact}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<Card
								style={{ marginTop: 8, marginHorizontal: 8 }}
								onPress={() => _onPressItem(item)}
							>
								<View
									style={{
										paddingVertical: 16,
										paddingHorizontal: 8,
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<AvatarBorder username={item.emp_no} size={60} />
									<View style={{ flex: 1, marginLeft: 8 }}>
										<Text
											style={{
												color: colors.primary,
												fontWeight: '600',
											}}
										>
											{item.emp_nm}
										</Text>
										<Text style={{ marginVertical: 4 }}>{item.div_nm}</Text>
										<Text style={{}}>
											<Text
												style={{
													color: colors.primary,
													fontWeight: '600',
												}}
											>
												(FL{item.working_Floor})
											</Text>{' '}
											- {item.ext}
										</Text>
										{item.leave_Tp ? (
											<Text
												style={{
													color: 'red',
													marginTop: 4,
													fontWeight: '500',
												}}
											>
												{item.leave_Tp}
											</Text>
										) : null}
									</View>

									<Icon
										as={Ionicons}
										name="call-outline"
										color={colors.primary}
										size={7}
										marginRight={4}
										onPress={async () =>
											modalContactRef.current.onShowModal({
												contactItem: item,
												room: await checkRoomChatExisted(item),
											})
										}
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
			)}
			<CallPhoneOptionModal ref={modalContactRef} />
		</View>
	);
}
