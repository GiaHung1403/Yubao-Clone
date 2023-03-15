import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, View } from 'react-native';
import { Card, Colors, FAB, useTheme } from 'react-native-paper';
import { getListTaxiCardData } from '@data/api';
import LoadingFullScreen from '@components/LoadingFullScreen';

export function TaxiBillScanScreen(props) {
	const navigation: any = useNavigation();
	const { colors } = useTheme();
	const [taxiCard, setTaxiCard] = useState<any>([]);

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

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			(async function getData() {
				const data: any = await getListTaxiCardData({
					action: 'GET_DATA',
				});
				setTaxiCard(data);
			})();
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Scan Taxi Bill'} />
			</View>

			{taxiCard.length > 0 ? (
				<FlatList
					data={taxiCard}
					keyExtractor={(item, index) => index.toString()}
					ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
					renderItem={({ item, index }) => (
						<Card
							elevation={2}
							style={{ marginHorizontal: 8, marginTop: 8, padding: 8 }}
						>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow
									icon={'barcode-outline'}
									value={item?.seq}
									styleValue={{ fontWeight: '600', color: colors.primary }}
								/>
								{/*
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Text
									style={{
										fontWeight: '500',
										color: getColorStatus('Accepted'),
									}}
								>
									{'Accepted'}
								</Text>
								<View
									style={{
										width: 10,
										height: 10,
										borderRadius: 6,
										backgroundColor: getColorStatus('Accepted'),
										marginLeft: 4,
									}}
								/>
							</View> */}
								<TextInfoRow
									icon={'time-outline'}
									value={`${item?.use_date.split(' ')[1]} ${item?.use_date.split(' ')[2]
										}`}
									isIconRight
									styleValue={{ fontWeight: '600', color: colors.primary }}
								/>
							</View>

							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow
									icon={'person-outline'}
									value={`${item?.use_Emp_Nm} (Using)`}
									styleValue={{ fontWeight: '600', color: colors.primary }}
								/>

								<TextInfoRow
									icon={'calendar-outline'}
									isIconRight
									// value={`${moment().format('DD.MM.YYYY')}`}
									value={item?.use_date.split(' ')[0]}
									containerStyle={{}}
								/>
							</View>
							<View style={{ flexDirection: 'row', marginBottom: 8 }}>
								<TextInfoRow
									icon={'person-outline'}
									value={`${item?.op_Emp_Nm} (PIC)`}
								/>

								<TextInfoRow
									icon={'cash-outline'}
									isIconRight
									value={`${item?.sTotalFee} vnđ`}
									styleValue={{ fontWeight: '600', color: colors.primary }}
									containerStyle={{}}
								/>
							</View>

							<TextInfoRow
								icon={'trail-sign-outline'}
								value={item?.destination}
								styleValue={{ flex: 1 }}
							/>
						</Card>
					)}
				/>
			) : (
				<LoadingFullScreen />
			)}

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() => navigation.navigate('TaxiBillCameraScreen')}
				/>
			</SafeAreaView>
		</View>
	);
}
