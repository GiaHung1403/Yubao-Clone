import { useNavigation } from '@react-navigation/native';
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
import { IBookMeeting } from '@models/types/IBookMeeting';
import BookMeetingFilterComponent from './BookMeetingFilterComponent';
import moment from 'moment';

export function BookMeetingListScreen() {
	const navigation: any = useNavigation();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);
	const { colors } = useTheme();
	const listBookMeeting: IBookMeeting[] = useSelector(
		(state: any) => state.book_meeting_reducer.listBookMeeting,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	});

	const _onPressItem = item => {
		navigation.navigate('BookMeetingDetailScreen', { bookMeetingItem: item });
	};

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

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Book Meeting List'} />

			<View style={{ zIndex: 1, paddingHorizontal: 8, paddingTop: 8 }}>
				<BookMeetingFilterComponent />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listBookMeeting}
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
											value={item.BOOKING_ID}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<Text
												style={{
													fontWeight: '500',
													color: getColorStatus(item.ST_C_NM),
												}}
											>
												{item.ST_C_NM}
											</Text>
											<View
												style={{
													width: 10,
													height: 10,
													borderRadius: 6,
													backgroundColor: getColorStatus(item.ST_C_NM),
													marginLeft: 4,
												}}
											/>
										</View>
									</View>

									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'person-outline'}
											value={item.OP_EMP_NM}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<TextInfoRow
											icon={'business-outline'}
											isIconRight
											value={item.MEET_NM}
										/>
									</View>

									<TextInfoRow
										icon={'bookmark-outline'}
										value={item.TITLE}
										styleValue={{ flex: 1 }}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'calendar-outline'}
										value={`${moment(new Date(item.START_DATE)).format(
											'HH:mm',
										)} -> ${moment(new Date(item.END_DATE)).format(
											'HH:mm',
										)} ${moment(new Date(item.BOOKING_DATE)).format(
											'DD/MM/YYYY',
										)}`}
										styleValue={{ fontWeight: '600', color: Color.approved }}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'briefcase-outline'}
										value={item.OPTIONAL_NM}
										styleValue={{
											fontWeight: '600',
											color: Color.approved,
											flex: 1,
										}}
										containerStyle={{ marginBottom: 8 }}
									/>
								</View>
							</Card>
						)}
					/>
				</View>
			) : (
				<LoadingFullScreen />
			)}
			<FABButtonFunction />
		</View>
	);
}

const FABButtonFunction = () => {
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
					onPress: () => navigation.navigate('BookMeetingDetailScreen', {}),
				},
				{
					icon: 'calendar-outline',
					label: 'View Calendar',
					onPress: () => navigation.navigate('ViewCalendarBookMeetingModal'),
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
