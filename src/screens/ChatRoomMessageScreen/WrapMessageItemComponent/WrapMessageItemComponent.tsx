import React, { useEffect, useRef } from 'react';
import {
	View,
	Text,
	TouchableOpacity,
	Keyboard,
	Dimensions,
} from 'react-native';
import { Icon } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import MessageItemComponent from '../MessageItemComponent';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { useTheme } from 'native-base';
import {
	FlingGestureHandler,
	Directions,
	State,
} from 'react-native-gesture-handler';

import Animated, {
	withSpring,
	useAnimatedStyle,
	useAnimatedGestureHandler,
	useSharedValue,
} from 'react-native-reanimated';

import EventEmitter from '@utils/events';

import styles from './styles';
import openLink from '@utils/openLink';
import { DOMAIN_SERVER_CHAT } from '@data/Constants';
import { IUserLoginRC } from '@models/types';
import { useSelector } from 'react-redux';
import {
	SharedElement,
	createSharedElementStackNavigator,
} from 'react-navigation-shared-element';

const WrapMessageItemComponent = (props: any) => {
	const { item, room, onSwipeLeft, setItemMessageSelected, imageViewerRef } =
		props;
	const navigation: any = useNavigation();
	const refSwipe = useRef<any>();

	const state = {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	};

	const dataUserRC: IUserLoginRC = useSelector(
		(state: any) => state.auth_reducer.dataUserRC,
	);

	const options = {
		enableVibrateFallback: true,
		ignoreAndroidSystemSettings: false,
	};

	useEffect(() => {
		EventEmitter.addEventListener('longPressMess', value => {
			if (item._id === value.value._id) {
				//animatedValue.value = withSpring(1);
			}
		});

		EventEmitter.addEventListener('outSidePress', value => {
			if (item._id === value.value._id) {
				//animatedValue.value = withSpring(0);
			}
		});
		return () => {
			EventEmitter.removeListener('longPressMess');
			EventEmitter.removeListener('outSidePress');
		};
	}, []);

	const _onSwipeLeftItem = () => {
		ReactNativeHapticFeedback.trigger('impactMedium', options);
		//refSwipe?.current.close();

		setTimeout(() => {
			onSwipeLeft(item);
		}, 200);
	};

	const startingPosition = 0;
	const x = useSharedValue(startingPosition);
	const animatedValue = useSharedValue(0);

	const eventHandler: any = useAnimatedGestureHandler({
		onStart: (event, ctx) => {},
		onActive: (event, ctx) => {
			x.value = true ? 80 : -50;
		},
		onEnd: (event, ctx) => {
			x.value = withSpring(startingPosition);
		},
	});

	const uas = useAnimatedStyle(() => {
		return {
			transform: [{ translateX: x.value }],
		};
	});

	const animatedStyles = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: animatedValue.value * -100 }],
			zIndex: animatedValue.value,
		};
	});

	const _onPressMessageContent = item => {
		switch (item.file?.type) {
			case 'image/jpeg':
				imageViewerRef.current.onShowViewer(
					`${DOMAIN_SERVER_CHAT}${item.attachments[0]?.title_link}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
					item,
				);
				// navigation.navigate('ImageViewScreen', {
				// 	imageViewer: `${DOMAIN_SERVER_CHAT}${item.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
				// });
				return;
			case 'image/png':
				// navigation.navigate('ImageViewScreen', {
				// 	imageViewer: `${DOMAIN_SERVER_CHAT}${item.attachments[0]?.image_url}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
				// });
				imageViewerRef.current.onShowViewer(
					`${DOMAIN_SERVER_CHAT}${item.attachments[0]?.title_link}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
					item,
				);
				return;
			case 'application/pdf':
				openLink(
					`${DOMAIN_SERVER_CHAT}${item.attachments[0]?.title_link}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
				);
				return;
			// case 'video/mp4':
			// 	openLink(
			// 		`${DOMAIN_SERVER_CHAT}${item.attachments[0]?.title_link}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
			// 	);
			// 	return;

			default:
				if (!item.file?.type) return;
				openLink(
					`${DOMAIN_SERVER_CHAT}${item.attachments[0]?.title_link}?rc_uid=${dataUserRC.userId}&rc_token=${dataUserRC.authToken}`,
				);
				return;
		}
	};

	return (
		// <Swipeable
		// 	ref={(ref: any) => {
		// 		refSwipe.current = ref;
		// 	}}
		// 	onSwipeableLeftOpen={() => _onSwipeLeftItem()}
		// 	renderLeftActions={() => {
		// 		return (
		// 			<View
		// 				style={{
		// 					alignSelf: 'center',
		// 					marginLeft: 10,
		// 				}}
		// 			>
		// 				<Icon as={Ionicons} name="arrow-redo" />
		// 			</View>
		// 		);
		// 	}
		// >

		<FlingGestureHandler
			direction={Directions.RIGHT}
			onGestureEvent={eventHandler}
			onHandlerStateChange={({ nativeEvent }) => {
				if (nativeEvent.state === State.ACTIVE) {
					_onSwipeLeftItem();
				}
			}}
		>
			<Animated.View style={[uas, animatedStyles]}>
				<View>
					<MessageItemComponent
						{...props}
						typeRoom={room.t}
						onPressAvatar={() =>
							// navigation.navigate('UserInfoScreen', {
							// 	userID: item.u.username,
							// })
							null
						}
						onPressMessageContent={() => {
							_onPressMessageContent(item);
						}}
						onLongPressMessageContent={() => {
							setItemMessageSelected(item);
						}}
					/>
				</View>
			</Animated.View>
		</FlingGestureHandler>

		// </Swipeable>
	);
};

export default React.memo(WrapMessageItemComponent);
