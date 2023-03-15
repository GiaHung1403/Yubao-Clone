import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	FlatList,
	InteractionManager,
	RefreshControl,
	SafeAreaView,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { Card, FAB, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import LoadingFullScreen from '@components/LoadingFullScreen';

import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { ISeller, IUserSystem, IContact } from '@models/types';
import { Ionicons, Entypo } from '@expo/vector-icons';
import firestore from '@react-native-firebase/firestore';
import { getListContact } from '@actions/contact_action';
import * as Keychain from 'react-native-keychain';

import EventEmitter from '@utils/events';
interface ICustomerReducer {
	listSeller: ISeller[];
	loading: boolean;
}

interface IPropRowSellerItem {
	icon: string;
	isIconRight?: boolean;
	value: string;
	styleValue?: TextStyle;
	styleContainer?: ViewStyle;
	iconColor?: string;
	haveVote?: boolean;
	iconName?: any;
}

const rowItemValue = ({
	icon,
	iconColor,
	isIconRight,
	value,
	styleValue,
	styleContainer,
	haveVote,
	iconName,
}: IPropRowSellerItem) => (
	<View
		style={[
			{
				justifyContent: isIconRight ? 'flex-end' : 'flex-start',
				flexDirection: 'row',
				alignItems: 'center',
				flex: 1,
			},
			styleContainer,
		]}
	>
		{isIconRight || !icon ? null : (
			<Icon
				as={iconName}
				name={icon}
				size={6}
				color={iconColor ? iconColor : haveVote ? '#00FF00' : '#FF0000'}
			/>
		)}
		<Text style={[styleValue, { flex: 1 }]}>{value}</Text>
		{isIconRight && icon ? (
			<Icon
				as={iconName}
				name={icon}
				size={6}
				color={iconColor}
				marginRight={4}
			/>
		) : null}
	</View>
);

export function VotingListScreen(props: any) {
	const navigation: any = useNavigation();
	const route = useRoute();
	const dispatch = useDispatch();

	const { colors } = useTheme();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listSeller, loading }: ICustomerReducer = useSelector(
		(state: any) => state.customer_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [firstQuery, setFirstQuery] = useState('');
	const [valueQuestion, setValueQuestion] = useState<any>([]);
	const [countDep, setCountDep] = useState<any[]>([]);

	const [selectValue, setSelectValue] = useState<any>([]);

	const [checkDeadline, setCheckDeadline] = useState<any>([]);

	const [countVote, setCountVote] = useState(0);

	const I18n = useContext(LocalizationContext);
	const textSearch = 'Search';

	const isVN = I18n.locale === 'vi';

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			let dataQuestion = await firestore()
				.collection('Voting')
				.onSnapshot(questSnapshot => {
					const listDataQuestion: any = [];
					questSnapshot.forEach(item => {
						if (item.data().listUser.includes(dataUserSystem.EMP_NO))
							listDataQuestion.push({ data: item.data(), key: item.id });
						else if (item.data().listTeam.includes(dataUserSystem.DEPT_CODE))
							listDataQuestion.push({ data: item.data(), key: item.id });
						else if (item.data().department.includes(dataUserSystem.DEPT_CODE))
							listDataQuestion.push({ data: item.data(), key: item.id });
					});

					listDataQuestion.map(async (item, index) => {
						const doc = await firestore()
							.collection('Voting')
							.doc(item.key)
							.collection('listUserVote')
							.get();
						setCountVote(doc.size);
					});

					const listMapData = Promise.all(
						listDataQuestion.map(async (item, index) => {
							const doc = await firestore()
								.collection('Voting')
								.doc(item.key)
								.collection('listUserVote')
								.doc(dataUserSystem.EMP_NO)
								.get();

							const doc2 = await firestore()
								.collection('Voting')
								.doc(item.key)
								.collection('listUserVote')
								.get();
							return { ...item, voted: doc.exists, listCoutVote: doc2.size };
						}),
					);

					listMapData.then(item => {
						item.sort((a, b) => {
							return a.data.createAt < b.data.createAt ? 1 : -1;
						});
						setValueQuestion(item);
					});

					listMapData.then(item => {
						setSelectValue(item);
					});
					setDoneLoadAnimated(true);
				});
		});
	}, [listContact]);

	useEffect(() => {
		if (valueQuestion.length > 0) {
			EventEmitter.addEventListener('summitVote', async () => {
				let dataQuestion = await firestore()
					.collection('Voting')
					.onSnapshot(questSnapshot => {
						const listDataQuestion: any = [];
						questSnapshot.forEach(item => {
							if (item.data()?.listUser?.includes(dataUserSystem.EMP_NO))
								listDataQuestion.push({ data: item.data(), key: item.id });
							else if (item.data().listTeam.includes(dataUserSystem.DEPT_CODE))
								listDataQuestion.push({ data: item.data(), key: item.id });
							else if (
								item.data().department.includes(dataUserSystem.DEPT_CODE)
							)
								listDataQuestion.push({ data: item.data(), key: item.id });
						});
						const listMapData = Promise.all(
							listDataQuestion.map(async (item, index) => {
								const doc = await firestore()
									.collection('Voting')
									.doc(item.key)
									.collection('listUserVote')
									.doc(dataUserSystem.EMP_NO)
									.get();

								const doc2 = await firestore()
									.collection('Voting')
									.doc(item.key)
									.collection('listUserVote')
									.get();
								return { ...item, voted: doc.exists, listCoutVote: doc2.size };
							}),
						);
						listMapData.then(item => {
							item.sort((a, b) => {
								return a.data.createAt < b.data.createAt ? 1 : -1;
							});
							setValueQuestion(item);
						});

						listMapData.then(item => {
							setSelectValue(item);
						});
						setDoneLoadAnimated(true);
					});
			});
		}
	}, [valueQuestion]);

	useEffect(() => {
		(async function search() {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: '0',
					Branch: '-1',
					subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
				}),
			);
		})();
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		if (!firstQuery) {
			setSelectValue(valueQuestion);
			return;
		}

		const listSearch = valueQuestion?.filter(item =>
			item.data.VoteTitle.includes(firstQuery),
		);

		setSelectValue(listSearch);
	}, [firstQuery]);

	const getListUserInvice = (Dep, Team, User) => {
		let countDepart = 0;
		let countTeam = 0;
		Dep.forEach(value => {
			const temp = listContact.filter(item2 => item2.dept_code === value);
			countDepart += temp.length;
		});

		Team.forEach(value => {
			const temp = listContact.filter(item2 => item2.dept_code === value);
			countTeam += temp.length;
		});

		return countDepart + countTeam + User.length;
	};

	const onRefresh = async () => {
		InteractionManager.runAfterInteractions(async () => {
			let dataQuestion = await firestore()
				.collection('Voting')
				.onSnapshot(questSnapshot => {
					const listDataQuestion: any = [];
					questSnapshot.forEach(item => {
						if (item.data().listUser.includes(dataUserSystem.EMP_NO))
							listDataQuestion.push({ data: item.data(), key: item.id });
						else if (item.data().listTeam.includes(dataUserSystem.DEPT_CODE))
							listDataQuestion.push({ data: item.data(), key: item.id });
						else if (item.data().department.includes(dataUserSystem.DEPT_CODE))
							listDataQuestion.push({ data: item.data(), key: item.id });
					});

					listDataQuestion.map(async (item, index) => {
						const doc = await firestore()
							.collection('Voting')
							.doc(item.key)
							.collection('listUserVote')
							.get();
						setCountVote(doc.size);
					});

					const listMapData = Promise.all(
						listDataQuestion.map(async (item, index) => {
							const doc = await firestore()
								.collection('Voting')
								.doc(item.key)
								.collection('listUserVote')
								.doc(dataUserSystem.EMP_NO)
								.get();

							const doc2 = await firestore()
								.collection('Voting')
								.doc(item.key)
								.collection('listUserVote')
								.get();
							return { ...item, voted: doc.exists, listCoutVote: doc2.size };
						}),
					);

					listMapData.then(item => {
						item.sort((a, b) => {
							return a.data.createAt < b.data.createAt ? 1 : -1;
						});
						setValueQuestion(item);
					});

					listMapData.then(item => {
						setSelectValue(item);
					});
					setDoneLoadAnimated(true);
				});
		});
	};

	const _onPressItem = item => {
		navigation.navigate('VotingDetailScreen', {
			key: item,
			count: countDep,
		});
	};

	const getCreateName = value => {
		let createName: IContact[];
		createName = listContact?.filter(item =>
			item.emp_no.includes(value?.data.createBy.toString()),
		);
		return createName[0]?.emp_nm;
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Voting List'} />
			</View>

			<View style={{ flex: 1 }}>
				<Searchbar
					textAlign={'left'}
					placeholder={textSearch}
					onChangeText={query => setFirstQuery(query)}
					value={firstQuery}
					style={{ zIndex: 2, marginTop: 8, marginHorizontal: 8 }}
					inputStyle={{ fontSize: 14 }}
				/>
				{doneLoadAnimated ? (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingTop: 8 }}
						data={selectValue}
						keyExtractor={(item, index) => item?.key?.toString()}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={onRefresh}
							/>
						}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => {
							let today = new Date();
							let deadLine = item?.data?.deadLine.toDate();
							return (
								<Card
									style={{
										marginBottom: 8,
										marginHorizontal: 8,
										backgroundColor: '#fff',
									}}
								>
									<TouchableOpacity
										style={{
											flexDirection: 'row',
											padding: 8,
											alignItems: 'center',
										}}
										onPress={() => _onPressItem(item.key)}
									>
										<View style={{ marginLeft: 8, flex: 1 }}>
											{rowItemValue({
												icon: '',
												value: item?.data?.VoteTitle,
												styleValue: {
													marginRight: 24,
													fontWeight: '600',
													color: 'orange',
												},
												styleContainer: { marginBottom: 8 },
											})}

											<View style={{ flexDirection: 'row', marginBottom: 8 }}>
												{rowItemValue({
													icon: 'dot-single',
													value: 'Status',
													iconName: Entypo,
													haveVote: item?.voted,
													styleContainer: { flex: 1 },
												})}

												{rowItemValue({
													icon: 'hourglass-outline',
													iconName: Ionicons,
													isIconRight: true,
													value: item?.data?.deadLine.toDate().toDateString(),
													styleValue: {
														textAlign: 'left',
														color:
															(deadLine.getDate() - today.getDate() === 1 ||
																deadLine.getDate() - today.getDate() === 0) &&
															deadLine.getMonth() === today.getMonth()
																? '#FF6600'
																: deadLine.getTime() < today.getTime()
																? 'red'
																: 'black',
													},
													iconColor: '#2c82c9',
												})}
											</View>

											<View style={{ flexDirection: 'row', marginBottom: 8 }}>
												{rowItemValue({
													icon: 'person-circle-outline',
													iconName: Ionicons,
													value: getCreateName(item),
													iconColor: '#2c82c9',
													styleContainer: { flex: 1 },
												})}

												{rowItemValue({
													icon: 'time-outline',
													iconName: Ionicons,
													isIconRight: true,
													value: item?.data?.createAt.toDate().toDateString(),
													styleValue: { textAlign: 'left' },
													iconColor: '#2c82c9',
												})}
											</View>

											<View style={{ flexDirection: 'row', marginBottom: 8 }}>
												{rowItemValue({
													icon: 'people-circle-outline',
													iconName: Ionicons,
													value: getListUserInvice(
														item?.data.department,
														item?.data.listTeam,
														item?.data.listUser,
													),
													iconColor: '#2c82c9',
													styleContainer: { flex: 1 },
												})}

												{rowItemValue({
													icon: 'hand-left-outline',
													iconName: Ionicons,
													isIconRight: true,
													value: item?.listCoutVote,
													styleValue: { textAlign: 'center' },
													iconColor: '#2c82c9',
												})}
											</View>
										</View>
									</TouchableOpacity>
								</Card>
							);
						}}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</View>

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() => navigation.navigate('VotingCreateScreen', {})}
				/>
			</SafeAreaView>
		</View>
	);
}
