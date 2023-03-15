import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Keyboard,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import Header from '@components/Header';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import EventEmitter from '@utils/events';
import { IContact, IUserSystem } from '@models/types';
import { getListContact } from '@actions/contact_action';
import * as Keychain from 'react-native-keychain';
import moment from 'moment';
import { updateTicketMIS } from '@data/api';

import styles from './styles';

const listYesNo: any = [
	{ label: 'Yes', value: '1' },
	{ label: 'No', value: '0' },
	{ label: 'All', value: '2' },
];

const listRequestVia: any = [
	{ label: '01 - System', value: '0' },
	{ label: '02 - Mail', value: '1' },
	{ label: '03 - Phone', value: '2' },
];

const listStatus: any = [
	{ label: 'Choose', value: '0' },
	{ label: '2 - In progress', value: '2' },
	{ label: '5 - Not yet started', value: '5' },
	{ label: '9 - Finished', value: '9' },
	{ label: '11 - Cancel (By IT)', value: '11' },
	{ label: '12 - Cancel (By User)', value: '12' },
	{ label: '13 - Follow up', value: '13' },
];

interface IContactReducer {
	listContact: IContact[];
}

export function TicketITControlScreen(props: any) {
	const navigation: any = useNavigation();
	const dateTimePickerRef = useRef<any>(null);
	const [deadline, setDeadline] = useState(new Date());
	const [firstPriority, setFirstPriority] = useState('0');
	const [studyCase, setStudyCase] = useState('0');
	const dispatch = useDispatch();
	const [listPIC_MIS, getListPIC_MIS] = useState([{}]);
	const [PIC_MIS, setPIC_MIS] = useState('0');
	const [jobNo, setJobNo] = useState('');
	const [requestVia, setRequestVia] = useState('0');

	const [status, setStatus] = useState('');
	const [finisheDate, setFinisheDate] = useState('');
	const [itSolution, setITSolution] = useState('');
	const [remake, setReamke] = useState('');
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listContact }: IContactReducer = useSelector(
		(state: any) => state.contact_reducer,
	);

	const { detail } = props.route.params;

	useEffect(() => {
		(async function search() {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;
			dispatch(
				getListContact({
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: '0001',
					Branch: '-1',
					subteam: '',
				}),
			);
		})();

		setPIC_MIS(detail[0]?.IT_PIC);
		setJobNo(detail[0]?.JOB_NO);
		setFinisheDate(detail[0]?.finish_date);
		setStatus(detail[0]?.STA);
		setFirstPriority(detail[0]?.PRIORITY.toString());
		setStudyCase(detail[0]?.IS_STUDY.toString());
		setITSolution(detail[0]?.IT_SOLUTION);
		setReamke(detail[0]?.RMKS);
	}, []);

	useEffect(() => {
		const listPICConvert = listContact?.map(item => ({
			label: item.emp_nm,
			value: item.emp_no,
		}));
		getListPIC_MIS(listPICConvert);
	}, [listContact]);

	const { colors } = useTheme();
	const _onPressShowModalDate = () => {
		dateTimePickerRef.current.onShowModal();
	};

	const _onHandleConfirmDate = (date: Date) => {
		setDeadline(date);
	};

	const callEvent = async () => {
		const data = await updateTicketMIS({
			User_ID: dataUserSystem.EMP_NO,
			action: 'UPDATE_TICKET',
			key_data: detail[0]?.TIC_TYPE,
			key_data_ext1: detail[0]?.TIC_MODULE,
			key_data_ext2: detail[0]?.TIC_FUNC,
			product_code: detail[0]?.TIC_FUNC_DTL,
			content_feedback: detail[0]?.DESCRIPT,
			title_feedback: detail[0]?.SUBJ,
			pic_mis: PIC_MIS,
			ticket_id: detail[0]?.LOG_ID,
			email: detail[0]?.CC,
			remake: remake,
			status: status,
		});
	};

	const _onPressSave = async () => {
		try {
			Keyboard.dismiss();
			if (status === '11' || status === '12') {
				if (remake === '') {
					Alert.alert('Alert', 'Input Remake');
					return;
				} else {
					callEvent();
				}
			} else {
				callEvent();
			}

			// Alert.alert('Alert', 'Update ticket successful');
			EventEmitter.emit('refTicket');
			setTimeout(() => {
				//setVisibleSnackBar(false);
				navigation.navigate('TicketSearchScreen');
			}, 1000);
		} catch (err) {
			// setLabelSnackBar(err.message);
			// setVisibleSnackBar(true);
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Ticket IT Controls'} />

			<TouchableWithoutFeedback
				style={{ flex: 1 }}
				onPress={() => Keyboard.dismiss()}
			>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'android' ? undefined : 'height'}
				>
					<ScrollView style={{ flex: 1 }}>
						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 8 }}>
							<View style={{ padding: 8 }}>
								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<TouchableOpacity
										style={{ flex: 1 }}
										onPress={() => _onPressShowModalDate()}
									>
										<Text
											style={{
												fontWeight: '600',
												color: '#555',
												marginBottom: 4,
											}}
										>
											Deadline
										</Text>
										<View
											style={{
												flexDirection: 'row',
												alignItems: 'center',
												borderWidth: 0.5,
												borderColor: '#666',
												padding: 8,
												borderRadius: 4,
												height: 43,
											}}
										>
											<Icon
												as={AntDesign}
												name={'calendar'}
												size={7}
												color={colors.primary}
												marginRight={8}
											/>
											<Text style={{ fontWeight: '600', color: '#666' }}>
												{moment().format('DD/MM/YYYY')}
											</Text>
										</View>
									</TouchableOpacity>

									<TextInputCustomComponent
										label="No Jobs"
										placeholder=""
										value={jobNo}
										onChangeText={(text: string) => null}
										style={{ flex: 1, marginLeft: 8 }}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<PickerCustomComponent
										showLabel={true}
										listData={listYesNo}
										label="First Priority"
										value={firstPriority}
										style={{ flex: 1 }}
										onValueChange={text => setFirstPriority(text)}
									/>

									<PickerCustomComponent
										showLabel={true}
										listData={listYesNo}
										label="Study case"
										value={studyCase}
										style={{ flex: 1, marginLeft: 8 }}
										onValueChange={text => setStudyCase(text)}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginTop: 8 }}>
									<TextInputCustomComponent
										label="Finish Date"
										placeholder=""
										enable={false}
										value={moment(finisheDate).format('DD.MM.YYYY HH:mm:ss')}
										onChangeText={(text: string) => null}
										style={{ flex: 1 }}
									/>

									<PickerCustomComponent
										showLabel={true}
										listData={listRequestVia}
										label="Request via"
										value={requestVia}
										style={{ flex: 1, marginLeft: 8 }}
										onValueChange={text => setRequestVia(text)}
									/>
								</View>

								<View style={{ flexDirection: 'row', marginVertical: 8 }}>
									<PickerCustomComponent
										showLabel={true}
										listData={listPIC_MIS}
										label="MIS P.I.C"
										value={PIC_MIS}
										style={{ flex: 1 }}
										onValueChange={text => setPIC_MIS(text)}
									/>

									<PickerCustomComponent
										showLabel={true}
										listData={listStatus}
										label="Status"
										value={status}
										style={{ flex: 1, marginLeft: 8 }}
										onValueChange={text => setStatus(text)}
									/>
								</View>
							</View>
						</Card>

						<Card elevation={2} style={{ marginHorizontal: 8, marginTop: 8 }}>
							<View style={{ padding: 8 }}>
								<TextInputCustomComponent
									label="IT Solution"
									placeholder="IT Solution"
									multiline={true}
									value={itSolution}
									inputStyle={{ height: 60 }}
									style={{ marginTop: 8 }}
									onChangeText={(text: string) => setITSolution(text)}
								/>

								<TextInputCustomComponent
									label="Remark"
									placeholder="Remark"
									multiline={true}
									value={remake}
									inputStyle={{ height: 50 }}
									style={{ marginVertical: 8 }}
									onChangeText={(text: string) => setReamke(text)}
								/>
							</View>
						</Card>

						<Button
							mode="contained"
							uppercase={false}
							onPress={() => _onPressSave()}
							style={{ marginHorizontal: 8, marginTop: 16 }}
						>
							Save
						</Button>

						<SafeAreaView style={{ height: 60 }} />
					</ScrollView>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>

			<DateTimePickerModalCustom
				ref={dateTimePickerRef}
				date={deadline}
				onConfirm={_onHandleConfirmDate}
			/>
		</View>
	);
}
