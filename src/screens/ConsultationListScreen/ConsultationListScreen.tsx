import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
	FlatList,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { Card, Colors, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { IConsultationItemList } from '@models/types';
import ConsultationFilterComponent from './ConsultationFilterComponent';

import styles from './styles';

export function ConsultationListScreen(props: any) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const listConsultation: IConsultationItemList[] = useSelector(
		(state: any) => state.consultation_reducer.listConsultation,
	);

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			listConsultation && setDoneLoadAnimated(true);
		});
	}, []);

	const getColorStatus = (status: string) => {
		if (status?.includes('No')) {
			return Color.waiting;
		} else if (status?.includes('Approve')) {
			return Color.approved;
		} else {
			return Colors.lightGreen600;
		}
	};

	const _onPressItem = (consultationItem: IConsultationItemList) => {
		navigation.navigate('ConsultationDetailScreen', {
			consultationID: consultationItem.key_ID,
		});
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'Consultation List'} />
			<View style={{ zIndex: 1, paddingHorizontal: 8, paddingTop: 8 }}>
				<ConsultationFilterComponent />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listConsultation}
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
											value={item.key_ID}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<View
											style={{ flexDirection: 'row', alignItems: 'center' }}
										>
											<Text
												style={{
													fontWeight: '500',
													color: getColorStatus(item.aprV_YN),
												}}
											>
												{item.aprV_YN}
											</Text>
											<View
												style={{
													width: 10,
													height: 10,
													borderRadius: 6,
													backgroundColor: getColorStatus(item.aprV_YN),
													marginLeft: 4,
												}}
											/>
										</View>
									</View>

									<TextInfoRow
										icon={'briefcase-outline'}
										value={item.ls_Nm}
										styleValue={{
											flex: 1,
											color: colors.primary,
											fontWeight: '600',
										}}
										containerStyle={{ marginBottom: 8 }}
									/>

									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow
											icon={'person-outline'}
											styleValue={{ fontWeight: '600', color: Color.approved }}
											containerStyle={{ flex: 2 }}
											value={`${item.fS_EMP_NM} (PIC)`}
										/>

										<TextInfoRow
											icon={'calendar-outline'}
											isIconRight
											value={item.cN_BasDate.replace(/[.]/g, '/')}
										/>
									</View>

									{item.fS_CR_NM && (
										<TextInfoRow
											icon={'person-outline'}
											value={`${item.fS_CR_NM} (Cr.PIC)`}
											containerStyle={{ marginBottom: 8 }}
										/>
									)}

									<TextInfoRow
										icon={'barcode-outline'}
										value={`${item.acqT_AMT} ${item.cur_C}`}
										styleValue={{
											fontWeight: '600',
											color: colors.primary,
											flex: 1,
										}}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'timer-outline'}
										value={`${item.cF_Date} (MO.L Cfm Date)`}
										containerStyle={{ marginBottom: 8 }}
									/>
									<TextInfoRow
										icon={'timer-outline'}
										value={`${item.appDate.replace(
											/[.]/g,
											'/',
										)} (CO.L Cfm Date)`}
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
		</View>
	);
}
