import React, { useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	InteractionManager,
	SafeAreaView,
	Text,
	View,
} from 'react-native';
import { Card, FAB, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import Header from '@components/Header';
import TextInfoRow from '@components/TextInfoRow';
import LoadingFullScreen from '@components/LoadingFullScreen';
import Color from '@config/Color';

export function MotorbikeCheckinDetailScreen() {
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
				<Header title={'Checkin Detail'} />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							marginHorizontal: 8,
							marginTop: 8,
							zIndex: 2,
						}}
					>
						<Card style={{ flex: 1 }}>
							<View
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									padding: 8,
								}}
							>
								<Text
									style={{ fontSize: 16, fontWeight: '500', color: '#666' }}
								>
									Location
								</Text>
								<Text
									style={{
										marginTop: 8,
										fontSize: 16,
										fontWeight: '600',
										color: colors.primary,
									}}
								>
									3
								</Text>
							</View>
						</Card>
						<Card style={{ flex: 1, marginHorizontal: 8 }}>
							<View
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									padding: 8,
								}}
							>
								<Text
									style={{ fontSize: 16, fontWeight: '500', color: '#666' }}
								>
									Distance
								</Text>
								<Text
									style={{
										marginTop: 8,
										fontSize: 16,
										fontWeight: '600',
										color: Color.approved,
									}}
								>
									50km
								</Text>
							</View>
						</Card>
						<Card style={{ flex: 1 }}>
							<View
								style={{
									alignItems: 'center',
									justifyContent: 'center',
									padding: 8,
								}}
							>
								<Text
									style={{ fontSize: 16, fontWeight: '500', color: '#666' }}
								>
									Time
								</Text>
								<Text
									style={{
										marginTop: 8,
										fontSize: 16,
										fontWeight: '600',
										color: Color.waiting,
									}}
								>
									3h
								</Text>
							</View>
						</Card>
					</View>

					<View style={{ flex: 1 }}>
						<FlatList
							data={[1, 2, 3, 4]}
							keyExtractor={(_, index) => index.toString()}
							showsVerticalScrollIndicator={false}
							ListFooterComponent={() => (
								<SafeAreaView style={{ height: 60 }} />
							)}
							renderItem={({ item, index }) => (
								<Card style={{ marginHorizontal: 8, marginTop: 8 }}>
									<View style={{ padding: 8 }}>
										{index === 3 && (
											<Text
												style={{
													marginBottom: 16,
													fontSize: 16,
													fontWeight: '600',
													color: Color.waiting,
												}}
											>
												Start
											</Text>
										)}

										{index !== 3 && (
											<TextInfoRow
												icon={'briefcase-outline'}
												value={`Công Ty Customer Test ${index + 1}`}
												styleValue={{
													flex: 1,
													color: colors.primary,
													fontWeight: '600',
												}}
												containerStyle={{ marginBottom: 8 }}
											/>
										)}

										<TextInfoRow
											icon={'navigate-outline'}
											iconColor={colors.primary}
											value={`${
												index + 1
											} Cao Lỗ, Phường 4, Quận 8, Tp. HCM, Việt Nam`}
											styleValue={{
												flex: 1,
											}}
											containerStyle={{ marginBottom: 8 }}
										/>
										{index !== 3 && (
											<TextInfoRow
												icon={'reader-outline'}
												iconColor={colors.primary}
												value={
													'Đã đến gặp khách hàng và tham khảo đủ thông tin cần thiết'
												}
												styleValue={{
													flex: 1,
												}}
												containerStyle={{ marginBottom: 8 }}
											/>
										)}

										{index === 3 && (
											<TextInfoRow
												icon={'alarm-outline'}
												iconColor={colors.primary}
												label={'Checkin: '}
												styleLabel={{ flex: 0 }}
												value={'09:37:47'}
												styleValue={{
													color: Color.approved,
													fontWeight: '500',
												}}
											/>
										)}

										{index !== 3 && (
											<View
												style={{
													flexDirection: 'row',
													justifyContent: 'space-between',
												}}
											>
												<TextInfoRow
													icon={'stopwatch-outline'}
													iconColor={colors.primary}
													styleLabel={{ flex: 0 }}
													value={'09:37'}
													styleValue={{
														color: Color.approved,
														fontWeight: '500',
													}}
													containerStyle={{
														flex: 1,
														justifyContent: 'center',
														alignItems: 'center',
													}}
												/>
												<TextInfoRow
													icon={'stopwatch'}
													iconColor={colors.primary}
													styleLabel={{ flex: 0 }}
													value={'11:37'}
													styleValue={{
														color: Color.reject,
														fontWeight: '500',
													}}
													containerStyle={{
														flex: 1,
														justifyContent: 'center',
														alignItems: 'center',
													}}
												/>
												<TextInfoRow
													icon={'timer-outline'}
													iconColor={colors.primary}
													styleLabel={{ flex: 0 }}
													value={'1h'}
													styleValue={{
														color: colors.primary,
														fontWeight: '500',
													}}
													containerStyle={{
														flex: 1,
														justifyContent: 'center',
														alignItems: 'center',
													}}
												/>
											</View>
										)}
									</View>
								</Card>
							)}
						/>
					</View>
				</View>
			) : (
				<LoadingFullScreen />
			)}

			<SafeAreaView
				style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
			>
				<FAB
					icon="fingerprint"
					onPress={() => navigation.navigate('CheckinMapModal', {})}
				/>
			</SafeAreaView>
		</View>
	);
}
