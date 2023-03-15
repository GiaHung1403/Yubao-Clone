import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
	FlatList,
	Image,
	InteractionManager,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Header from '@components/Header';
import LoadingFullScreen from '@components/LoadingFullScreen';
import { useTheme } from 'react-native-paper';

import { LocalizationContext } from '@context/LocalizationContext';
import { IUserSystem } from '@models/types';
import { convertUnixTimeNotification } from '@utils';
import {
	SceneMap,
	SceneRendererProps,
	TabBar,
	TabView,
} from 'react-native-tab-view';
import styles from './styles';

const LOGO = require('@assets/logo.png');

export function NotificationScreen() {
	const navigation: any = useNavigation();
	const dispatch = useDispatch();
	const { colors } = useTheme();
	const dataUserSystem: IUserSystem = useSelector(
		(state: any) => state.auth_reducer.dataUserSystem,
	);
	const [doneLoadAnimation, setDoneLoadAnimation] = useState(false);
	const [listNotification, setListNotification] = useState<any>([]);
	const [listAll, setListAll] = useState<any>([]);

	const I18n = useContext(LocalizationContext);
	const textNotification = 'Private';
	const textAll = 'Global';

	const [indexTab, setIndexTab] = React.useState(0);
	const [routes] = React.useState([
		{ key: 'first', title: textAll },
		{ key: 'second', title: textNotification },
	]);

	const initialLayout = useWindowDimensions();

	const FirstRoute = () => renderListNotification(listAll);
	const SecondRoute = () => renderListNotification(listNotification);

	useEffect(() => {
		InteractionManager.runAfterInteractions(() => {
			setDoneLoadAnimation(true);
		});
	}, []);

	useEffect(() => {
		(async function getNotification() {
			if (doneLoadAnimation) {
				let subscriberPrivate: any = null;
				let subscriberAll: any = null;
				subscriberPrivate = firestore()
					.collection('Notification')
					.doc('Private')
					.collection(`user_${dataUserSystem.EMP_NO}`)
					.onSnapshot(querySnapshot => {
						const notifications: any = [];

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

						setListNotification(notifications);
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
						setListAll(notifications);
					});

				// Unsubscribe from events when no longer in use
				return () => {
					subscriberPrivate();
					subscriberAll();
				};
			}
		})();
	}, [doneLoadAnimation]);

	const renderScene = SceneMap({
		first: FirstRoute,
		second: SecondRoute,
	});

	const renderTabBar = (
		propsData: SceneRendererProps & { navigationState },
	) => {
		return (
			<TabBar
				{...propsData}
				scrollEnabled
				indicatorStyle={{
					borderBottomColor: colors.primary,
					borderBottomWidth: 4,
				}}
				style={{ backgroundColor: '#fff' }}
				tabStyle={{ width: initialLayout.width / 2 }}
				labelStyle={{ fontWeight: '600', textTransform: undefined }}
				activeColor={colors.primary}
				inactiveColor={'#a1a1aa'}
			/>
		);
	};

	const renderListNotification = (listData: any[]) => (
		<FlatList
			style={styles.listNotification}
			data={listData.slice(0, 20)}
			keyExtractor={(item, index) => index.toString()}
			ListFooterComponent={() => <SafeAreaView style={{ height: 60 }} />}
			renderItem={({ item, index }) => (
				<TouchableOpacity
					style={styles.containerItem}
					onPress={() =>
						navigation.navigate('NotificationDetailScreen', {
							notification: item,
						})
					}
				>
					<Image source={LOGO} resizeMode="contain" style={styles.logo} />
					<View
						style={
							index === listData.length - 1
								? styles.containerContentLast
								: styles.containerContent
						}
					>
						<Text
							style={{
								color: item.is_read ? '#8c8c8c' : '#505050',
								fontWeight: item.is_read ? 'normal' : '600',
							}}
						>
							{item.title}
						</Text>
						<Text
							style={{
								fontSize: 12,
								color: item.is_read ? '#8c8c8c' : '#505050',
								fontWeight: '400',
								paddingVertical: 2,
							}}
							numberOfLines={4}
						>
							{item.short_content}
						</Text>
						<Text
							style={{
								color: item.is_read ? '#8c8c8c' : '#3E88C7',
								fontSize: 10,
							}}
						>
							{
								convertUnixTimeNotification(item.create_at.toMillis() / 1000)
									.time
							}
						</Text>
					</View>
				</TouchableOpacity>
			)}
		/>
	);

	return (
		<View style={styles.container}>
			<View style={{ zIndex: 2 }}>
				<Header title={'Notification'} />
			</View>

			{doneLoadAnimation ? (
				<TabView
					navigationState={{ index: indexTab, routes }}
					renderScene={renderScene}
					renderTabBar={renderTabBar}
					onIndexChange={setIndexTab}
					initialLayout={initialLayout}
					// style={{ marginTop: StatusBar.currentHeight }}
				/>
			) : (
				<LoadingFullScreen />
			)}
		</View>
	);
}
