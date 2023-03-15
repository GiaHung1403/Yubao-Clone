import { AntDesign, Ionicons } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import TextInputCustomComponent from '@components/TextInputCustomComponent';
import Colors from '@config/Color';
import { ModalDate } from '@models/ModalDateEnum';
import { IContact, ISpotlight, IUserSystem } from '@models/types';
import { convertUnixTimeSolid } from '@utils';
import moment from 'moment';
import * as Keychain from 'react-native-keychain';
import { getListContract_Timeline } from '@actions/contract_timeline_action';

const anime = {
	height: new Animated.Value(0),
	contentHeight: 100,
};

let listener = '';

interface IContactReducer {
	listContact: IContact[];
}

export default function TimeLineFilterComponent(props: any) {
	const dateTimePickerRef = useRef<any>(null);
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { fromDate, toDate, onSetFromDate, onSetToDate } = props;
	const [showView, setShowView] = useState(false);
	const [idModalDate, setIdModalDate] = useState(0);
	const [CNID, setCNID] = useState('');
	const [customerName, setCustomerName] = useState('');
	const [contractNo, setContractNo] = useState('');

	useEffect(() => {
		(async function search() {
			const credentials: any = await Keychain.getGenericPassword();
			_getData();
		})();
		return () => anime.height.removeListener(listener);
	}, []);

	const _onPressShowModalDate = (idModal: number) => {
		setIdModalDate(idModal);
		dateTimePickerRef.current.onShowModal();
	};

	const _onHandleConfirmDate = (date: Date) => {
		if (idModalDate === ModalDate.FROM_DATE) {
			onSetFromDate(date);
		} else {
			onSetToDate(date);
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

	const _getData = () => {
		setTimeout(
			() =>
				dispatch(
					getListContract_Timeline({
						emp_No: ['00039','00965'].includes(dataUserSystem.EMP_NO)
							? ''
							: dataUserSystem.EMP_NO,
						s_Start_Date: moment(fromDate).format('DDMMYYYY'),
						s_End_Date: moment(toDate).format('DDMMYYYY'),
						cnid: CNID,
						apno: contractNo,
						customerName,
					}),
				),
			400,
		);
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
					<TextInputCustomComponent
						label="Contract No."
						placeholder="Contract No"
						value={contractNo}
						onChangeText={(text: string) => setContractNo(text)}
						style={{ flex: 1, marginRight: 19 }}
					/>
					<TextInputCustomComponent
						label="CNID"
						placeholder="CNID"
						value={CNID}
						onChangeText={(text: string) => setCNID(text)}
						style={{ flex: 1 }}
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
						<TextInputCustomComponent
							label="Customer Name"
							placeholder="Customer Name"
							value={customerName}
							onChangeText={(text: string) => setCustomerName(text)}
							style={{ flex: 1 }}
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
