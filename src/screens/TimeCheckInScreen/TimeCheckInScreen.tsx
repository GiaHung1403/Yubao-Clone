import { AntDesign } from '@expo/vector-icons';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import {
	ActivityIndicator,
	InteractionManager,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Keychain from 'react-native-keychain';
import { Card, DataTable, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import moment from 'moment';

import DateTimePickerModalCustom from '@components/DateTimePickerModalCustom';
import Header from '@components/Header';
import { getCheckInTime } from '@data/api';
import { ModalDate } from '@models/ModalDateEnum';
import { ITimeCheckIn, IUserSystem } from '@models/types';
import styles from './styles';

const timeNow = new Date();
const timeFromDefault = new Date(timeNow.getFullYear(), timeNow.getMonth(), 1);

const isCheckInLate = (time: string) => {
	const timeSplit = time?.split(':');

	return parseInt(timeSplit[0], 10) >= 8 && parseInt(timeSplit[1], 10) > 0;
};

const isCheckOutSoon = (time: string) => {
	const timeSplit = time?.split(':');

	return parseInt(timeSplit[0], 10) < 17;
};

export function TimeCheckInScreen(props: any) {
	const dateTimePickerRef = useRef<any>(null);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const { colors } = useTheme();
	const [listTimeCheckIn, setListTimeCheckIn] = useState<ITimeCheckIn[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [idModalDate, setIdModalDate] = useState(0);
	const [fromDate, setFromDate] = useState(timeFromDefault);
	const [toDate, setToDate] = useState(timeNow);

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

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			const { password }: any = await Keychain.getGenericPassword();

			setLoading(true);
			const responseCheckInTime: any = await getCheckInTime({
				User_ID: dataUserSystem.EMP_NO,
				Password: password,
				fromDate: moment(fromDate).format('DDMMYYYY'),
				toDate: moment(toDate).format('DDMMYYYY'),
			});

			setListTimeCheckIn(responseCheckInTime);
			setLoading(false);
		});
	}, [fromDate, toDate]);

	return (
		<View style={{ flex: 1 }}>
			<View>
				<Header title={'Time Checkin - Checkout'} />
			</View>

			<View style={{ flex: 1 }}>
				<Card
					elevation={4}
					style={{ marginHorizontal: 8, marginTop: 8, paddingVertical: 8 }}
				>
					{/* View Choose Date */}
					<View
						style={{
							flexDirection: 'row',
						}}
					>
						<TouchableOpacity
							style={{ padding: 8, flex: 1 }}
							onPress={() => _onPressShowModalDate(ModalDate.FROM_DATE)}
						>
							<Text
								style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
							>
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
									{moment(fromDate).format('DD/MM/YYYY')}
								</Text>
							</View>
						</TouchableOpacity>

						<TouchableOpacity
							style={{ padding: 8, flex: 1 }}
							onPress={() => _onPressShowModalDate(ModalDate.TO_DATE)}
						>
							<Text
								style={{ fontWeight: '600', color: '#555', marginBottom: 8 }}
							>
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
									{moment(toDate).format('DD/MM/YYYY')}
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</Card>

				<Card elevation={2} style={{ flex: 1, margin: 8, padding: 8 }}>
					<DataTable style={{ flex: 1 }}>
						<DataTable.Header>
							<DataTable.Title sortDirection={'ascending'}>
								<Text
									style={{
										fontSize: 14,
										color: colors.primary,
										fontWeight: '600',
									}}
								>
									Date
								</Text>
							</DataTable.Title>
							<DataTable.Title numeric>
								<Text
									style={{
										fontSize: 14,
										color: colors.primary,
										fontWeight: '600',
									}}
								>
									Check in
								</Text>
							</DataTable.Title>
							<DataTable.Title numeric>
								<Text
									style={{
										fontSize: 14,
										color: colors.primary,
										fontWeight: '600',
									}}
								>
									Check out
								</Text>
							</DataTable.Title>
						</DataTable.Header>

						{!loading ? (
							<ScrollView
								style={{ flex: 1 }}
								showsVerticalScrollIndicator={false}
							>
								{listTimeCheckIn.map((timeCheckIn: ITimeCheckIn, index) => (
									<DataTable.Row key={index.toString()}>
										<DataTable.Cell>{timeCheckIn.dayCheck}</DataTable.Cell>
										<DataTable.Cell numeric>
											<Text
												style={{
													color: isCheckInLate(timeCheckIn.checkin)
														? 'red'
														: '#2c82c9',
													fontWeight: '600',
												}}
											>
												{timeCheckIn.checkin}
											</Text>
										</DataTable.Cell>
										<DataTable.Cell numeric>
											<Text
												style={{
													color: isCheckOutSoon(timeCheckIn.checkout)
														? 'red'
														: '#2c82c9',
													fontWeight: '600',
												}}
											>
												{timeCheckIn.checkout}
											</Text>
										</DataTable.Cell>
									</DataTable.Row>
								))}
							</ScrollView>
						) : (
							<View
								style={{
									flex: 1,
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<ActivityIndicator />
							</View>
						)}
					</DataTable>
				</Card>
				<SafeAreaView />
			</View>

			<DateTimePickerModalCustom
				ref={dateTimePickerRef}
				date={idModalDate === ModalDate.FROM_DATE ? fromDate : toDate}
				onConfirm={_onHandleConfirmDate}
			/>
		</View>
	);
}
