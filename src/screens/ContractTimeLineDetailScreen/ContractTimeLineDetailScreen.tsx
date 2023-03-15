import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	Keyboard,
	Platform,
	RefreshControl,
	SafeAreaView,
	ScrollView,
	Text,
	TextStyle,
	View,
	ViewStyle,
} from 'react-native';
import { Button, Card, useTheme, List } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCustomer } from '@actions/customer_action';
import Header from '@components/Header';
import Color from '@config/Color';
import { LocalizationContext } from '@context/LocalizationContext';
import { ICustomer, IUserSystem } from '@models/types';
import { removeVietnameseTones } from '@utils';

import RadioForm, {
	RadioButton,
	RadioButtonInput,
	RadioButtonLabel,
} from 'react-native-simple-radio-button';
import LoadingFullScreen from '@components/LoadingFullScreen/LoadingFullScreen';
import {
	getListContract_TimeLine_Detail,
	checkItem_Contract_Timeline,
} from '@data/api';

interface ICustomerReducer {
	listCustomer: ICustomer[];
	loading: boolean;
}

export function ContractTimeLineDetailScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const route = useRoute();
	const dispatch = useDispatch();
	let countCheckItem: any = [];

	const { contractInfo, step } = props.route.params;
	// const { listCustomer, loading }: ICustomerReducer = useSelector(
	// 	(state: any) => state.customer_reducer,
	// );
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const [loading, setLoading] = useState(false);
	const [listData, setListData] = useState<any>([]);

	const I18n = useContext(LocalizationContext);

	const isVN = I18n.locale === 'vi';
	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(false);
			const data: any = await getListContract_TimeLine_Detail({
				apno: contractInfo.apno,
				cnid: contractInfo.cnid,
				action: 'GET_DTL_STEP',
				emp_No: dataUserSystem.EMP_NO,
				step_Id: step === '9' ? '11' : step,
			});
			step === '4' ? convertStep_4Data(data) : convertStep_9Data(data);
			setDoneLoadAnimated(true);
		});
	}, [step]);

	const convertStep_4Data = data => {
		let convertData: any = [];
		let temp: any = [];
		data.forEach(item => {
			if (item.step_nm.includes('.')) {
				temp.push(item);
			} else {
				temp = [];
				convertData.push({
					title: `${item.step_nm}. ${item.desc_nm}`,
					itemCheck: temp,
					state: true,
				});
			}
		});
		setListData(convertData);
	};

	const convertStep_9Data = data => {
		let convertData: any = [];
		let temp: any = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i].step_nm === data[i + 1]?.step_nm && data[i + 1].step_nm) {
				temp.push(data[i]);
			} else {
				temp.push(data[i]);
				convertData.push({
					title: `${data[i].step_nm}`,
					itemCheck: temp,
					state: true,
				});
				temp = [];
			}
		}
		// console.log(convertData);
		setListData(convertData);
	};

	// const handlePress = (index ) => setExpanded(!expanded);
	const handlePress = index => {
		const temp: any = [...listData];
		temp[index] = { ...temp[index], state: !temp[index].state };
		setListData(temp);
	};

	const on_CheckItem = stepId => {
		if (countCheckItem.includes(stepId)) {
			const ID = countCheckItem.findIndex(item => item === stepId);
			countCheckItem.splice(ID, 1);
		} else {
			countCheckItem.push(stepId);
		}
	};

	const _onConfirm = async () => {
		setLoading(true);
		if (countCheckItem.length < 8 && step === 4) {
			Alert.alert('Alert', 'Choose at least 8 item');
			setLoading(false);
		} else {
			await checkItem_Contract_Timeline({
				apno: contractInfo.apno,
				cnid: contractInfo.cnid,
				action: step === '9' ? 'INS_STEP_HIS_DTL' : 'REQUEST_CONFIRM_STEP',
				emp_No: dataUserSystem.EMP_NO,
				step_Id: step === '9' ? '11' : step,
				data_Bit: countCheckItem.toString(),
			});
			navigation.goBack();
		}
	};

	const itemView = (itemRadio, indexRadio, index) => {
		itemRadio.data_value_mo ? countCheckItem.push(itemRadio.step_id) : null;
		return (
			<View style={{ flexDirection: 'row' }}>
				<View style={{ alignSelf: 'center' }}>
					<RadioButton labelHorizontal={true} key={indexRadio}>
						<RadioButtonInput
							obj={itemRadio}
							index={indexRadio}
							isSelected={itemRadio.data_value_mo}
							onPress={() => {
								const temp: any = [...listData];
								const newObj: any = temp[index].itemCheck;
								newObj[indexRadio] = {
									...newObj[indexRadio],
									data_value_mo: !newObj[indexRadio].data_value_mo,
								};
								temp[index] = { ...temp[index], itemCheck: newObj };
								setListData(temp);
							}}
							borderWidth={1}
							buttonInnerColor={colors.primary}
							// buttonOuterColor={
							// 	listValueCreditProgress[index] === itemRadio.value
							// 		? colors.primary
							// 		: '#5a5a5a'
							// }
							buttonSize={12}
							buttonOuterSize={20}
						/>
					</RadioButton>
				</View>
			</View>
		);
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header
					title={`Step ${step}`}
					isShowButtonImage={true}
					buttonImageName={'git-branch-outline'}
					onPressButton={() =>
						navigation.navigate('FullListContractTimeLineScreen', {
							contractInfo,
						})
					}
				/>
			</View>

			<SafeAreaView style={{ flex: 1 }}>
				{doneLoadAnimated ? (
					<FlatList
						keyboardShouldPersistTaps="handled"
						style={{ paddingTop: 8 }}
						data={listData}
						keyExtractor={(_, index) => index.toString()}
						// refreshControl={
						// 	<RefreshControl
						// 		tintColor={colors.primary}
						// 		colors={[colors.primary, Color.waiting, Color.approved]}
						// 		refreshing={loading}
						// 		onRefresh={onRefresh}
						// 	/>
						// }
						ListFooterComponent={() => (
							<SafeAreaView style={{ marginBottom: 20 }}>
								<Button
									mode="contained"
									style={{ flex: 1, margin: 8 }}
									uppercase={false}
									onPress={() => _onConfirm()}
									loading={loading}
								>
									{'Confirm'}
								</Button>
							</SafeAreaView>
						)}
						renderItem={({ item, index }) => (
							<List.Section>
								<List.Accordion
									title={item.title}
									titleStyle={{ fontWeight: '600' }}
									// left={props => (
									// 	<View style={{ alignSelf: 'center' }}>
									// 		<Text
									// 			style={{
									// 				fontSize: 17,
									// 				color: colors.primary,
									// 				fontWeight: '400',
									// 			}}
									// 		>
									// 			{index + 1}.
									// 		</Text>
									// 	</View>
									// )}
									expanded={item.state}
									titleNumberOfLines={2}
									onPress={() => handlePress(index)}
									style={{ backgroundColor: '#E0E0E0' }}
								>
									{item.itemCheck.map((itemRadio, indexRadio) => (
										<List.Item
											key={indexRadio}
											title={itemRadio.desc_nm}
											style={{ flex: 1 }}
											left={props => itemView(itemRadio, indexRadio, index)}
											// right={props => itemView(item, index)}
											titleNumberOfLines={3}
											onPress={() => {
												const temp: any = [...listData];
												const newObj: any = temp[index].itemCheck;
												newObj[indexRadio] = {
													...newObj[indexRadio],
													data_value_mo: !newObj[indexRadio].data_value_mo,
												};
												temp[index] = { ...temp[index], itemCheck: newObj };
												setListData(temp);
												on_CheckItem(itemRadio?.step_id);
											}}
										/>
									))}
								</List.Accordion>
							</List.Section>
						)}
					/>
				) : (
					<LoadingFullScreen />
				)}
			</SafeAreaView>
		</View>
	);
}
