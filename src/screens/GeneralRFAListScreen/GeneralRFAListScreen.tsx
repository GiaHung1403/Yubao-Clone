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
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import TextInfoRow from '@components/TextInfoRow';
import Color from '@config/Color';
import GeneralRFAFilterComponent from './GeneralRFAFilterComponent';
import { IGeneralRFA } from '@models/types';

export function GeneralRFAListScreen() {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	const listGeneralRFA: IGeneralRFA[] = useSelector(
		(state: any) => state.general_rfa_reducer.listGeneralRFA,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
		});
	});

	const _onPressItem = item => {
		navigation.navigate('GeneralRFADetailScreen', { generalRFAItem: item });
	};

	const getColorStatus = (status: string) => {
		if (status?.includes('Cancel') || status?.includes('Refuse')) {
			return Color.reject;
		} else if (status?.includes('Finished')) {
			return Color.approved;
		} else if (status?.includes('Not yet started')) {
			return Color.waiting;
		} else {
			return Colors.lightGreen600;
		}
	};

	return (
		<View style={{ flex: 1 }}>
			<Header title={'General RFA List'} />

			<View style={{ zIndex: 1, paddingHorizontal: 8, paddingTop: 8 }}>
				<GeneralRFAFilterComponent />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={listGeneralRFA}
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
											value={item.req_id}
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
											value={item.fS_EMP_NM}
											styleValue={{ fontWeight: '600', color: colors.primary }}
										/>

										<TextInfoRow
											icon={'layers-outline'}
											isIconRight
											value={item.req_Type}
										/>
									</View>

									<TextInfoRow
										icon={'bookmark-outline'}
										value={item.subj}
										styleValue={{ flex: 1 }}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'calendar-outline'}
										value={item.sBasDate}
										styleValue={{ fontWeight: '600', color: Color.approved }}
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

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() => navigation.navigate('GeneralRFADetailScreen', {})}
				/>
			</SafeAreaView>
		</View>
	);
}
