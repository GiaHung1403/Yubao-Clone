import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	View,
} from 'react-native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Color from '@config/Color';
import { getListBookMeeting } from '@data/api';
import { IBookMeeting, IUserSystem } from '@models/types';
import { convertUnixTimeNoSpace } from '@utils';

const listHour = [
	{ id: 1, label: '07:00', value: { h: 7, m: 0 } },
	{ id: 2, label: '07:30', value: { h: 7, m: 30 } },
	{ id: 3, label: '08:00', value: { h: 8, m: 0 } },
	{ id: 4, label: '08:30', value: { h: 8, m: 30 } },
	{ id: 5, label: '09:00', value: { h: 9, m: 0 } },
	{ id: 6, label: '09:30', value: { h: 9, m: 30 } },
	{ id: 7, label: '10:00', value: { h: 10, m: 0 } },
	{ id: 8, label: '10:30', value: { h: 10, m: 30 } },
	{ id: 9, label: '11:00', value: { h: 11, m: 0 } },
	{ id: 10, label: '11:30', value: { h: 11, m: 30 } },
	{ id: 11, label: '12:00', value: { h: 12, m: 0 } },
	{ id: 12, label: '12:30', value: { h: 12, m: 30 } },
	{ id: 13, label: '13:00', value: { h: 13, m: 0 } },
	{ id: 14, label: '13:30', value: { h: 13, m: 30 } },
	{ id: 15, label: '14:00', value: { h: 14, m: 0 } },
	{ id: 16, label: '14:30', value: { h: 14, m: 30 } },
	{ id: 17, label: '15:00', value: { h: 15, m: 0 } },
	{ id: 18, label: '15:30', value: { h: 15, m: 30 } },
	{ id: 19, label: '16:00', value: { h: 16, m: 0 } },
	{ id: 20, label: '16:30', value: { h: 16, m: 30 } },
	{ id: 21, label: '17:00', value: { h: 17, m: 0 } },
	{ id: 22, label: '17:30', value: { h: 17, m: 30 } },
	{ id: 23, label: '18:00', value: { h: 18, m: 0 } },
	{ id: 24, label: '18:30', value: { h: 18, m: 30 } },
	{ id: 25, label: '19:00', value: { h: 19, m: 0 } },
];

const listColorMaterial = [
	Color.approved,
	'#e29df6',
	'#5fe607',
	'#23bac6',
	'#e89e13',
	'#e148a0',
	'#206078',
	Color.main,
];

function diffCalculator(start, end) {
	start = start.split(':');
	end = end.split(':');
	const startDateDiff = new Date(0, 0, 0, start[0], start[1], 0);
	const endDateDiff = new Date(0, 0, 0, end[0], end[1], 0);
	let diff = endDateDiff.getTime() - startDateDiff.getTime();
	let hours = Math.floor(diff / 1000 / 60 / 60);
	diff -= hours * 1000 * 60 * 60;
	const minutes = Math.floor(diff / 1000 / 60);

	// If using time pickers with 24 hours format, add the below line get exact hours
	if (hours < 0) hours = hours + 24;

	return hours * 2 + (minutes >= 30 ? 1 : 0) + 1;
}

export function ViewCalendarBookMeetingModal() {
	const navigation: any = useNavigation();

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { listMeetingRoom } = useSelector(
		(state: any) => state.book_meeting_reducer,
	);

	const [listBookMeeting, setListBookMeeting] = useState<IBookMeeting[]>([]);

	useEffect(() => {
		console.log(listMeetingRoom.filter(item => item.value !== '0'));
		console.log(listBookMeeting);

	}, [listBookMeeting]);

	useEffect(() => {
		(async function getListData() {
			const listBooking = (await getListBookMeeting({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				fromDate: '01122022',
				toDate: '09122022',
				branchID: dataUserSystem.BRANCH_CODE,
				roomID: '',
				bookingID: '',
				meetingContent: '',
			})) as IBookMeeting[];
			setListBookMeeting(listBooking);
		})();
	}, []);

	const getIndexHour = booking => {
		const index = listHour.findIndex(
			item => parseInt(booking.START_TIME.substr(0, 2), 10) === item.value.h,
		);
		return index || 0;
	};

	const roundingTimeStart = booking => {
		const start = booking.START_TIME.split(':');
		return parseInt(start[1], 10) > 30 ? `${start[0]}:30` : `${start[0]}:00`;
	};

	const roundingTimeEnd = booking => {
		const end = booking.END_TIME.split(':');
		return parseInt(end[1], 10) > 30
			? `${parseInt(end[0], 10) + 1}:00`
			: `${end[0]}:30`;
	};

	return (
		<View style={{ flex: 1 }}>
			<StatusBar barStyle={'dark-content'} />
			<SafeAreaView
				style={{
					paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
				}}
			/>
			{/* View Header */}
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
					Close
				</Button>
				<Text style={{ fontSize: 15, fontWeight: '600', color: '#555' }}>
					View calendar meeting
				</Text>
				<Button uppercase={false} style={{}} onPress={() => null}>
					{'OK'}
				</Button>
			</View>

			<View style={{ flex: 1, paddingTop: 8 }}>
				<ScrollView style={{ flex: 1 }}>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{ flex: 1 }}
					>
						<View>
							<View style={{ flexDirection: 'row', marginLeft: 120 }}>
								{listHour.map(item => (
									<Text
										key={item.id.toString()}
										style={{ width: 100, textAlign: 'center' }}
									>
										{item.label}
									</Text>
								))}
							</View>

							<View style={{ marginTop: 12 }}>
								{listMeetingRoom
									.filter(item => item.value !== '0')
									.map((item, index) => (
										<View
											key={index.toString()}
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<Text
												style={{
													padding: 8,
													width: 120,
													position: 'absolute',
													color: listColorMaterial[index],
													fontWeight: '600',
												}}
											>
												{item.label}
											</Text>
											<View
												style={{
													flexDirection: 'row',
													marginLeft: 128,
													minHeight: 50,
												}}
											>
												{listBookMeeting
													.filter(
														booking => booking.CAR_ID.toString() === item.value,
													)
													?.map(booking => (
														<View
															key={booking.BOOKING_ID.toString()}
															style={{
																minWidth:
																	100 *
																	diffCalculator(
																		roundingTimeStart(booking),
																		roundingTimeEnd(booking),
																	),
																minHeight: 50,
																marginLeft: getIndexHour(booking) * 100,
																borderRadius: 4,
																borderWidth: 0.5,
																borderColor: '#fff',
																backgroundColor: listColorMaterial[index],
															}}
														/>
													))}
											</View>
										</View>
									))}
							</View>
						</View>
					</ScrollView>
				</ScrollView>
			</View>
		</View>
	);
}
