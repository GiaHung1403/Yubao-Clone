import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Alert,
	InteractionManager,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { getListContact } from '@actions/contact_action';
import {
	getListDayOffRemaining,
	getListLeaveRequest,
} from '@actions/leave_request_action';
import AvatarBorder from '@components/AvatarBorder';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import { getListApproverDayOff, submitLeaveRequest } from '@data/api';
import { getListHoliday } from '@data/api/api_leave_request';
import {
	IApproverLeaveRequest,
	IContact,
	IDayOffRemaining,
	IHoliday,
	ILeaveRequest,
	IUserSystem,
} from '@models/types';
import { zeroFill } from '@utils';
import moment from 'moment';
import styles from './styles';

interface IPropsRouteParams {
	leaveItem: ILeaveRequest;
	listContactPersonSelected: string[];
}

interface IPropsItemChip {
	userID: string;
	name: string;
	index: number;
	onPress?: () => void;
}

const timeNow = new Date();
const timeFromDefault = new Date(
	timeNow.getFullYear(),
	timeNow.getMonth(),
	timeNow.getDate(),
	8,
	0,
);
const timeToDefault = new Date(
	timeNow.getFullYear(),
	timeNow.getMonth(),
	timeNow.getDate(),
	17,
	0,
);
const fromDateOffDay = new Date(timeNow.getFullYear(), 0, 1);

const formatUserID = ({ userID, name }) =>
	`${userID}.${name
		?.replace(/ /g, '.')
		.substr(0, name?.indexOf('(') > -1 ? name?.indexOf('(') - 1 : undefined)}`;

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

const convertLeaveTake = listPeriod => {
	if (!listPeriod) {
		return '0d';
	}
	const day = listPeriod.reduce((a, b) => a + b.cDays, 0);
	const hour = listPeriod.reduce((a, b) => a + b.cHours, 0);
	const minute = listPeriod.reduce((a, b) => a + b.cMinutes, 0);

	return `${day === 0 ? '' : `${day}d`} ${hour === 0 ? '' : `${hour}h`} ${
		minute === 0 ? '' : `${minute}m`
	}`;
};

function numberWeekend(fromDate, toDate) {
	const d1 = new Date(fromDate.getTime());
	const d2 = toDate;
	let weekend = 0;

	while (d1 < d2) {
		const day = d1.getDay();
		weekend = day === 6 || day === 0 ? (weekend += 1) : weekend;
		d1.setDate(d1.getDate() + 1);
	}

	return weekend;
}

function numberHoliday(fromDate, toDate, listHoliday) {
	let holidays = 0;

	listHoliday.forEach(holiday => {
		const holidayFormat = new Date(holiday.hld_date);
		holidayFormat.setHours(8);
		if (fromDate <= holidayFormat && holidayFormat <= toDate) {
			holidays += 1;
		}
	});

	return holidays;
}

function totalTimeOff(fromDate, toDate, listHoliday) {
	let seconds = Math.floor((toDate - fromDate) / 1000);
	if (fromDate.getHours() < 12 && toDate.getHours() > 12) {
		seconds -= 3600;
	}
	let minutes = Math.floor(seconds / 60);
	let hours = Math.floor(minutes / 60);
	let days = Math.floor(hours / 24);

	hours = hours - days * 24;
	minutes = minutes - days * 24 * 60 - hours * 60;

	if (hours === 8) {
		hours = 0;
		days += 1;
	}

	days =
		days -
		numberWeekend(fromDate, toDate) -
		numberHoliday(fromDate, toDate, listHoliday);

	return {
		text: `${days === 0 ? '' : `${days}d`} ${hours === 0 ? '' : `${hours}h`} ${
			minutes === 0 ? '' : `${minutes}m`
		}`,
		days,
		hours,
		minutes,
	};
}

function convertTimeStringToMinutes(timeString) {
	if (!timeString) {
		return 0;
	}
	const split = timeString.split(' ');
	const convert = split.map(item => {
		if (item.includes('d')) {
			return item.replace('d', '');
		}

		if (item.includes('h')) {
			return item.replace('h', '');
		}

		if (item.includes('m')) {
			return item.replace('m', '');
		}

		return 0;
	});
	return convert[0] * 8 * 60 + convert[1] * 60 + convert[2] * 1;
}

export function LeaveRequestDetailScreen(props: any) {
	const navigation: any = useNavigation();
	const { leaveItem, listContactPersonSelected }: IPropsRouteParams =
		props.route.params;
	const dispatch = useDispatch();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	const listDayOffRemaining: IDayOffRemaining[] = useSelector(
		(state: any) => state.leave_request_reducer.listDayOffRemaining,
	);
	const { colors } = useTheme();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [fromDate, setFromDate] = useState(
		leaveItem ? new Date(leaveItem.lstPeriod[0].startDate) : timeFromDefault,
	);
	const [toDate, setToDate] = useState(
		leaveItem
			? new Date(leaveItem?.lstPeriod[leaveItem?.lstPeriod.length - 1].endDate)
			: timeToDefault,
	);
	const [remark, setRemark] = useState(leaveItem?.remark || '');
	const [typeLeave, setTypeLeave] = useState<string>(
		leaveItem?.lstPeriod[0].periodTypeID || 'A1',
	);
	const [listApprover, setListApprover] = useState<IApproverLeaveRequest[]>([]);
	const [listContactSelectedConvert, setListContactSelectedConvert] = useState<
		IContact[]
	>([]);
	const [listHoliday, setListHoliday] = useState<IHoliday[]>([]);
	const [notice, setNotice] = useState<string>('');

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			dispatch(
				getListDayOffRemaining({
					UserID: dataUserSystem.EMP_NO,
					fromDate: moment(fromDateOffDay).format('DDMMYYYY'),
					toDate: moment(timeNow).format('DDMMYYYY'),
				}),
			);

			const listHolidayResponse: IHoliday[] = (await getListHoliday({
				year: timeNow.getFullYear(),
				UserID: dataUserSystem.EMP_NO,
			})) as IHoliday[];

			setListHoliday(listHolidayResponse);

			if (dataUserSystem.ST_C === '2' && dataUserSystem.EMP_NO.includes('I')) {
				setTypeLeave('D1');
			}

			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: '0',
					subteam: dataUserSystem.TEAM,
					Branch: dataUserSystem.BRANCH_CODE,
				}),
			);

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		(async function getListApprover() {
			const listApproverResponse: IApproverLeaveRequest[] =
				(await getListApproverDayOff({
					UserID: dataUserSystem.EMP_NO,
					takeLeave: totalTimeOff(fromDate, toDate, listHoliday).days,
					leaveType: typeLeave,
				})) as IApproverLeaveRequest[];

			setListApprover(listApproverResponse);
		})();
	}, [fromDate, toDate]);

	useEffect(() => {
		if (
			!listContactSelectedConvert ||
			listContactSelectedConvert.length === 0
		) {
			setNotice('');
			return;
		}
		setNotice(
			`If you need immediate assistance during my absence, please contact` +
				`${listContactSelectedConvert?.map(
					contact =>
						` ${contact?.emp_nm} at ${contact?.email} EXT: ${contact?.ext}`,
				)}. ` +
				`Otherwise, I will respond to your emails as soon as possible upon my return.`,
		);
	}, [listContactSelectedConvert]);

	/* Check list contact selected */
	useEffect(() => {
		if (listContactPersonSelected) {
			const listConvert: IContact[] = listContactPersonSelected.map(
				contactPersonID => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === contactPersonID,
					);
				},
			) as IContact[];

			setListContactSelectedConvert(listConvert);
		} else {
			const listConvert: IContact[] = leaveItem?.lstApprovers
				.filter(item => item.sign_YN)
				.map(approver => {
					return listContact?.find(
						contactPerson => contactPerson?.emp_no === approver.userID,
					);
				}) as IContact[];

			setListContactSelectedConvert(listConvert);
		}
	}, [listContactPersonSelected, listContact]);

	const _onPressOpenContactPersonModal = () => {
		const convertListContactSelected = listContactSelectedConvert?.map(
			item => item.emp_no,
		);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			deptCode: dataUserSystem.DEPT_CODE,
			screenBack: 'LeaveRequestDetailScreen',
		});
	};

	const _onPressSubmitRequest = async (
		flag: 'I' | 'U' | 'D',
		isSubmit: boolean,
	) => {
		if (
			['A0', 'A1', 'A4', 'B1', 'B2'].includes(typeLeave) &&
			convertTimeStringToMinutes(
				listDayOffRemaining.find(item => item.c_No === typeLeave)?.reMain,
			) <
				convertTimeStringToMinutes(
					totalTimeOff(fromDate, toDate, listHoliday).text,
				)
		) {
			Alert.alert('Warning', 'Day off not enough!');
			return;
		}

		setLoading(true);
		const listApproverConvert = listApprover?.map(approver => ({
			Name: approver.tit,
			Approver_No: approver.approver_No,
		}));
		const listContactConvert = listContactSelectedConvert?.map(item => ({
			Name: item.emp_nm,
			Approver_No: item.emp_no,
			sign_YN: '3',
		}));

		const { days, hours, minutes } = totalTimeOff(
			fromDate,
			toDate,
			listHoliday,
		);

		const leaveTaken = `${zeroFill(days, 3)}${zeroFill(hours, 2)}${zeroFill(
			minutes,
			2,
		)}`;

		await submitLeaveRequest({
			UserID: dataUserSystem.EMP_NO,
			Leave_ID: leaveItem?.reqID || '',
			confirmYN:
				isSubmit.toString() /* Nếu false là insert và update, true là khi submit */,
			flag /* I: Insert; U: Update; D: Delete */,
			listApprover: [
				...(listApproverConvert || []),
				...(listContactConvert || []),
			],
			listLeaveRequestDTL: [
				{
					CHK_TIME: '',
					End_Date: moment(toDate).format('YYYY/MM/DD HH:mm'),
					End_Time: `${zeroFill(toDate.getHours(), 2)}:${zeroFill(
						toDate.getMinutes(),
						2,
					)}`,
					Flag: flag,
					Is_First: 0,
					Leave_TP: typeLeave,
					Leave_Taken: leaveTaken,
					RFA_ID: '',
					Rmks: remark,
					Seq: 1,
					Start_Date: moment(fromDate).format('YYYY/MM/DD HH:mm'),
					Start_Time: `${zeroFill(fromDate.getHours(), 2)}:${zeroFill(
						fromDate.getMinutes(),
						2,
					)}`,
					User_Login: dataUserSystem.EMP_NO,
				},
			],
			noticeInfo: notice,
			Rmks: remark,
			status: '0',
		});

		const timeFromList = new Date(
			new Date(
				timeNow.getFullYear(),
				timeNow.getMonth() - 1,
				timeNow.getDate(),
			),
		);

		dispatch(
			getListLeaveRequest({
				UserID: dataUserSystem.EMP_NO,
				memberID: dataUserSystem.EMP_NO,
				fromDate: moment(timeFromList).format('DDMMYYYY'),
				toDate: moment(toDate).format('DDMMYYYY'),
			}),
		);

		setLoading(false);

		navigation.goBack();
	};

	return (
		<View style={styles.container}>
			<Header
				title={
					leaveItem ? `Leave ID ${leaveItem.reqID}` : 'Create Leave Request'
				}
			/>

			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={styles.containerBodyScroll}>
						<Card elevation={2} style={styles.containerCardPeriod}>
							<View style={styles.viewInsideCardPeriod}>
								<View style={styles.containerChooseDate}>
									<ButtonChooseDateTime
										label={'From'}
										valueDisplay={moment(fromDate).format('DD/MM/YYYY HH:mm')}
										value={fromDate}
										minuteInterval={30}
										onHandleConfirmDate={setFromDate}
										containerStyle={{
											flex: 1,
											marginRight: 8,
										}}
									/>

									<ButtonChooseDateTime
										label={'To'}
										valueDisplay={moment(toDate).format('DD/MM/YYYY HH:mm')}
										value={toDate}
										minuteInterval={30}
										onHandleConfirmDate={setToDate}
										containerStyle={{ flex: 1 }}
									/>
								</View>

								<View style={{ marginTop: 12 }}>
									<PickerCustomComponent
										enable={
											dataUserSystem.ST_C !== '2' &&
											!dataUserSystem.EMP_NO.includes('I')
										}
										showLabel={true}
										listData={listDayOffRemaining
											.filter(item2 => /\d/.test(item2?.c_No.toString()))
											.map(item => ({
												label: `${item.c_No} - ${item.stnD_C_NM} (${
													item.reMain || '0d'
												})`,
												value: item.c_No,
											}))}
										label="Type Leave"
										value={typeLeave}
										style={{ flex: 1 }}
										textStyle={{
											maxWidth: 400,
											color: '#2c82c9',
											fontWeight: '600',
										}}
										onValueChange={text => setTypeLeave(text)}
									/>
								</View>

								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										marginTop: 16,
										marginBottom: 8,
									}}
								>
									<Text style={{ flex: 1, fontWeight: '600', color: '#555' }}>
										Total day-off
									</Text>
									<Text
										style={{
											color: colors.primary,
											fontWeight: '600',
											fontSize: 15,
										}}
									>
										{leaveItem
											? convertLeaveTake(leaveItem.lstPeriod)
											: totalTimeOff(fromDate, toDate, listHoliday).text}
									</Text>
								</View>
							</View>
						</Card>

						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 12 }}>
							<View style={{ padding: 8 }}>
								<View>
									<TextInputCustomComponent
										label="Remark"
										placeholder=""
										multiline={true}
										value={remark}
										onChangeText={(text: string) => setRemark(text)}
										style={{ flex: 1, marginTop: 8 }}
										inputStyle={{ height: 60 }}
									/>

									<View style={{ marginVertical: 8 }}>
										<Text
											style={{
												fontWeight: '600',
												color: '#555',
												marginBottom: 8,
											}}
										>
											Approver
										</Text>
										<ScrollView
											horizontal={true}
											showsHorizontalScrollIndicator={false}
										>
											{listApprover.map((approver, index) =>
												renderItemChip({
													userID: approver.approver_No,
													name: approver.tit,
													index,
												}),
											)}
										</ScrollView>
									</View>
								</View>
							</View>
						</Card>

						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 12 }}>
							<View style={{ padding: 8 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
								>
									Contacts Name
								</Text>
								<ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}
								>
									{listContactSelectedConvert?.map((contactPerson, index) =>
										renderItemChip({
											userID: contactPerson?.emp_no,
											name: contactPerson?.emp_nm,
											index,
											onPress: () => _onPressOpenContactPersonModal(),
										}),
									)}
									<TouchableOpacity
										style={{
											width: 40,
											height: 40,
											borderRadius: 25,
											backgroundColor: '#dfdfdf',
											justifyContent: 'center',
											alignItems: 'center',
										}}
										onPress={() => _onPressOpenContactPersonModal()}
									>
										<Text>+</Text>
									</TouchableOpacity>
								</ScrollView>

								<TextInputCustomComponent
									label="Notice"
									placeholder=""
									enable={!leaveItem}
									multiline={true}
									value={notice}
									onChangeText={(text: string) => null}
									style={{ flex: 1, marginVertical: 8 }}
								/>
							</View>
						</Card>

						{loading ? (
							<ActivityIndicator
								size={'small'}
								color={colors.primary}
								style={{ marginTop: 16 }}
							/>
						) : leaveItem?.status !== 'Reject' &&
						  leaveItem?.status !== 'Success' &&
						  totalTimeOff(fromDate, toDate, listHoliday).text !== '  ' ? (
							<View style={{ marginTop: 16, flexDirection: 'row' }}>
								<Button
									mode="contained"
									uppercase={false}
									style={{ marginHorizontal: 8, flex: 1 }}
									onPress={() =>
										_onPressSubmitRequest(leaveItem ? 'U' : 'I', false)
									}
								>
									{'Save'}
								</Button>

								{leaveItem?.status === 'Draft' && (
									<Button
										mode="contained"
										uppercase={false}
										style={{
											marginHorizontal: 8,
											flex: 1,
											backgroundColor: Colors.approved,
										}}
										onPress={() => _onPressSubmitRequest('U', true)}
									>
										Submit
									</Button>
								)}

								{leaveItem?.status === 'Draft' && (
									<Button
										mode="contained"
										uppercase={false}
										style={{
											marginHorizontal: 8,
											flex: 1,
											backgroundColor: 'red',
										}}
										onPress={() => _onPressSubmitRequest('D', false)}
									>
										Delete
									</Button>
								)}
							</View>
						) : leaveItem ? null : (
							<Text
								style={{
									textAlign: 'center',
									color: 'red',
									padding: 20,
									fontWeight: '500',
								}}
							>
								{`Total day-off is wrong! Please check again!`}
							</Text>
						)}

						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
