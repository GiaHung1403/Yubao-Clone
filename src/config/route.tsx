import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import {
	createStackNavigator,
	TransitionPresets,
	TransitionSpecs,
} from '@react-navigation/stack';
import { Icon } from 'native-base';
import React, { useEffect, useRef, useState } from 'react';
import { InteractionManager, Platform, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import LoadingFullScreen from '@components/LoadingFullScreen';
import { LocalizationContext } from '@context/LocalizationContext';
import * as firebaseFunction from '@data/firebase';
import { EventTracking } from '@models/EventTrackingEnum';
import { IRequestEFlow, IUserSystem } from '@models/types';

import { Ionicons } from '@expo/vector-icons';
import * as screens from '@screens';

//test scan

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const optionModal = ({ route, navigation }) =>
	Platform.OS === 'ios'
		? {
			headerShown: false,
			gestureEnabled: true,
			cardOverlayEnabled: true,
			headerStatusBarHeight:
				navigation.getState().routes.findIndex(r => r.key === route.key) > 0
					? 0
					: undefined,
			...TransitionPresets.RevealFromBottomAndroid,
		}
		: {
			headerShown: false,
			gestureEnabled: true,
			cardOverlayEnabled: true,
			headerStatusBarHeight:
				navigation.getState().routes.findIndex(r => r.key === route.key) > 0
					? 0
					: undefined,
			...TransitionPresets.RevealFromBottomAndroid,
		};

function BottomTabHome({ navigation }) {
	const I18n = React.useContext(LocalizationContext);
	const listRequestEFlow: IRequestEFlow[] = useSelector(
		(state: any) => state.eFlow_reducer.listRequestEFlow,
	);
	const listRequestEReview: IRequestEFlow[] = useSelector(
		(state: any) => state.eReview_reducer.listRequestEReview,
	);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const [count, setCount] = useState(0);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			// let dataQuestion = await firestore()
			// 	.collection('Chat_Support')
			// 	.onSnapshot(questSnapshot => {
			// 		let tempCount: number = 0;
			// 		questSnapshot.forEach(item => {
			// 			const ID = item.data()?.ID.split('_');
			// 			if (ID[1] === dataUserSystem.EMP_NO) {
			// 				for (let i = 0; i < item.data().listMessage.length; i++) {
			// 					if (
			// 						item.data().listMessage[i].seen === false &&
			// 						item.data().listMessage[i].From === '1'
			// 					) {
			// 						tempCount += 1;
			// 					}
			// 				}
			// 			}
			// 		});
			// 		setCount(tempCount);
			// 	});
		});
	}, []);

	const totalRequest =
		listRequestEReview.length +
		listRequestEFlow.filter(eFlow => eFlow.status === 'Waiting Approval')
			.length +
		count;

	const textHomePage = 'Home';
	const textMainFunction = 'Main Function';
	const textNews = 'News';
	const textAccount = 'Account';
	const textScanQR = 'QR Scanner';
	const { colors } = useTheme();

	return (
		<Tab.Navigator
			// activeColor={colors.primary}
			// barStyle={{ backgroundColor: "#fff" }}
			// tabBarOptions={{
			//   activeTintColor: colors.primary,
			// }}
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: colors.primary,
				tabBarStyle:
					Platform.OS === 'android'
						? { flex: 0, paddingBottom: 0, height: 50 }
						: null,
			}}
		>
			<Tab.Screen
				name="HomeScreen"
				component={screens.HomeScreen}
				options={{
					tabBarLabel: textHomePage,
					tabBarIcon: ({ color, focused }) => (
						<Icon as={Ionicons} name="home-outline" size={7} color={color} />
					),
				}}
			/>
			<Tab.Screen
				name="MainFeatureScreen"
				component={screens.MainFeatureScreen}
				options={{
					tabBarLabel: textMainFunction,
					tabBarIcon: ({ color, focused }) => (
						<View style={{ position: 'relative' }}>
							<Icon
								as={Ionicons}
								name="briefcase-outline"
								size={7}
								color={color}
							/>
							{totalRequest > 0 ? (
								<View
									style={{
										width: 18,
										height: 18,
										backgroundColor: colors.primary,
										borderRadius: 10,
										position: 'absolute',
										justifyContent: 'center',
										alignItems: 'center',
										right: -8,
										top: -2,
									}}
								>
									<Text
										style={{
											fontSize: 10,
											color: '#fff',
											fontWeight: 'bold',
										}}
									>
										{totalRequest}
									</Text>
								</View>
							) : (
								<View />
							)}
						</View>
					),
				}}
			/>
			<Tab.Screen
				name="CameraScreen"
				component={screens.CameraScreen}
				options={{
					tabBarLabel: '',
					tabBarIcon: ({ color, focused }) => {
						return (
							<View
								style={{
									position: 'absolute',
									alignSelf: 'center',
									zIndex: 999,
									top: -30,
									alignItems: 'center',
									justifyContent: 'center',
								}}
							>
								<Card
									elevation={4}
									style={{ width: 60, height: 60, borderRadius: 30 }}
									onPress={() => navigation.navigate('CameraScreen')}
								>
									<View
										style={{
											alignItems: 'center',
											justifyContent: 'center',
											flex: 1,
										}}
									>
										<Icon
											as={Ionicons}
											name="qr-code-outline"
											size={30}
											color={'#666'}
										/>
									</View>
								</Card>
								<Text style={{ fontSize: 10, color: '#8a8a8a', marginTop: 6 }}>
									{textScanQR}
								</Text>
							</View>
						);
					},
				}}
			/>
			<Tab.Screen
				name="News"
				component={screens.NewsScreen}
				options={{
					tabBarLabel: textNews,
					tabBarIcon: ({ color, focused }) => (
						<Icon
							as={Ionicons}
							name="newspaper-outline"
							size={7}
							color={color}
						/>
					),
				}}
			/>
			<Tab.Screen
				name="MenuScreen"
				component={screens.MenuScreen}
				options={{
					tabBarLabel: textAccount,
					tabBarIcon: ({ color, focused }) => (
						<Icon as={Ionicons} name="person-outline" size={7} color={color} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}

function ChatStack() {
	return (
		<Stack.Navigator
			initialRouteName="BottomTabHome"
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen
				name="ChatRoomListScreen"
				component={screens.ChatRoomListScreen}
			/>
			<Stack.Screen
				name="ChatRoomMessageScreen"
				component={screens.ChatRoomMessageScreen}
			/>
			<Stack.Screen
				name="ChatRoomSettingScreen"
				component={screens.ChatRoomSettingScreen}
			/>

			<Stack.Screen
				name="ChatRoomInfoScreen"
				component={screens.ChatRoomInfoScreen}
			/>
			<Stack.Screen
				name="ChatRoomShareScreen"
				component={screens.ChatRoomShareScreen}
			/>
			<Stack.Screen name="ChatNewScreen" component={screens.ChatNewScreen} />
			<Stack.Screen
				name="ChatNewSelectUserScreen"
				component={screens.ChatNewSelectUserScreen}
			/>
			<Stack.Screen name="ChatCallScreen" component={screens.ChatCallScreen} />
			<Stack.Screen
				name="ChatRoomStoredScreen"
				component={screens.ChatRoomStoredScreen}
			/>
			<Stack.Screen
				name="ChatRoomMemberScreen"
				component={screens.ChatRoomMemberScreen}
			/>
			<Stack.Screen
				name="SortRoomModal"
				component={screens.SortRoomModal}
				options={optionModal}
			/>
			{/* <Stack.Screen
				name="InvitesUserModal"
				component={InvitesUserModal}
				options={optionModal}
			/> */}
		</Stack.Navigator>
	);
}

function HomeStack() {
	const forFade = ({ current }) => ({
		cardStyle: {
			opacity: current.progress,
		},
	});

	return (
		<Stack.Navigator
			initialRouteName="BottomTabHome"
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="BottomTabHome" component={BottomTabHome} />
			<Stack.Screen
				name="ChatRoomListScreen"
				component={screens.ChatRoomListScreen}
			/>
			<Stack.Screen
				name="ChatRoomMessageScreen"
				component={screens.ChatRoomMessageScreen}
			/>
			<Stack.Screen
				name="ChatRoomSettingScreen"
				component={screens.ChatRoomSettingScreen}
			/>
			<Stack.Screen
				name="ChatRoomInfoScreen"
				component={screens.ChatRoomInfoScreen}
			/>
		
			<Stack.Screen
				name="ChatRoomShareScreen"
				component={screens.ChatRoomShareScreen}
			/>
			<Stack.Screen name="ChatNewScreen" component={screens.ChatNewScreen} />
			<Stack.Screen
				name="ChatNewSelectUserScreen"
				component={screens.ChatNewSelectUserScreen}
			/>
			<Stack.Screen name="ChatCallScreen" component={screens.ChatCallScreen} />
			<Stack.Screen
				name="ChatRoomStoredScreen"
				component={screens.ChatRoomStoredScreen}
			/>
			<Stack.Screen
				name="ChatRoomMemberScreen"
				component={screens.ChatRoomMemberScreen}
			/>
			<Stack.Screen
				name="SortRoomModal"
				component={screens.SortRoomModal}
				options={optionModal}
			/>
			<Stack.Screen name="WebviewScreen" component={screens.WebviewScreen} />
			<Stack.Screen name="CameraScreen" component={screens.CameraScreen} />
			<Stack.Screen
				name="CustomerListScreen"
				component={screens.CustomerListScreen}
			/>
			<Stack.Screen name="MapScreen" component={screens.MapScreen} />
			<Stack.Screen
				name="DetectTextCameraScreen"
				component={screens.DetectTextCameraScreen}
			/>
			<Stack.Screen
				name="DetectTextResultScreen"
				component={screens.DetectTextResultScreen}
			/>
			<Stack.Screen
				name="EFlowSearchScreen"
				component={screens.EFlowSearchScreen}
			/>
			<Stack.Screen
				name="CustomerInfoScreen"
				component={screens.CustomerInfoScreen}
			/>
			<Stack.Screen
				name="CustomerContractChooseInfoScreen"
				component={screens.CustomerContractChooseInfoScreen}
			/>
			<Stack.Screen
				name="AssetsListScreen"
				component={screens.AssetsListScreen}
			/>
			<Stack.Screen
				name="CustomerInsuranceListScreen"
				component={screens.CustomerInsuranceListScreen}
			/>
			<Stack.Screen
				name="CustomerInsuranceChooseInfoScreen"
				component={screens.CustomerInsuranceChooseInfoScreen}
			/>
			<Stack.Screen
				name="CustomerInsuranceCompensationScreen"
				component={screens.CustomerInsuranceCompensationScreen}
			/>
			<Stack.Screen
				name="MortgageAssetScreen"
				component={screens.MortgageAssetScreen}
			/>
			<Stack.Screen
				name="AssetsTakePhotoScreen"
				component={screens.AssetsTakePhotoScreen}
			/>
			<Stack.Screen name="FeedbackScreen" component={screens.FeedbackScreen} />
			<Stack.Screen name="VisitScreen" component={screens.VisitScreen} />
			<Stack.Screen
				name="VisitDetailScreen"
				component={screens.VisitDetailScreen}
			/>
			<Stack.Screen name="TeleScreen" component={screens.TeleScreen} />
			<Stack.Screen
				name="TeleDetailScreen"
				component={screens.TeleDetailScreen}
			/>
			<Stack.Screen
				name="QuotationScreen"
				component={screens.QuotationScreen}
			/>
			<Stack.Screen
				name="QuotationDetailScreen"
				component={screens.QuotationDetailScreen}
			/>
			<Stack.Screen
				name="SellerListScreen"
				component={screens.SellerListScreen}
			/>
			<Stack.Screen
				name="CustomerInvoiceScreen"
				component={screens.CustomerInvoiceScreen}
			/>
			<Stack.Screen
				name="EFlowDetailScreen"
				component={screens.EFlowDetailScreen}
			/>
			<Stack.Screen
				name="NotificationScreen"
				component={screens.NotificationScreen}
			/>
			<Stack.Screen
				name="NotificationDetailScreen"
				component={screens.NotificationDetailScreen}
			/>
			<Stack.Screen
				name="AttendanceViaFaceScreen"
				component={screens.AttendanceViaFaceScreen}
			/>
			<Stack.Screen
				name="DocumentScanScreen"
				component={screens.DocumentScanScreen}
			/>
			<Stack.Screen
				name="CATakePhotoScreen"
				component={screens.CATakePhotoScreen}
			/>
			<Stack.Screen name="ContactScreen" component={screens.ContactScreen} />
			<Stack.Screen
				name="FilterDashboardModal"
				component={screens.FilterDashboardModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="CIC_CheckingScreen"
				component={screens.CICCheckingScreen}
				options={optionModal}
			/>
			<Stack.Screen
				name="FilterContactModal"
				component={screens.FilterContactModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="CustomerGuarantorScreen"
				component={screens.CustomerGuarantorScreen}
			/>
			<Stack.Screen name="SettingScreen" component={screens.SettingScreen} />
			<Stack.Screen
				name="SettingLanguageScreen"
				component={screens.SettingLanguageScreen}
			/>
			<Stack.Screen
				name="SettingThemeScreen"
				component={screens.SettingThemeScreen}
			/>
			<Stack.Screen
				name="SettingCustomThemeScreen"
				component={screens.SettingCustomThemeScreen}
			/>
			<Stack.Screen name="UserInfoScreen" component={screens.UserInfoScreen} />
			<Stack.Screen name="QuizScreen" component={screens.QuizScreen} />
			<Stack.Screen
				name="DocumentReview"
				component={screens.DocumentReviewScreen}
			/>
			<Stack.Screen
				name="DocumentPDFViewScreen"
				component={screens.DocumentPDFViewScreen}
			/>
			<Stack.Screen
				name="TimeCheckInScreen"
				component={screens.TimeCheckInScreen}
			/>
			<Stack.Screen
				name="LeaveRequestSearchScreen"
				component={screens.LeaveRequestSearchScreen}
			/>
			<Stack.Screen
				name="LeaveRequestDetailScreen"
				component={screens.LeaveRequestDetailScreen}
			/>
			<Stack.Screen
				name="LeaveRequestRemainingScreen"
				component={screens.LeaveRequestRemainingScreen}
			/>
			<Stack.Screen
				name="TicketSearchScreen"
				component={screens.TicketSearchScreen}
			/>
			<Stack.Screen
				name="TicketDetailScreen"
				component={screens.TicketDetailScreen}
			/>
			<Stack.Screen
				name="TicketITControlScreen"
				component={screens.TicketITControlScreen}
			/>
			<Stack.Screen
				name="CarBookingListScreen"
				component={screens.CarBookingListScreen}
			/>
			<Stack.Screen
				name="CarBookingDetailScreen"
				component={screens.CarBookingDetailScreen}
			/>
			<Stack.Screen
				name="CICRequestDetailScreen"
				component={screens.CICRequestDetailScreen}
			/>
			<Stack.Screen
				name="CustomerNewScreen"
				component={screens.CustomerNewScreen}
			/>
			<Stack.Screen
				name="SellerNewScreen"
				component={screens.SellerNewScreen}
			/>
			<Stack.Screen
				name="SellerInfoScreen"
				component={screens.SellerInfoScreen}
			/>
			<Stack.Screen
				name="ChooseUserModal"
				component={screens.ChooseUserModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="ChooseCustomerModal"
				component={screens.ChooseCustomerModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="ChooseSaleManModal"
				component={screens.ChooseSaleManModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="ChooseDealerModal"
				component={screens.ChooseDealerModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="CommenceDetailModal"
				component={screens.CommenceDetailModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="SummaryReportDetailModal"
				component={screens.SummaryReportDetailModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="CustomerResourceDetailModal"
				component={screens.CustomerResourceDetailModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="InsuranceDetailModal"
				component={screens.InsuranceDetailModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="RecoveryDetailModal"
				component={screens.RecoveryDetailModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="ViewCalendarBookMeetingModal"
				component={screens.ViewCalendarBookMeetingModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="BookMeetingListScreen"
				component={screens.BookMeetingListScreen}
			/>
			<Stack.Screen name="VRCScanScreen" component={screens.VRCScanScreen} />
			<Stack.Screen
				name="VRCPickerModal"
				component={screens.VRCPickerModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="VRCResultScreen"
				component={screens.VRCResultScreen}
			/>
			<Stack.Screen
				name="BookMeetingDetailScreen"
				component={screens.BookMeetingDetailScreen}
			/>
			<Stack.Screen
				name="GeneralRFAListScreen"
				component={screens.GeneralRFAListScreen}
			/>
			<Stack.Screen
				name="GeneralRFADetailScreen"
				component={screens.GeneralRFADetailScreen}
			/>
			<Stack.Screen
				name="FixedAssetsListScreen"
				component={screens.FixedAssetsListScreen}
			/>
			<Stack.Screen
				name="FixedAssetsCheckingScreen"
				component={screens.FixedAssetsCheckingScreen}
			/>
			<Stack.Screen
				name="FixedAssetsDetailScreen"
				component={screens.FixedAssetsDetailScreen}
			/>
			<Stack.Screen
				name="FixedAssetsInstockScreen"
				component={screens.FixedAssetsInstockScreen}
			/>
			<Stack.Screen
				name="FixedAssetsInstockDetailScreen"
				component={screens.FixedAssetsInstockDetailScreen}
			/>
			<Stack.Screen
				name="FixedAssetsCameraScreen"
				component={screens.FixedAssetsCameraScreen}
			/>
			<Stack.Screen name="ECoinScreen" component={screens.ECoinScreen} />
			<Stack.Screen
				name="ECoinHistoryScreen"
				component={screens.ECoinHistoryScreen}
			/>
			<Stack.Screen
				name="ECoinOrderHistoryScreen"
				component={screens.ECoinOrderHistoryScreen}
			/>
			<Stack.Screen
				name="ECoinCameraScreen"
				component={screens.ECoinCameraScreen}
			/>
			<Stack.Screen
				name="ECoinInfoGiftModal"
				component={screens.ECoinInfoGiftModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="VisitMapModal"
				component={screens.VisitMapModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="ConsultationListScreen"
				component={screens.ConsultationListScreen}
			/>
			<Stack.Screen
				name="ConsultationDetailScreen"
				component={screens.ConsultationDetailScreen}
			/>
			<Stack.Screen
				name="RequestCustomerListScreen"
				component={screens.RequestCustomerListScreen}
			/>
			<Stack.Screen
				name="RequestCustomerCreateScreen"
				component={screens.RequestCustomerCreateScreen}
			/>
			<Stack.Screen
				name="VotingCreateScreen"
				component={screens.VotingCreateScreen}
			/>
			<Stack.Screen
				name="VotingDetailScreen"
				component={screens.VotingDetailScreen}
			/>
			<Stack.Screen
				name="VotingListScreen"
				component={screens.VotingListScreen}
			/>
			<Stack.Screen
				name="MotorbikeDashboardScreen"
				component={screens.MotorbikeDashboardScreen}
			/>
			<Stack.Screen
				name="MotorbikeCheckinScreen"
				component={screens.MotorbikeCheckinScreen}
			/>
			<Stack.Screen
				name="MotorbikeCheckinDetailScreen"
				component={screens.MotorbikeCheckinDetailScreen}
			/>
			<Stack.Screen
				name="CheckinMapModal"
				component={screens.CheckinMapModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="ChooseConsultationModal"
				component={screens.ChooseConsultationModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="EmailPaymentScreen"
				component={screens.EmailPaymentScreen}
			/>
			<Stack.Screen
				name="TaxiBillScanScreen"
				component={screens.TaxiBillScanScreen}
			/>
			<Stack.Screen
				name="TaxiBillCameraScreen"
				component={screens.TaxiBillCameraScreen}
			/>
			<Stack.Screen
				name="TaxiBillResultScreen"
				component={screens.TaxiBillResultScreen}
			/>
			<Stack.Screen
				name="ChatSupportScreen"
				component={screens.ChatSupportScreen}
			/>
			<Stack.Screen
				name="ChatSupportRoomScreen"
				component={screens.ChatSupportRoomScreen}
			/>
			<Stack.Screen
				name="EReviewSearchScreen"
				component={screens.EReviewSearchScreen}
			/>
			<Stack.Screen
				name="EReviewDetailScreen"
				component={screens.EReviewDetailScreen}
			/>
			<Stack.Screen
				name="ImageViewScreen"
				component={screens.ImageViewScreen}
				options={{ cardStyleInterpolator: forFade }}
			// options={{ presentation: 'transparentModal' }}
			// options={{
			// 	transitionSpec: {
			// 		open: TransitionSpecs.ScaleFromCenterAndroidSpec,
			// 		close: TransitionSpecs.ScaleFromCenterAndroidSpec,
			// 	},
			// }}
			/>
			<Stack.Screen
				name="InvitesUserModal"
				component={screens.InvitesUserModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="VisitDetailScreen_T"
				component={screens.VisitDetailScreen_T}
			/>
			<Stack.Screen
				name="VisitMapModal_T"
				component={screens.VisitMapModal_T}
				options={optionModal}
			/>
			<Stack.Screen
				name="IDCardScanScreen"
				component={screens.IDCardScanScreen}
			/>
			<Stack.Screen
				name="IDCardResultScreen"
				component={screens.IDCardResultScreen}
			/>
			<Stack.Screen
				name="IDCardFormScreen"
				component={screens.IDCardFormScreen}
			/>
			<Stack.Screen
				name="ContractTimeLineListScreen"
				component={screens.ContractTimeLineListScreen}
			/>
			<Stack.Screen
				name="ContractTimeLineDetailScreen"
				component={screens.ContractTimeLineDetailScreen}
			/>
			<Stack.Screen
				name="FullListContractTimeLineScreen"
				component={screens.FullListContractTimeLineScreen}
			/>
			<Stack.Screen
				name="PaymentNoticeScreen"
				component={screens.PaymentNoticeScreen}
			/>
			<Stack.Screen
				name="InsuranceSupportScreen"
				component={screens.InsuranceSupportScreen}
			/>
			<Stack.Screen
				name="InsuranceSupportDetailScreen"
				component={screens.InsuranceSupportDetailScreen}
			/>
			<Stack.Screen
				name="InsuranceAssetModal"
				component={screens.InsuranceAssetModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="InsuranceCompensationModal"
				component={screens.InsuranceCompensationModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="InsuranceFilterModal"
				component={screens.InsuranceFilterModal}
				options={optionModal}
			/>
			<Stack.Screen
				name="CheckinMap_PC"
				component={screens.CheckinMap_PC}
				options={optionModal}
			/>
			<Stack.Screen
				name="TakePhotoScreen"
				component={screens.TakePhotoScreen}
			/>
			<Stack.Screen
				name="ValidApprovalListScreen"
				component={screens.ValidApprovalListScreen}
			/>
			<Stack.Screen
				name="ReferralCustomerScreen"
				component={screens.ReferralCustomerScreen}
			/>
			<Stack.Screen
				name="ReferralCustomerDetailScreen"
				component={screens.ReferralCustomerDetailScreen}
			/>
		</Stack.Navigator>
	);
}

const linking = {
	prefixes: ['yubao://', 'http://yubao.chailease.com.vn/'],
	config: {
		screens: {
			NewsScreen: 'news',
			HomeStack: {
				path: 'home',
				screens: {
					NotificationScreen: 'notification',
					NotificationDetailScreen: 'notificationDetail',
					ChatRoomListScreen: 'chatList',
				},
			},
		},
	},
};

function RootStack() {
	const navigationRef = useRef<any>();
	const routeNameRef = useRef();

	return (
		<NavigationContainer
			linking={linking}
			theme={DefaultTheme}
			fallback={<LoadingFullScreen />}
			ref={navigationRef}
			onReady={() => {
				routeNameRef.current = navigationRef.current.getCurrentRoute().name;
				firebaseFunction
					.trackingLog({
						event: EventTracking.SCREEN,
						screen: {
							class: navigationRef.current.getCurrentRoute().name,
							name: navigationRef.current.getCurrentRoute().name,
						},
					})
					.then();
			}}
			onStateChange={async () => {
				const previousRouteName = routeNameRef.current;
				const currentRouteName = navigationRef.current.getCurrentRoute().name;

				if (previousRouteName !== currentRouteName) {
					// The line below uses the expo-firebase-analytics tracker
					// https://docs.expo.io/versions/latest/sdk/firebase-analytics/
					// Change this line to use another Mobile analytics SDK
					firebaseFunction
						.trackingLog({
							event: EventTracking.SCREEN,
							screen: {
								class: currentRouteName,
								name: currentRouteName,
							},
						})
						.then();
				}

				// Save the current route name for later comparison
				routeNameRef.current = currentRouteName;
			}}
		>
			<Stack.Navigator
				initialRouteName="LoginScreen"
				screenOptions={{
					animationEnabled: true,
					headerShown: false,
				}}
			>
				<Stack.Screen name="LoginScreen" component={screens.LoginScreen} />
				<Stack.Screen
					name="HomeStack"
					component={HomeStack}
					options={{ gestureEnabled: false }}
				/>
				<Stack.Screen name="ChatStack" component={ChatStack} />
				<Stack.Screen name="SignUpScreen" component={screens.SignUpScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default RootStack;
