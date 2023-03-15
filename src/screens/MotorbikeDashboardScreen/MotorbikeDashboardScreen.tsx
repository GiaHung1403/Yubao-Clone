import Header from '@components/Header';
import Color from '@config/Color';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React from 'react';
import {
	View,
	Text,
	SafeAreaView,
	StatusBar,
	Image,
	ScrollView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import { ProgressCircle } from 'react-native-svg-charts';

const IC_CONTRACT_3D = require('@assets/icons/ic_contract_3d.png');
const IC_LOCATION_3D = require('@assets/icons/ic_location_3d.png');
const IC_DOLLAR_3D = require('@assets/icons/ic_dollar_3d.png');

export function MotorbikeDashboardScreen() {
	const navigation: any = useNavigation();

	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			<SafeAreaView />
			<TouchableOpacity
				style={{ zIndex: 2, padding: 20 }}
				onPress={() => navigation.goBack()}
			>
				<StatusBar barStyle={'dark-content'} />

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Icon as={Ionicons} name={'chevron-back-outline'} size={7} />
				</View>
				<Text style={{ marginTop: 20, fontSize: 20, fontWeight: '600' }}>
					Motorbike Dashboard
				</Text>
			</TouchableOpacity>

			<ScrollView>
				<View
					style={{ flexDirection: 'row', marginHorizontal: 20, marginTop: 10 }}
				>
					<Card
						style={{ flex: 1, marginRight: 20, padding: 8, borderRadius: 8 }}
						elevation={12}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={IC_CONTRACT_3D}
								style={{ width: 50, height: 50, marginRight: 12 }}
							/>
							<Text>Contract</Text>
						</View>
					</Card>

					<Card
						style={{ flex: 1, padding: 8, borderRadius: 8 }}
						elevation={12}
						onPress={() => navigation.navigate('MotorbikeCheckinScreen')}
					>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={IC_LOCATION_3D}
								style={{ width: 50, height: 50, marginRight: 12 }}
							/>
							<Text>CheckIn</Text>
						</View>
					</Card>
				</View>

				<View style={{ marginHorizontal: 20, marginTop: 30 }}>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Text style={{ color: '#666', fontWeight: '500' }}>
							REPORT (03/2022)
						</Text>
						<Text style={{ color: '#666' }}>See more</Text>
					</View>

					<View style={{ marginTop: 12 }}>
						<Card style={{ padding: 8, borderRadius: 8 }} elevation={4}>
							<View style={{ flexDirection: 'row' }}>
								<Image
									source={IC_DOLLAR_3D}
									style={{ width: 100, height: 100, marginRight: 12 }}
								/>
								<View style={{ justifyContent: 'center' }}>
									<Text
										style={{
											fontSize: 16,
											fontWeight: '500',
											marginBottom: 8,
										}}
									>
										Total Commencement (38)
									</Text>
									<Text
										style={{
											fontSize: 24,
											fontWeight: '500',
											color: Color.main,
										}}
									>
										97,000 USD
									</Text>
								</View>
							</View>
						</Card>
						<View style={{ flexDirection: 'row', marginTop: 12 }}>
							<Card
								elevation={2}
								style={{ padding: 8, marginRight: 8, flex: 1 }}
							>
								<Text style={{ fontWeight: '500', textAlign: 'center' }}>
									Submitted
								</Text>
								<View style={{ position: 'relative', marginTop: 8 }}>
									<ProgressCircle
										style={{ height: 70 }}
										progress={0.5}
										progressColor={Color.main}
										backgroundColor="#EEEEEE"
										strokeWidth={6}
									/>
									<View
										style={{
											position: 'absolute',
											height: 70,
											right: 0,
											left: 0,
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Text style={{}}>20/40</Text>
									</View>

									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: 8,
										}}
									>
										<Text style={{ fontWeight: '600', color: Color.main }}>
											9,000,000$
										</Text>
									</View>
								</View>
							</Card>
							<Card elevation={2} style={{ padding: 8, flex: 1 }}>
								<Text style={{ fontWeight: '500', textAlign: 'center' }}>
									Approved
								</Text>
								<View style={{ position: 'relative', marginTop: 8 }}>
									<ProgressCircle
										style={{ height: 70 }}
										progress={0.7}
										progressColor={Color.approved}
										backgroundColor="#EEEEEE"
										strokeWidth={6}
									/>
									<View
										style={{
											position: 'absolute',
											height: 70,
											right: 0,
											left: 0,
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Text style={{}}>12/20</Text>
									</View>

									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: 8,
										}}
									>
										<Text style={{ fontWeight: '600', color: Color.approved }}>
											9,000,000$
										</Text>
									</View>
								</View>
							</Card>
						</View>

						<View style={{ flexDirection: 'row', marginTop: 12 }}>
							<Card
								elevation={2}
								style={{ padding: 8, marginRight: 8, flex: 1 }}
							>
								<View>
									<Text style={{ fontWeight: '500', textAlign: 'center' }}>
										Return
									</Text>
									<View style={{ position: 'relative', marginTop: 8 }}>
										<ProgressCircle
											style={{ height: 70 }}
											progress={1}
											progressColor={Color.draft}
											backgroundColor="#EEEEEE"
											strokeWidth={6}
										/>
										<View
											style={{
												position: 'absolute',
												height: 70,
												right: 0,
												left: 0,
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<Text style={{}}>3</Text>
										</View>

										<View
											style={{
												justifyContent: 'center',
												alignItems: 'center',
												marginTop: 8,
											}}
										>
											<Text style={{ fontWeight: '600', color: Color.draft }}>
												300,000$
											</Text>
										</View>
									</View>
								</View>
							</Card>
							<Card elevation={2} style={{ padding: 8, flex: 1 }}>
								<Text style={{ fontWeight: '500', textAlign: 'center' }}>
									Reject
								</Text>
								<View style={{ position: 'relative', marginTop: 8 }}>
									<ProgressCircle
										style={{ height: 70 }}
										progress={1}
										progressColor={Color.reject}
										backgroundColor="#EEEEEE"
										strokeWidth={6}
									/>
									<View
										style={{
											position: 'absolute',
											height: 70,
											right: 0,
											left: 0,
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Text style={{}}>5</Text>
									</View>

									<View
										style={{
											justifyContent: 'center',
											alignItems: 'center',
											marginTop: 8,
										}}
									>
										<Text style={{ fontWeight: '600', color: Color.reject }}>
											500,000$
										</Text>
									</View>
								</View>
							</Card>
						</View>
					</View>
				</View>
			</ScrollView>
		</View>
	);
}
