import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
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
import { Button, Card, Switch } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { getListBookMeeting } from '@actions/book_meeting_action';
import { getListContact } from '@actions/contact_action';
import AvatarBorder from '@components/AvatarBorder';
import ButtonChooseDateTime from '@components/ButtonChooseDateTime';
import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Color from '@config/Color';
import { insertBookMeeting } from '@data/api';
import { IBookMeeting, IContact, ICustomer, IUserSystem } from '@models/types';
import styles from './styles';

interface IPropsRouteParams {
	bookMeetingItem: IBookMeeting;
	listContactPersonSelected: string[];
	customerSelected: ICustomer;
	RoomID: any;
}

interface IPropsItemChip {
	userData: IContact;
	index: number;
	onPress?: () => void;
}

const timeNow = new Date();
const timeNowPLus = new Date();
timeNowPLus.setMinutes(timeNow.getMinutes() + 30);
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);
const timeTo = new Date(new Date());

const renderItemChip = ({ userData, index, onPress }: IPropsItemChip) => (
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
			<AvatarBorder username={userData?.emp_no} size={25} />
			<Text
				style={{
					color: '#000',
					marginLeft: 8,
				}}
			>
				{userData?.emp_nm}
			</Text>
		</View>
	</TouchableOpacity>
);

export function BookMeetingDetailScreen(props: any) {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const {
		bookMeetingItem,
		listContactPersonSelected,
		RoomID,
	}: IPropsRouteParams = props.route.params;

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { listMeetingRoom } = useSelector(
		(state: any) => state.book_meeting_reducer,
	);

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const [fromDate, setFromDate] = useState(
		bookMeetingItem ? new Date(bookMeetingItem?.START_DATE) : timeNow,
	);
	const [toDate, setToDate] = useState(
		bookMeetingItem ? new Date(bookMeetingItem?.END_DATE) : timeNowPLus,
	);
	const [listContactSelectedConvert, setListContactSelectedConvert] = useState<
		IContact[]
	>([]);
	const [meetingRoomSelected, setMeetingRoomSelected] = useState(
		bookMeetingItem?.CAR_ID || 0,
	);
	const [webex, setWebex] = useState(bookMeetingItem?.WEBEX);
	const [invite, setInvite] = useState(bookMeetingItem?.INVITE || '');
	const [subject, setSubject] = useState<string>(bookMeetingItem?.TITLE || '');
	const [content, setContent] = useState<string>(
		bookMeetingItem?.MEET_CONTENT || '',
	);
	const [loadingSave, setLoadingSave] = useState<boolean>(false);
	const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
	const [loadingCancel, setLoadingCancel] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
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

			setDoneLoadAnimated(true);
		});
	}, []);

	useEffect(() => {
		if (RoomID) {
			setMeetingRoomSelected(RoomID);
		}
	}, [listMeetingRoom]);

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
			const listConvert: IContact[] = bookMeetingItem?.OPTIONAL_EMP_NO?.trim()
				? (bookMeetingItem.OPTIONAL_EMP_NO.trim()
						.split(',')
						.map(
							optionEmpId =>
								listContact?.find(
									contactPerson => contactPerson?.emp_no === optionEmpId,
								) || null,
						) as IContact[])
				: [];

			setListContactSelectedConvert(listConvert.filter(item => item));
		}
	}, [listContactPersonSelected, listContact]);

	const _onPressOpenContactPersonModal = () => {
		const convertListContactSelected = listContactSelectedConvert?.map(
			item => item.emp_no,
		);
		navigation.navigate('ChooseUserModal', {
			listContactPersonExisted: convertListContactSelected || [],
			deptCode: '0',
			screenBack: 'BookMeetingDetailScreen',
		});
	};

	const setLoadingButton = ({ flag, value }) => {
		if (flag === 'I' || flag === 'U') {
			setLoadingSave(value);
			return;
		}
		if (flag === 'S') {
			setLoadingSubmit(value);
			return;
		}
		if (flag === 'D') {
			setLoadingCancel(value);
			return;
		}
	};

	const _onPressButtonSave = async ({ flag }) => {
		if (listContactSelectedConvert.length === 0 && !invite) {
			Alert.alert('Warning', 'Please choose option person or invite email!');
			return;
		}
		if (meetingRoomSelected === 0) {
			Alert.alert('Warning', 'Please choose meeting room!');
			return;
		}
		if (!subject) {
			Alert.alert('Warning', 'Please input subject!');
			return;
		}
		if (!content) {
			Alert.alert('Warning', 'Please input content!');
			return;
		}
		setLoadingButton({ flag, value: true });
		try {
			await insertBookMeeting({
				flag,
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				fromDate: moment(fromDate).format('YYYY-MM-DD HH:mm:ss'),
				toDate: moment(toDate).format('YYYY-MM-DD HH:mm:ss'),
				optionEmp: listContactSelectedConvert.reduce(
					(result, optionEmp) => result + `${optionEmp.emp_no},`,
					'',
				),
				roomID: meetingRoomSelected,
				bookingID: bookMeetingItem?.BOOKING_ID || '',
				subject,
				content,
				invite,
				webex,
			});

			// sentMailBookMeeting({
			// 	User_ID: dataUserSystem.EMP_NO,
			// 	Password: '',
			// 	bookingID: bookMeetingItem?.BOOKING_ID,
			// 	flag,
			// }).then();

			dispatch(
				getListBookMeeting({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					fromDate: moment(timeFrom).format('DDMMYYYY'),
					toDate: moment(timeTo).format('DDMMYYYY'),
					branchID: dataUserSystem.BRANCH_CODE,
					roomID: '',
					bookingID: '',
					meetingContent: '',
				}),
			);
			setLoadingButton({ flag, value: false });
			RoomID
				? navigation.dispatch(StackActions.popToTop())
				: navigation.goBack();
		} catch (e: any) {
			setLoadingButton({ flag, value: false });
			Alert.alert('Error', e.message);
		}
	};

	useEffect(() => {
		console.log(moment(fromDate).format('YYYY-MM-DD HH:mm:ss'));
	}, [fromDate]);

	return (
		<View style={{ flex: 1 }}>
			<Header
				title={'Booking New Meeting'}
				onPressButtonBack={() => {
					RoomID
						? navigation.dispatch(StackActions.popToTop())
						: navigation.goBack();
				}}
			/>

			{doneLoadAnimated ? (
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={{ flex: 1 }}
				>
					<ScrollView style={{ flex: 1, padding: 8 }}>
						<Card style={{ padding: 8 }}>
							<View
								style={{
									flexDirection: 'row',
									marginBottom: 12,
								}}
							>
								<ButtonChooseDateTime
									label={'From date'}
									valueDisplay={moment(fromDate).format('DD/MM/YYYY HH:mm')}
									minuteInterval={30}
									value={fromDate}
									onHandleConfirmDate={setFromDate}
									containerStyle={{ flex: 1 }}
								/>

								<ButtonChooseDateTime
									label={'To date'}
									valueDisplay={moment(toDate).format('DD/MM/YYYY HH:mm')}
									value={toDate}
									minuteInterval={30}
									onHandleConfirmDate={setToDate}
									containerStyle={{ flex: 1, marginLeft: 8 }}
								/>
							</View>

							<PickerCustomComponent
								showLabel={true}
								listData={listMeetingRoom}
								label="Meeting Room"
								value={meetingRoomSelected.toString()}
								style={{ flex: 1, marginBottom: 12 }}
								textStyle={{}}
								onValueChange={text => setMeetingRoomSelected(text)}
							/>

							<View
								style={{
									marginBottom: 12,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
								}}
							>
								<Text style={{ color: '#555', fontWeight: '500' }}>
									Using webex
								</Text>
								<Switch
									value={webex}
									onValueChange={value => setWebex(value)}
								/>
							</View>

							<View style={{ marginBottom: 12 }}>
								<Text
									style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
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
											marginRight: 8,
										}}
										onPress={() => _onPressOpenContactPersonModal()}
									>
										<Text>+</Text>
									</TouchableOpacity>
									{listContactSelectedConvert?.map((contactPerson, index) =>
										renderItemChip({
											userData: contactPerson,
											index,
											onPress: () => _onPressOpenContactPersonModal(),
										}),
									)}
								</ScrollView>
							</View>

							<TextInputCustomComponent
								label="Invite"
								enable={true}
								placeholder="user_a@chailease.com.vn; user_b@chailease.com.vn..."
								style={{ flex: 1, marginBottom: 12 }}
								value={invite}
								onChangeText={(text: string) => setInvite(text)}
							/>
						</Card>

						<Card style={{ padding: 8, marginTop: 8 }}>
							<TextInputCustomComponent
								label="Subject"
								placeholder=""
								multiline
								inputStyle={{
									height: Platform.OS === 'android' ? 50 : 'auto',
									textAlignVertical: 'top',
								}}
								value={subject}
								style={{ marginBottom: 12 }}
								onChangeText={text => setSubject(text)}
							/>

							<TextInputCustomComponent
								label="Content"
								placeholder=""
								multiline
								inputStyle={{
									height: Platform.OS === 'android' ? 50 : 'auto',
									textAlignVertical: 'top',
								}}
								value={content}
								onChangeText={text => setContent(text)}
							/>
						</Card>

						<View style={{ flexDirection: 'row', marginTop: 16 }}>
							{(!bookMeetingItem || bookMeetingItem?.ST_C === '01') && (
								<Button
									mode="contained"
									style={{ flex: 1, marginRight: 8 }}
									uppercase={false}
									disabled={loadingSave}
									loading={loadingSave}
									onPress={() =>
										_onPressButtonSave({ flag: bookMeetingItem ? 'U' : 'I' })
									}
								>
									{'Save'}
								</Button>
							)}

							{bookMeetingItem?.ST_C === '01' && (
								<Button
									mode="contained"
									style={{
										flex: 1,
										marginRight: 8,
										backgroundColor: Color.approved,
									}}
									disabled={loadingSubmit}
									loading={loadingSubmit}
									uppercase={false}
									onPress={() => _onPressButtonSave({ flag: 'S' })}
								>
									{'Submit'}
								</Button>
							)}

							{(bookMeetingItem?.ST_C === '01' ||
								bookMeetingItem?.ST_C === '02') && (
								<Button
									mode="contained"
									style={{ flex: 1, marginRight: 8, backgroundColor: 'red' }}
									uppercase={false}
									disabled={loadingCancel}
									loading={loadingCancel}
									onPress={() => _onPressButtonSave({ flag: 'D' })}
								>
									{'Cancel'}
								</Button>
							)}
						</View>
						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
