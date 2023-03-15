import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { Card, FAB, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { IAssetCheckingRequest } from '@models/types';
import RequestCustomerFilterComponent from './RequestCustomerFilterComponent';
import styles from './styles';

export function RequestCustomerListScreen(props: any) {
	const navigation: any = useNavigation();

	const assetCheckingRequests: IAssetCheckingRequest[] = useSelector(
		(state: any) => state.request_customer_reducer.assetCheckingRequests,
	);

	const [] = useState();

	const _onPressItem = (item: IAssetCheckingRequest) => {
		navigation.navigate('RequestCustomerCreateScreen', { requestItem: item });
	};

	const getColorStatus = (status: string | null) => {
		if (status?.includes('Cancel') || status?.includes('Refuse')) {
			return Color.reject;
		} else if (status?.includes('Finished')) {
			return Color.approved;
		} else if (status?.includes('Not yet started')) {
			return Color.waiting;
		} else {
			return Color.waiting;
		}
	};

	const { colors } = useTheme();

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<Header title={'Request Customer'} />

			<View style={{ flex: 1 }}>
				<View style={{ marginHorizontal: 8, zIndex: 2, marginTop: 8 }}>
					<RequestCustomerFilterComponent />
				</View>

				<FlatList
					data={assetCheckingRequests.reverse()}
					showsVerticalScrollIndicator={false}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => (
						<Card
							elevation={2}
							style={{ marginHorizontal: 8, marginTop: 8 }}
							onPress={() => _onPressItem(item)}
						>
							<View style={{ padding: 8 }}>
								<View style={{ flexDirection: 'row', marginBottom: 8 }}>
									<TextInfoRow
										icon={'barcode-outline'}
										value={item.ID.toString()}
										styleValue={{ fontWeight: '600', color: colors.primary }}
									/>

									<View style={{ flexDirection: 'row', alignItems: 'center' }}>
										<Text
											style={{
												fontWeight: '500',
												color: getColorStatus(item.REQ_STA),
											}}
										>
											{item.REQ_STA || 'Processing'}
										</Text>
										<View
											style={{
												width: 10,
												height: 10,
												borderRadius: 6,
												backgroundColor: getColorStatus(item.REQ_STA),
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
										icon={'calendar-outline'}
										isIconRight
										value={moment(item.CRE_DATE).format('DD/MM/YYYY')}
									/>
								</View>

								<TextInfoRow
									icon={'briefcase-outline'}
									value={item.LS_NM}
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

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() => navigation.navigate('RequestCustomerCreateScreen', {})}
				/>
			</SafeAreaView>
		</View>
	);
}
