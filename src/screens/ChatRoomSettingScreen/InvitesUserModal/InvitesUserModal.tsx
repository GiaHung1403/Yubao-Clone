import React, { useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Avatar, Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	addUserInvitedRC,
	removeAllUserInvitedRC,
} from '@actions/room_rc_action';
import Header from '@components/Header';
import Color from '@config/Color';
import {
	IContact,
	IDepartment,
	IRoom,
	ISpotlight,
	ISubTeam,
	IUserLoginRC,
	IUserSystem,
} from '@models/types';

import { getDomainAPIChat } from '@data/Constants';
import { getSpotlight } from '@data/api';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { getListContact, setDepartmentSelected } from '@actions/contact_action';
import { getAllUserRC } from '@actions/user_action';
import { useNavigation } from '@react-navigation/native';
import ListInviteComponent from './ListInviteComponent';

import { RocketChat } from '@data/rocketchat';

let temp: any = [];
let listIUser: number = 0;
let listInvite: any = [];

interface IContactReducer {
	listContact: IContact[];
	departmentSelected: IDepartment;
}

interface IRouteParams {
	room: IRoom;
}

export function InvitesUserModal(props: any) {
	const { room }: IRouteParams = props.route.params;
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const [textQuery, setTextQuery] = useState<string>('');
	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [listUserFilter, setListUserFilter] = useState<ISpotlight[]>([]);

	const [selectDep, setSelectDep] = useState<String[]>([]);
	const [showDep, setShowDep] = useState(false);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	// const [listDepartment, setListDepartment] = useState<ISubTeam[]>([]);
	const { listContact, departmentSelected }: IContactReducer = useSelector(
		(state: any) => state.contact_reducer,
	);

	const dataAllUserRC: any = useSelector(
		(state: any) => state.user_reducer.listUserRC,
	);

	// const listUserInvited: ISpotlight[] = useSelector(
	// 	(state: any) => state.room_rc_reducer.listUserInvited,
	// );

	// const listInvite  = useRef<any[]>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getAllUserRC({
					UserID: dataUserRC?.userId,
					token: dataUserRC?.authToken,
				}),
			);

			dispatch(
				setDepartmentSelected({
					departmentSelected: undefined,
				}),
			);

			(async function search() {
				dispatch(
					getListContact({
						User_ID: dataUserSystem.EMP_NO,
						Password: '',
						query: textQuery,
						Dept_Code:
							departmentSelected?.src === 'Department'
								? departmentSelected?.C_NO
								: '0',
						Branch: '-1',
						subteam:
							departmentSelected?.src === 'Department'
								? undefined
								: departmentSelected?.SubTeam,
					}),
				);
			})();
			setDoneLoadAnimated(true);
		});
	}, []);

	const checkInvite = item => {
		if (
			listInvite?.filter(user => item?.username === user?.username).length === 1
		) {
			return true;
		}

		return false;
	};

	const removeInvite = item => {
		const temp = listInvite.filter(value => item?.name !== value?.name);
		listInvite = [...temp];
	};
	const getUserInfor = item => {
		(async function search() {
			const mergerSpotlight: any = await getSpotlight({
				token: dataUserRC.authToken,
				UserID: dataUserRC.userId,
				query: `@${item}`,
			});
			if (!checkInvite(mergerSpotlight[0])) {
				dispatch(addUserInvitedRC({ user: [mergerSpotlight[0]] }));
				listInvite.push(mergerSpotlight[0]);
			}
		})();
	};

	useEffect(() => {
		// (async function search() {
		// 	const mergerSpotlight: any = await getSpotlight({
		// 		token: dataUserRC.authToken,
		// 		UserID: dataUserRC.userId,
		// 		query: `@${textQuery}`,
		// 	});
		// 	setListUserFilter(mergerSpotlight);
		// })();

		// (async function search() {
		// 	dispatch(
		// 		getListContact({
		// 			User_ID: dataUserSystem.EMP_NO,
		// 			Password: '',
		// 			query: textQuery,
		// 			Dept_Code: '0',
		// 			Branch: '-1',
		// 			subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
		// 		}),
		// 	);
		// })();

		setTimeout(() => {
			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: textQuery,
					Dept_Code:
						departmentSelected?.src === 'Department'
							? departmentSelected?.C_NO
							: '0',
					Branch: '-1',
					subteam:
						departmentSelected?.src === 'Department'
							? undefined
							: departmentSelected?.SubTeam,
				}),
			);
		}, 100);
	}, [textQuery, departmentSelected]);

	// useEffect(() => {
	// 	temp = [];

	// 	temp = listContact.filter(contact => selectDep.findIndex(dept => contact.dept_code === dept) > -1);

	// 	if (selectDep.length === 0) {
	// 		dispatch(removeAllUserInvitedRC());
	// 	} else {
	// 		dispatch(removeAllUserInvitedRC());
	// 		const listUserInvite = dataAllUserRC.filter(
	// 			user => temp.findIndex(item => user.username === item.emp_no) > -1,
	// 		);
	// 		dispatch(addUserInvitedRC({ user: listUserInvite || [] }));
	// 	}
	// }, [selectDep]);

	const _onPressAddAll = () => {
		temp = [];
		temp = listContact.filter(
			contact => contact.dept_code === departmentSelected?.C_NO,
		);

		const listUserInvite = dataAllUserRC.filter(
			user => temp.findIndex(item => user.username === item.emp_no) > -1,
		);
		dispatch(addUserInvitedRC({ user: listUserInvite || [] }));
	};

	const _onPressItemDep = (subTeam: ISubTeam) => {
		if (selectDep.includes(subTeam.SubTeam)) {
			selectDep.filter((item, index) => {
				if (item === subTeam.SubTeam) selectDep.splice(index, 1);
			});
			const tempList = [...selectDep];
			setSelectDep(tempList);
		} else setSelectDep(item => [...item, subTeam.SubTeam]);
	};

	const _onPress_Invite = async () => {
		const listInviteConvert = listInvite.map(item => item._id.toString());

		room.t === 'c'
			? await RocketChat.invite_Channels({
					roomId: room.rid || room._id,
					list_userId: listInviteConvert,
			  })
			: await RocketChat.invite_Groups({
					roomId: room.rid || room._id,
					list_userId: listInviteConvert,
			  });
		dispatch(removeAllUserInvitedRC());
		// navigation.navigate('ChatRoomMessageScreen', { room });
		navigation.goBack();
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header
					title="Invite User"
					isShowButton={true}
					labelButton="Invite"
					onPressButton={_onPress_Invite}
				/>
			</View>

			<View style={{ flex: 1 }}>
				<Searchbar
					textAlign={'left'}
					placeholder="Search"
					value={textQuery}
					style={{
						marginTop: 8,
						marginHorizontal: 8,
						zIndex: 2,
					}}
					inputStyle={{ fontSize: 14 }}
					onChangeText={(text: string) => setTextQuery(text)}
				/>

				<Card style={{ marginTop: 8, marginHorizontal: 8 }} elevation={4}>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							paddingVertical: 12,
							alignItems: 'center',
						}}
						onPress={() =>
							navigation.navigate('FilterContactModal', { query: textQuery })
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
				<ListInviteComponent buttonRemove={removeInvite} />
				<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
					<TouchableOpacity
						style={{
							flex: 1,
							marginLeft: 5,
							flexDirection: 'row',
							alignItems: 'center',
						}}
						onPress={() => dispatch(removeAllUserInvitedRC())}
					>
						<Icon
							as={Ionicons}
							name="add-outline"
							size={5}
							style={{ marginRight: 5 }}
							color={colors.primary}
						/>
						<Text
							style={{
								color: colors.primary,
								fontSize: 15,
							}}
						>
							Delete All
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							marginRight: 10,
							flexDirection: 'row',
							alignItems: 'center',
						}}
						onPress={() => _onPressAddAll()}
					>
						<Icon
							as={Ionicons}
							name="add-outline"
							size={5}
							style={{ marginRight: 5 }}
							color={colors.primary}
						/>
						<Text
							style={{
								color: colors.primary,
								fontSize: 15,
							}}
						>
							Add All
						</Text>
					</TouchableOpacity>
				</View>
				<FlatList
					style={{ paddingHorizontal: 8, paddingTop: 4 }}
					keyExtractor={(_, index) => index.toString()}
					keyboardShouldPersistTaps="handled"
					data={listContact}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => (
						<Card style={{ marginTop: 4 }}>
							<TouchableOpacity
								style={{
									padding: 8,
									flexDirection: 'row',
									alignItems: 'center',
								}}
								onPress={() => {
									getUserInfor(item?.emp_no);
								}}
							>
								<Avatar.Image
									source={{
										uri: `${getDomainAPIChat()}/avatar/${
											item?.emp_no
										}?size=60&format=png`,
									}}
									size={40}
								/>
								<Text style={{ marginLeft: 8 }}>{item?.emp_nm}</Text>
							</TouchableOpacity>
						</Card>
					)}
				/>
			</View>
		</View>
	);
}
