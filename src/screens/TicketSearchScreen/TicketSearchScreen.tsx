import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Text,
	TextStyle,
	View,
	SafeAreaView,
	InteractionManager,
} from 'react-native';
import { Card, FAB } from 'react-native-paper';

import Header from '@components/Header';
import Color from '@config/Color';
import TicketFilterComponent from './TicketFilterComponent';

import { useTheme } from 'react-native-paper';
import styles from './styles';
import { IUserSystem } from '@models/types';
import { useSelector } from 'react-redux';
import EventEmitter from '@utils/events';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';

interface IPropItemTicket {
	label: string;
	value: string;
	styleValue?: TextStyle;
}

const itemTicketView = ({ label, value, styleValue }: IPropItemTicket) => (
	<View style={{ flexDirection: 'row', marginBottom: 8 }}>
		<Text style={{ flex: 1 }}>{label}</Text>
		<Text style={styleValue}>{value}</Text>
	</View>
);

export function TicketSearchScreen(props: any) {
	const navigation: any = useNavigation();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [listTicket, setListTicket] = useState<any>();
	const [newList, setNewList] = useState<any>();
	const [loading, setLoading] = useState(false);

	const { colors } = useTheme();

	EventEmitter.addEventListener('searchTicket', item => {
		const listTicket_STA2 = item?.filter(item => item.STA === '2');
		const lastListTicket = item?.filter(item => item.STA !== '2');
		const newListTicket = listTicket_STA2.concat(lastListTicket);
		setListTicket(newListTicket);
	});

	const getColorStatus = (status: string) => {
		if (status.toLowerCase() === 'finished') {
			return Color.approved;
		}
		if (status.toLowerCase().includes('cancel')) {
			return Color.reject;
		}
		return Color.waiting;
	};

	const _onPressItemTicket = item => {
		navigation.navigate('TicketDetailScreen', {
			ticketID: item,
		});
	};

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<Header title={'Ticket Management'} />
			<View style={{ flex: 1 }}>
				<View style={{ marginHorizontal: 8, zIndex: 2, marginTop: 8 }}>
					<TicketFilterComponent onLoading={item => setLoading(item)} />
				</View>
				{loading ? (
					<FlatList
						data={listTicket}
						contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
						renderItem={({ item, index }) => (
							<Card
								elevation={2}
								style={{ marginHorizontal: 8, marginBottom: 8, }}
								onPress={() => {
									_onPressItemTicket(item?.LOG_ID);
								}}
							>
								<View style={{ padding: 8 }}>
									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'barcode-outline'}
											value={item?.LOG_ID}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<Text
												style={{
													fontWeight: '500',
													color: getColorStatus(item?.sta_c),
												}}
											>
												{item?.sta_c}
											</Text>
											<View
												style={{
													width: 10,
													height: 10,
													borderRadius: 6,
													backgroundColor: getColorStatus(item?.sta_c),
													marginLeft: 4,
												}}
											/>
										</View>
									</View>

									<TextInfoRow
										icon={'person-outline'}
										value={item?.op_emp_nm}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'receipt-outline'}
										value={item?.SUBJ}
										styleValue={{
											fontWeight: '600',
											color: Color.approved,
											maxWidth: 250,
										}}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'stopwatch'}
										value={item?.c_bas_date}
										containerStyle={{ marginBottom: 8 }}
									/>

									{/* {!item?.sta_c.toLowerCase().includes('cancel') && (
										<TextInfoRow
											icon={'stopwatch'}
											value={
												item?.finish_date === '1900-01-01T00:00:00'
													? 'null'
													: moment(item?.finish_date).format(
															'DD.MM.YYYY HH:mm:ss',
													  )
											}
											containerStyle={{ marginBottom: 8 }}
										/>
									)} */}
									{item?.S_time &&
									!item?.sta_c.toLowerCase().includes('cancel') ? (
										<TextInfoRow
											icon={'hourglass-outline'}
											value={item?.S_time}
											styleValue={{
												fontWeight: '600',
												color:
													item?.S_time.includes('day') &&
													item?.S_time.includes('hour')
														? Color.reject
														: Color.approved,
											}}
										/>
									) : null}
								</View>
							</Card>
						)}
					/>
				) : (
					<LoadingFullScreen size={'large'}/>
				)}
			</View>
			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() => navigation.navigate('TicketDetailScreen', {})}
				/>
			</SafeAreaView>
		</View>
	);
}
