import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	TextStyle,
	View,
} from 'react-native';
import { Card, FAB, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Colors from '@config/Color';
import Color from '@config/Color';
import { ILeaveRequest } from '@models/types';
import moment from 'moment';
import LeaveRequestFilterComponent from './LeaveRequestFilterComponent';
import styles from './styles';

interface IPropItemLeaveRequest {
	icon: string;
	isIconRight?: boolean;
	value: string;
	styleValue?: TextStyle;
	iconColor: string;
}

interface IPropLeaveReducer {
	listLeaveRequest: ILeaveRequest[];
	loading: boolean;
}

const rowItemValue = ({
	icon,
	isIconRight,
	value,
	styleValue,
	iconColor,
}: IPropItemLeaveRequest) => (
	<View
		style={[
			styles.containerRowItemValue,
			{ justifyContent: isIconRight ? 'flex-end' : 'flex-start' },
		]}
	>
		{isIconRight ? null : (
			<Icon
				as={Ionicons}
				name={icon}
				size={6}
				color={iconColor}
				marginRight={4}
			/>
		)}
		<Text style={styleValue}>{value}</Text>
		{isIconRight ? (
			<Icon
				as={Ionicons}
				name={icon}
				size={6}
				color={iconColor}
				marginLeft={4}
			/>
		) : null}
	</View>
);

const convertLeaveTake = listPeriod => {
	let day = listPeriod.reduce((a, b) => a + b.cDays, 0);
	let hour = listPeriod.reduce((a, b) => a + b.cHours, 0);
	const minute = listPeriod.reduce((a, b) => a + b.cMinutes, 0);

	if (hour >= 8) {
		day += parseInt((hour / 8).toString());
		hour -= 8;
	}

	return `${day === 0 ? '' : `${day}d `}${hour === 0 ? '' : `${hour}h `}${
		minute === 0 ? '' : `${minute}m`
	}`;
};

export function LeaveRequestSearchScreen(props: any) {
	const navigation: any = useNavigation();

	const { colors } = useTheme();
	const { listLeaveRequest, loading }: IPropLeaveReducer = useSelector(
		(state: any) => state.leave_request_reducer,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	}, []);

	const _onPressItem = item => {
		navigation.navigate('LeaveRequestDetailScreen', { leaveItem: item });
	};

	const getColorStatus = (status: string) => {
		switch (status) {
			case 'Reject':
				return Colors.reject;
			case 'Draft':
				return Colors.draft;
			case 'Success':
				return Colors.approved;
			default:
				return Colors.waiting;
		}
	};

	return (
		<View style={styles.container}>
			<Header title={'Leave Request'} />

			<View style={styles.containerFilter}>
				<LeaveRequestFilterComponent />
			</View>

			{doneLoadAnimated && !loading ? (
				<View style={styles.containerBody}>
					<View style={styles.containerListData}>
						<FlatList
							data={listLeaveRequest.sort((a, b) => {
								return (
									new Date(b?.requestDate).getTime() -
									new Date(a?.requestDate).getTime()
								);
							})}
							keyExtractor={(_, index) => index.toString()}
							extraData={props}
							ListFooterComponent={() => (
								<SafeAreaView style={{ height: 60 }} />
							)}
							renderItem={({ item, index }) => (
								<Card
									elevation={2}
									style={styles.containerCardItem}
									onPress={() => _onPressItem(item)}
								>
									<View style={styles.viewInCardItem}>
										<View style={{ flexDirection: 'row', marginBottom: 8 }}>
											{rowItemValue({
												icon: 'barcode-outline',
												value: item.reqID,
												styleValue: {
													fontWeight: '600',
													color: colors.primary,
												},
												iconColor: colors.primary,
											})}
											<View
												style={{ flexDirection: 'row', alignItems: 'center' }}
											>
												<Text
													style={{
														fontWeight: '500',
														color: getColorStatus(item.status),
													}}
												>
													{item.status}
												</Text>
												<View
													style={{
														width: 10,
														height: 10,
														borderRadius: 6,
														backgroundColor: getColorStatus(item.status),
														marginLeft: 4,
													}}
												/>
											</View>
										</View>

										<View style={{ flexDirection: 'row', marginBottom: 8 }}>
											{rowItemValue({
												icon: 'person-outline',
												value: item.picName,
												iconColor: colors.primary,
											})}

											{rowItemValue({
												icon: 'calendar-outline',
												isIconRight: true,
												value: moment(new Date(item.requestDate)).format(
													'DD/MM/YYYY',
												),
												iconColor: colors.primary,
											})}
										</View>

										{rowItemValue({
											icon: 'timer-outline',
											value: `${moment(item.lstPeriod[0].startDate).format(
												'HH:mm DD/MM/YYYY',
											)} -> ${moment(
												item.lstPeriod[item.lstPeriod.length - 1].endDate,
											).format('HH:mm DD/MM/YYYY')} (${convertLeaveTake(
												item.lstPeriod,
											)})`,
											styleValue: {
												fontWeight: '500',
												color: Color.approved,
												flex: 1,
											},
											iconColor: colors.primary,
										})}
									</View>
								</Card>
							)}
						/>
					</View>
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
					label: 'New request',
					onPress: () => navigation.navigate('LeaveRequestDetailScreen', {}),
				},
				{
					icon: 'calendar-today',
					label: 'Check day-off remaining',
					onPress: () => navigation.navigate('LeaveRequestRemainingScreen'),
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
