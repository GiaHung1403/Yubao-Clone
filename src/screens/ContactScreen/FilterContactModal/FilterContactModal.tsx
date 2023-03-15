import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	Platform,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import { Button, Searchbar, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListContact, setDepartmentSelected } from '@actions/contact_action';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { getListDepartment } from '@data/api';
import { IBranch, IDepartment, IUserSystem } from '@models/types';
import { useNavigation } from '@react-navigation/native';

interface IContactReducer {
	departmentSelected: IDepartment;
	branchSelected: IBranch;
}

export function FilterContactModal(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { query } = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { departmentSelected }: IContactReducer = useSelector(
		(state: any) => state.contact_reducer,
	);

	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [listDepartment, setListDepartment] = useState<IDepartment[]>();
	const [listDepartmentFilter, setListDepartmentFilter] =
		useState<IDepartment[]>();
	const [textSearch, setTextSearch] = useState<string>('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const { password }: any = await Keychain.getGenericPassword();

			const responseDepartment: any = await getListDepartment({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
			});

			setListDepartment(responseDepartment);
			setListDepartmentFilter(responseDepartment);
			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (!textSearch) {
			setListDepartmentFilter(listDepartment);
			return;
		}

		const listDepartmentF = listDepartment?.filter(department =>
			department.STND_C_NM.toLowerCase().includes(textSearch.toLowerCase()),
		);
		setListDepartmentFilter(listDepartmentF);
	}, [textSearch]);

	const _onPressItemDepartment = async (department: IDepartment) => {
		navigation.goBack();
		setTimeout(() => {
			dispatch(
				setDepartmentSelected({
					departmentSelected:
						departmentSelected?.C_NO === department.C_NO
							? undefined
							: department,
				}),
			);

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query,
					Dept_Code:
						departmentSelected?.C_NO === department.C_NO
							? '0'
							: department.C_NO,

					Branch: '-1',
					subteam: department.ST_C === 'Department' ? '' : department.C_NO,
				}),
			);

			// dispatch(
			// 	getListContact({
			// 		User_ID: dataUserSystem.EMP_NO,
			// 		Password: '',
			// 		query,
			// 		Dept_Code:
			// 			departmentSelected?.ST_C === 'Department'
			// 				? departmentSelected?.C_NO
			// 				: '0',
			// 		Branch: '-1',
			// 		subteam:
			// 			departmentSelected?.ST_C === 'Department'
			// 				? ''
			// 				: departmentSelected?.C_NO,
			// 	}),
			// );
		}, 500);
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
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
					Filter Data Contact
				</Text>
				<Button uppercase={false} style={{}}>
					{' '}
				</Button>
			</View>

			{/* View Body */}
			{doneLoadAnimated ? (
				<View
					style={{ flex: 1, paddingHorizontal: 8, zIndex: 1, paddingTop: 8 }}
				>
					{/* Filter department */}
					<Searchbar
						textAlign={'left'}
						placeholder="Search department - branch"
						value={textSearch}
						inputStyle={{ fontSize: 14 }}
						style={{ zIndex: 2 }}
						onChangeText={(text: string) => setTextSearch(text)}
					/>
					<FlatList
						data={listDepartmentFilter}
						style={{ flex: 1, paddingTop: 8 }}
						keyExtractor={(_, index) => index.toString()}
						showsVerticalScrollIndicator={false}
						keyboardShouldPersistTaps={'handled'}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<TouchableWithoutFeedback
								onPress={() => _onPressItemDepartment(item)}
							>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										paddingHorizontal: 12,
										height: 45,
										backgroundColor: '#fff',
										borderTopWidth: index === 0 ? 0 : 0.5,
										borderTopColor: '#ddd',
									}}
								>
									<Text style={{ flex: 1 }}>{item.STND_C_NM}</Text>
									{item.C_NO === departmentSelected?.C_NO && (
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
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
