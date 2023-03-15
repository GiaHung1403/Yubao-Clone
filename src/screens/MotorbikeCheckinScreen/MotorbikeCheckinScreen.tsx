import React, { useEffect, useState } from 'react';
import { FlatList, InteractionManager, SafeAreaView, View } from 'react-native';
import { Card, FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import LoadingFullScreen from '@components/LoadingFullScreen';

export function MotorbikeCheckinScreen() {
	const navigation: any = useNavigation();
	const { colors } = useTheme();

	const [doneLoadAnimated, setDoneLoadAnimated] = useState<boolean>(false);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimated(true);
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Check in'} />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<FlatList
						data={[1, 2, 3, 4, 5, 6]}
						keyExtractor={(_, index) => index.toString()}
						showsVerticalScrollIndicator={false}
						ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
						renderItem={({ item, index }) => (
							<Card
								style={{ marginHorizontal: 8, marginTop: 8 }}
								onPress={() =>
									navigation.navigate('MotorbikeCheckinDetailScreen')
								}
							>
								<View style={{ padding: 8 }}>
									<TextInfoRow
										icon={'barcode-outline'}
										iconColor={colors.primary}
										value={'12345678'}
										styleValue={{ color: colors.primary, fontWeight: '500' }}
										containerStyle={{ marginBottom: 8 }}
									/>

									<View style={{ flexDirection: 'row', marginBottom: 8 }}>
										<TextInfoRow icon={'time-outline'} value={'08/03/2022'} />

										<TextInfoRow
											icon={'map-outline'}
											isIconRight
											value={'50km'}
										/>
									</View>

									<TextInfoRow
										icon={'alarm-outline'}
										iconColor={colors.primary}
										label={'Checkin time: '}
										styleLabel={{ flex: 0 }}
										value={'7:49'}
										styleValue={{ color: colors.primary, fontWeight: '500' }}
										containerStyle={{ marginBottom: 8 }}
									/>

									<TextInfoRow
										icon={'navigate-outline'}
										iconColor={colors.primary}
										value={
											'37 Tôn Ðức Thắng, Phường Bến Nghé, Quận 1, Tp. HCM, Việt Nam'
										}
										styleValue={{
											color: colors.primary,
											fontWeight: '500',
											flex: 1,
										}}
										containerStyle={{ marginBottom: 8 }}
									/>
									<TextInfoRow
										icon={'location-outline'}
										iconColor={colors.primary}
										label={'Total location: '}
										styleLabel={{ flex: 0 }}
										value={'3'}
										styleValue={{
											color: colors.primary,
											fontWeight: '500',
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

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="plus"
					onPress={() =>
						navigation.navigate('TeleDetailScreen', {
							teleInfo: null,
							isCreateNewTele: true,
						})
					}
				/>
			</SafeAreaView>
		</View>
	);
}
