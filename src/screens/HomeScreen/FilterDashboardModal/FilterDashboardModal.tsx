import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {
	Button,
	Card,
	Chip,
	Searchbar,
	Switch,
	useTheme,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import {
	getDelinquent,
	getInsuranceInformed,
	getNPV,
	getRecovery,
	getSummaryProgress,
	setFromDate,
	setHasViewByTeam,
	setIDChipDate,
	setSubTeamSelected,
	setTeamMemberSelected,
	setToDate,
} from '@actions/dashboard_action';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import { getListSubTeam, getListTeamMember } from '@data/api';
import {
	timeFromFilterDashboardDefault,
	timeToFilterDashboardDefault,
} from '@data/Constants';
import { Ionicons } from '@expo/vector-icons';
import { ISubTeam, ITeamMember, IUserSystem } from '@models/types';
import moment from 'moment';

interface IDashboardReducer {
	fromDate: Date;
	toDate: Date;
	idModalDate: number;
	idChipDate: string;
	isViewByTeam: boolean;
	teamMemberSelected: ITeamMember;
	subTeamSelected: ISubTeam;
}

const listChipTime = [
	{ id: 'month', label: 'This month' },
	{ id: 'year', label: 'This year' },
	{ id: 'custom', label: 'Custom' },
];

export function FilterDashboardModal(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const dispatch = useDispatch();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const {
		fromDate,
		toDate,
		idModalDate,
		idChipDate,
		isViewByTeam,
		teamMemberSelected,
		subTeamSelected,
	}: IDashboardReducer = useSelector((state: any) => state.dashboard_reducer);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [fromDateLocal, setFromDateLocal] = useState(fromDate);
	const [toDateLocal, setToDateLocal] = useState(toDate);
	const [teamMemberSelectedLocal, setTeamMemberSelectedLocal] =
		useState<ITeamMember>(teamMemberSelected);
	const [subTeamSelectedLocal, setSubTeamSelectedLocal] =
		useState<ISubTeam>(subTeamSelected);

	const [isShowMember, setShowMember] = useState<boolean>(false);
	const [isShowTeam, setShowTeam] = useState<boolean>(false);
	const [listSubTeam, setListSubTeam] = useState<ISubTeam[]>([]);
	const [listSubTeamFilter, setListSubTeamFilter] = useState<ISubTeam[]>();
	const [textSearchTeam, setTextSearchTeam] = useState<string>('');
	const [listTeamMember, setListTeamMember] = useState<ITeamMember[]>([]);
	const [listTeamMemberFilter, setListTeamMemberFilter] = useState<
		ITeamMember[]
	>([]);
	const [textSearchMember, setTextSearchMember] = useState<string>('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const { password }: any = await Keychain.getGenericPassword();

			const responseSubTeam: any = await getListSubTeam({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				Dept_Code: dataUserSystem.DEPT_CODE,
				KEY_DATA_EXT1: 'PGLNRT012',
			});

			setListSubTeam(responseSubTeam);
			setListSubTeamFilter(responseSubTeam);

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			if (subTeamSelectedLocal) {
				const { password }: any = await Keychain.getGenericPassword();

				const responseTeamMember: any = await getListTeamMember({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					Sub_Team_Code: subTeamSelectedLocal.SubTeam,
					Dept_Code: dataUserSystem.DEPT_CODE,
					KEY_DATA_EXT1: 'PGLNRT012',
				});

				setListTeamMember(responseTeamMember);
				setListTeamMemberFilter(responseTeamMember);
				setTeamMemberSelectedLocal(responseTeamMember[0]);
			}
		});
	}, [subTeamSelectedLocal]);

	useEffect(() => {
		if (!textSearchTeam) {
			setListSubTeamFilter(listSubTeam);
			return;
		}
		const listSubTeamF = listSubTeam?.filter(subTeam =>
			subTeam.STND_C_NM.includes(textSearchTeam),
		);
		setListSubTeamFilter(listSubTeamF);
	}, [textSearchTeam]);

	useEffect(() => {
		if (!textSearchMember) {
			setListTeamMemberFilter(listTeamMember);
			return;
		}

		const listTeamMemberF = listTeamMember?.filter(
			teamMember =>
				teamMember.EMPNM.includes(textSearchMember) ||
				teamMember.EMP_NO.includes(textSearchMember),
		);
		setListTeamMemberFilter(listTeamMemberF);
	}, [textSearchMember]);

	const _onPressChipDate = (item: any) => {
		dispatch(setIDChipDate({ idChip: item.id }));
		switch (item.id) {
			case 'month':
				setFromDateLocal(timeFromFilterDashboardDefault);
				setToDateLocal(timeToFilterDashboardDefault);
				break;
			case 'year':
				const timeFrom = new Date(
					new Date(timeToFilterDashboardDefault.getFullYear(), 0, 1),
				);
				const timeTo = new Date(
					new Date(
						timeToFilterDashboardDefault.getFullYear(),
						timeToFilterDashboardDefault.getMonth() + 1,
						0,
					),
				);
				setFromDateLocal(timeFrom);
				setToDateLocal(timeTo);
				break;
			case 'custom':
				setFromDateLocal(timeFromFilterDashboardDefault);
				setToDateLocal(timeToFilterDashboardDefault);
				break;
			default:
				break;
		}
	};

	const _onPressItemSubTeam = (subTeam: ISubTeam) => {
		setSubTeamSelectedLocal(subTeam);

		setShowTeam(false);
		setShowMember(true);
	};

	const _onPressItemMember = (teamMember: ITeamMember) => {
		setTeamMemberSelectedLocal(teamMember);

		setShowMember(false);
	};

	const _onPressButtonFilter = async () => {
		const { password }: any = await Keychain.getGenericPassword();
		const objectData = {
			User_ID: dataUserSystem.EMP_NO,
			Password: password,
			MO_ID: teamMemberSelectedLocal?.EMP_NO || null,
			FROM_DATE: moment(fromDateLocal).format('DDMMYYYY'),
			TO_DATE: moment(toDateLocal).format('DDMMYYYY'),
			Sub_Team: subTeamSelectedLocal?.C_NO ?? null,
			LEVEL_TP:
				subTeamSelectedLocal?.LEVEL_TP === 0
					? '1'
					: subTeamSelectedLocal?.LEVEL_TP,
		};

		dispatch(setFromDate({ date: fromDateLocal }));
		dispatch(setToDate({ date: toDateLocal }));
		dispatch(setSubTeamSelected({ subTeamSelected: subTeamSelectedLocal }));
		dispatch(
			setTeamMemberSelected({ teamMemberSelected: teamMemberSelectedLocal }),
		);
		dispatch(getSummaryProgress(objectData));
		dispatch(getNPV(objectData));
		dispatch(getRecovery(objectData));
		dispatch(getDelinquent(objectData));
		dispatch(getInsuranceInformed(objectData));

		navigation.goBack();
	};

	const _onPressClear = () => {
		const listSubTeamFilterLeader: ISubTeam[] = listSubTeam.filter(
			(subTeam: ISubTeam) => subTeam.TEAM_LEADER === dataUserSystem.EMP_NO,
		);

		const subTeamDefault: ISubTeam =
			listSubTeamFilterLeader.length > 0
				? listSubTeamFilterLeader[0]
				: listSubTeam[0];

		setFromDateLocal(timeFromFilterDashboardDefault);
		setToDateLocal(timeToFilterDashboardDefault);
		setTeamMemberSelectedLocal(listTeamMember[0]);
		setSubTeamSelectedLocal(subTeamDefault);
	};

	const renderChipTime = ({ item, index }) => (
		<Chip
			key={index.toString()}
			mode="outlined"
			selected={item.id === idChipDate}
			selectedColor={item.id === idChipDate ? colors.primary : '#555'}
			style={{
				backgroundColor: '#fff',
				flex: 1,
				justifyContent: 'center',
				marginLeft: index !== 0 ? 8 : 0,
				paddingVertical: 2,
			}}
			textStyle={{
				fontWeight: item.id === idChipDate ? '600' : '500',
			}}
			onPress={() => _onPressChipDate(item)}
		>
			{item.label}
		</Chip>
	);

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					padding: 8,
					borderBottomColor: '#ddd',
					borderBottomWidth: 1,
				}}
			>
				<Button
					uppercase={false}
					style={{}}
					onPress={() => navigation.goBack()}
				>
					Cancel
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					Filter Data Dashboard
				</Text>
				<Button uppercase={false} onPress={() => _onPressClear()}>
					Clear
				</Button>
			</View>

			{doneLoadAnimated && (
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'android' ? undefined : 'padding'}
				>
					<View style={{ flex: 1, padding: 8 }}>
						<View style={{ flexDirection: 'row', marginTop: 8 }}>
							{listChipTime.map((item, index) =>
								renderChipTime({ item, index }),
							)}
						</View>
						{idChipDate === 'custom' && (
							<View
								style={{
									flexDirection: 'row',
									zIndex: 2,
									marginTop: 16,
								}}
							>
								<Card
									elevation={2}
									style={{ marginRight: 8, flex: 1, padding: 8 }}
								>
									<ButtonChooseDateTime
										label={'From'}
										modalMode={'date'}
										valueDisplay={moment(fromDateLocal).format('DD/MM/YYYY')}
										disableBorder={true}
										value={fromDateLocal}
										onHandleConfirmDate={setFromDateLocal}
									/>
								</Card>
								<Card elevation={2} style={{ flex: 1, padding: 8 }}>
									<ButtonChooseDateTime
										label={'To'}
										modalMode={'date'}
										valueDisplay={moment(toDateLocal).format('DD/MM/YYYY')}
										disableBorder={true}
										value={toDateLocal}
										onHandleConfirmDate={date => {
											if (date < fromDateLocal) {
												setFromDateLocal(date);
											}
											setToDateLocal(date);
										}}
									/>
								</Card>
							</View>
						)}

						<View style={{ marginTop: 16, marginHorizontal: -8 }}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									backgroundColor: '#fff',
									padding: 8,
								}}
							>
								<Text
									style={{
										flex: 1,
										color: '#555',
										fontWeight: '500',
									}}
								>
									View by team
								</Text>
								<Switch
									value={isViewByTeam}
									onValueChange={() => {
										dispatch(setHasViewByTeam({ isViewByTeam: !isViewByTeam }));
									}}
									style={{}}
								/>
							</View>

							{isViewByTeam && (
								<View>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											backgroundColor: '#fff',
											paddingHorizontal: 8,
											paddingVertical: 12,
											borderTopColor: '#ddd',
											borderTopWidth: 1,
										}}
										onPress={() => setShowTeam(oldStatus => !oldStatus)}
									>
										<Text
											style={{
												flex: 1,
												color: '#555',
												fontWeight: '500',
											}}
										>
											Select team
										</Text>
										<Text
											style={{
												color: '#555',
												fontWeight: '500',
												marginRight: 8,
											}}
										>
											{subTeamSelectedLocal?.STND_C_NM}
										</Text>
										<Icon
											as={Ionicons}
											name={
												isShowTeam
													? 'chevron-down-outline'
													: 'chevron-forward-outline'
											}
											size={7}
											color={'#666'}
										/>
									</TouchableOpacity>

									{isShowTeam && (
										<View style={{ padding: 8 }}>
											<Searchbar
												textAlign={'left'}
												placeholder="Search team"
												value={textSearchTeam}
												style={{ elevation: 0 }}
												inputStyle={{ fontSize: 14 }}
												onChangeText={(text: string) => setTextSearchTeam(text)}
											/>
											<FlatList
												data={listSubTeamFilter}
												extraData={listSubTeamFilter}
												style={{ maxHeight: 250 }}
												keyboardShouldPersistTaps="handled"
												keyExtractor={(_, index) => index.toString()}
												renderItem={({ item, index }) => (
													<TouchableWithoutFeedback
														onPress={() => _onPressItemSubTeam(item)}
													>
														<View
															style={{
																flexDirection: 'row',
																alignItems: 'center',
																paddingHorizontal: 12,
																height: 45,
																backgroundColor: '#fff',
																borderTopWidth: 0.5,
																borderTopColor: '#ddd',
															}}
														>
															<Text style={{ flex: 1 }}>{item.STND_C_NM}</Text>
															{subTeamSelectedLocal?.SubTeam ===
																item.SubTeam && (
																<Icon
																	as={Ionicons}
																	name="checkmark-outline"
																	size={7}
																	color={colors.primary}
																/>
															)}
														</View>
													</TouchableWithoutFeedback>
												)}
											/>
										</View>
									)}
								</View>
							)}

							{isViewByTeam && subTeamSelected && (
								<View>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											backgroundColor: '#fff',
											paddingHorizontal: 8,
											paddingVertical: 12,
											borderTopColor: '#ddd',
											borderTopWidth: isShowTeam ? 0 : 1,
										}}
										onPress={() => setShowMember(oldStatus => !oldStatus)}
									>
										<Text
											style={{
												flex: 1,
												color: '#555',
												fontWeight: '500',
											}}
										>
											Select team member
										</Text>
										<Text
											style={{
												color: '#555',
												fontWeight: '500',
												marginRight: 8,
											}}
										>
											{teamMemberSelectedLocal?.EMPNM}
										</Text>
										<Icon
											as={Ionicons}
											name={
												isShowMember
													? 'chevron-down-outline'
													: 'chevron-forward-outline'
											}
											size={7}
											color={'#666'}
										/>
									</TouchableOpacity>
									{isShowMember && (
										<View style={{ padding: 8 }}>
											<Searchbar
												textAlign={'left'}
												placeholder="Search member"
												value={textSearchMember}
												style={{ elevation: 0 }}
												inputStyle={{ fontSize: 14 }}
												onChangeText={(text: string) =>
													setTextSearchMember(text)
												}
											/>
											<FlatList
												data={listTeamMemberFilter}
												extraData={listTeamMemberFilter}
												style={{ maxHeight: 250 }}
												keyboardShouldPersistTaps="handled"
												keyExtractor={(_, index) => index.toString()}
												renderItem={({ item, index }) => (
													<TouchableWithoutFeedback
														onPress={() => _onPressItemMember(item)}
													>
														<View
															style={{
																flexDirection: 'row',
																alignItems: 'center',
																paddingHorizontal: 12,
																height: 45,
																backgroundColor: '#fff',
																borderTopWidth: 0.5,
																borderTopColor: '#ddd',
															}}
														>
															<Text style={{ flex: 1 }}>{item.EMPNM}</Text>
															{teamMemberSelectedLocal?.EMP_NO ===
																item.EMP_NO && (
																<Icon
																	as={Ionicons}
																	name="checkmark-outline"
																	size={7}
																	color={colors.primary}
																/>
															)}
														</View>
													</TouchableWithoutFeedback>
												)}
											/>
										</View>
									)}
								</View>
							)}
						</View>

						<Button
							mode="contained"
							style={{ marginTop: 20 }}
							onPress={() => _onPressButtonFilter()}
						>
							Filter
						</Button>
					</View>
				</KeyboardAvoidingView>
			)}
		</View>
	);
}
