import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Animated,
	InteractionManager,
	TouchableOpacity,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListCarBooking } from '@actions/car_booking_action';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import {
	getListBranch,
	getListCar,
	getListSubTeam,
	getListTeamMember,
} from '@data/api';
import {
	IBranch,
	ICar,
	ISubTeam,
	ITeamMember,
	IUserSystem,
} from '@models/types';
import { convertUnixTimeDDMMYYYY, convertUnixTimeNoSpace } from '@utils';

interface IDataPicker {
	value: number | string;
	label: string;
}

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() - 7),
);
const timeTo = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth(), timeNow.getDate() + 7),
);

const anime = {
	height: new Animated.Value(0),
	contentHeight: 300,
};

let listener = '';

const listStatus = [
	{ value: '0', label: 'Choose' },
	{ value: '01', label: 'Accepted: can use car' },
	{ value: '02', label: 'Refuse: use taxi' },
	{ value: '03', label: 'Processing' },
	{ value: '04', label: 'Cancel - By HR' },
	{ value: '05', label: 'Cancel - By Organizer' },
	{ value: '06', label: 'Share car with other person' },
	{ value: '07', label: 'Share taxi with other person' },
];

export default function CarBookingFilterComponent(props: any) {
	const dispatch = useDispatch();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const [showView, setShowView] = useState(false);
	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeTo);
	const [listCar, setListCar] = useState<IDataPicker[]>([]);
	const [listBranch, setListBranch] = useState<IDataPicker[]>([]);
	const [listDepartment, setListDepartment] = useState<ISubTeam[]>([]);
	const [listPIC, setListPIC] = useState<ISubTeam[]>([]);
	const [bookingIDFilter, setBookingIDFilter] = useState('');
	const [departmentFilter, setDepartmentFilter] = useState('');
	const [customerNameFilter, setCustomerNameFilter] = useState('');
	const [picFilter, setPICFilter] = useState(dataUserSystem.EMP_NO);
	const [statusFilter, setStatusFilter] = useState('0');
	const [carFilterSelected, setCarFilterSelected] = useState('0');
	const [branchFilterSelected, setBranchFilterSelected] = useState('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const responseCars: ICar[] = (await getListCar({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				KEY_DATA: 'H',
			})) as ICar[];

			const listCarConvert: IDataPicker[] = responseCars.map(item => ({
				label: item.stnd_C_Nm,
				value: item.c_No.toString(),
			}));

			setListCar(listCarConvert);

			const responseBranch: IBranch[] = (await getListBranch({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
			})) as IBranch[];

			const listBranchConvert: IDataPicker[] = responseBranch.map(item => ({
				label: item.STND_C_NM,
				value: item.C_NO,
			}));

			setListBranch(listBranchConvert);

			const responseSubTeam: any = await getListSubTeam({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				Dept_Code: dataUserSystem.DEPT_CODE,
				KEY_DATA_EXT1: 'PGHRDOM01',
			});

			const subTeamConvert = responseSubTeam.map((team: ISubTeam) => ({
				label: team.STND_C_NM,
				value: team.SubTeam,
			}));
			console.log('====================================');
			console.log(
				{
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					Dept_Code: dataUserSystem.DEPT_CODE,
					KEY_DATA_EXT1: 'PGHRDOM01',
				},
				'ahihi',
			);
			console.log('====================================');

			setListDepartment(subTeamConvert);

			dispatch(
				getListCarBooking({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
					toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
					branchID: branchFilterSelected,
					carID: carFilterSelected,
					bookingID: bookingIDFilter,
					subTeam: departmentFilter,
					opEmpNO: picFilter,
					lsName: customerNameFilter,
					status: statusFilter,
				}),
			);
		});
		listener = anime.height.addListener(async ({ value }) => {
			if (value === anime.contentHeight && !showView) {
				setShowView(true);
			} else {
				setShowView(false);
			}
		});

		return () => {
			anime.height.removeListener(listener);
			anime.height.setValue(_getMinValue());
		};
	}, []);

	useEffect(() => {
		(async function getDataOfficer() {
			if (departmentFilter) {
				const { password }: any = await Keychain.getGenericPassword();

				const responseTeamMember: ITeamMember[] = (await getListTeamMember({
					User_ID: dataUserSystem.EMP_NO,
					Password: password,
					Sub_Team_Code: departmentFilter,
					Dept_Code: dataUserSystem.DEPT_CODE,
					KEY_DATA_EXT1: 'PGHRDOM01',
				})) as ITeamMember[];

				responseTeamMember.splice(0, 1);

				const listOfficerConvert: any = responseTeamMember.map(
					(team: ITeamMember) => ({
						label: team.EMPNM,
						value: team.EMP_NO,
					}),
				);

				setListPIC(listOfficerConvert);
			}
		})();
	}, [departmentFilter]);

	const _initContentHeight = evt => {
		if (anime.contentHeight > 0) {
			return;
		}
		anime.contentHeight = evt.nativeEvent.layout.height;
		anime.height.setValue(showView ? _getMaxValue() : _getMinValue());
	};

	const _getMaxValue = () => {
		return anime.contentHeight;
	};

	const _getMinValue = () => {
		return 0;
	};

	const toggle = () => {
		Animated.timing(anime.height, {
			toValue: showView ? _getMinValue() : _getMaxValue(),
			duration: 300,
			useNativeDriver: false,
		}).start();
	};

	const _onPressFilter = () => {
		if (showView) {
			Animated.timing(anime.height, {
				toValue: _getMinValue(),
				duration: 300,
				useNativeDriver: false,
			}).start();
		}

		setTimeout(() => {
			dispatch(
				getListCarBooking({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
					toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
					branchID: branchFilterSelected,
					carID: carFilterSelected,
					bookingID: bookingIDFilter,
					subTeam: departmentFilter,
					opEmpNO: picFilter,
					lsName: customerNameFilter,
					status: statusFilter,
				}),
			);
		}, 400);
	};

	return (
		<Card elevation={4}>
			{/* View Choose Date */}
			<View
				style={{
					flexDirection: 'row',
					marginTop: 8,
					paddingHorizontal: 8,
				}}
			>
				<ButtonChooseDateTime
					label={'From date'}
					valueDisplay={convertUnixTimeDDMMYYYY(fromDate.getTime() / 1000)}
					value={fromDate}
					modalMode={'date'}
					onHandleConfirmDate={setFromDate}
					containerStyle={{ flex: 1 }}
				/>

				<ButtonChooseDateTime
					label={'To date'}
					valueDisplay={convertUnixTimeDDMMYYYY(toDate.getTime() / 1000)}
					value={toDate}
					modalMode={'date'}
					onHandleConfirmDate={setToDate}
					containerStyle={{ flex: 1, marginLeft: 8 }}
				/>
			</View>

			<Animated.View
				style={{ height: anime.height }}
				onLayout={_initContentHeight}
			>
				{/* View Quotation ID and Choose Branch */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						<TextInputCustomComponent
							label="Booking ID"
							placeholder="Booking ID"
							value={bookingIDFilter}
							onChangeText={(text: string) => setBookingIDFilter(text)}
							style={{ flex: 1, marginRight: 8 }}
						/>
						<PickerCustomComponent
							showLabel={true}
							listData={listBranch}
							label="Branch"
							value={branchFilterSelected.toString()}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: 120 }}
							onValueChange={text => setBranchFilterSelected(text)}
						/>
					</View>
				)}

				{/* View Customer ID and Customer Name */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						<PickerCustomComponent
							showLabel={true}
							listData={listCar}
							label="Car"
							value={carFilterSelected.toString()}
							style={{ flex: 1, marginRight: 8 }}
							textStyle={{ maxWidth: 120 }}
							onValueChange={text => setCarFilterSelected(text)}
						/>

						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							value={customerNameFilter}
							onChangeText={(text: string) => setCustomerNameFilter(text)}
							style={{ flex: 1 }}
						/>
					</View>
				)}

				{/* View Department and PIC */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						<PickerCustomComponent
							showLabel={true}
							listData={listDepartment}
							label="Department"
							value={departmentFilter}
							style={{ flex: 1, marginRight: 8 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text => setDepartmentFilter(text)}
						/>
						<PickerCustomComponent
							showLabel={true}
							listData={listPIC}
							label="PIC"
							value={picFilter}
							style={{ flex: 1 }}
							textStyle={{ maxWidth: 110 }}
							onValueChange={text => setPICFilter(text)}
						/>
					</View>
				)}

				{/* View Status */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						<PickerCustomComponent
							showLabel={true}
							listData={listStatus}
							label="Status"
							value={statusFilter}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => setStatusFilter(text)}
						/>
						<View style={{ flex: 1 }} />
					</View>
				)}
			</Animated.View>

			<Button
				mode="contained"
				uppercase={false}
				style={{ margin: 8, width: 100, alignSelf: 'center' }}
				onPress={() => _onPressFilter()}
			>
				Filter
			</Button>

			<TouchableOpacity
				style={{
					justifyContent: 'center',
					alignItems: 'center',
					paddingVertical: 8,
				}}
				onPress={() => toggle()}
			>
				<Icon
					as={Ionicons}
					name={showView ? 'chevron-up-outline' : 'chevron-down-outline'}
					size={7}
					color={colors.primary}
				/>
			</TouchableOpacity>
		</Card>
	);
}
