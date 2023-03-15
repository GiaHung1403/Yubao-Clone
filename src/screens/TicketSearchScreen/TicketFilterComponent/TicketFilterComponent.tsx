import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import PickerCustomComponent from '@components/PickerCustomComponent';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import { ModalDate } from '@models/ModalDateEnum';
import { IContact, ISpotlight, IUserSystem } from '@models/types';
import { convertUnixTimeSolid } from '@utils';
import { getTicket } from '@data/api';
import { getListContact } from '@actions/contact_action';
import EventEmitter from '@utils/events';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';

const timeNow = new Date();
const timeFrom = new Date(
	new Date(timeNow.getFullYear(), timeNow.getMonth() - 1, timeNow.getDate()),
);

const anime = {
	height: new Animated.Value(0),
	contentHeight: 150,
};

let listener = '';

const listYesNo: any = [
	{ label: 'Yes', value: '1' },
	{ label: 'No', value: '0' },
	{ label: 'All', value: '2' },
];

const listStatus: any = [
	{ label: 'Choose', value: '0' },
	{ label: '2 - In progress', value: '2' },
	{ label: '5 - Not yet started', value: '5' },
	{ label: '9 - Finished', value: '9' },
	{ label: '10 - Not yet finished', value: '10' },
	{ label: '13 - Follow up', value: '13' },
];

interface IContactReducer {
	listContact: IContact[];
}

let listSpotlight: ISpotlight[] = [];

export default function TicketFilterComponent(props: any) {
	const dateTimePickerRef = useRef<any>(null);
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { onLoading } = props;
	const [showView, setShowView] = useState(false);
	const [idModalDate, setIdModalDate] = useState(0);
	const [fromDate, setFromDate] = useState(timeFrom);
	const [toDate, setToDate] = useState(timeNow);
	const [statusFilter, setStatusFilter] = useState('10');
	const [studyCaseFilter, setStudyCaseFilter] = useState('2');
	const [firstPriorityFilter, setFirstPriorityFilter] = useState('0');
	const [subjectFilter, setSubjectFilter] = useState('');
	const [onTimeFilter, setOnTimeFilter] = useState('0');
	const [listTicket, getListTicket] = useState();

	const listContact: IContact[] = useSelector(
		(state: any) => state.contact_reducer.listContact,
	);

	const [listPIC_MIS, getListPIC_MIS] = useState([{}]);
	const [PIC_MIS, setPIC_MIS] = useState(
		dataUserSystem.DEPT_CODE === '0001' && dataUserSystem.EMP_NO !== '00039'
			? dataUserSystem.EMP_NO
			: '0',
	);

	const [user, setUser] = useState<IContact>();

	useEffect(() => {
		(async function search() {
			const credentials: any = await Keychain.getGenericPassword();
			const { password } = credentials;
			dispatch(
				getListContact({
					// User_ID: dataUserSystem.EMP_NO,
					// Password: '',
					// query: '',
					// Dept_Code: '0001',
					// Branch: '-1',
					// subteam: '',
					User_ID: dataUserSystem.EMP_NO,
					Password: '',
					query: '',
					Dept_Code: '0',
					Branch: '-1',
					subteam: undefined,
				}),
			);

			const userFind = listContact.find(
				(item: IContact) => item.emp_no === dataUserSystem.EMP_NO,
			);

			setUser(userFind);
		})();
		return () => anime.height.removeListener(listener);
	}, []);

	useEffect(() => {
		const listPICConvert = listContact
			.filter(item => item.dept_code === '0001')
			?.map(item => ({
				label: item.emp_nm,
				value: item.emp_no,
			}));
		listPICConvert.splice(0, 0, {
			label: 'Choose',
			value: '0',
		});
		getListPIC_MIS(listPICConvert);
	}, [listContact]);

	//Get Ticket
	useEffect(() => {
		_getData();
	}, []);

	EventEmitter.addEventListener('refTicket', () => {
		_getData();
	});

	useEffect(() => {
		EventEmitter.emit('searchTicket', listTicket);
	}, [listTicket]);

	const _onPressShowModalDate = (idModal: number) => {
		setIdModalDate(idModal);
		dateTimePickerRef.current.onShowModal();
	};

	const _onHandleConfirmDate = (date: Date) => {
		if (idModalDate === ModalDate.FROM_DATE) {
			setFromDate(date);
		} else {
			setToDate(date);
		}
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

		if (showView) {
			setShowView(false);
		}

		listener = anime.height.addListener(async ({ value }) => {
			if (value === anime.contentHeight && !showView) {
				setShowView(true);
				return;
			}
		});
	};
	const _getData = async () => {
		onLoading(false);
		const data: any = await getTicket({
			User_ID: dataUserSystem.EMP_NO,
			action: 'SEARCH_TICKET',
			key_data: statusFilter,
			from_date: moment(fromDate).format('DDMMYYYY'),
			to_date: moment(toDate).format('DDMMYYYY'),
			key_data_ext1: onTimeFilter,
			key_data_ext2: studyCaseFilter,
			title_feedback: subjectFilter,
			product_code: firstPriorityFilter,
			pic_mis: PIC_MIS,
			dept_code:
				dataUserSystem.DEPT_CODE === '0001'
					? '0'
					: dataUserSystem.DEPT_CODE === '0003'
					? user?.dept_code
					: dataUserSystem.DEPT_CODE,
			create_ticket:
				dataUserSystem.DEPT_CODE === '0001' ? '0' : dataUserSystem.EMP_NO,
		});
		getListTicket(data);
		onLoading(true);
	};

	const _onPressFilter = () => {
		_getData();
		if (showView) toggle();
	};

	return (
		<Card elevation={4}>
			{/* View Choose Date */}
			<View style={{}}>
				<View
					style={{
						flexDirection: 'row',
						marginTop: 8,
					}}
				>
					<TouchableOpacity
						style={{ padding: 8, flex: 1 }}
						onPress={() => _onPressShowModalDate(ModalDate.FROM_DATE)}
					>
						<Text style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}>
							From date
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
								{convertUnixTimeSolid(fromDate.getTime() / 1000)}
							</Text>
						</View>
					</TouchableOpacity>

					<TouchableOpacity
						style={{ padding: 8, flex: 1 }}
						onPress={() => _onPressShowModalDate(ModalDate.TO_DATE)}
					>
						<Text style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}>
							To date
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
								{convertUnixTimeSolid(toDate.getTime() / 1000)}
							</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style={{ flexDirection: 'row', marginHorizontal: 8 }}>
					<PickerCustomComponent
						showLabel={true}
						listData={listPIC_MIS}
						label="MIS P.I.C"
						value={PIC_MIS}
						style={{ flex: 1, marginRight: 8 }}
						enable={dataUserSystem.DEPT_CODE === '0001' ? true : false}
						onValueChange={text => setPIC_MIS(text)}
					/>
					<PickerCustomComponent
						showLabel={true}
						listData={listStatus}
						label="Status"
						value={statusFilter}
						style={{ flex: 1 }}
						onValueChange={text => setStatusFilter(text)}
					/>
				</View>
			</View>

			<Animated.View
				style={{ height: anime.height }}
				onLayout={_initContentHeight}
			>
				{/* View Status and OnTime */}
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
							listData={listYesNo}
							label="First Priority"
							value={firstPriorityFilter}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => setFirstPriorityFilter(text)}
						/>

						<PickerCustomComponent
							showLabel={true}
							listData={listYesNo}
							label="OnTime"
							value={onTimeFilter}
							style={{ flex: 1 }}
							onValueChange={text => setOnTimeFilter(text)}
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
						<PickerCustomComponent
							showLabel={true}
							listData={listYesNo}
							label="Study case"
							value={studyCaseFilter}
							style={{ flex: 1, marginRight: 8 }}
							onValueChange={text => setStudyCaseFilter(text)}
						/>

						<TextInputCustomComponent
							label="Subject"
							placeholder="Subject"
							value={subjectFilter}
							onChangeText={(text: string) => setSubjectFilter(text)}
							style={{ flex: 1 }}
						/>
					</View>
				)}

				{/* View Choose Marketing Team and Marketing Officer */}
			</Animated.View>

			<Button
				mode="contained"
				uppercase={false}
				style={{ margin: 8, width: 100, alignSelf: 'center' }}
				onPress={() => _onPressFilter()}
			>
				Search
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

			<DateTimePickerModalCustom
				ref={dateTimePickerRef}
				date={idModalDate === ModalDate.FROM_DATE ? fromDate : toDate}
				onConfirm={_onHandleConfirmDate}
			/>
		</Card>
	);
}
