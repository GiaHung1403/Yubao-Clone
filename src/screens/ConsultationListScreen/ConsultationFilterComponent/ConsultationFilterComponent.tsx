import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	Animated,
	InteractionManager,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListConsultation } from '@actions/consultation_action';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import { getListBranch, getListSubTeam, getListTeamMember } from '@data/api';
import { IBranch, ISubTeam, ITeamMember, IUserSystem } from '@models/types';
import { convertUnixTimeDDMMYYYY, convertUnixTimeNoSpace } from '@utils';
import moment from 'moment';

interface IDataPicker {
	value: number | string;
	label: string;
}

const timeNow = new Date();
const timeFrom = new Date(
	timeNow.getFullYear(),
	timeNow.getMonth() - 2,
	timeNow.getDate(),
);
const timeTo = new Date();

const anime = {
	height: new Animated.Value(0),
	contentHeight: 220,
};

let listener = '';

const listConfirm = [
	{ value: '0', label: 'No' },
	{ value: '1', label: 'Yes' },
];

export default function ConsultationFilterComponent(props: any) {
	const dispatch = useDispatch();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();

	const [showView, setShowView] = useState(false);
	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeTo);
	const [listBranch, setListBranch] = useState<IDataPicker[]>([]);
	const [consultationID, setConsultationID] = useState('');
	const [customerNameFilter, setCustomerNameFilter] = useState('');
	const [confirmFilter, setConfirmFilter] = useState('0');
	const [branchFilterSelected, setBranchFilterSelected] = useState('0');
	const [marketingTeamFilter, setMarketingTeamFilter] = useState('');
	const [marketingOfficerFilter, setMarketingOfficerFilter] = useState('');
	const [listMarketingTeam, setListMarketingTeam] = useState<ISubTeam[]>([]);
	const [listMarketingOfficer, setListMarketingOfficer] = useState<
		ITeamMember[]
	>([]);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			await getBranch();
			getMKTeam().then();
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
		(async function getDataMarketingOfficer() {
			if (marketingTeamFilter) {
				const responseTeamMember: any = await getListTeamMember({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					Sub_Team_Code: marketingTeamFilter,
					Dept_Code: dataUserSystem.DEPT_CODE,
					KEY_DATA_EXT1: 'PGLNSL002',
				});

				const listMarketingOfficerMap = responseTeamMember.map(
					(member: ITeamMember) => ({
						label: member.EMPNM,
						value: member.EMP_NO,
					}),
				);
				setListMarketingOfficer(listMarketingOfficerMap);
				setMarketingOfficerFilter(listMarketingOfficerMap[0].value);
			}
		})();
	}, [marketingTeamFilter]);

	useEffect(() => {
		if (dataUserSystem.DEPT_CODE === '0003' && !marketingTeamFilter) return;
		dispatch(
			getListConsultation({
				User_ID: dataUserSystem.EMP_NO,
				fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
				toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
				status: '',
				branch_No: branchFilterSelected,
				keyID: consultationID,
				cnid: '',
				consTP: '0',
				ls_Nm: customerNameFilter,
				sub_Team: marketingTeamFilter,
				mk_Emp_No: marketingOfficerFilter,
				cr_Team: '',
				cr_Emp_No: '',
				confirm_YN: confirmFilter,
				ATT_READ: 1,
			}),
		);
	}, [marketingOfficerFilter]);

	const getBranch = async () => {
		const responseBranch: IBranch[] = (await getListBranch({
			User_ID: dataUserSystem.EMP_NO,
			Password: '',
		})) as IBranch[];

		const listBranchConvert: IDataPicker[] = responseBranch.map(item => ({
			label: item.STND_C_NM,
			value: item.C_NO,
		}));

		setListBranch(listBranchConvert);
	};

	const getMKTeam = async () => {
		const responseSubTeam: any = await getListSubTeam({
			User_ID: dataUserSystem.EMP_NO,
			Password: 'abcd@1234',
			Dept_Code: dataUserSystem.DEPT_CODE,
			KEY_DATA_EXT1: 'PGLNSL002',
		});

		const listMarketingTeamMap = responseSubTeam.map((team: ISubTeam) => ({
			label: team.STND_C_NM,
			value: team.SubTeam,
		}));

		setListMarketingTeam(listMarketingTeamMap);
		setMarketingTeamFilter(
			listMarketingTeamMap.length > 0 ? listMarketingTeamMap[0].value : '',
		);
	};

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
				getListConsultation({
					User_ID: dataUserSystem.EMP_NO,
					fromDate: convertUnixTimeNoSpace(fromDate.getTime() / 1000),
					toDate: convertUnixTimeNoSpace(toDate.getTime() / 1000),
					status: '',
					branch_No: branchFilterSelected,
					keyID: consultationID,
					cnid: '',
					consTP: '0',
					ls_Nm: customerNameFilter,
					sub_Team: marketingTeamFilter,
					mk_Emp_No: marketingOfficerFilter,
					cr_Team: '',
					cr_Emp_No: '',
					confirm_YN: confirmFilter,
					ATT_READ: 1,
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
							label="ID"
							placeholder="ID"
							value={consultationID}
							onChangeText={(text: string) => setConsultationID(text)}
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
						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							value={customerNameFilter}
							onChangeText={(text: string) => setCustomerNameFilter(text)}
							style={{ flex: 1, marginRight: 8 }}
						/>

						<PickerCustomComponent
							showLabel={true}
							listData={listConfirm}
							label="Confirm Y/N"
							value={confirmFilter}
							style={{ flex: 1 }}
							onValueChange={text => setConfirmFilter(text)}
						/>
					</View>
				)}

				{/* View Choose Marketing Team and Marketing Officer */}
				{showView && (
					<View
						style={{
							flexDirection: 'row',
							paddingHorizontal: 8,
							marginTop: 8,
						}}
					>
						{/*TODO: max width*/}
						<PickerCustomComponent
							showLabel={true}
							listData={listMarketingTeam}
							label="Marketing Team"
							value={marketingTeamFilter}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => setMarketingTeamFilter(text)}
						/>

						<PickerCustomComponent
							showLabel={true}
							listData={listMarketingOfficer}
							label="Marketing Officer"
							value={marketingOfficerFilter}
							style={{ flex: 1 }}
							onValueChange={text => setMarketingOfficerFilter(text)}
						/>
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
