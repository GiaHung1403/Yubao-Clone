import { BlurView } from '@react-native-community/blur';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Alert,
	Dimensions,
	Image,
	ImageBackground,
	InteractionManager,
	Linking,
	Platform,
	SafeAreaView,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useSelector } from 'react-redux';

import HeaderBanner from '@components/HeaderBanner';
import { LocalizationContext } from '@context/LocalizationContext';
import { PreferencesContext } from '@context/PreferencesContext';
import { createDirectMessage, getListContact, getSpotlight } from '@data/api';
import { Ionicons } from '@expo/vector-icons';
import {
	IContact,
	IRequestEFlow,
	ISpotlight,
	IUserSystem,
} from '@models/types';
import BlurView_android from './BlurView_Custom';
import styles from './styles';

const BG_HCM = require('@assets/bg_hcm.jpg');
// const BG_HCM = require('@assets/christmas_Theme.jpeg');
const BG_BLUR = require('@assets/bg_blur2.jpg');
const IMG_MARKETING = require('@assets/img_marketing.png');
const IMG_MANAGEMENT = require('@assets/img_management.png');
const IMG_UTILS = require('@assets/img_utils.png');

const widthScreen = Dimensions.get('screen').width;

export function MainFeatureScreen(props: any) {
	const navigation: any = useNavigation();
	const I18n = useContext(LocalizationContext);
	const [userInfor, setUserInfor] = useState<IContact>();

	const { colors } = useTheme();
	const { newTheme }: any = useContext(PreferencesContext);

	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const { dataUserRC } = useSelector((state: any) => state.auth_reducer);
	const listRequestEFlow: IRequestEFlow[] = useSelector(
		(state: any) => state.eFlow_reducer.listRequestEFlow,
	);
	const listRequestEReview: IRequestEFlow[] = useSelector(
		(state: any) => state.eReview_reducer.listRequestEReview,
	);
	const [count, setCount] = useState(0);

	// useEffect(() => {
	// 	InteractionManager.runAfterInteractions(async () => {
	// 		// let dataQuestion = await firestore()
	// 		// 	.collection('Chat_Support')
	// 		// 	.onSnapshot(questSnapshot => {
	// 		// 		let tempCount: number = 0;
	// 		// 		questSnapshot.forEach(item => {
	// 		// 			const ID = item.data()?.ID.split('_');
	// 		// 			if (ID[1] === dataUserSystem?.EMP_NO) {
	// 		// 				for (let i = 0; i < item.data().listMessage.length; i++) {
	// 		// 					if (
	// 		// 						item.data().listMessage[i].seen === false &&
	// 		// 						item.data().listMessage[i].From === '1'
	// 		// 					) {
	// 		// 						tempCount += 1;
	// 		// 					}
	// 		// 				}
	// 		// 			}
	// 		// 		});
	// 		// 		setCount(tempCount);
	// 		// 	});
	// 	});
	// }, []);

	const checkIsUserTrading = () => {
		if (dataUserSystem?.EMP_NO.includes('T')) {
			return true;
		}
		return false;
	};

	const listFeaturePage = [
		{
			labelSession: 'MO Functions',
			image: IMG_MARKETING,
			listFunction: [
				{
					name: 'Customer',
					image: 'person-outline',
					id: 'customerInfo',
				},
				{
					name: 'Seller',
					image: 'people-outline',
					id: 'dealerInfo',
				},
				{
					name: 'Telemarketing',
					image: 'call-outline',
					id: 'tele',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Visit',
					image: 'trail-sign-outline',
					id: 'visitInfo',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Quotation',
					image: 'document-text-outline',
					id: 'quotation',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Consultation',
					image: 'glasses-outline',
					id: 'cf',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Payment Notice',
					image: 'receipt-outline',
					id: 'payment_notice',
				},
				{
					name: 'Insurance Support',
					image: 'shield-checkmark-outline',
					id: 'insurance_support',
					hidden: checkIsUserTrading(),
				},
				// {
				// 	name: 'Motorbike finance',
				// 	image: 'bicycle-outline',
				// 	id: 'motor',
				// },
				{
					name: 'Valid Approval',
					image: 'clipboard-outline',
					id: 'valid_approval',
					hidden: dataUserSystem?.DEPT_CODE !== '0003',
				},
				{
					name: 'Chat Support',
					image: 'chatbubble-ellipses-outline',
					id: 'chat_support',
					number: count,
				},
				{
					name: 'Contract TimeLine',
					image: 'git-pull-request-outline',
					id: 'contract_timeline',
					number: count,
				},
				{
					name: 'Referral Customer',
					image: 'link-outline',
					id: 'referral_customer',
					hidden:
						dataUserSystem?.DEPT_CODE !== '0001' &&
						dataUserSystem?.DEPT_CODE !== '0014',
				},
			],
		},
		{
			labelSession: 'Other Functions',
			image: IMG_MANAGEMENT,
			listFunction: [
				{
					name: 'E-Flow',
					image: 'create-outline',
					id: 'eFlow',
					number: listRequestEFlow.filter(
						eFlow => eFlow.status === 'Waiting Approval',
					).length,
				},
				{
					name: 'E-Review',
					image: 'easel-outline',
					id: 'eReview',
					number: listRequestEReview.length,
				},
				{
					name: 'Leave Request',
					image: 'calendar-outline',
					id: 'leaveRequest',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Car Booking',
					image: 'car-sport-outline',
					id: 'carBooking',
				},
				{
					name: 'Book a meeting',
					image: 'mic-outline',
					id: 'bookMeeting',
				},
				{
					name: 'General RFA',
					image: 'file-tray-full-outline',
					id: 'generalRFA',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Request to customer',
					image: 'git-compare-outline',
					id: 'requestCustomer',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Check In/Out',
					image: 'finger-print-outline',
					id:
						userInfor?.dept_code === 'HCI1-A' ||
						dataUserSystem?.DEPT_CODE === '0006' ||
						dataUserSystem?.EMP_NO === '00039' ||
						dataUserSystem?.EMP_NO === '01233'
							? 'checkInOut_PC'
							: 'checkInOut',
					hidden:
						userInfor?.dept_code !== 'HCI1-A' &&
						dataUserSystem?.DEPT_CODE !== '0006' &&
						!['00039', '00010', '00678', '00965', '01233'].includes(
							dataUserSystem?.EMP_NO,
						),
				},
				{
					name: 'Ticket',
					image: 'reader-outline',
					id: 'ticket-feedback',
					hidden: checkIsUserTrading(),
				},
			],
		},
		{
			labelSession: 'Utilities',
			image: IMG_UTILS,
			listFunction: [
				{
					name: 'Scan Document',
					image: 'document-text-outline',
					id: 'scanDocument',
				},
				{
					name: 'Scan VRC',
					image: 'car-outline',
					id: 'scanVRC',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Scan CardVisit',
					image: 'card-outline',
					id: 'scanCard',
					hidden: checkIsUserTrading(),
				},
				{
					name: 'Scan Taxi Bill',
					image: 'receipt-outline',
					id: 'taxiBillScan',
					hidden:
						dataUserSystem?.DEPT_CODE !== '0001' &&
						dataUserSystem?.DEPT_CODE !== '0006' &&
						dataUserSystem?.DEPT_CODE !== '9999',
				},
				{
					name: 'Quiz',
					image: 'flask-outline',
					id: 'quiz',
				},
				{
					name: 'Fixed assets',
					image: 'tv-outline',
					id: 'fixedAssets',
					hidden:
						dataUserSystem?.DEPT_CODE !== '0001' &&
						dataUserSystem?.DEPT_CODE !== '0006',
				},
				{
					name: 'Vote',
					image: 'hand-right-outline',
					id: 'vote',
				},
				{
					name: 'My Cloud',
					image: 'cloud-upload-outline',
					id: 'cloud',
				},
				{
					name: 'Scan Card ID',
					image: 'card-outline',
					id: 'scanCardID',
				},
			],
		},
	];

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			(async function checkListener() {
				const initialUrl = await Linking.getInitialURL();

				const codeScreen: string = initialUrl?.substring(
					initialUrl.indexOf('//') + 2,
				)!;

				if (codeScreen) {
					navigation.navigate(codeScreen);
				}
			})();

			const responseContactList: any = await getListContact({
				User_ID: dataUserSystem.EMP_NO,
				Password: '',
				query: '',
				Dept_Code: '0',
				Branch: '-1',
				subteam: undefined,
			});

			const userFind = responseContactList.find(
				(item: IContact) => item.emp_no === dataUserSystem.EMP_NO,
			);
			setUserInfor(userFind);
		});
	}, []);

	const _onPressItemFeature = async ({ dataFeature }) => {
		switch (dataFeature.id) {
			/**
			 * ============ MO Functions =============
			 */
			case 'chat':
				navigation.navigate('ChatRoomListScreen');
				break;
			case 'customerInfo':
				navigation.navigate('CustomerListScreen', {});
				break;
			case 'dealerInfo':
				navigation.navigate('SellerListScreen', {});
				break;
			case 'visitInfo':
				navigation.navigate('VisitScreen');
				break;
			case 'tele':
				navigation.navigate('TeleScreen');
				break;
			case 'quotation':
				navigation.navigate('QuotationScreen');
				break;
			case 'cf':
				navigation.navigate('ConsultationListScreen');
				break;
			case 'motor':
				if (__DEV__) {
					navigation.navigate('MotorbikeDashboardScreen');
				} else {
					Alert.alert('Notice', 'Coming soon!');
				}
				break;
			case 'chat_support':
				navigation.navigate('ChatSupportScreen', {});
				break;
			case 'contract_timeline':
				navigation.navigate('ContractTimeLineListScreen', {});
				break;
			case 'payment_notice':
				navigation.navigate('PaymentNoticeScreen', {});
				break;
			case 'insurance_support':
				navigation.navigate('InsuranceSupportScreen', {});
				break;
			case 'valid_approval':
				navigation.navigate('ValidApprovalListScreen', {});
				break;
			case 'referral_customer':
				navigation.navigate('ReferralCustomerScreen', {});
				break;
			/**
			 *  ============ Other Functions =============
			 */
			case 'eFlow':
				navigation.navigate('EFlowSearchScreen', {});
				break;
			case 'eReview':
				navigation.navigate('EReviewSearchScreen', {});
				break;
			case 'leaveRequest':
				navigation.navigate('LeaveRequestSearchScreen');
				break;
			case 'carBooking':
				navigation.navigate('CarBookingListScreen');
				break;
			case 'bookMeeting':
				navigation.navigate('BookMeetingListScreen');
				break;
			case 'generalRFA':
				navigation.navigate('GeneralRFAListScreen');
				break;
			case 'requestCustomer':
				navigation.navigate('RequestCustomerListScreen');
				break;
			case 'checkInOut':
				navigation.navigate('CheckinMapModal');
				break;
			case 'checkInOut_PC':
				navigation.navigate('CheckinMap_PC', {
					image: undefined,
					base64: undefined,
				});
				break;
			case 'ticket-feedback':
				navigation.navigate('TicketSearchScreen');
				break;
			/**
			 *  ============ Utilities =============
			 */
			case 'attendance':
				navigation.navigate('AttendanceViaFaceScreen');
				break;
			case 'scanDocument':
				navigation.navigate('DocumentScanScreen', {});
				break;
			case 'scanVRC':
				navigation.navigate('VRCScanScreen', {});
				break;
			case 'scanCard':
				navigation.navigate('DetectTextCameraScreen');
				break;
			case 'taxiBillScan':
				navigation.navigate('TaxiBillScanScreen');
				break;
			case 'quiz':
				navigation.navigate('QuizScreen');
				break;
			case 'fixedAssets':
				navigation.navigate('FixedAssetsListScreen');
				break;
			case 'vote':
				navigation.navigate('VotingListScreen');
				break;
			case 'cloud':
				const listSpotlight = (await getSpotlight({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					query: 'cloud_bot',
				})) as ISpotlight[];
				const room = listSpotlight[0];
				const roomResponse: any = await createDirectMessage({
					token: dataUserRC.authToken,
					UserID: dataUserRC.userId,
					usernameStaff: room.username,
				});

				navigation.navigate('ChatRoomMessageScreen', {
					room: Object.assign(roomResponse, {
						name: room.username,
						fname: room.name,
					}),
				});
				break;
			case 'scanCardID':
				navigation.navigate('IDCardFormScreen', { result: '', image: '' });
				break;
			default:
				break;
		}
	};

	const renderListFeatureCommon = feature => (
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
			{feature.listFunction
				.filter(item => !item.hidden)
				.map(func => (
					<TouchableOpacity
						key={func.id}
						style={[
							styles.containerItem,
							{
								width: widthScreen / 3 - 12,
								paddingVertical: 8,
								alignItems: 'center',
							},
						]}
						disabled={!func.name}
						onPress={() => _onPressItemFeature({ dataFeature: func })}
					>
						<View
							style={[
								styles.containerImageItem,
								{ width: widthScreen / 3 - 16 },
							]}
						>
							<View
								style={{
									padding: 8,
									backgroundColor: 'rgba(108, 122, 137, 0.4)',
									borderRadius: 8,
								}}
							>
								{func.number ? (
									<View
										style={{
											width: 20,
											height: 20,
											backgroundColor: colors.primary,
											borderRadius: 10,
											position: 'absolute',
											justifyContent: 'center',
											alignItems: 'center',
											right: -8,
											top: -8,
										}}
									>
										<Text
											style={{
												fontSize: 12,
												color: '#fff',
												fontWeight: 'bold',
											}}
										>
											{func.number}
										</Text>
									</View>
								) : null}

								<Icon
									as={Ionicons}
									name={func.image!}
									size={35}
									color={'#fff'}
								/>
							</View>
							<Text style={styles.nameItem}>{func.name}</Text>
						</View>
					</TouchableOpacity>
				))}
		</View>
	);

	const renderListFeatureCommon_Android = feature => (
		<View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 8 }}>
			{feature.listFunction
				.filter(item => !item.hidden)
				.map(func => (
					<TouchableOpacity
						key={func.id}
						style={[
							styles.containerItem,
							{
								width: widthScreen / 3 - 12,
								paddingVertical: 8,
								alignItems: 'center',
							},
						]}
						disabled={!func.name}
						onPress={() => _onPressItemFeature({ dataFeature: func })}
					>
						<View
							style={[
								styles.containerImageItem,
								{ width: widthScreen / 3 - 16 },
							]}
						>
							<View
								style={{
									padding: 8,
									backgroundColor: 'rgba(108, 122, 137, 0.4)',
									borderRadius: 8,
								}}
							>
								{func.number ? (
									<View
										style={{
											width: 20,
											height: 20,
											backgroundColor: colors.primary,
											borderRadius: 10,
											position: 'absolute',
											justifyContent: 'center',
											alignItems: 'center',
											right: -8,
											top: -8,
										}}
									>
										<Text
											style={{
												fontSize: 12,
												color: '#fff',
												fontWeight: 'bold',
											}}
										>
											{func.number}
										</Text>
									</View>
								) : null}

								<Icon
									as={Ionicons}
									name={func.image!}
									size={35}
									color={'#fff'}
								/>
							</View>
							<Text style={styles.nameItem}>{func.name}</Text>
						</View>
					</TouchableOpacity>
				))}
		</View>
	);

	const renderListFunctionAndroid = () => (
		<ScrollView>
			{/* Session Tra cứu */}
			{listFeaturePage.map((feature, index) => (
				<Card
					key={index.toString()}
					elevation={8}
					style={{ backgroundColor: 'transparent', marginBottom: 8 }}
				>
					<ImageBackground
						source={BG_BLUR}
						style={{ flexWrap: 'wrap', padding: 8 }}
					>
						<View
							style={{
								backgroundColor: 'transparent',
								borderRightWidth: 15,
								borderTopWidth: 25,
								borderRightColor: 'transparent',
								borderTopColor: 'rgba(191,149,208,0.4)',
								width: 150,
								marginHorizontal: -8,
							}}
						/>

						<Text
							style={{
								paddingHorizontal: 8,
								paddingVertical: 12,
								fontSize: 15,
								fontWeight: '600',
								color: '#fff',
								position: 'absolute',
							}}
						>
							{feature.labelSession}
						</Text>

						<Image
							source={feature.image}
							resizeMode={'contain'}
							style={{
								width: 150,
								height: 150,
								alignSelf: 'center',
								marginVertical: 16,
							}}
						/>

						{renderListFeatureCommon(feature)}
					</ImageBackground>
				</Card>
			))}
			<SafeAreaView style={{ height: 8 }} />
		</ScrollView>
	);

	const renderListFunctionIOS = () => (
		<ScrollView>
			{/* Session Tra cứu */}
			{listFeaturePage.map((feature, index) => (
				<Card
					key={index.toString()}
					elevation={8}
					style={{ backgroundColor: 'transparent', marginBottom: 8 }}
				>
					<BlurView
						blurType={
							Platform.OS === 'ios' ? 'ultraThinMaterialLight' : 'light'
						}
						blurAmount={100}
						reducedTransparencyFallbackColor="white"
					>
						<View style={{ flexWrap: 'wrap', padding: 8 }}>
							<View
								style={{
									backgroundColor: 'transparent',
									borderRightWidth: 15,
									borderTopWidth: 25,
									borderRightColor: 'transparent',
									borderTopColor: 'rgba(191,149,208,0.4)',
									width: 150,
									marginHorizontal: -8,
								}}
							/>

							<Text
								style={{
									paddingHorizontal: 8,
									paddingVertical: 12,
									fontSize: 15,
									fontWeight: '600',
									color: '#fff',
									position: 'absolute',
								}}
							>
								{feature.labelSession}
							</Text>

							<Image
								source={feature.image}
								resizeMode={'contain'}
								style={{
									width: 150,
									height: 150,
									alignSelf: 'center',
									marginVertical: 16,
								}}
							/>

							{renderListFeatureCommon(feature)}
						</View>
					</BlurView>
				</Card>
			))}
			<SafeAreaView style={{ height: 8 }} />
		</ScrollView>
	);

	const renderListFunctionAndroid_V2 = () => (
		<ScrollView>
			{/* Session Tra cứu */}
			{listFeaturePage.map((feature, index) => (
				<Card
					key={index.toString()}
					elevation={8}
					style={{ backgroundColor: 'transparent', marginBottom: 8, flex: 1 }}
				>
					<BlurView_android
						blurType="light"
						blurAmount={15}
						style={{
							height: 650,
							width: '100%',
							bottom: 0,
						}}
					/>
					<View style={{ zIndex: 99, position: 'absolute' }}>
						<View
							style={{
								backgroundColor: 'transparent',
								borderRightWidth: 15,
								borderTopWidth: 25,
								borderRightColor: 'transparent',
								borderTopColor: 'rgba(191,149,208,0.4)',
								width: 150,
								marginHorizontal: -8,
							}}
						/>

						<Text
							style={{
								paddingHorizontal: 8,
								paddingVertical: 12,
								fontSize: 15,
								fontWeight: '600',
								color: '#fff',
								position: 'absolute',
							}}
						>
							{feature.labelSession}
						</Text>

						<Image
							source={feature.image}
							resizeMode={'contain'}
							style={{
								width: 150,
								height: 150,
								alignSelf: 'center',
								marginVertical: 16,
							}}
						/>

						{renderListFeatureCommon_Android(feature)}
					</View>

					{/* </BlurView> */}
				</Card>
			))}
			<SafeAreaView style={{ height: 8 }} />
		</ScrollView>
	);

	return (
		<View style={styles.container}>
			<HeaderBanner />
			<ImageBackground
				style={styles.containerBody}
				source={
					newTheme
						? typeof newTheme === 'number'
							? newTheme
							: {
									uri: newTheme?.includes('https')
										? newTheme
										: `data:image/jpeg;base64,${newTheme}`,
							  }
						: BG_HCM
				}
				resizeMode={'cover'}
			>
				{Platform.OS === 'ios'
					? dataUserSystem.EMP_NO === '00858'
						? renderListFunctionAndroid()
						: renderListFunctionIOS()
					: renderListFunctionAndroid()}
				{/* {Platform.OS === 'ios'
					? renderListFunctionIOS()
					: renderListFunctionAndroid_V2()} */}
			</ImageBackground>
		</View>
	);
}
