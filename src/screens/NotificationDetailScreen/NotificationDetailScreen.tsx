import PushNotificationIOS from '@react-native-community/push-notification-ios';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
	ActivityIndicator,
	InteractionManager,
	Platform,
	View,
} from 'react-native';
import WebView from 'react-native-webview';
import { useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { IUserSystem } from '@models/types';
import styles from './styles';

export function NotificationDetailScreen(props: any) {
	const { notification } = props.route.params;
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [doneLoadAnimated, setDoneLoadAnimated] = useState(false);
	const numberUnread = useSelector((state: any) =>
		state.notification_reducer.numberUnreadNotification + dataUserSystem
			? state.notification_reducer.numberUnreadPromotion
			: 0,
	);

	useEffect(() => {
		InteractionManager.runAfterInteractions(async () => {
			setDoneLoadAnimated(true);
			if (!notification.is_read) {
				if (notification.type === 'Private') {
					await firestore()
						.collection('Notification')
						.doc('Private')
						.collection(`user_${dataUserSystem.EMP_NO}`)
						.doc(notification.key)
						.update({ is_read: true });
				} else {
					const listRead: any[] = [].concat(notification.read_by || []);
					listRead.push(`user_${dataUserSystem.EMP_NO.trim()}`);

					await firestore()
						.collection('Notification')
						.doc('Notification')
						.collection('Staff')
						.doc(notification.key)
						.update({ read_by: listRead });
				}

				if (Platform.OS === 'ios') {
					PushNotificationIOS.setApplicationIconBadgeNumber(numberUnread - 1);
				}
			}
		});
	}, []);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ zIndex: 2 }}>
				<Header title={notification.title} />
			</View>

			{doneLoadAnimated ? (
				<View style={{ flex: 1, zIndex: 1, backgroundColor: '#fff' }}>
					{/* <HTMLView value={notification.content} stylesheet={styles} /> */}
					<WebView
						style={{ zIndex: 1 }}
						originWhitelist={['*']}
						source={{
							html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${notification.content}</body></html>`,
						}}
						renderLoading={() => <ActivityIndicator style={{ flex: 100 }} />}
						startInLoadingState
						javaScriptEnabled={true}
						domStorageEnabled={true}
						sharedCookiesEnabled={true}
						mixedContentMode="compatibility"
					/>
				</View>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
