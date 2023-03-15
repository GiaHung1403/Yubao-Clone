import { getListCustomer } from '@actions/customer_action';
import AvatarBorder from '@components/AvatarBorder';
import ButtonChooseRangeTime from '@components/ButtonChooseRangeTime';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';
import { getContractList } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import { IContract, ICustomer, IUserSystem } from '@models/types';
import { useNavigation } from '@react-navigation/native';
import {
	contractInsuranceAtom,
	customerInsuranceAtom,
	fromDateInsuranceAtom,
	keyQueryInsuranceAtom,
	toDateInsuranceAtom,
} from 'atoms/insurance-support.atom';
import { useAtom } from 'jotai';
import moment from 'moment';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Image,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Card, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

interface ICustomerReducer {
	listCustomer: ICustomer[];
	loading: boolean;
}

interface IChooseCustomerParams {}

function ChooseCustomerComponent({}: IChooseCustomerParams) {
	const dispatch = useDispatch();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listCustomer, loading }: ICustomerReducer = useSelector(
		(state: any) => state.customer_reducer,
	);

	const [showChooseCustomer, setShowChooseCustomer] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState<string>('');

	const [customerSelected, setCustomerSelected] = useAtom(
		customerInsuranceAtom,
	);

	useEffect(() => {
		(async function search() {
			dispatch(
				getListCustomer({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: firstQuery,
				}),
			);
		})();
	}, [firstQuery]);

	const _onPressItem = (item: ICustomer) => {
		setCustomerSelected(item);
		setShowChooseCustomer(false);
	};

	return (
		<View style={{ marginTop: 8 }}>
			<Text
				style={{
					color: '#666666',
					fontSize: 12,
					marginBottom: 4,
				}}
			>
				Choose a customer:
			</Text>
			<Card elevation={1}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						paddingHorizontal: 8,
						paddingVertical: 8,
						alignItems: 'center',
					}}
					onPress={() => setShowChooseCustomer(statusOld => !statusOld)}
				>
					<Text style={{ flex: 1, color: '#666' }} numberOfLines={1}>
						{customerSelected ? customerSelected.LS_NM : 'Choose customer'}
					</Text>
					<Icon
						as={Ionicons}
						name={
							showChooseCustomer ? 'chevron-up-outline' : 'chevron-down-outline'
						}
						size={7}
						color={'#666'}
					/>
				</TouchableOpacity>
			</Card>

			{showChooseCustomer ? (
				<Card elevation={1} style={{ marginTop: 4 }}>
					<Searchbar
						placeholder="Search customer"
						value={firstQuery}
						style={{
							elevation: 0,
							borderBottomWidth: 0.5,
							borderBottomColor: '#dedede',
						}}
						inputStyle={{ fontSize: 14 }}
						onChangeText={setFirstQuery}
					/>

					<ScrollView style={{ maxHeight: 280 }}>
						{listCustomer.slice(0, 10).map((item, index) => (
							<TouchableOpacity
								key={item.TAX_CODE?.trim()}
								style={{
									flexDirection: 'row',
									padding: 8,
									alignItems: 'center',
									backgroundColor:
										customerSelected?.LESE_ID === item.LESE_ID
											? `${Color.main}30`
											: '#fff',
								}}
								onPress={() => _onPressItem(item)}
							>
								<AvatarBorder username={item.LS_NM} size={35} />
								<View
									style={{
										marginLeft: 8,
										justifyContent: 'space-between',
										flex: 1,
									}}
								>
									<Text style={{ fontWeight: '600', color: Color.approved }}>
										{item.LS_NM}
									</Text>
									<Text style={{ color: Color.draft, marginTop: 4 }}>
										{item.TAX_CODE}
									</Text>
								</View>
							</TouchableOpacity>
						))}
					</ScrollView>
				</Card>
			) : null}
		</View>
	);
}

function ChooseContractComponent(props, ref) {
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [listContract, setListContract] = useState<IContract[]>([]);
	const [showChooseContract, setShowChooseContract] = useState<boolean>(false);
	const [firstQuery, setFirstQuery] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const [customerSelected] = useAtom(customerInsuranceAtom);
	const [contractSelected, setContractSelected] = useAtom(
		contractInsuranceAtom,
	);

	useEffect(() => {
		if (!customerSelected) return;

		(async function getListContract() {
			setShowChooseContract(true);
			setLoading(true);
			const response: any = await getContractList({
				User_ID: dataUserSystem.EMP_NO,
				taxCode: customerSelected?.TAX_CODE,
			});

			setListContract(response);
			setLoading(false);
		})();
	}, [customerSelected]);

	const _onPressShowView = () => {
		setShowChooseContract(oldStatus => !oldStatus);
	};

	const listContractFilter = listContract.filter(
		item => !firstQuery || item.apno.includes(firstQuery),
	);

	return (
		<View style={{ marginTop: 16 }}>
			<Text
				style={{
					color: '#666666',
					fontSize: 12,
					marginBottom: 4,
				}}
			>
				Choose a contract:
			</Text>
			<Card elevation={1}>
				<TouchableOpacity
					style={{
						flexDirection: 'row',
						paddingHorizontal: 8,
						paddingVertical: 8,
						alignItems: 'center',
					}}
					onPress={_onPressShowView}
				>
					<Text style={{ flex: 1, color: '#666' }} numberOfLines={1}>
						{contractSelected ? contractSelected.apno : 'Choose contract'}
					</Text>
					<Icon
						as={Ionicons}
						name={
							showChooseContract ? 'chevron-up-outline' : 'chevron-down-outline'
						}
						size={7}
						color={'#666'}
					/>
				</TouchableOpacity>
			</Card>

			{showChooseContract ? (
				<Card elevation={1} style={{ marginTop: 4 }}>
					<Searchbar
						placeholder="Search contract"
						value={firstQuery}
						style={{
							elevation: 0,
							borderBottomWidth: 0.5,
							borderBottomColor: '#dedede',
						}}
						inputStyle={{ fontSize: 14 }}
						onChangeText={setFirstQuery}
					/>
					{loading ? (
						<View style={{ padding: 8 }}>
							<LoadingFullScreen size={'small'} />
						</View>
					) : (
						<ScrollView style={{ maxHeight: 280 }}>
							{listContractFilter.map((item, _) => (
								<TouchableOpacity
									key={item.apno?.trim()}
									style={{
										flexDirection: 'row',
										padding: 8,
										alignItems: 'center',
										backgroundColor:
											item.apno === contractSelected?.apno
												? `${Color.main}30`
												: '#fff',
									}}
									onPress={() => setContractSelected(item)}
								>
									<Image
										source={{
											uri: 'https://img.icons8.com/bubbles/512/agreement.png',
										}}
										resizeMode="contain"
										style={{ width: 60, height: 60 }}
									/>
									<View
										style={{
											marginLeft: 8,
											justifyContent: 'space-between',
											flex: 1,
										}}
									>
										<Text style={{ fontWeight: '600', color: Color.status }}>
											{item.apno}
										</Text>
										<Text style={{ color: Color.draft, marginTop: 4 }}>
											{item.aprv_amt} {item.cur_c}
										</Text>
									</View>
								</TouchableOpacity>
							))}
						</ScrollView>
					)}
				</Card>
			) : null}
		</View>
	);
}

const ChooseContractComponentRef = React.forwardRef(ChooseContractComponent);

export function InsuranceFilterModal(params: any) {
	const chooseContractRef = useRef<any>();
	const navigation: any = useNavigation();
	const dispatch = useDispatch();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	const [fromDate, setFromDate] = useAtom(fromDateInsuranceAtom);
	const [toDate, setToDate] = useAtom(toDateInsuranceAtom);
	const [firstQuery, setFirstQuery] = useAtom(keyQueryInsuranceAtom);
	const [customerSelected] = useAtom(customerInsuranceAtom);
	const [contractSelected] = useAtom(contractInsuranceAtom);

	const _onPressClear = () => {};

	const _onPressFilter = () => {
		if (contractSelected?.apno || customerSelected?.TAX_CODE) {
			setFirstQuery(contractSelected?.apno || customerSelected?.TAX_CODE || "");
		}

		navigation.goBack();
	};

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
					Filter Insurance Contract
				</Text>
				<Button uppercase={false} onPress={() => _onPressClear()}>
					Clear
				</Button>
			</View>

			<ScrollView style={{ flex: 1, padding: 8 }}>
				{/* Choose time */}
				<ButtonChooseRangeTime
					fromDate={fromDate.toDate()}
					toDate={toDate.toDate()}
					modalMode="date"
					fromDateDisplay={fromDate.format('DD/MM/YYYY')}
					toDateDisplay={toDate.format('DD/MM/YYYY')}
					onHandleConfirmFromDate={fromDateValue =>
						setFromDate(moment(fromDateValue))
					}
					onHandleConfirmToDate={toDateValue => setToDate(moment(toDateValue))}
				/>

				{/* Choose Customer */}
				<ChooseCustomerComponent />

				{/* Choose Contract */}
				<ChooseContractComponentRef ref={chooseContractRef} />

				<Button
					mode="contained"
					style={{ marginTop: 8 }}
					onPress={_onPressFilter}
				>
					Filter
				</Button>
				<View style={{ height: 60 }} />
			</ScrollView>
		</View>
	);
}
