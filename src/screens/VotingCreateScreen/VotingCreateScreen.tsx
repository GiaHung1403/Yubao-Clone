import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	View,
	TouchableWithoutFeedback,
	Text,
	TouchableOpacity,
	FlatList,
	KeyboardAvoidingView,
	Platform,
} from 'react-native';
import { Button, Card, useTheme, Searchbar, Title } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInputCustomComponentForVote from '@components/TextInputCustomComponentForVote';
import { IUserSystem, ISubTeam, IContact } from '@models/types';
import firestore from '@react-native-firebase/firestore';
import { Icon } from 'native-base';
import { Ionicons, Feather } from '@expo/vector-icons';
import * as Keychain from 'react-native-keychain';
import { getListDepartment } from '@data/api';
import moment from 'moment';
import AvatarBorder from '@components/AvatarBorder';

import styles from './styles';

// interface INationConvert {
// 	label: string;
// 	value: string;
// }

interface IPropsItemChip {
	userID: string;
	name: string;
	index: number;
	onPress?: () => void;
}

export function VotingCreateScreen(props: any) {
	const dispatch = useDispatch();
	const navigation: any = useNavigation();
	const { listContactPersonSelected } = props.route.params;

	const [listDepartment, setListDepartment] = useState<ISubTeam[]>([]);
	const [selectDepartment, setSelectDepartment] = useState<ISubTeam[]>([]);

	const [listTeam, setListTeam] = useState<ISubTeam[]>([]);
	const [getListTeam, setGetListTeam] = useState<ISubTeam[]>([]);

	const { colors } = useTheme();
	const [showDep, setShowDep] = useState(false);

	const [showTeam, setShowTeam] = useState(false);
	const [showAllTeam, setShowAllTeam] = useState(false);

	const [listContactSelectedConvert, setListContactSelectedConvert] = useState<
		IContact[]
	>([]);

	const [textSearchDep, setTextSearchDep] = useState('');
	const [textSearchTeam, setTextSearchTeam] = useState('');
	const [selectTeam, setSelectedTeam] = useState<String[]>([]);
	const [selectDep, setSelectDep] = useState<String[]>([]);
	const [deadLine, setDeadLine] = useState<Date>(new Date());
	const [listChoose, setNewChoose] = useState<any>([
		{ label: '', value: 1 },
		{ label: '', value: 2 },
	]);

	const listC: any = [];
	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	useEffect(() => {}, [selectDepartment]);

	const [loading, setLoading] = useState<boolean>(false);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [titleName, setTitleName] = useState<string>('');
	const [listNotify, setListNotify] = useState<any[]>([]);
	const [checkChoose, setCheckChoose] = useState(false);

	const _onPressButtonSave = async () => {
		if (!titleName) {
			Alert.alert('Alert', 'Please input Title!');
			return;
		} else if (listNotify.length === 0) {
			Alert.alert('Alert', "You haven't invited anyone yet!");
			return;
		} else if (checkChoose) {
			Alert.alert('Alert', 'Please input you choose!');
			return;
		}
		const today = new Date();

		if (
			deadLine?.getDate() < today.getDate() ||
			deadLine?.getMonth() < today.getMonth()
		) {
			Alert.alert('Alert', 'Deadline not invalid');
			return;
		}

		setLoading(true);
		try {
			await firestore()
				.collection('Voting')
				.add({
					VoteTitle: titleName,
					createAt: firestore.Timestamp.now(),
					createBy: dataUserSystem.EMP_NO,
					department: selectDep,
					listUser: listContactPersonSelected || [],
					listVote: listChoose,
					listTeam: selectTeam,
					deadLine: firestore.Timestamp.fromDate(deadLine),
				});

			Alert.alert('Thông báo', 'Submit thành công!');

			// await postNotifyVote({
			// 	topic: listNotify,
			// 	title: 'Voting',
			// 	user: dataUserSystem.EMP_NO,
			// 	content: `<p>${titleName}</p>`,
			// 	short_content: titleName,
			// });
		} catch (error: any) {
			Alert.alert('Error', error.message);
		}
		setLoading(false);
		navigation.navigate('VotingListScreen');
	};

	useEffect(() => {
		const today = new Date();
		let tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1);
		setDeadLine(tomorrow);
	}, []);

	useEffect(() => {
		if (!textSearchDep.length) {
			setSelectDepartment(listDepartment);
			return;
		}
		const listSubTeamF = listDepartment?.filter(subTeam =>
			subTeam.STND_C_NM.includes(textSearchDep),
		);
		setSelectDepartment(listSubTeamF);
	}, [textSearchDep]);

	useEffect(() => {
		if (!textSearchTeam.length) {
			setGetListTeam(listTeam);
			return;
		}
		const listSubTeamF = listTeam?.filter(subTeam =>
			subTeam.STND_C_NM.includes(textSearchTeam),
		);
		setGetListTeam(listSubTeamF);
	}, [textSearchTeam]);

	useEffect(() => {
		const list = listDepartment.filter(item => item.SubTeam.includes('-'));
		setListTeam(list);
		setGetListTeam(list);
	}, [listDepartment]);

	useEffect(() => {
		if (selectDep.length > 0) setShowAllTeam(true);
		else setShowAllTeam(false);
	}, [selectDep]);

	//Choose user
	useEffect(() => {
		if (listContactPersonSelected) {
			const listConvert: IContact[] = listContactPersonSelected?.map(
				contactPersonID => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === contactPersonID,
					);
				},
			) as IContact[];
			setListContactSelectedConvert(listConvert.filter(item => item));
		}
	}, [listContactPersonSelected]);

	const _onPressItemSubTeam = (subTeam: ISubTeam) => {
		if (selectTeam.includes(subTeam.SubTeam)) {
			selectTeam.filter((item, index) => {
				if (item === subTeam.SubTeam) selectTeam.splice(index, 1);
			});
			const tempList = [...selectTeam];
			setSelectedTeam(tempList);
		} else setSelectedTeam(item => [...item, subTeam.SubTeam]);
		//setShowDep(false);
	};

	//Get all user from department and team
	useEffect(() => {
		setListNotify([]);
		let temp = selectDep.concat(selectTeam);
		setListNotify(temp);
		if (listContactPersonSelected != null)
			listContactPersonSelected.forEach(item => {
				let temp = 'user_' + item.toString();
				setListNotify(item2 => [...item2, temp]);
			});
	}, [selectDep, selectTeam, listContactPersonSelected]);

	const _onPressItemDep = (subTeam: ISubTeam) => {
		if (selectDep.includes(subTeam.SubTeam)) {
			selectDep.filter((item, index) => {
				if (item === subTeam.SubTeam) selectDep.splice(index, 1);
			});
			const tempList = [...selectDep];
			setSelectDep(tempList);
		} else setSelectDep(item => [...item, subTeam.SubTeam]);
		//setShowDep(false);
	};

	const _onPressNewChoose = (item: any) => {
		setNewChoose(value => [...value, item]);
	};

	const _onTextInPutChangce = (text, index) => {
		let newData = [...listChoose];
		newData[index] = { ...newData[index], label: text };
		setNewChoose(newData);
	};

	const _onPressX = index => {
		if (index < 2) {
			if (listChoose.length > 2) {
				listChoose.splice(listChoose.length - 1, 1);
				setNewChoose([...listChoose]);
			} else {
				Alert.alert('Alert', 'Need to have more than 1 choose!!!');
			}
		} else {
			listChoose.splice(index, 1);

			let newData = [...listChoose];
			listChoose.forEach((item, index) => {
				newData[index] = { ...newData[index], value: index + 1 };
			});
			setNewChoose([...newData]);
		}
	};

	const formatUserID = ({ userID, name }) =>
		`${userID}.${name
			?.replace(/ /g, '.')
			.substr(0, name.indexOf('(') > -1 ? name.indexOf('(') - 1 : undefined)}`;

	const _onPressOpenContactPersonModal = () => {
		const convertListContactSelected = listContactSelectedConvert?.map(
			item => item?.emp_no,
		);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			deptCode: '0',
			screenBack: 'VotingCreateScreen',
		});
	};

	const renderItemChip = ({ userID, name, index, onPress }: IPropsItemChip) => (
		<TouchableOpacity
			key={index.toString()}
			style={{
				marginRight: 8,
				flexDirection: 'row',
				alignItems: 'center',
			}}
			onPress={onPress}
		>
			<View
				style={{
					backgroundColor: '#d5d5d5',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: 50,
					flexDirection: 'row',
					paddingVertical: 4,
					paddingHorizontal: 16,
				}}
			>
				<AvatarBorder username={userID} size={25} />
				<Text
					style={{
						color: '#000',
						marginLeft: 8,
					}}
				>
					{name}
				</Text>
			</View>
		</TouchableOpacity>
	);

	useEffect(() => {
		listChoose.forEach((item, index) => {
			if (!item?.label) {
				setCheckChoose(true);
			} else setCheckChoose(false);
		});
	}, [listChoose]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const { password }: any = await Keychain.getGenericPassword();

			const responseDepartment: any = await getListDepartment({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			setListDepartment(responseDepartment);
			setSelectDepartment(responseDepartment);
			setDoneLoadAnimated(true);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Create New Vote'} />
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				style={{ flex: 1 }}
			>
				{doneLoadAnimated ? (
					<ScrollView>
						<View>
							<View style={{ padding: 8 }}>
								<TextInputCustomComponentForVote
									label="Title"
									placeholder="Title"
									style={{ marginTop: 8 }}
									value={titleName}
									multiline={true}
									onChangeText={text => setTitleName(text)}
									inputStyle={{ fontSize: 30 }}
									viewHeight={100}
									inputTextHeight={50}
								/>
								<View
									style={{ borderBottomColor: '#BBBBBB', borderBottomWidth: 1 }}
								>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											alignItems: 'center',
											paddingVertical: 12,
											borderTopColor: '#ddd',
											borderTopWidth: 1,
										}}
										onPress={() => setShowDep(oldStatus => !oldStatus)}
									>
										<Text
											style={{
												flex: 1,
												color: '#555',
												fontWeight: '500',
											}}
										>
											Select Department
										</Text>
										<Text
											style={{
												color: '#555',
												fontWeight: '500',
												marginRight: 8,
											}}
										>
											{selectDep.length > 3
												? `${selectDep[0]}; ${selectDep[1]}; ${selectDep[2]}; ...`
												: selectDep.map(item => item + '; ')}
										</Text>
										<Icon
											as={Ionicons}
											name={
												showDep
													? 'chevron-down-outline'
													: 'chevron-forward-outline'
											}
											size={7}
											color={'#666'}
										/>
									</TouchableOpacity>

									{showDep && (
										<View style={{ padding: 8 }}>
											<Searchbar
												textAlign={'left'}
												placeholder="Search Department"
												value={textSearchDep}
												style={{ elevation: 0 }}
												inputStyle={{ fontSize: 14 }}
												onChangeText={(text: string) => setTextSearchDep(text)}
											/>

											<ScrollView style={{ height: 300 }}>
												{selectDepartment?.map((item, index) => {
													return (
														<TouchableWithoutFeedback
															onPress={() => _onPressItemDep(item)}
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
																<Text style={{ flex: 1 }}>
																	{item?.STND_C_NM}
																</Text>
																{selectDep.includes(item?.SubTeam) && (
																	<Icon
																		as={Ionicons}
																		name="checkmark-outline"
																		size={7}
																		color={colors.primary}
																	/>
																)}
															</View>
														</TouchableWithoutFeedback>
													);
												})}
											</ScrollView>
										</View>
									)}
								</View>

								<View
									style={{ borderBottomColor: '#BBBBBB', borderBottomWidth: 1 }}
								>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											alignItems: 'center',
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
											Select Team
										</Text>
										<Text
											style={{
												color: '#555',
												fontWeight: '500',
												marginRight: 8,
											}}
										>
											{selectTeam.length > 3
												? `${selectTeam[0]}; ${selectTeam[1]}; ${selectTeam[2]}; ...`
												: selectTeam.map(item => item + '; ')}
										</Text>
										<Icon
											as={Ionicons}
											name={
												showTeam
													? 'chevron-down-outline'
													: 'chevron-forward-outline'
											}
											size={7}
											color={'#666'}
										/>
									</TouchableOpacity>

									{showTeam && (
										<View style={{ padding: 8 }}>
											<Searchbar
												textAlign={'left'}
												placeholder="Search Team"
												value={textSearchTeam}
												style={{ elevation: 0 }}
												inputStyle={{ fontSize: 14 }}
												onChangeText={(text: string) => setTextSearchTeam(text)}
											/>
											<ScrollView style={{ height: 300 }}>
												{getListTeam?.map((item, index) => {
													return (
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
																<Text style={{ flex: 1 }}>
																	{item?.STND_C_NM}
																</Text>
																{selectTeam.includes(item?.SubTeam) && (
																	<Icon
																		as={Ionicons}
																		name="checkmark-outline"
																		size={7}
																		color={colors.primary}
																	/>
																)}
															</View>
														</TouchableWithoutFeedback>
													);
												})}
											</ScrollView>
										</View>
									)}
								</View>

								<View style={{ marginVertical: 8, paddingTop: 20 }}>
									<Text
										style={{
											fontWeight: '600',
											color: '#555',
											marginBottom: 8,
										}}
									>
										Optional Person
									</Text>
									<ScrollView
										horizontal={true}
										showsHorizontalScrollIndicator={false}
									>
										<TouchableOpacity
											style={{
												width: 40,
												height: 40,
												borderRadius: 25,
												backgroundColor: '#dfdfdf',
												justifyContent: 'center',
												alignItems: 'center',
												marginRight: 10,
											}}
											onPress={() => _onPressOpenContactPersonModal()}
										>
											<Text>+</Text>
										</TouchableOpacity>
										{listContactSelectedConvert?.map((contactPerson, index) =>
											renderItemChip({
												userID: contactPerson?.emp_no,
												name: contactPerson?.emp_nm,
												index,
												onPress: () => _onPressOpenContactPersonModal(),
											}),
										)}
									</ScrollView>
								</View>

								<View>
									{listChoose?.map((item, index) => {
										return (
											<View>
												<TextInputCustomComponentForVote
													label="Title"
													placeholder="Choose"
													style={{ marginTop: 8 }}
													value={item.label}
													multiline={true}
													onChangeText={text =>
														_onTextInPutChangce(text, index)
													}
													inputStyle={{ fontSize: 17 }}
													viewHeight={60}
													inputTextHeight={25}
													showX={index > 1 ? true : false}
													onPressX={() => {
														_onPressX(index);
													}}
												/>
											</View>
										);
									})}
									<TouchableOpacity
										style={{ padding: 8, paddingTop: 25 }}
										onPress={() =>
											_onPressNewChoose({
												label: '',
												value: listChoose.length + 1,
											})
										}
									>
										<View style={{ flexDirection: 'row' }}>
											<Icon
												as={Feather}
												name="plus"
												size={7}
												color={colors.primary}
												marginRight={5}
											/>
											<Text
												style={{ color: colors.primary, alignSelf: 'center' }}
											>
												New Choose
											</Text>
										</View>
									</TouchableOpacity>
								</View>
								<View
									style={{
										marginTop: 20,
										marginRight: 8,
										padding: 8,
										borderTopWidth: 0.5,
										borderTopColor: '#BBBBBB',
									}}
								>
									<ButtonChooseDateTime
										label={'Deadline'}
										modalMode={'date'}
										valueDisplay={moment(deadLine).format('DD/MM/YYYY')}
										disableBorder={true}
										value={deadLine}
										onHandleConfirmDate={setDeadLine}
									/>
								</View>
							</View>

							<Button
								mode={'contained'}
								uppercase={false}
								style={{ margin: 8 }}
								loading={loading}
								onPress={_onPressButtonSave}
							>
								{loading ? 'Loading' : 'Save'}
							</Button>

							<SafeAreaView style={{ height: 60 }} />
						</View>
					</ScrollView>
				) : (
					<LoadingFullScreen />
				)}
			</KeyboardAvoidingView>
		</View>
	);
}
