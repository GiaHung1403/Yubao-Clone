import { getListContact } from '@actions/contact_action';
import { setDepartmentSelected } from '@actions/contact_action';
import AvatarBorder from '@components/AvatarBorder';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import { getListHighest } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import { ModalChooseUserEnum } from '@models/ModalChooseUserEnum';
import {
	IContact,
	IDepartment,
	IGeneralUserChoose,
	IUserLoginRC,
	IUserSystem,
} from '@models/types';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	Platform,
	RefreshControl,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Button, Card, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

interface IPropsRouteParams {
	listContactPersonExisted: string[];
	deptCode?: string;
	type?: ModalChooseUserEnum;
	screenBack: string;
}

interface IAuthReducer {
	dataUserSystem: IUserSystem;
	dataUserRC: IUserLoginRC;
}

interface IContactReducer {
	listContact: IContact[];
	listContactFilter: IContact[];
	loading: boolean;
	departmentSelected: IDepartment;
}

export function ChooseUserModal(props: any) {
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const navigation: any = useNavigation();
	const {
		listContactPersonExisted,
		deptCode,
		type,
		screenBack,
	}: IPropsRouteParams = props.route.params;

	const { dataUserSystem }: IAuthReducer = useSelector(
		(state: any) => state.auth_reducer,
	);
	const { listContactFilter, loading, departmentSelected }: IContactReducer =
		useSelector((state: any) => state.contact_reducer);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [generalUserChoose, setGeneralUserChoose] =
		useState<IGeneralUserChoose>();
	const [listContactPersonSelected, setListContactPersonSelected] = useState<
		string[]
	>(listContactPersonExisted);
	const [firstQuery, setFirstQuery] = useState('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!doneLoadAnimated) {
			return;
		}

		(async function search() {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;

			if (type !== 'all' && type) {
				const response = (await getListHighest({
					User_ID: dataUserSystem.EMP_NO,
				})) as IGeneralUserChoose;
				setGeneralUserChoose(response);
				return;
			}

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					query: firstQuery,
					Dept_Code: departmentSelected || deptCode || '0',
					Branch: '-1',
					subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
					isFilter: true,
				}),
			);
		})();
	}, [doneLoadAnimated, firstQuery]);

	const _onPressButtonOK = async () => {
		dispatch(
			setDepartmentSelected({
				departmentSelected: undefined,
			}),
		);
		const credentials: any = await Keychain.getGenericPassword();
		const { password } = credentials;
		dispatch(
			getListContact({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				query: '',
				Dept_Code: '0',
				Branch: '-1',
				subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
			}),
		);
		switch (type) {
			case ModalChooseUserEnum.RELATED:
				navigation.navigate(screenBack, {
					listApproverSelected: listContactPersonSelected,
				});
				return;
			default:
				navigation.navigate(screenBack, { listContactPersonSelected });
				return;
		}
	};

	const _onPressItem = async item => {
		await setListContactPersonSelected(listOld => {
			const listNew = [...listOld];
			const indexOfItem = listNew.indexOf(item.emp_no);

			if (indexOfItem > -1) {
				listNew.splice(indexOfItem, 1);
			} else {
				listNew.push(item.emp_no);
			}
			return listNew;
		});

		switch (type) {
			case ModalChooseUserEnum.HIGHEST:
				navigation.navigate(screenBack, {
					idHighestAuthoritySelected: item.emp_no,
				});
				return;
			case ModalChooseUserEnum.ON_BEHALF:
				navigation.navigate(screenBack, { idOnBehalfSelected: item.emp_no });
				return;
		}
	};

	const onRefresh = async () => {
		dispatch(
			getListContact({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: firstQuery,
				Dept_Code: departmentSelected || deptCode || '0',
				Branch: '-1',
				subteam: dataUserSystem.EMP_NO.includes('T') ? '' : undefined,
				isFilter: true,
			}),
		);
	};

	const getListByType = () => {
		switch (type) {
			case ModalChooseUserEnum.ALL:
				const listSort = listContactFilter
					?.sort((a, b) => (a.div_nm > b.div_nm ? 1 : -1))
					.filter(
						item =>
							item.emp_no.includes(firstQuery) ||
							item.emp_nm.includes(firstQuery),
					);
				const listUserChoose = listSort.filter(item =>
					listContactPersonSelected.includes(item.emp_no),
				);
				const listUserNotChoose = listSort.filter(
					item => !listContactPersonSelected.includes(item.emp_no),
				);

				return [...listUserChoose, ...listUserNotChoose].slice(
					0,
					listContactPersonSelected.length > 20
						? listContactPersonSelected.length
						: 20,
				);
			case ModalChooseUserEnum.HIGHEST:
				const listHighestConvert = generalUserChoose?.lstHighest
					.map(item => ({
						emp_no: item.emp_No,
						emp_nm: item.lst_NM,
					}))
					.filter(
						item =>
							item.emp_no.includes(firstQuery) ||
							item.emp_nm.includes(firstQuery),
					);

				const listHighestChoose =
					listHighestConvert?.filter(item =>
						listContactPersonSelected.includes(item.emp_no),
					) || ([] as any[]);
				const listHighestNotChoose =
					listHighestConvert?.filter(
						item => !listContactPersonSelected.includes(item.emp_no),
					) || ([] as any[]);
				return [...listHighestChoose, ...listHighestNotChoose].slice(
					0,
					listContactPersonSelected.length > 20
						? listContactPersonSelected.length
						: 20,
				);
			case ModalChooseUserEnum.ON_BEHALF:
				const listOnBehalfConvert = generalUserChoose?.lstOnbehalves
					.map(item => ({
						emp_no: item.emp_No,
						emp_nm: item.lst_NM,
					}))
					.filter(
						item =>
							item.emp_no.includes(firstQuery) ||
							item.emp_nm.includes(firstQuery),
					);
				const listOnBehalfChoose =
					listOnBehalfConvert?.filter(item =>
						listContactPersonSelected.includes(item.emp_no),
					) || ([] as any[]);
				const listOnBehalfNotChoose =
					listOnBehalfConvert?.filter(
						item => !listContactPersonSelected.includes(item.emp_no),
					) || ([] as any[]);
				return [...listOnBehalfChoose, ...listOnBehalfNotChoose].slice(
					0,
					listContactPersonSelected.length > 20
						? listContactPersonSelected.length
						: 20,
				);
			case ModalChooseUserEnum.RELATED:
				const listRelatedConvert = generalUserChoose?.lstRelated
					.map(item => ({
						emp_no: item.emp_ID,
						emp_nm: item.tit,
					}))
					.filter(
						item =>
							item.emp_no.includes(firstQuery) ||
							item.emp_nm.includes(firstQuery),
					);
				const listRelatedChoose =
					listRelatedConvert?.filter(item =>
						listContactPersonSelected.includes(item.emp_no),
					) || ([] as any[]);
				const listRelatedNotChoose =
					listRelatedConvert?.filter(
						item => !listContactPersonSelected.includes(item.emp_no),
					) || ([] as any[]);
				return [...listRelatedChoose, ...listRelatedNotChoose].slice(
					0,
					listContactPersonSelected.length > 20
						? listContactPersonSelected.length
						: 20,
				);
			default:
				return listContactFilter || [];
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			{/* View Header */}
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
					Close
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					Choose Contact Person
				</Text>
				<Button uppercase={false} style={{}} onPress={() => _onPressButtonOK()}>
					{'OK'}
				</Button>
			</View>

			<Card style={{ marginTop: 8, marginHorizontal: 8 }} elevation={3}>
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
						size={6}
						color={'#666'}
					/>
				</TouchableOpacity>
			</Card>

			<Searchbar
				placeholder={'Search employee name or employee ID '}
				onChangeText={query => setFirstQuery(query)}
				value={firstQuery}
				style={{ zIndex: 2, marginHorizontal: 8, marginTop: 8 }}
				inputStyle={{ fontSize: 14 }}
				onFocus={() => setFirstQuery('')}
			/>

			{/* View Body */}
			{doneLoadAnimated ? (
				<View style={{ flex: 1, zIndex: 1 }}>
					<FlatList
						data={getListByType()}
						style={{ flex: 1, paddingTop: 8, backgroundColor: '#fff' }}
						keyExtractor={(_, index) => index.toString()}
						extraData={firstQuery}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'handled'}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						refreshControl={
							<RefreshControl
								tintColor={colors.primary}
								colors={[colors.primary, Color.waiting, Color.approved]}
								refreshing={loading}
								onRefresh={onRefresh}
							/>
						}
						renderItem={({ item, index }) => (
							<TouchableOpacity onPress={() => _onPressItem(item)}>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										paddingHorizontal: 12,
										paddingVertical: 8,
										backgroundColor: '#fff',
										borderTopWidth: index === 0 ? 0 : 0.5,
										borderTopColor: '#ddd',
									}}
								>
									<AvatarBorder username={item.emp_no} size={30} />
									<Text style={{ flex: 1, marginLeft: 12 }}>
										{item.emp_no} - {item.emp_nm}
									</Text>
									{listContactPersonSelected.includes(item.emp_no) && (
										<Icon
											as={Ionicons}
											name="checkmark-outline"
											size={7}
											color={colors.primary}
										/>
									)}
								</View>
							</TouchableOpacity>
						)}
					/>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
