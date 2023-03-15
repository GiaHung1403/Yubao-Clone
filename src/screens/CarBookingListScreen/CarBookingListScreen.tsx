import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
	Alert,
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { Card, Colors, FAB, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { ICarBooking } from '@models/types';
import CarBookingFilterComponent from './CarBookingFilterComponent';
import styles from './styles';

export function CarBookingListScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const listCarBooking: ICarBooking[] = useSelector(
		(state: any) => state.car_booking_reducer.listCarBooking,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	});

	const getColorStatus = (status: string) => {
		if (status?.includes('Cancel') || status?.includes('Refuse')) {
			return Color.reject;
		} else if (status?.includes('Accepted')) {
			return Color.approved;
		} else if (status?.includes('Processing')) {
			return Color.waiting;
		} else {
			return Colors.lightGreen600;
		}
	};

	const _onPressItem = (carBookingItem: ICarBooking) => {
		navigation.navigate('CarBookingDetailScreen', { carBookingItem });
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Car Booking List'} />

			<View style={{ zIndex: 1, paddingHorizontal: 8, paddingTop: 8 }}>
				<CarBookingFilterComponent />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listCarBooking.reverse()}
						keyExtractor={(_, index) => index.toString()}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<Card
								elevation={2}
								style={{ marginTop: 8, marginHorizontal: 8 }}
								onPress={() => _onPressItem(item)}
							>
								<View style={{ padding: 8 }}>
									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'barcode-outline'}
											value={item.booking_ID}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<Text
												style={{
													fontWeight: '500',
													color: getColorStatus(item.st_c_nm),
												}}
											>
												{item.st_c_nm}
											</Text>
											<View
												style={{
													width: 10,
													height: 10,
													borderRadius: 6,
													backgroundColor: getColorStatus(item.st_c_nm),
													marginLeft: 4,
												}}
											/>
										</View>
									</View>

									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'person-outline'}
											value={item.op_emp_nm}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<TextInfoRow
											icon={'calendar-outline'}
											isIconRight
											value={moment(new Date(item.booking_date)).format(
												'DD/MM/YYYY HH:mm',
											)}
										/>
									</View>

									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'layers-outline'}
											value={item.BOOKING_TP_NM}
										/>
									</View>

									<View style={{ marginBottom: 8 }}>
										<TextInfoRow
											icon={'timer-outline'}
											value={`${moment(item.start_date).format(
												'HH:mm DD/MM/YYYY',
											)} -> ${moment(item.end_date).format(
												'HH:mm DD/MM/YYYY',
											)}`}
											styleValue={{ fontWeight: '600', color: Color.approved }}
										/>
									</View>

									<View style={{ marginBottom: 8 }}>
										<TextInfoRow
											icon={'briefcase-outline'}
											value={item.ls_Nm}
											styleValue={{
												fontWeight: '600',
												color: Color.approved,
												flex: 1,
											}}
										/>
									</View>

									<TextInfoRow
										icon={'location-outline'}
										styleValue={{ flex: 1 }}
										value={`${item.destination} (${item?.DISTANCE}km)`}
									/>
								</View>
							</Card>
						)}
					/>
				</View>
			) : (
				<LoadingFullScreen />
			)}
			<MyComponent />
		</View>
	);
}

const MyComponent = () => {
	const navigation: any = useNavigation();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const onStateChange = ({ open }) => setIsOpen(open);

	return (
		<FAB.Group
			visible={true}
			open={isOpen}
			icon={isOpen ? 'close' : 'menu'}
			actions={[
				{
					icon: 'plus',
					label: 'New booking',
					onPress: () => navigation.navigate('CarBookingDetailScreen', {}),
				},
				{
					icon: 'sort',
					label: 'Sort',
					onPress: () => Alert.alert('Note', 'Coming Soon!'),
				},
			]}
			onStateChange={onStateChange}
			onPress={() => {
				if (isOpen) {
					// do something if the speed dial is open
				}
			}}
		/>
	);
};
