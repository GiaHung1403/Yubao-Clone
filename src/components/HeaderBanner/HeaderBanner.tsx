import { Ionicons } from '@expo/vector-icons';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'native-base';
import React, { useContext, useEffect, useState } from 'react';
import {
	Image,
	Platform,
	SafeAreaView,
	ScrollView,
	StatusBar,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizationContext } from '@context/LocalizationContext';
import { PreferencesContext } from '@context/PreferencesContext';
import { IUserLoginRC, IUserSystem } from '@models/types';
import { formatVND } from '@utils';
import openLink, { openChrome } from '@utils/openLink';
import AvatarBorder from '../AvatarBorder';
import styles from './styles';
import { setNumberUnreadNotification } from '@actions/notification_action';

const BANNER1 = require('@assets/banner_new_cao.jpg');
// const BANNER1 = require('@assets/banner_noel_2.png');

const LOGO = require('@assets/logo.png');
const LOGO_HODIHUB = require('@assets/logo_hodiHub.png');
const IC_NOTIFICATION = require('@assets/icons/ic_notification_v2.png');
const IC_FEEDBACK = require('@assets/icons/ic_feedback.png');
const IC_CHAICOIN = require('@assets/icons/ic_chaicoin_border.png');
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

interface IProps {
	style?: any;
	name?: string;
	color?: string;
	email?: string;
	avatar?: string;
	hideWelcome?: boolean;
}

let notificationUnread = 0;
export default function HeaderBanner(props: IProps) {
	const navigation: any = useNavigation();
	const { newHeader }: any = useContext(PreferencesContext);
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);

	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const eCoinTotal: IUserLoginRC = useSelector(
		(state: any) => state.e_coin_reducer.eCoinTotal,
	);

	const numberMessageUnread: number = useSelector(
		(state: any) => state.room_rc_reducer.numberMessageUnread,
	);

	const numberNotificationUnread = useSelector(
		(state: any) =>
			(dataUserSystem
				? state.notification_reducer.numberUnreadNotification
				: 0) + state.notification_reducer.numberUnreadPromotion,
	);

	if (Platform.OS === 'ios') {
		PushNotificationIOS.setApplicationIconBadgeNumber(
			numberNotificationUnread + numberMessageUnread,
		);
	}

	const [notificationUnreadP, setNotificationUnreadP] = useState(0);
	const [notificationUnreadG, setNotificationUnreadG] = useState(0);

	const I18n = useContext(LocalizationContext);
	const textWelcome = I18n.t('welcome');

	const listMenuTab = [
		{
			image: IC_FEEDBACK,
			id: 'feedback',
			label: 'Feedback',
			numberBadge: 0,
			withoutLib: true,
		},
		{
			image: 'book-outline',
			id: 'contact',
			label: 'Contact',
			numberBadge: 0,
		},
		{
			image: null,
			id: '',
			label: '',
		},
		{
			image: 'chatbubbles-outline',
			id: 'chat',
			label: 'Chat',
			numberBadge: numberMessageUnread,
		},
		{
			image: 'location-outline',
			id: 'listCustomer',
			label: 'LESDAR',
			numberBadge: 0,
		},
	];

	const _onPressItemMenuTop = (idMenu: string) => {
		switch (idMenu) {
			case 'feedback':
				navigation.navigate('FeedbackScreen');
				break;
			case 'utils':
				break;
			case 'contact':
				navigation.navigate('ContactScreen');
				break;
			case 'listCustomer':
				navigation.navigate('MapScreen');
				break;
			case 'notification':
				navigation.navigate('NotificationScreen');
				break;
			case 'chat':
				navigation.navigate('ChatRoomListScreen');
				break;
			default:
				break;
		}
	};

	const _onPressInfoUser = () => {
		navigation.navigate('UserInfoScreen', { userID: dataUserSystem.EMP_NO });
	};

	const dispatch = useDispatch();

	useEffect(() => {
		(async function getNotification() {
			let subscriberPrivate: any = null;
			let subscriberAll: any = null;
			subscriberPrivate = firestore()
				.collection('Notification')
				.doc('Private')
				.collection(`user_${dataUserSystem.EMP_NO}`)
				.onSnapshot(querySnapshot => {
					const notifications: any = [];
					let listNotify = 0;
					querySnapshot?.forEach(documentSnapshot => {
						if (documentSnapshot.data().data.function !== 'Voting') {
							notifications.push({
								...documentSnapshot.data(),
								key: documentSnapshot.id,
							});
						}
					});

					notifications.sort((a, b) => {
						return a.create_at < b.create_at;
					});

					notifications.map(notify =>
						Object.assign(notify, { type: 'Private' }),
					);

					notifications.forEach(item => {
						if (!item.is_read) {
							listNotify++;
						}
					});
					setNotificationUnreadP(listNotify);
				});

			subscriberAll = firestore()
				.collection('Notification')
				.doc('Notification')
				.collection('Staff')
				.where('user_store', 'array-contains-any', [
					`user_${dataUserSystem.EMP_NO.trim()}`,
					`group_${dataUserSystem.DEPT_CODE.trim()}`,
					'global',
				])
				.onSnapshot(querySnapshot => {
					const notifications: any = [];
					let listNotify = 0;
					querySnapshot?.forEach(documentSnapshot => {
						notifications.push({
							...documentSnapshot.data(),
							key: documentSnapshot.id,
						});
					});

					notifications.sort((a, b) => {
						return a.create_at < b.create_at;
					});

					notifications.map(notify =>
						notify.read_by?.findIndex(
							id => id === `user_${dataUserSystem.EMP_NO.trim()}`,
						) > -1
							? (notify.is_read = true)
							: (notify.is_read = false),
					);
					notifications.map(notify => Object.assign(notify, { type: 'All' }));
					notifications.forEach(item => {
						if (!item.is_read) {
							listNotify++;
						}
					});
					//  dispatch(
					// 		setNumberUnreadNotification({ numberUnread: listNotify }),
					// 	);
					setNotificationUnreadG(listNotify);
				});
			// Unsubscribe from events when no longer in use
			return () => {
				subscriberPrivate();
				subscriberAll();
			};
		})();
	}, []);

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* View image banner */}
			<Image
				source={
					newHeader
						? typeof newHeader === 'number'
							? newHeader
							: {
									uri: newHeader.includes('https')
										? newHeader
										: `data:image/jpeg;base64,${newHeader}`,
							  }
						: BANNER1
				}
				// resizeMethod={'scale'}
				resizeMode="stretch"
				style={styles.imageSwiper}
			/>

			{/* View Avatar and Welcome */}
			{!props.hideWelcome && (
				<TouchableOpacity
					style={[styles.containerWelcome]}
					onPress={_onPressInfoUser}
				>
					<SafeAreaView style={styles.safeWelcome}>
						<AvatarBorder username={dataUserRC?.me.username} size={50} />

						<View>
							<Text style={styles.textWelcome}>{textWelcome}</Text>
							{dataUserSystem && (
								<Text
									style={styles.textWelcome}
								>{`${dataUserSystem.FST_NM} ${dataUserSystem.LST_NM}`}</Text>
							)}
						</View>
					</SafeAreaView>
				</TouchableOpacity>
			)}

			{/* View Notification */}
			<View
				style={{
					position: 'absolute',
					top: 8,
					right: -8,
					padding: 20,
					zIndex: 4,
				}}
			>
				<SafeAreaView style={styles.safeWelcome}>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							marginTop: 2,
							alignItems: 'center',
						}}
						onPress={async() => {
							const response: any = await axios.post(
								'https://coreapi.chailease.com.vn/SPAPPMain/getRandom_Code',
								{
									module: 'ELEARNING',
									action: 'GET_RANDOM_CODE',
									useR_ID: dataUserSystem.EMP_NO,
								},
							);
							openChrome(
								`https://elearning.chailease.com.vn/login.aspx?rdCd=${response.data.random_Code}`,
							);}}
					>
						<Image
							source={LOGO_HODIHUB}
							resizeMode={'contain'}
							style={{ width: 30, height: 30, tintColor: '#fff' }}
						/>
					</TouchableOpacity>
					<View
						style={{
							height: '100%',
							width: 0.5,
							backgroundColor: '#fff',
							marginHorizontal: 8,
						}}
					/>
					<TouchableOpacity onPress={() => _onPressItemMenuTop('notification')}>
						<View style={styles.safeWelcome}>
							{notificationUnreadP + notificationUnreadG > 0 ? (
								<View>
									<Image
										source={IC_NOTIFICATION}
										resizeMode="contain"
										style={styles.imageItemMenuTopNoLib}
										// style={{ width: 24, height: 24, tintColor: '#fff' }}
									/>
									<View style={styles.containerNumberBadge}>
										<Text style={styles.textNumberBadge}>
											{notificationUnreadP + notificationUnreadG}
										</Text>
									</View>
								</View>
							) : (
								<Image
									source={IC_NOTIFICATION}
									resizeMode="contain"
									style={{ width: 24, height: 24, tintColor: '#fff' }}
								/>
							)}
						</View>
					</TouchableOpacity>
				</SafeAreaView>

				<SafeAreaView
					style={{
						flexDirection: 'row',
						justifyContent: 'flex-end',
						flexWrap: 'wrap',
						marginTop: 4,
					}}
				>
					<TouchableOpacity
						style={{
							flexDirection: 'row',
							marginTop: 2,
							alignItems: 'center',
						}}
						onPress={() => navigation.navigate('ECoinScreen')}
					>
						<Text
							style={{
								color: '#fdad29',
								fontWeight: '700',
								marginLeft: 13,
								marginRight: 4,
							}}
						>
							{formatVND(eCoinTotal)}
						</Text>
						<Image
							source={IC_CHAICOIN}
							resizeMode={'contain'}
							style={{ width: 23, height: 23 }}
						/>
					</TouchableOpacity>
				</SafeAreaView>
			</View>

			{/* View menu container */}
			<View style={styles.containerMenuTop}>
				{/* View logo.svg center menu */}
				<View style={styles.containerLogoMenuTop}>
					<Card elevation={4} style={styles.cardLogoMenuTop}>
						<View style={styles.containerImageLogo}>
							<Image
								source={LOGO}
								resizeMode="contain"
								style={styles.logoMenuTop}
							/>
						</View>
					</Card>
				</View>

				{/* View menu */}
				<ScrollView
					style={styles.scrollMenuTop}
					horizontal
					scrollEnabled={false}
					showsHorizontalScrollIndicator={false}
				>
					{listMenuTab.map((item, index) => (
						<View key={index.toString()} style={styles.containerItemMenuTop}>
							<TouchableOpacity
								style={styles.itemMenuTop}
								onPress={() => _onPressItemMenuTop(item.id)}
							>
								<View>
									{item.withoutLib ? (
										<Image
											source={item.image}
											resizeMode="contain"
											style={styles.imageItemMenuTopNoLib}
										/>
									) : item.image ? (
										<Icon
											as={Ionicons}
											name={item.image}
											color={'#fff'}
											size={6}
										/>
									) : null}

									{item.numberBadge !== 0 && (
										<View style={styles.containerNumberBadge}>
											<Text style={styles.textNumberBadge}>
												{item.numberBadge}
											</Text>
										</View>
									)}
								</View>

								<Text style={styles.labelItemMenuTop}>{item.label}</Text>
							</TouchableOpacity>
						</View>
					))}
				</ScrollView>
			</View>
		</View>
	);
}

// class SingletonClass {
//   static instance;
//   static createInstance() {
//     return new SingletonClass();
//   }
//
//   static getInstance () {
//     if (!SingletonClass.instance) {
//       SingletonClass.instance = SingletonClass.createInstance();
//     }
//     return SingletonClass.instance;
//   }
//
// }
